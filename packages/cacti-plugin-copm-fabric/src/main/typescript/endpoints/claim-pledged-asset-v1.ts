import { ClaimPledgedAssetV1Request } from "../generated/services/default_service_pb.js";
import { Logger } from "@hyperledger/cactus-common";
import { DLTransactionContextFactory } from "../lib/dl-context-factory";
import { TransferrableAsset } from "../lib/transferrable-asset.js";

export async function claimPledgedAssetV1Impl(
  req: ClaimPledgedAssetV1Request,
  log: Logger,
  DLTransactionContextFactory: DLTransactionContextFactory,
  contractName: string,
): Promise<string> {
  log.debug("parsing data");
  const sourceNetwork = req.assetPledgeClaimV1PB?.source?.network
    ? req.assetPledgeClaimV1PB.source.network
    : "";
  const destNetwork = req.assetPledgeClaimV1PB?.destination?.network
    ? req.assetPledgeClaimV1PB?.destination.network
    : "";
  const destUser = req.assetPledgeClaimV1PB?.destination?.userId
    ? req.assetPledgeClaimV1PB.destination.userId
    : "";
  const ccType = req.assetPledgeClaimV1PB?.asset?.assetType
    ? req.assetPledgeClaimV1PB.asset.assetType
    : "";
  const pledgeId: string = req.assetPledgeClaimV1PB?.pledgeId
    ? req.assetPledgeClaimV1PB.pledgeId
    : "";
  const sourceCert = req.assetPledgeClaimV1PB?.sourceCertificate
    ? req.assetPledgeClaimV1PB?.sourceCertificate
    : "";
  const destCert = req.assetPledgeClaimV1PB?.destCertificate
    ? req.assetPledgeClaimV1PB?.destCertificate
    : "";

  const asset = new TransferrableAsset(
    req.assetPledgeClaimV1PB?.asset?.assetId,
    req.assetPledgeClaimV1PB?.asset?.assetQuantity,
  );

  const interop_context =
    await DLTransactionContextFactory.getRemoteTransactionContext(
      { organization: destNetwork, userId: destUser },
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
      method: asset.isNFT() ? "ClaimRemoteAsset" : "ClaimRemoteTokenAsset",
      args: [
        pledgeId,
        ccType,
        asset.idOrQuantity(),
        sourceCert,
        sourceNetwork,
        "",
      ],
    },
  );

  return claimId;
}
