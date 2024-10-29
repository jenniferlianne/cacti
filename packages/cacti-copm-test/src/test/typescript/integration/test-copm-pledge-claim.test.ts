import "jest-extended";
import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import {
  ClaimPledgedAssetV1Request,
  PledgeAssetV1Request,
} from "@hyperledger-cacti/cacti-copm-core";
import { CopmNetworkMode } from "../../../main/typescript/lib/types";
import { CopmTestertMultiNetwork } from "../../../main/typescript/lib/copm-tester-multi-network";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const net1Type = process.env["COPM_NET_1"] || "fabric";
const net2Type = process.env["COPM_NET_2"] || "fabric";

const logLevel: LogLevelDesc = "DEBUG";
const log: Logger = LoggerProvider.getOrCreate({
  label: "plugin-copm-crpc-server-test",
  level: logLevel,
});

describe("Copm Pledge and Claim", () => {
  let copmTester: CopmTestertMultiNetwork;

  const pledgeAssetName: string =
    "pledgeasset" + new Date().getTime().toString();

  beforeAll(async () => {
    copmTester = new CopmTestertMultiNetwork(
      log,
      net1Type,
      net2Type,
      CopmNetworkMode.Pledge,
    );
    await copmTester.startServer();
    log.info("test setup complete");
  });

  afterAll(async () => {
    if (copmTester) {
      await copmTester.stopServer();
    }
  });

  test(`${net1Type}-${net2Type} asset nft pledge and claim`, async () => {
    const assetType = "bond01";
    const partyA = copmTester.getPartyA(assetType);
    const partyB = copmTester.getPartyB(assetType);
    const certA = await copmTester.getCertificateString(partyA);
    const certB = await copmTester.getCertificateString(partyB);
    await copmTester
      .assetsFor(partyA)
      .addNonFungibleAsset(assetType, pledgeAssetName);

    const pledgeNFTResult = await copmTester.clientFor(partyA).pledgeAssetV1(
      new PledgeAssetV1Request({
        assetPledgeV1PB: {
          asset: {
            assetType: assetType,
            assetId: pledgeAssetName,
          },
          source: { network: partyA.organization, userId: partyA.userId },
          destination: {
            network: partyB.organization,
            userId: partyB.userId,
          },
          expirySecs: BigInt(45),
          destinationCertificate: certB,
        },
      }),
    );

    expect(pledgeNFTResult).toBeTruthy();
    expect(pledgeNFTResult.pledgeId).toBeString();

    const claimNFTResult = await copmTester
      .clientFor(partyB)
      .claimPledgedAssetV1(
        new ClaimPledgedAssetV1Request({
          assetPledgeClaimV1PB: {
            pledgeId: pledgeNFTResult.pledgeId,
            asset: {
              assetType: assetType,
              assetId: pledgeAssetName,
            },
            source: { network: partyA.organization, userId: partyA.userId },
            destination: {
              network: partyB.organization,
              userId: partyB.userId,
            },
            sourceCertificate: certA,
            destCertificate: certB,
          },
        }),
      );
    expect(claimNFTResult).toBeTruthy();

    if (net1Type == "fabric") {
      // Check that the asset changed networks.
      expect(
        await copmTester
          .assetsFor(partyA)
          .userOwnsNonFungibleAsset(assetType, pledgeAssetName),
      ).toBeFalse();
    }
    if (net2Type == "fabric") {
      expect(
        await copmTester
          .assetsFor(partyB)
          .userOwnsNonFungibleAsset(assetType, pledgeAssetName),
      ).toBeTrue();
    }
  });

  test(`${net1Type}-${net2Type} asset token pledge and claim`, async () => {
    const assetType = "token1";
    const exchangeQuantity = 10;
    const partyA = copmTester.getPartyA(assetType);
    const partyB = copmTester.getPartyB(assetType);
    const certA = await copmTester.getCertificateString(partyA);
    const certB = await copmTester.getCertificateString(partyB);

    const assetsPartyA = copmTester.assetsFor(partyA);
    const assetsPartyB = copmTester.assetsFor(partyB);

    // ensure initial account balance - user will not h
    await assetsPartyA.addToken(assetType, 1 + exchangeQuantity);
    await assetsPartyB.addToken(assetType, 1);

    let user1StartBalance = 0,
      user2StartBalance = 0;

    if (net1Type == "fabric") {
      user1StartBalance = await assetsPartyA.tokenBalance(assetType);
    }
    if (net2Type == "fabric") {
      user2StartBalance = await assetsPartyB.tokenBalance(assetType);
    }

    const pledgeResult = await copmTester.clientFor(partyA).pledgeAssetV1(
      new PledgeAssetV1Request({
        assetPledgeV1PB: {
          asset: {
            assetType: assetType,
            assetQuantity: exchangeQuantity,
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
          destinationCertificate: certB,
        },
      }),
    );

    expect(pledgeResult).toBeTruthy();
    expect(pledgeResult.pledgeId).toBeString();

    const claimResult = await copmTester.clientFor(partyB).claimPledgedAssetV1(
      new ClaimPledgedAssetV1Request({
        assetPledgeClaimV1PB: {
          pledgeId: pledgeResult.pledgeId,
          asset: {
            assetType: assetType,
            assetQuantity: exchangeQuantity,
          },
          source: {
            network: partyA.organization,
            userId: partyA.userId,
          },
          destination: {
            network: partyB.organization,
            userId: partyB.userId,
          },
          sourceCertificate: certA,
          destCertificate: certB,
        },
      }),
    );
    expect(claimResult).toBeTruthy();

    // Check that the tokens changed networks.
    if (net1Type == "fabric") {
      expect(await assetsPartyA.tokenBalance(assetType)).toEqual(
        user1StartBalance - exchangeQuantity,
      );
    }
    if (net2Type == "fabric") {
      expect(await assetsPartyB.tokenBalance(assetType)).toEqual(
        user2StartBalance + exchangeQuantity,
      );
    }

    expect(await assetsPartyB.tokenBalance(assetType)).toEqual(
      user2StartBalance + exchangeQuantity,
    );
  });
});
