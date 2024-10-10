import { CordaSerializablePB } from "./corda_types";

export class WeaverAssetLockPB extends CordaSerializablePB {
  constructor(data: Uint8Array) {
    super(
      data,
      "org.hyperledger.cacti.weaver.protos.common.asset_locks.AssetLocks$AssetLock",
      "org.hyperledger.cacti.weaver.imodule.corda.flows.customSerializers.AssetLockSerializer",
    );
  }
}

export class WeaverFungibleAssetExchangePB extends CordaSerializablePB {
  constructor(data: Uint8Array) {
    super(
      data,
      "org.hyperledger.cacti.weaver.protos.common.asset_locks.AssetLocks$FungibleAssetExchangeAgreement",
      "org.hyperledger.cacti.weaver.imodule.corda.flows.customSerializers.FungibleAssetExchangeAgreementSerializer",
    );
  }
}
