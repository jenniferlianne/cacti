import { PledgeAssetV1Request } from "../generated/services/default_service_pb.js";
import { Logger } from "@hyperledger/cactus-common";
import { DLTransactionContextFactory } from "../lib/dl-context-factory";
import { TransferrableAsset } from "../lib/transferrable-asset.js";
import { ConnectError, Code } from "@connectrpc/connect";
import {
  validateAssetAccount,
  validateTransferrableAsset,
} from "../lib/validators.js";
import { DLAccount } from "../lib/types.js";

export async function pledgeAssetV1Impl(
  req: PledgeAssetV1Request,
  log: Logger,
  DLTransactionContextFactory: DLTransactionContextFactory,
  contractName: string,
): Promise<string> {
  const data = validate(req);

  const transactionContext =
    await DLTransactionContextFactory.getTransactionContext(data.source);

  const pledgeId = await transactionContext.invoke({
    contract: contractName,
    method: data.asset.isNFT() ? "PledgeAsset" : "PledgeTokenAsset",
    args: [
      data.asset.assetType,
      data.asset.idOrQuantity(),
      data.destinationNetwork,
      data.destinationCertificate,
      (Math.floor(Date.now() / 1000) + data.expirySecs).toString(),
    ],
  });

  return pledgeId;
}

function validate(req: PledgeAssetV1Request): {
  asset: TransferrableAsset;
  source: DLAccount;
  destinationNetwork: string;
  destinationCertificate: string;
  expirySecs: number;
} {
  if (!req.assetPledgeV1PB) {
    throw new ConnectError(`request data is required`, Code.InvalidArgument);
  }
  if (!req.assetPledgeV1PB.destination?.network) {
    throw new ConnectError("destination.network is required");
  }
  if (!req.assetPledgeV1PB.destinationCertificate) {
    throw new ConnectError("destinationCertificate is required");
  }

  return {
    asset: validateTransferrableAsset(req.assetPledgeV1PB.asset, "asset"),
    source: validateAssetAccount(req.assetPledgeV1PB.source, "source"),
    destinationNetwork: req.assetPledgeV1PB.destination.network,
    destinationCertificate: req.assetPledgeV1PB.destinationCertificate,
    expirySecs: req.assetPledgeV1PB.expirySecs
      ? Number(req.assetPledgeV1PB.expirySecs)
      : 60,
  };
}
