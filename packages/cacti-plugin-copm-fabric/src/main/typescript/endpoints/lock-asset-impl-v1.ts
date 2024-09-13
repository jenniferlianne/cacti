import { LockAssetV1Request } from "../generated/services/default_service_pb.js";
import { Logger } from "@hyperledger/cactus-common";
import {
  AssetManager,
  HashFunctions,
} from "@hyperledger/cacti-weaver-sdk-fabric";
import { TransferrableAsset } from "../lib/transferrable-asset.js";
import { DLTransactionContextFactory } from "../lib/dl-context-factory";
import { ConnectError, Code } from "@connectrpc/connect";
import {
  validateAssetAccount,
  validateHashInfo,
  validateTransferrableAsset,
} from "../lib/validators.js";
import { DLAccount } from "../lib/types.js";

export async function lockAssetV1Impl(
  req: LockAssetV1Request,
  log: Logger,
  DLTransactionContextFactory: DLTransactionContextFactory,
  contractName: string,
): Promise<string> {
  const params = validate(req);

  const transactionContext =
    await DLTransactionContextFactory.getTransactionContext(params.owner);

  const serializeAgreementFunc = params.asset.isNFT()
    ? AssetManager.createAssetExchangeAgreementSerialized
    : AssetManager.createFungibleAssetExchangeAgreementSerialized;

  const agreementStr = serializeAgreementFunc(
    params.asset.assetType,
    params.asset.idOrQuantity(),
    params.destinationCertificate,
    params.sourceCertificate,
  );

  const lockInfoStr = AssetManager.createAssetLockInfoSerialized(
    params.hashInfo,
    Math.floor(Date.now() / 1000) + params.expirySecs,
  );

  const claimId = await transactionContext.invoke({
    contract: contractName,
    method: params.asset.isNFT() ? "LockAsset" : "LockFungibleAsset",
    args: [agreementStr, lockInfoStr],
  });
  return claimId;
}

function validate(request: LockAssetV1Request): {
  owner: DLAccount;
  hashInfo: HashFunctions.Hash;
  sourceCertificate: string;
  destinationCertificate: string;
  asset: TransferrableAsset;
  expirySecs: number;
} {
  if (!request.assetLockV1PB) {
    throw new ConnectError("data required", Code.InvalidArgument);
  }
  if (!request.assetLockV1PB.destinationCertificate) {
    throw new ConnectError(
      "destinationCertificate required",
      Code.InvalidArgument,
    );
  }
  if (!request.assetLockV1PB.sourceCertificate) {
    throw new ConnectError("sourceCertificate required", Code.InvalidArgument);
  }
  return {
    owner: validateAssetAccount(request.assetLockV1PB.owner, "owner"),
    hashInfo: validateHashInfo(request.assetLockV1PB.hashInfo, "hashInfo"),
    asset: validateTransferrableAsset(request.assetLockV1PB.asset, "asset"),
    sourceCertificate: request.assetLockV1PB.sourceCertificate,
    destinationCertificate: request.assetLockV1PB.destinationCertificate,
    expirySecs: request.assetLockV1PB.expirySecs
      ? Number(request.assetLockV1PB.expirySecs)
      : 60,
  };
}
