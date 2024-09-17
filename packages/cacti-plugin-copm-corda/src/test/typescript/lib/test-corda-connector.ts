import { LogLevelDesc, Logger } from "@hyperledger/cactus-common";
import { Configuration } from "@hyperledger/cactus-core-api";
import {
  IBuildImageConnectorCordaServerResponse,
  Containers,
} from "@hyperledger/cactus-test-tooling";
import {
  CordaConnectorContainer,
  ICordappJarFile,
} from "@hyperledger/cactus-test-tooling";
import * as path from "path";
import Docker, { ContainerInfo } from "dockerode";
import { DefaultApi as CordaApi } from "@hyperledger/cactus-plugin-ledger-connector-corda";

type JarDef = {
  jarRelativePath: string;
  fileName: string;
};

async function pullCordappJars(
  jarNames: JarDef[],
  ledgerJarRoot: string,
  connectorJarRoot: string,
): Promise<Array<ICordappJarFile>> {
  const docker = new Docker();
  let containerNet1PartyA;
  const containerInfos = await docker.listContainers({});
  containerInfos.forEach(function (containerInfo: ContainerInfo) {
    //Docker.getContainer(containerInfo.Id).stop(cb);
    if (containerInfo.Names.includes("/corda_partya_1")) {
      containerNet1PartyA = docker.getContainer(containerInfo.Id);
    }
  });

  expect(containerNet1PartyA).toBeTruthy();
  if (!containerNet1PartyA) {
    throw Error("can not connect to partyA");
  }

  await new Promise((resolve2) => setTimeout(resolve2, 1000));
  const jars = new Array<ICordappJarFile>();

  for (const jarName of jarNames) {
    const jarPath = path.join(ledgerJarRoot, jarName.jarRelativePath);
    const jar = await Containers.pullBinaryFile(containerNet1PartyA, jarPath);
    jars.push({
      contentBase64: jar.toString("base64"),
      filename: `${connectorJarRoot}${jarName.fileName}`,
      hasDbMigrations: true,
    });
  }

  if (jars.length == 0) {
    throw new Error(`no jars found`);
  }

  return jars;
}

export const WEAVER_CORDAPP_DATA = Object.freeze({
  rootDir: "/opt/corda",
  cordappDirPartyA: "/opt/corda/cordapps",
  cordappDirPartyB: "-",
  cordappDirPartyC: "-",
  cordappDirNotary: "-",
  jars: [
    {
      jarRelativePath: "cordapps/protos-java-kt-2.0.0-rc.4.jar",
      fileName: "_protos-java-kt-2.0.0-rc.4.jar",
    },
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
      jarRelativePath: "cordapps/workflows-kotlin-0.4.jar",
      fileName: "_workflows-kotlin-0.4.jar",
    },
  ],
});

export class TestCordaConnector {
  private connector: CordaConnectorContainer;
  private log: Logger;
  constructor(
    uid: string,
    pwd: string,
    host: string,
    port: number,
    log: Logger,
  ) {
    const logLevelJvmRoot: LogLevelDesc = "INFO";
    const logLevelJvmApp: LogLevelDesc = "DEBUG";
    this.log = log;
    this.log.info(`Internal/LAN IP (based on default gateway): ${host}`);
    const springAppConfig = {
      logging: {
        level: {
          root: logLevelJvmRoot,
          "org.hyperledger.cactus": logLevelJvmApp,
        },
      },
      cactus: {
        corda: {
          node: { host: host },
          // TODO: parse the gradle build files to extract the credentials?
          rpc: {
            port: port,
            username: uid,
            password: pwd,
          },
        },
      },
    };
    const springApplicationJson = JSON.stringify(springAppConfig);
    const envVarSpringAppJson = `SPRING_APPLICATION_JSON=${springApplicationJson}`;
    this.log.debug("Spring App Config Env Var: ", envVarSpringAppJson);

    this.connector = new CordaConnectorContainer({
      logLevel: "DEBUG",
      imageName: "cccs",
      imageVersion: "latest",
      envVars: [envVarSpringAppJson],
    });
    expect(CordaConnectorContainer).toBeTruthy();
  }

  public async stop() {
    if (!this.connector) {
      this.log.info("Connector container falsy, skipping stop & destroy.");
      return;
    }
    try {
      await this.connector.stop();
    } finally {
      await this.connector.destroy();
    }
  }

  public async start(): Promise<CordaApi> {
    const skipContainerImagePull = true;
    const connectorContainer = await this.connector.start(
      skipContainerImagePull,
    );
    expect(connectorContainer).toBeTruthy();

    await this.connector.logDebugPorts();
    const apiUrl = await this.connector.getApiLocalhostUrl();
    const config = new Configuration({ basePath: apiUrl });
    /*
    const jars = await pullCordappJars(
      WEAVER_CORDAPP_DATA.jars,
      WEAVER_CORDAPP_DATA.rootDir,
      "flow-database-access",
    );
    */
    const api = new CordaApi(config);
    //await api.addContractJarsV1({ jarFiles: jars });
    return api;
  }
}
