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
import * as path from "path";
import * as dotenv from "dotenv";
import { CopmNetworkMode } from "../../../main/typescript/lib/types";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const logLevel: LogLevelDesc = "DEBUG";
const log: Logger = LoggerProvider.getOrCreate({
  label: "plugin-copm-crpc-server-test",
  level: logLevel,
});

const netType = process.env["COPM_NET_1"] || "fabric";

describe("Copm Lock and Claim", () => {
  let copmTester: CopmTester;
  const hashSecret: string = "my_secret_123";
  const lockAssetName: string = "lockasset" + new Date().getTime().toString();

  beforeAll(async () => {
    copmTester = copmTesterFactory(log, netType, CopmNetworkMode.Lock);
    await copmTester.startServer();
  });

  afterAll(async () => {
    if (copmTester) {
      await copmTester.stopServer();
    }
  });

  test(`${netType} can lock/claim nft on same network by asset agreement`, async () => {
    const assetType = "bond";
    const partyA = copmTester.getPartyA(assetType);
    const partyB = copmTester.getPartyB(assetType);

    const sourceCert = await copmTester.getCertificateString(partyA);
    const destCert = await copmTester.getCertificateString(partyB);

    await copmTester
      .assetsFor(partyA)
      .addNonFungibleAsset(assetType, lockAssetName);

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
          asset: {
            assetType: assetType,
            assetId: lockAssetName,
          },
          source: {
            network: partyA.organization,
            userId: partyA.userId,
          },
          destination: {
            network: partyB.organization,
            userId: partyB.userId,
          },
          sourceCertificate: sourceCert,
          destCertificate: destCert,
          hashInfo: {
            secret: hashSecret,
          },
        },
      }),
    );
    expect(claimResult).toBeTruthy();
  });

  test(`${netType} can lock/claim tokens on same network`, async () => {
    const assetType = "token1";
    const assetQuantity = 10;
    const partyA = copmTester.getPartyA(assetType);
    const partyB = copmTester.getPartyB(assetType);

    await copmTester.assetsFor(partyA).addToken(assetType, assetQuantity);

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
          source: {
            network: partyA.organization,
            userId: partyA.userId,
          },
          destination: {
            network: partyB.organization,
            userId: partyB.userId,
          },
          sourceCertificate: srcCert,
          destCertificate: destCert,
          hashInfo: {
            secret: hashSecret,
          },
        },
      }),
    );
    expect(claimResult).toBeTruthy();
  });
});
