import {
  LockAssetV1Request,
  Validators,
  Interfaces as CopmIF,
} from "@hyperledger-cacti/cacti-copm-core";
import { HashFunctions } from "@hyperledger/cacti-weaver-sdk-fabric";
import { Logger } from "@hyperledger/cactus-common";
import { CordaConfiguration } from "../lib/corda-configuration";
import {
  WeaverAssetLockPB,
  WeaverFungibleAssetExchangePB,
} from "../lib/weaver-pb";
import * as assetLocksPb from "@hyperledger/cacti-weaver-protos-js/common/asset_locks_pb";

export async function lockAssetV1Impl(
  req: LockAssetV1Request,
  log: Logger,
  contextFactory: CopmIF.DLTransactionContextFactory,
  cordaConfig: CordaConfiguration,
  contractName: string,
): Promise<string> {
  const params = Validators.validateLockAssetRequest(req);

  const transactionContext = await contextFactory.getTransactionContext(
    params.source,
  );

  const assetCmds = cordaConfig.getAssetCmds(params.asset);

  const lockInfoBytes = lockInfo(
    params.hashInfo,
    Math.floor(Date.now() / 1000) + params.expirySecs,
  );

  const claimId = await transactionContext.invoke({
    contract: contractName,
    method: params.asset.isNFT() ? "LockAsset" : "LockFungibleAsset",
    args: [
      lockInfoBytes,
      fungibleAssetAgreement(req),
      assetCmds.ref,
      assetCmds.del,
      //cordaConfig.getIssuer(params.asset),
      //cordaConfig.getObservers(),
    ],
  });

  log.debug("lock complete");
  return claimId;
}

function fungibleAssetAgreement(
  req: LockAssetV1Request,
): WeaverFungibleAssetExchangePB {
  const params = Validators.validateLockAssetRequest(req);
  const assetExchangeAgreement =
    new assetLocksPb.FungibleAssetExchangeAgreement();
  assetExchangeAgreement.setAssettype(params.asset.assetType);
  assetExchangeAgreement.setNumunits(params.asset.quantity());
  assetExchangeAgreement.setRecipient(params.destinationCertificate);
  assetExchangeAgreement.setLocker(params.sourceCertificate);
  return new WeaverFungibleAssetExchangePB(
    assetExchangeAgreement.serializeBinary(),
  );
}

function lockInfo(
  hash: HashFunctions.Hash,
  expiryTimeSecs: number,
): WeaverAssetLockPB {
  const lockInfoHTLC = new assetLocksPb.AssetLockHTLC();
  lockInfoHTLC.setHashmechanism(hash.HASH_MECHANISM);
  lockInfoHTLC.setHashbase64(Buffer.from(hash.getSerializedHashBase64()));
  lockInfoHTLC.setExpirytimesecs(expiryTimeSecs);
  lockInfoHTLC.setTimespec(assetLocksPb.TimeSpec.EPOCH);
  const lockInfoHTLCSerialized = lockInfoHTLC.serializeBinary();
  const lockInfo = new assetLocksPb.AssetLock();
  lockInfo.setLockmechanism(assetLocksPb.LockMechanism.HTLC);
  lockInfo.setLockinfo(lockInfoHTLCSerialized);
  return new WeaverAssetLockPB(lockInfo.serializeBinary());
}
