package com.copmCorda

import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.TransferrableAssetV1Pb.TransferrableAssetV1PB

class DLAsset public constructor(asset: TransferrableAssetV1PB) {
    val assetType: String = asset.getAssetType()
    val assetId: String = asset.getAssetId();
    val assetQuantity: Long = asset.getAssetQuantity().toLong();
    val isNFT: Boolean = asset.getAssetQuantity() == 0;
}