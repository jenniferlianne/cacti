package com.copmCorda.endpoints

import com.copmCorda.ApiCopmCordaServiceImpl.Companion.logger
import com.copmCorda.DLTransactionContextFactory
import com.copmCorda.corda.CordaConfiguration
import com.copmCorda.corda.LocalTransactionContext
import com.copmCorda.types.DLTransactionParams
import com.copmCorda.validators.ValidatedClaimLockedAssetV1Request
import net.corda.core.CordaRuntimeException
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.ClaimPledgedAssetV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceOuterClass
import org.hyperledger.cacti.weaver.sdk.corda.AssetManager

suspend fun claimLockedAssetV1Impl(request: DefaultServiceOuterClass.ClaimLockedAssetV1Request,
                               transactionContextFactory: DLTransactionContextFactory,
                               cordaConfig: CordaConfiguration): ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB {
    logger.info("start claimLockedAssetV1")
    val data = ValidatedClaimLockedAssetV1Request(request)
    val assetContract = cordaConfig.assetContract(data.asset)
    val localTransactionContext = transactionContextFactory.getLocalTransactionContext(data.recipient)
    try {
        val result = localTransactionContext.invoke(
            DLTransactionParams(
                cordaConfig.copmContract,
                "ClaimAsset",
                listOf(data.contractId,
                    AssetManager.createAssetClaimInfo(data.hash),
                    assetContract.assetIssue,
                    assetContract.updateAssetOwnerRef,
                    cordaConfig.getIssuer(data.recipient),
                    cordaConfig.getObservers(data.recipient))
            )
        )
        return ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB.newBuilder()
            .setClaimId(result.toString())
            .build()
    } catch (e: CordaRuntimeException) {
        throw IllegalStateException(e.message)
    }

}
