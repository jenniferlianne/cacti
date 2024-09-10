import { PledgeAssetV1Request } from "../generated/services/default_service_pb.js";
import { Logger } from "@hyperledger/cactus-common";
import { DLTransactionContextFactory } from "../lib/dl-context-factory";
import { TransferrableAsset } from "../lib/transferrable-asset.js";

export async function pledgeAssetV1Impl(
  req: PledgeAssetV1Request,
  log: Logger,
  DLTransactionContextFactory: DLTransactionContextFactory,
  contractName: string,
): Promise<string> {
  log.debug("parsing data");
  const sourceNetwork = req.assetPledgeV1PB?.source?.network
    ? req.assetPledgeV1PB.source.network
    : "";
  const sourceUser = req.assetPledgeV1PB?.source?.userId
    ? req.assetPledgeV1PB.source.userId
    : "";
  const destNetwork = req.assetPledgeV1PB?.destination?.network
    ? req.assetPledgeV1PB?.destination.network
    : "";
  const ccType = req.assetPledgeV1PB?.asset?.assetType
    ? req.assetPledgeV1PB.asset.assetType
    : "";
  const expirySecs = req.assetPledgeV1PB?.expirySecs
    ? Number(req.assetPledgeV1PB.expirySecs)
    : 60;
  const destCert = req.assetPledgeV1PB?.destinationCertificate
    ? req.assetPledgeV1PB?.destinationCertificate
    : "";

  const expirationTime = Math.floor(Date.now() / 1000 + expirySecs).toString();

  const transactionContext =
    await DLTransactionContextFactory.getTransactionContext(
      sourceNetwork,
      sourceUser,
    );

  const transferrableAsset = new TransferrableAsset(
    req.assetPledgeV1PB?.asset?.assetId,
    req.assetPledgeV1PB?.asset?.assetQuantity,
  );

  let pledgeId: string;

  if (transferrableAsset.isNFT()) {
    pledgeId = await transactionContext.invoke({
      contract: contractName,
      method: "PledgeAsset",
      args: [
        ccType,
        transferrableAsset.idOrQuantity(),
        destNetwork,
        destCert,
        expirationTime,
      ],
    });
  } else {
    pledgeId = await transactionContext.invoke({
      contract: contractName,
      method: "PledgeTokenAsset",
      args: [
        ccType,
        transferrableAsset.idOrQuantity(),
        destNetwork,
        destCert,
        expirationTime,
      ],
    });
  }
  return pledgeId;
}
