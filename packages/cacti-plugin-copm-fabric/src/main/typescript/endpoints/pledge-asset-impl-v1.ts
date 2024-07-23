import { PledgeAssetV1Request } from "../generated/services/default_service_pb.js";
import { Logger } from "@hyperledger/cactus-common";
import { DLTransactionContextFactory } from "../lib/dl-context-factory";

export async function pledgeAssetV1Impl(
  req: PledgeAssetV1Request,
  log: Logger,
  DLTransactionContextFactory: DLTransactionContextFactory,
  contractName: string,
): Promise<string> {
  log.debug("parsing data");
  const sourceNetwork = req.assetPledgeV1PB?.source?.network
    ? req.assetPledgeV1PB.source.network
    : "unknown-network";
  const sourceUser = req.assetPledgeV1PB?.source?.userId
    ? req.assetPledgeV1PB.source.userId
    : "unknown-user";
  const destNetwork = req.assetPledgeV1PB?.destination?.network
    ? req.assetPledgeV1PB?.destination.network
    : "unknown-network";
  const ccType = req.assetPledgeV1PB?.asset?.assetType
    ? req.assetPledgeV1PB.asset.assetType
    : "unknown-asset-type";
  let ccId: string = "unknown-asset";
  const expirySecs = req.assetPledgeV1PB?.expirySecs
    ? Number(req.assetPledgeV1PB.expirySecs)
    : 60;
  const destCert = req.assetPledgeV1PB?.destinationCertificate
    ? req.assetPledgeV1PB?.destinationCertificate
    : "";

  if (req.assetPledgeV1PB?.asset?.assetId) {
    ccId = req.assetPledgeV1PB.asset.assetId;
  } else if (req.assetPledgeV1PB?.asset?.assetQuantity) {
    ccId = req.assetPledgeV1PB?.asset?.assetQuantity.toString();
  }

  const expirationTime = Math.floor(Date.now() / 1000 + expirySecs).toString();

  const transactionContext =
    await DLTransactionContextFactory.getTransactionContext(
      sourceNetwork,
      sourceUser,
    );

  const pledgeId = await transactionContext.invoke({
    contract: contractName,
    method: "PledgeAsset",
    args: [ccType, ccId, destNetwork, destCert, expirationTime],
  });
  return pledgeId;
}
