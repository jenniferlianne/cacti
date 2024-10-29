package com.copmCorda.endpoints

import com.copmCorda.ApiCopmCordaServiceImpl.Companion.logger
import com.copmCorda.DLTransactionContextFactory
import com.copmCorda.corda.CordaConfiguration
import com.copmCorda.types.DLTransactionParams
import com.copmCorda.validators.ValidatedLockAssetV1Request
import net.corda.core.CordaRuntimeException
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.LockAssetV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceOuterClass
import org.hyperledger.cacti.weaver.sdk.corda.AssetManager


suspend fun lockAssetV1Impl(request: DefaultServiceOuterClass.LockAssetV1Request,
                            transactionContextFactory: DLTransactionContextFactory,
                            cordaConfig: CordaConfiguration): LockAssetV1200ResponsePb.LockAssetV1200ResponsePB {
    logger.info("start lockAssetV1")
    val data = ValidatedLockAssetV1Request(request)
    val contract = cordaConfig.assetContract(data.asset)
    val lockInfo = AssetManager.createAssetLockInfo(data.hash,data.expiryTimeFmt, data.expiryTime)
    val flow = if (data.asset.isNFT) "LockAsset" else "LockFungibleAsset"
    val agreement = if (data.asset.isNFT) AssetManager.createAssetExchangeAgreement(data.asset.assetType,data.asset.assetId, data.dest.accountId,"")
    else AssetManager.createFungibleAssetExchangeAgreement(data.asset.assetType,data.asset.assetQuantity,data.dest.accountId, "")
    try {
        val transaction = transactionContextFactory.getLocalTransactionContext(data.source)
        val result = transaction.invoke(
            DLTransactionParams(
                cordaConfig.copmContract,
                flow,
                listOf(lockInfo,
                    agreement,
                    contract.getStateAndRef,
                    contract.assetBurn,
                    cordaConfig.getIssuer(data.source),
                    cordaConfig.getObservers(data.source))
            )
        )
        return LockAssetV1200ResponsePb.LockAssetV1200ResponsePB
            .newBuilder()
            .setLockId(result.toString())
            .build()
    } catch (e: CordaRuntimeException) {
        logger.error(e.message)
        throw IllegalStateException(e.message)
    }
}
