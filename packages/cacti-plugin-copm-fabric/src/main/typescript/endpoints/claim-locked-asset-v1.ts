import { ClaimLockedAssetV1Request } from "../generated/services/default_service_pb.js";
import { Logger } from "@hyperledger/cactus-common";
import { DLTransactionContextFactory } from "../lib/dl-context-factory";
import {
  AssetManager,
  HashFunctions,
} from "@hyperledger/cacti-weaver-sdk-fabric";
import { TransferrableAsset } from "../lib/transferrable-asset.js";
import { DLAccount, DLTransactionParams } from "../lib/types.js";
import {
  validateAssetAccount,
  validateHashInfo,
  validateTransferrableAsset,
} from "../lib/validators.js";
import { ConnectError, Code } from "@connectrpc/connect";

export async function claimLockedAssetV1Impl(
  req: ClaimLockedAssetV1Request,
  log: Logger,
  DLTransactionContextFactory: DLTransactionContextFactory,
  contractName: string,
): Promise<string> {
  let transactionParams: DLTransactionParams;
  const params = validate(req);
  const claimInfoStr = AssetManager.createAssetClaimInfoSerialized(
    params.hashInfo,
  );

  if (params.asset.isNFT()) {
    const nftParams = validateNFTParams(req);
    const agreementStr = AssetManager.createAssetExchangeAgreementSerialized(
      params.asset.assetType,
      params.asset.idOrQuantity(),
      nftParams.destCertificate,
      nftParams.sourceCertificate,
    );
    transactionParams = {
      contract: contractName,
      method: "ClaimAsset",
      args: [agreementStr, claimInfoStr],
    };
  } else {
    // NOTE: can not currently claim NFTs with only a lock id
    transactionParams = {
      contract: contractName,
      method: "ClaimFungibleAsset",
      args: [params.lockId, claimInfoStr],
    };
  }

  const transactionContext =
    await DLTransactionContextFactory.getTransactionContext(params.destination);
  const claimId = await transactionContext.invoke(transactionParams);

  log.debug("claim complete");
  return claimId;
}

function validate(req: ClaimLockedAssetV1Request): {
  asset: TransferrableAsset;
  destination: DLAccount;
  hashInfo: HashFunctions.Hash;
  lockId: string;
} {
  if (!req.assetLockClaimV1PB) {
    throw new ConnectError(`request data is required`, Code.InvalidArgument);
  }
  if (
    !req.assetLockClaimV1PB?.asset?.assetId &&
    !req.assetLockClaimV1PB?.lockId
  ) {
    throw new ConnectError(
      "either lockId or asset.assetId is required",
      Code.InvalidArgument,
    );
  }

  return {
    asset: validateTransferrableAsset(req.assetLockClaimV1PB.asset, "asset"),
    hashInfo: validateHashInfo(req.assetLockClaimV1PB.hashInfo, "hashInfo"),
    destination: validateAssetAccount(
      req.assetLockClaimV1PB.destination,
      "destination",
    ),
    lockId: req.assetLockClaimV1PB.lockId || "",
  };
}

function validateNFTParams(req: ClaimLockedAssetV1Request): {
  sourceCertificate: string;
  destCertificate: string;
} {
  if (!req.assetLockClaimV1PB?.destCertificate) {
    throw new ConnectError(
      "destinationCertificate required",
      Code.InvalidArgument,
    );
  }
  if (!req.assetLockClaimV1PB?.sourceCertificate) {
    throw new ConnectError("sourceCertificate required", Code.InvalidArgument);
  }
  return {
    destCertificate: req.assetLockClaimV1PB.destCertificate,
    sourceCertificate: req.assetLockClaimV1PB.sourceCertificate,
  };
}
