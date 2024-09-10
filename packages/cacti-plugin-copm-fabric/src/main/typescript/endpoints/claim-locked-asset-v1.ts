import { ClaimLockedAssetV1Request } from "../generated/services/default_service_pb.js";
import { Logger } from "@hyperledger/cactus-common";
import { DLTransactionContextFactory } from "../lib/dl-context-factory";
import {
  AssetManager,
  HashFunctions,
} from "@hyperledger/cacti-weaver-sdk-fabric";
import { TransferrableAsset } from "../lib/transferrable-asset.js";

export async function claimLockedAssetV1Impl(
  req: ClaimLockedAssetV1Request,
  log: Logger,
  DLTransactionContextFactory: DLTransactionContextFactory,
  contractName: string,
): Promise<string> {
  log.debug("parsing data");
  const lockId = req.assetLockClaimV1PB?.lockId
    ? req.assetLockClaimV1PB.lockId
    : "unknown";
  const destNetwork = req.assetLockClaimV1PB?.destination?.network
    ? req.assetLockClaimV1PB?.destination.network
    : "unknown-network";
  const destUser = req.assetLockClaimV1PB?.destination?.userId
    ? req.assetLockClaimV1PB.destination.userId
    : "unknown-user";
  const ccType = req.assetLockClaimV1PB?.asset?.assetType
    ? req.assetLockClaimV1PB.asset.assetType
    : "unknown-asset-type";
  const sourceCert = req.assetLockClaimV1PB?.sourceCertificate
    ? req.assetLockClaimV1PB?.sourceCertificate
    : "";
  const destCert = req.assetLockClaimV1PB?.destCertificate
    ? req.assetLockClaimV1PB?.destCertificate
    : "";
  const hashSecret = req.assetLockClaimV1PB?.hashInfo?.secret
    ? req.assetLockClaimV1PB.hashInfo.secret
    : "";

  const asset = new TransferrableAsset(
    req.assetLockClaimV1PB?.asset?.assetId,
    req.assetLockClaimV1PB?.asset?.assetQuantity,
  );

  log.debug(`the asset is NFT ${asset.isNFT()}`);

  let hash: HashFunctions.Hash;
  if (req.assetLockClaimV1PB?.hashInfo?.hashFcn == "SHA512") {
    hash = new HashFunctions.SHA512();
  } else {
    hash = new HashFunctions.SHA256();
  }
  hash.setPreimage(hashSecret);

  const claimInfoStr = AssetManager.createAssetClaimInfoSerialized(hash);

  const serializeAgreementFunc = asset.isNFT()
    ? AssetManager.createAssetExchangeAgreementSerialized
    : AssetManager.createFungibleAssetExchangeAgreementSerialized;

  const agreementStr = serializeAgreementFunc(
    ccType,
    asset.idOrQuantity(),
    destCert,
    sourceCert,
  );

  const transactionContext =
    await DLTransactionContextFactory.getTransactionContext({
      organization: destNetwork,
      userId: destUser,
    });

  const claimId = await transactionContext.invoke({
    contract: contractName,
    method: asset.isNFT() ? "ClaimAsset" : "ClaimFungibleAsset",
    args: asset.isNFT() ? [agreementStr, claimInfoStr] : [lockId, claimInfoStr],
  });
  return claimId;
}
