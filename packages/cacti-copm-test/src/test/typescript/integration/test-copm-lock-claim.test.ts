import "jest-extended";
import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import {
  ClaimLockedAssetV1Request,
  LockAssetV1Request,
} from "@hyperledger-cacti/cacti-copm-core";
import { copmTesterFactory } from "../../../main/typescript/lib/copm-tester-factory";
import { CopmTester } from "../../../main/typescript/interfaces/copm-tester";
import { CopmTestNetwork } from "../../../main/typescript/lib/copm-testnetwork";
import * as path from "path";
import * as dotenv from "dotenv";
import { CopmNetworkMode } from "../../../main/typescript/lib/types";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const logLevel: LogLevelDesc = "DEBUG";
const log: Logger = LoggerProvider.getOrCreate({
  label: "plugin-copm-crpc-server-test",
  level: logLevel,
});

const copmTestNetwork = new CopmTestNetwork(log, CopmNetworkMode.Lock);
const copmTesterMap: Map<string, CopmTester> = new Map();

let networksToTest: string[] = copmTestNetwork.supportedNetworks;
if (process.env["COPM_NET_1"]) {
  networksToTest = [process.env["COPM_NET_1"]];
}

function getTesterForNetworkType(networkType: string): CopmTester {
  let tester = copmTesterMap.get(networkType);
  if (!tester) {
    tester = copmTesterFactory(log, networkType, CopmNetworkMode.Lock);
    copmTesterMap.set(networkType, tester);
  }
  return tester;
}

describe("Copm Lock and Claim", () => {
  const hashSecret: string = "my_secret_123";
  const lockAssetName: string = "lockasset" + new Date().getTime().toString();

  beforeAll(async () => {
    log.info("setting up copm test network");
  });

  afterAll(async () => {
    for (const tester of copmTesterMap.values()) {
      await tester.stopServer();
    }
    if (!process.env["COPM_KEEP_UP"]) {
      await copmTestNetwork.stopNetworks();
    }
  });

  test.each(networksToTest)(
    "%s can lock/claim nft on same network",
    async (netType: string) => {
      await copmTestNetwork.startNetworkOfType(netType);
      const copmTester = getTesterForNetworkType(netType);
      await copmTester.startServer();

      const assetType = "bond";
      const partyA = copmTester.getPartyA(assetType);
      const partyB = copmTester.getPartyB(assetType);

      // parties are different but on the same network
      expect(partyA.organization).toEqual(partyB.organization);
      expect(partyA.userId).not.toEqual(partyB.userId);

      const sourceCert = await copmTester.getCertificateString(partyA);
      const destCert = await copmTester.getCertificateString(partyB);

      const assetsPartyA = await copmTester.assetsFor(partyA);
      const assetsPartyB = await copmTester.assetsFor(partyB);

      await assetsPartyA.addNonFungibleAsset(assetType, lockAssetName);

      const lockResult = await copmTester.clientFor(partyA).lockAssetV1(
        new LockAssetV1Request({
          assetLockV1PB: {
            asset: {
              assetType: assetType,
              assetId: lockAssetName,
            },
            source: {
              network: partyA.organization,
              userId: partyA.userId,
            },
            dest: {
              network: partyB.organization,
              userId: partyB.userId,
            },
            hashInfo: {
              secret: hashSecret,
            },
            expirySecs: BigInt(45),
            sourceCertificate: sourceCert,
            destinationCertificate: destCert,
          },
        }),
      );

      expect(lockResult).toBeTruthy();

      const claimResult = await copmTester.clientFor(partyB).claimLockedAssetV1(
        new ClaimLockedAssetV1Request({
          assetLockClaimV1PB: {
            lockId: lockResult.lockId,
            asset: {
              assetType: assetType,
              assetId: lockAssetName,
            },
            destination: {
              network: partyB.organization,
              userId: partyB.userId,
            },
            hashInfo: {
              secret: hashSecret,
            },
          },
        }),
      );
      expect(claimResult).toBeTruthy();

      expect(
        await assetsPartyA.userOwnsNonFungibleAsset(assetType, lockAssetName),
      ).toBeFalse();
      expect(
        await assetsPartyB.userOwnsNonFungibleAsset(assetType, lockAssetName),
      ).toBeTrue();
    },
  );

  test.each(networksToTest)(
    "%s can lock/claim tokens on same network",
    async (netType: string) => {
      await copmTestNetwork.startNetworkOfType(netType);
      const copmTester = getTesterForNetworkType(netType);
      await copmTester.startServer();

      const assetType = "token1";
      const assetQuantity = 10;
      const partyA = copmTester.getPartyA(assetType);
      const partyB = copmTester.getPartyB(assetType);

      // parties are different but on the same network
      expect(partyA.organization).toEqual(partyB.organization);
      expect(partyA.userId).not.toEqual(partyB.userId);

      const assetsPartyA = await copmTester.assetsFor(partyA);
      const assetsPartyB = await copmTester.assetsFor(partyB);

      await assetsPartyA.addToken(assetType, assetQuantity);

      const partyAStartBalance = await assetsPartyA.tokenBalance(assetType);
      const partyBStartBalance = await assetsPartyB.tokenBalance(assetType);

      const srcCert = await copmTester.getCertificateString(partyA);
      const destCert = await copmTester.getCertificateString(partyB);

      const lockResult = await copmTester.clientFor(partyA).lockAssetV1(
        new LockAssetV1Request({
          assetLockV1PB: {
            asset: {
              assetType: assetType,
              assetQuantity: assetQuantity,
            },
            source: { network: partyA.organization, userId: partyA.userId },
            dest: { network: partyB.organization, userId: partyB.userId },
            hashInfo: {
              secret: hashSecret,
            },
            expirySecs: BigInt(45),
            sourceCertificate: srcCert,
            destinationCertificate: destCert,
          },
        }),
      );

      expect(lockResult).toBeTruthy();
      expect(lockResult.lockId).toBeString();
      log.debug(lockResult.lockId);

      const claimResult = await copmTester.clientFor(partyB).claimLockedAssetV1(
        new ClaimLockedAssetV1Request({
          assetLockClaimV1PB: {
            lockId: lockResult.lockId,
            asset: {
              assetType: assetType,
              assetQuantity: assetQuantity,
            },
            destination: {
              network: partyB.organization,
              userId: partyB.userId,
            },
            hashInfo: {
              secret: hashSecret,
            },
          },
        }),
      );
      expect(claimResult).toBeTruthy();
      expect(await assetsPartyA.tokenBalance(assetType)).toEqual(
        partyAStartBalance - assetQuantity,
      );

      expect(await assetsPartyB.tokenBalance(assetType)).toEqual(
        partyBStartBalance + assetQuantity,
      );
    },
  );
});
