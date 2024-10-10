import "jest-extended";
import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import { BAD_REQUEST, OK } from "http-errors-enhanced-cjs";
import { v4 as internalIpV4 } from "internal-ip";
import { Configuration } from "@hyperledger/cactus-core-api";
import {
  buildImageConnectorCordaServer,
  Containers,
} from "@hyperledger/cactus-test-tooling";
import {
  CordaConnectorContainer,
  ICordappJarFile,
} from "@hyperledger/cactus-test-tooling";

import {
  DefaultApi as CordaApi,
  FlowInvocationType,
  JarFile,
  createJvmLong,
  createJvmInt,
  createJvmString,
} from "@hyperledger/cactus-plugin-ledger-connector-corda";
import Docker, { Container, ContainerInfo } from "dockerode";

import * as path from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const logLevel: LogLevelDesc = "DEBUG";
const log: Logger = LoggerProvider.getOrCreate({
  label: "plugin-copm-crpc-server-corda-test",
  level: logLevel,
});

const RPC_USERNAME = "clientUser1";
const RPC_PASSWORD = "test";
const REG_EXP_UUID = new RegExp(
  "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}",
);

type JarDef = {
  jarRelativePath: string;
  fileName: string;
};

async function pullCordappJars(
  jarNames: JarDef[],
  ledgerJarRoot: string,
  container: Container,
  connectorJarRoot: string,
): Promise<Array<ICordappJarFile>> {
  await new Promise((resolve2) => setTimeout(resolve2, 1000));
  const jars = new Array<ICordappJarFile>();

  for (const jarName of jarNames) {
    const jarPath = path.join(ledgerJarRoot, jarName.jarRelativePath);
    log.debug(`Pulling jar file from container at: %o`, jarPath);
    const jar = await Containers.pullBinaryFile(container, jarPath);
    jars.push({
      contentBase64: jar.toString("base64"),
      filename: `${connectorJarRoot}${jarName.fileName}`,
      hasDbMigrations: true,
    });
    log.debug(`Pulled jar (%o bytes) %o`, jarPath, jar.length);
  }

  if (jars.length == 0) {
    throw new Error(`no jars found`);
  }

  return jars;
}

function get_jarfile_binary(jarPath: string, deployPath: string): JarFile {
  const buf = fs.readFileSync(jarPath);
  log.debug(`Pulled jar (%o bytes) %o`, jarPath, buf.length);
  return {
    contentBase64: buf.toString("base64"),
    filename: deployPath,
    hasDbMigrations: false,
  };
}

export const WEAVER_CORDAPP_DATA = Object.freeze({
  ["basic_flow"]: {
    rootDir: "/opt/corda",
    cordappDirPartyA: "/opt/corda/cordapps",
    cordappDirPartyB: "-",
    cordappDirPartyC: "-",
    cordappDirNotary: "-",
    jars: [
      {
        jarRelativePath: "cordapps/contracts-kotlin-0.4.jar",
        fileName: "_contracts-kotlin-0.4.jar",
      },
      {
        jarRelativePath: "cordapps/interop-contracts-2.0.0-rc.4.jar",
        fileName: "_interop-contracts-2.0.0-rc.4.jar",
      },
      {
        jarRelativePath: "cordapps/interop-workflows-2.0.0-rc.4.jar",
        fileName: "_interop-workflows-2.0.0-rc.4.jar",
      },
      {
        jarRelativePath: "cordapps/protos-java-kt-2.0.0-rc.4.jar",
        fileName: "_protos-java-kt-2.0.0-rc.4.jar",
      },
      {
        jarRelativePath: "cordapps/workflows-kotlin-0.4.jar",
        fileName: "_workflows-kotlin-0.4.jar",
      },
    ],
  },
});

describe("looking at corda ts library", () => {
  let apiClient: CordaApi;
  let connector: CordaConnectorContainer;
  let lanIp: string;
  let partyARpcPort: number;
  let containerNet1PartyA: Container;

  beforeAll(async () => {
    const imgConnectorJvm = await buildImageConnectorCordaServer({
      logLevel,
    });
    partyARpcPort = 10006;

    const logLevelJvmRoot: LogLevelDesc = "INFO";
    const logLevelJvmApp: LogLevelDesc = "DEBUG";

    const internalIpOrUndefined = await internalIpV4();
    expect(internalIpOrUndefined).toBeTruthy();

    lanIp = internalIpOrUndefined as string;
    log.info(`Internal/LAN IP (based on default gateway): ${lanIp}`);
    const docker = new Docker();
    const containerInfos = await docker.listContainers({});
    containerInfos.forEach(function (containerInfo: ContainerInfo) {
      log.debug(`the container is ${containerInfo.Names}`);
      //Docker.getContainer(containerInfo.Id).stop(cb);
      if (containerInfo.Names.includes("/corda_partya_1")) {
        containerNet1PartyA = docker.getContainer(containerInfo.Id);
      }
    });

    expect(containerNet1PartyA).toBeTruthy();
    const springAppConfig = {
      logging: {
        level: {
          root: logLevelJvmRoot,
          "org.hyperledger.cactus": logLevelJvmApp,
        },
      },
      cactus: {
        corda: {
          node: { host: lanIp },
          // TODO: parse the gradle build files to extract the credentials?
          rpc: {
            port: partyARpcPort,
            username: RPC_USERNAME,
            password: RPC_PASSWORD,
          },
        },
      },
    };
    const springApplicationJson = JSON.stringify(springAppConfig);
    const envVarSpringAppJson = `SPRING_APPLICATION_JSON=${springApplicationJson}`;
    log.debug("Spring App Config Env Var: ", envVarSpringAppJson);

    log.info(imgConnectorJvm.imageName);
    log.info(imgConnectorJvm.imageVersion);
    connector = new CordaConnectorContainer({
      logLevel,
      imageName: "cccs",
      imageVersion: "latest",
      envVars: [envVarSpringAppJson],
    });
    // Set to true if you are testing an image that you've built locally and have not
    // yet uploaded to the container registry where it would be publicly available.
    // Do not forget to set it back to `false` afterwards!
    const skipContainerImagePull = true;
    expect(CordaConnectorContainer).toBeTruthy();

    const connectorContainer = await connector.start(skipContainerImagePull);
    expect(connectorContainer).toBeTruthy();

    await connector.logDebugPorts();
    const apiUrl = await connector.getApiLocalhostUrl();
    const config = new Configuration({ basePath: apiUrl });
    apiClient = new CordaApi(config);
  });

  afterAll(async () => {
    if (!connector) {
      log.info("Connector container falsy, skipping stop & destroy.");
      return;
    }
    try {
      await connector.stop();
    } finally {
      await connector.destroy();
    }
  });

  test("can I connect to the corda network and run a transaction via TS?", async () => {
    const diagRes = await apiClient.diagnoseNodeV1();
    expect(diagRes.status).toEqual(200);
    expect(diagRes.data).toBeTruthy();
    expect(diagRes.data.nodeDiagnosticInfo).toBeTruthy();

    const ndi = diagRes.data.nodeDiagnosticInfo;
    expect(ndi.cordapps).toBeArray();
    expect(ndi.cordapps.length > 0).toBeTrue();
    log.info("Cordaps", ndi.cordapps);

    const flowsRes = await apiClient.listFlowsV1();
    expect(flowsRes.status).toEqual(200);
    expect(flowsRes.data).toBeTruthy();
    expect(flowsRes.data.flowNames).toBeTruthy();
    log.debug(`apiClient.listFlowsV1() => ${JSON.stringify(flowsRes.data)}`);
    const configKey = "basic_flow";
    const cordappDeploymentConfigs = [];
    const jars = await pullCordappJars(
      WEAVER_CORDAPP_DATA[configKey].jars,
      WEAVER_CORDAPP_DATA[configKey].rootDir,
      containerNet1PartyA,
      "flow-database-access",
    );

    const rpcCredentialsA = {
      hostname: lanIp,
      port: partyARpcPort,
      username: RPC_USERNAME,
      password: RPC_PASSWORD,
    };

    cordappDeploymentConfigs.push({
      cordappDir: "/opt/corda/cordapps",
      cordaNodeStartCmd: "run-corda",
      cordaJarPath: "/opt/corda/corda.jar",
      nodeBaseDirPath: "/opt/corda",
      rpcCredentials: rpcCredentialsA,
      sshCredentials: {
        hostKeyEntry: "not-used-right-now-so-this-does-not-matter... ;-(",
        hostname: lanIp,
        password: RPC_PASSWORD,
        port: 22022,
        username: RPC_USERNAME,
      },
    });
    const deployReq = {
      jarFiles: jars,
    };

    log.debug(deployReq);
    try {
      const res = await apiClient.addContractJarsV1(deployReq);
      expect(res).toBeTruthy();
    } catch (error) {
      log.error(error.toJSON());
      throw error;
    }

    let passingContractInvocation;
    try {
      passingContractInvocation = await apiClient.invokeContractV1({
        flowFullClassName:
          "com.cordaSimpleApplication.flow.IssueBondAssetState",
        flowInvocationType: FlowInvocationType.TrackedFlowDynamic,
        params: [
          {
            jvmTypeKind: "PRIMITIVE",
            jvmType: {
              fqClassName: "java.lang.String",
            },
            primitiveValue: "my_first_asset",
          },
          {
            jvmTypeKind: "PRIMITIVE",
            jvmType: {
              fqClassName: "java.lang.String",
            },
            primitiveValue: "token1",
          },
        ],
        timeoutMs: 60000,
      });
    } catch (error) {
      log.error(error.toJSON());
      throw error;
    }
    log.info("response", passingContractInvocation.status);
    log.info("response status", passingContractInvocation.statusText);
    await expect(passingContractInvocation).toMatchObject({
      status: OK,
      data: {
        success: true,
        callOutput: expect.toBeObject(),
        flowId: expect.stringMatching(REG_EXP_UUID),
        progress: expect.toBeArray(),
      },
    });

    let failingContractInvocation;

    try {
      failingContractInvocation = await apiClient.invokeContractV1({
        flowFullClassName: "com.cordaSimpleApplication.flow.IssueAssetState",
        flowInvocationType: FlowInvocationType.TrackedFlowDynamic,
        params: [createJvmLong(42), createJvmString({ data: "token1" })],
        timeoutMs: 60000,
      });
    } catch (error) {
      log.error(error.toJSON());
      throw error;
    }
    log.info("response", failingContractInvocation.status);
    log.info("response status", failingContractInvocation.statusText);
  });
});
