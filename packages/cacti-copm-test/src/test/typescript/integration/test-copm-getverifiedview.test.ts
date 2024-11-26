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
import { TestNetworks } from "../../../main/typescript/network/test-networks";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const logLevel: LogLevelDesc = "DEBUG";
const log: Logger = LoggerProvider.getOrCreate({
  label: "plugin-copm-crpc-server-test",
  level: logLevel,
});
let dest_cert: string;

describe(`COPM get verified view`, () => {
  let partyA: DLAccount, partyB: DLAccount;
  const copmTestNetwork: TestNetworks = new TestNetworks(
    log,
    CopmNetworkMode.Pledge,
  );
  const copmTester = new CopmTestertMultiNetwork(log, CopmNetworkMode.Pledge);
  const networksToTest: string[][] =
    process.env["COPM_NET_1"] && process.env["COPM_NET_2"]
      ? [[process.env["COPM_NET_1"], process.env["COPM_NET_2"]]]
      : copmTestNetwork.supportedNetworkMatrix();

  afterAll(async () => {
    if (copmTester) {
      await copmTester.stopServer();
    }
    if (!process.env["COPM_KEEP_UP"]) {
      await copmTestNetwork.stopNetworks();
    }
  });

  test.each(networksToTest)(
    "%s-%s get verified view",
    async (net1Type, net2Type) => {
      await copmTestNetwork.startNetworksOfType([net1Type, net2Type]);
      await copmTester.setNetworks(net1Type, net2Type);
      const assetType = "token1";

      partyA = copmTester.getPartyA(assetType);
      partyB = copmTester.getPartyB(assetType);

      dest_cert = await copmTester.getCertificateString(partyB);
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
    },
  );
});
