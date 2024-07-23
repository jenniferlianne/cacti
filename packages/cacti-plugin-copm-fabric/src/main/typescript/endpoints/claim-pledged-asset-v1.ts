import { ClaimPledgedAssetV1Request } from "../generated/services/default_service_pb.js";
import { Logger } from "@hyperledger/cactus-common";
import { DLTransactionContextFactory } from "../lib/dl-context-factory";

export async function claimPledgedAssetV1Impl(
  req: ClaimPledgedAssetV1Request,
  log: Logger,
  DLTransactionContextFactory: DLTransactionContextFactory,
  contractName: string,
): Promise<string> {
  log.debug("parsing data");
  const sourceNetwork = req.assetPledgeClaimV1PB?.source?.network
    ? req.assetPledgeClaimV1PB.source.network
    : "unknown-network";
  const destNetwork = req.assetPledgeClaimV1PB?.destination?.network
    ? req.assetPledgeClaimV1PB?.destination.network
    : "unknown-network";
  const destUser = req.assetPledgeClaimV1PB?.destination?.userId
    ? req.assetPledgeClaimV1PB.destination.userId
    : "unknown-user";
  const ccType = req.assetPledgeClaimV1PB?.asset?.assetType
    ? req.assetPledgeClaimV1PB.asset.assetType
    : "unknown-asset-type";
  const pledgeId: string = req.assetPledgeClaimV1PB?.pledgeId
    ? req.assetPledgeClaimV1PB.pledgeId
    : "unknown-pledgeid";
  const sourceCert = req.assetPledgeClaimV1PB?.sourceCertificate
    ? req.assetPledgeClaimV1PB?.sourceCertificate
    : "";
  const destCert = req.assetPledgeClaimV1PB?.destCertificate
    ? req.assetPledgeClaimV1PB?.destCertificate
    : "";

  let ccId: string = "unknown-asset";
  if (req.assetPledgeClaimV1PB?.asset?.assetId) {
    ccId = req.assetPledgeClaimV1PB.asset.assetId;
  } else if (req.assetPledgeClaimV1PB?.asset?.assetQuantity) {
    ccId = req.assetPledgeClaimV1PB?.asset?.assetQuantity.toString();
  }

  const interop_context =
    await DLTransactionContextFactory.getRemoteTransactionContext(
      destNetwork,
      destUser,
      sourceNetwork,
    );

  const claimId = await interop_context.invokeFlow(
    {
      contract: contractName,
      method: "GetAssetPledgeStatus",
      args: [pledgeId, sourceCert, destNetwork, destCert],
    },
    {
      contract: contractName,
      method: "ClaimRemoteAsset",
      args: [pledgeId, ccType, ccId, sourceCert, sourceNetwork, ""],
    },
  );

  return claimId;
}
