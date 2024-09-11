import { LockAssetV1Request } from "@hyperledger/cacti-copm-core";
import { Logger } from "@hyperledger/cactus-common";
import {
  AssetManager,
  HashFunctions,
} from "@hyperledger/cacti-weaver-sdk-fabric";
import { TransferrableAsset } from "../lib/transferrable-asset.js";
import { DLTransactionContextFactory } from "../lib/dl-context-factory";

export async function lockAssetV1Impl(
  req: LockAssetV1Request,
  log: Logger,
  DLTransactionContextFactory: DLTransactionContextFactory,
  contractName: string,
): Promise<string> {
  log.debug("parsing data");

  const ownerNetwork = req.assetLockV1PB?.owner?.network
    ? req.assetLockV1PB.owner.network
    : "";
  const ownerId = req.assetLockV1PB?.owner?.userId
    ? req.assetLockV1PB.owner.userId
    : "";
  const ccType = req.assetLockV1PB?.asset?.assetType
    ? req.assetLockV1PB.asset.assetType
    : "";
  const hashSecret = req.assetLockV1PB?.hashInfo?.secret
    ? req.assetLockV1PB.hashInfo.secret
    : "";
  const destCert = req.assetLockV1PB?.destinationCertificate
    ? req.assetLockV1PB?.destinationCertificate
    : "";
  const sourceCert = req.assetLockV1PB?.sourceCertificate
    ? req.assetLockV1PB?.sourceCertificate
    : "";
  const expirySecs = req.assetLockV1PB?.expirySecs
    ? Number(req.assetLockV1PB.expirySecs)
    : 60;

  const transferrableAsset = new TransferrableAsset(
    req.assetLockV1PB?.asset?.assetId,
    req.assetLockV1PB?.asset?.assetQuantity,
  );

  let hash: HashFunctions.Hash;
  if (req.assetLockV1PB?.hashInfo?.hashFcn == "SHA512") {
    hash = new HashFunctions.SHA512();
  } else {
    hash = new HashFunctions.SHA256();
  }
  hash.setPreimage(hashSecret);

  const transactionContext =
    await DLTransactionContextFactory.getTransactionContext({
      organization: ownerNetwork,
      userId: ownerId,
    });

  const serializeAgreementFunc = transferrableAsset.isNFT()
    ? AssetManager.createAssetExchangeAgreementSerialized
    : AssetManager.createFungibleAssetExchangeAgreementSerialized;

  const agreementStr = serializeAgreementFunc(
    ccType,
    transferrableAsset.idOrQuantity(),
    destCert,
    sourceCert,
  );

  const lockInfoStr = AssetManager.createAssetLockInfoSerialized(
    hash,
    Math.floor(Date.now() / 1000) + expirySecs,
  );

  const claimId = await transactionContext.invoke({
    contract: contractName,
    method: transferrableAsset.isNFT() ? "LockAsset" : "LockFungibleAsset",
    args: [agreementStr, lockInfoStr],
  });
  return claimId;
}
