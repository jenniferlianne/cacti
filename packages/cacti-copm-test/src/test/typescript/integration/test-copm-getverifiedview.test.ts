import "jest-extended";
import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import {
  PledgeAssetV1Request,
  GetVerifiedViewV1Request,
  DLAccount,
} from "@hyperledger-cacti/cacti-copm-core";
import * as path from "path";
import * as dotenv from "dotenv";
import { CopmTestertMultiNetwork } from "../../../main/typescript/lib/copm-tester-multi-network";
import { CopmNetworkMode } from "../../../main/typescript/lib/types";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const logLevel: LogLevelDesc = "DEBUG";
const log: Logger = LoggerProvider.getOrCreate({
  label: "plugin-copm-crpc-server-test",
  level: logLevel,
});
let dest_cert: string;
const net1Type = process.env["COPM_NET_1"] || "fabric";
const net2Type = process.env["COPM_NET_2"] || "fabric";

describe(`COPM get verified view ${net1Type}-${net2Type}`, () => {
  let copmTester: CopmTestertMultiNetwork;
  let partyA: DLAccount, partyB: DLAccount;

  beforeAll(async () => {
    log.info("setting up fabric test network");

    copmTester = new CopmTestertMultiNetwork(log, CopmNetworkMode.Pledge);
    copmTester.setNetworks(net1Type, net2Type);
    await copmTester.startServer();

    partyA = copmTester.getPartyA("bond");
    partyB = copmTester.getPartyB("bond");

    dest_cert = await copmTester.getCertificateString(partyB);

    log.info("test setup complete");
  });

  afterAll(async () => {
    if (copmTester) {
      await copmTester.stopServer();
    }
  });
  /*
  invoking flow: relay-network1:9080/network1/mychannel:simpleassettransfer:GetTokenAssetPledgeStatus:8a6fbd62c841577a4f58c2813c4407d41a859d698f1a6062a5d0110ac80ec439:LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNnVENDQWlpZ0F3SUJBZ0lVRzJJaHZyN0I0Y2x3aUF6dFZHZ1oyeDBIZEVBd0NnWUlLb1pJemowRUF3SXcKY2pFTE1Ba0dBMVVFQmhNQ1ZWTXhGekFWQmdOVkJBZ1REazV2Y25Sb0lFTmhjbTlzYVc1aE1Sb3dHQVlEVlFRSwpFeEZ2Y21jeExtNWxkSGR2Y21zeExtTnZiVEVQTUEwR0ExVUVDeE1HUm1GaWNtbGpNUjB3R3dZRFZRUURFeFJqCllTNXZjbWN4TG01bGRIZHZjbXN4TG1OdmJUQWVGdzB5TkRBMk1UY3dOakl3TURCYUZ3MHpOREEyTVRVd056VTUKTURCYU1FSXhNREFMQmdOVkJBc1RCRzl5WnpFd0RRWURWUVFMRXdaamJHbGxiblF3RWdZRFZRUUxFd3RrWlhCaApjblJ0Wlc1ME1URU9NQXdHQTFVRUF4TUZZV3hwWTJVd1dUQVRCZ2NxaGtqT1BRSUJCZ2dxaGtqT1BRTUJCd05DCkFBU0hEcGdJVUdLRXF3c3hPREJDcnNYRWZEVXlPTHJaaVFORGpMc29XaGEvUDcxVitVRnRxMU4xT3FmYkI5cG4KY2d2ci84QlZxWGhPUlBwSjhsWk9QMmRqbzRITE1JSElNQTRHQTFVZER3RUIvd1FFQXdJSGdEQU1CZ05WSFJNQgpBZjhFQWpBQU1CMEdBMVVkRGdRV0JCUU02VkxMSldsb2N4SlgyTUFBbGZxSzg0eHgwekFmQmdOVkhTTUVHREFXCmdCU2pxVzNWSENURlZsajN3azVEbEJiN3lOczhrekJvQmdncUF3UUZCZ2NJQVFSY2V5SmhkSFJ5Y3lJNmV5Sm8KWmk1QlptWnBiR2xoZEdsdmJpSTZJbTl5WnpFdVpHVndZWEowYldWdWRERWlMQ0pvWmk1RmJuSnZiR3h0Wlc1MApTVVFpT2lKaGJHbGpaU0lzSW1obUxsUjVjR1VpT2lKamJHbGxiblFpZlgwd0NnWUlLb1pJemowRUF3SURSd0F3ClJBSWdOUmNnWXVEVjV0MG04Tk9kRUJOV2Z1SDFzMEs2NU9HT0xJZjgzcDV6OWpFQ0lCTTBZZEFRT0Jvd2Nya28KTHdDQkVVZTA3RXhpeWFVdFI4RmJVRzFmaU5tcAotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==:Corda_Network:LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJ6RENDQVdlZ0F3SUJBZ0lRWUU0YnVpNURmWGovNEZ3bGZEa1hSekFVQmdncWhrak9QUVFEQWdZSUtvWkkKemowREFRY3dMekVMTUFrR0ExVUVCaE1DUjBJeER6QU5CZ05WQkFjTUJreHZibVJ2YmpFUE1BMEdBMVVFQ2d3RwpVR0Z5ZEhsQk1CNFhEVEkwTURjek1EQXdNREF3TUZvWERUSTNNRFV5TURBd01EQXdNRm93THpFTE1Ba0dBMVVFCkJoTUNSMEl4RHpBTkJnTlZCQWNNQmt4dmJtUnZiakVQTUEwR0ExVUVDZ3dHVUdGeWRIbEJNQ293QlFZREsyVncKQXlFQTZ0elRDY0EyZHA1TDlGWWd4Ui9UQUE0dGhoNzJ3UUJuSXdMV25NYktDZ3lqZ1lrd2dZWXdIUVlEVlIwTwpCQllFRklFRDQ0cXhpaFBYdWo0Sm4rcHpTYjcwZjFRcE1BOEdBMVVkRXdFQi93UUZNQU1CQWY4d0N3WURWUjBQCkJBUURBZ0tFTUJNR0ExVWRKUVFNTUFvR0NDc0dBUVVGQndNQ01COEdBMVVkSXdRWU1CYUFGRHhCV2ZoMkdIMGgKc3V4cU9CR09jUk9vTS9nc01CRUdDaXNHQVFRQmc0cGlBUUVFQXdJQkJqQVVCZ2dxaGtqT1BRUURBZ1lJS29aSQp6ajBEQVFjRFNRQXdSZ0loQUxYUWU0MUltdkJOWWJ6Y29mWlBXUFREU1JjUkFzUiszcXd6L1R5Z0NPUlhBaUVBCnNXV0x5RGN5d0oxemhjdzFScmFNMGxtd2Rua2ZBMXBWOTRYSGwxYTRRUVk9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0= at relay localhost:9081
  */

  test(`${net1Type}-${net2Type} get verified view1`, async () => {
    const assetType = "token1";
    const assetQuantity = 2;
    await (
      await copmTester.assetsFor(partyA)
    ).addToken(assetType, assetQuantity);

    log.info(`party a ${partyA.organization} ${partyA.userId}`);
    log.info(`party b ${partyB.organization} ${partyB.userId}`);

    const pledgeResult = await copmTester.clientFor(partyA).pledgeAssetV1(
      new PledgeAssetV1Request({
        assetPledgeV1PB: {
          asset: {
            assetType: assetType,
            assetQuantity: assetQuantity,
          },
          source: {
            network: partyA.organization,
            userId: partyA.userId,
          },
          destination: {
            network: partyB.organization,
            userId: partyB.userId,
          },
          expirySecs: BigInt(45),
          destinationCertificate: dest_cert,
        },
      }),
    );

    expect(pledgeResult).toBeTruthy();
    expect(pledgeResult.pledgeId).toBeString();
    const readPledge = await copmTester.getVerifyViewCmd(
      pledgeResult.pledgeId,
      await copmTester.getCertificateString(partyA),
      dest_cert,
      partyB.organization,
    );
    const res = await copmTester.clientFor(partyB).getVerifiedViewV1(
      new GetVerifiedViewV1Request({
        getVerifiedViewV1RequestPB: {
          account: {
            network: partyB.organization,
            userId: partyB.userId,
          },
          view: {
            network: partyA.organization,
            viewAddress: readPledge,
          },
        },
      }),
    );

    expect(res).toBeTruthy();
    expect(res.data).toBeString();
    log.info(res.data);
  });
});
