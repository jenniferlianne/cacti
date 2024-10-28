package com.copmCorda.endpoints

import com.copmCorda.ApiCopmCordaServiceImpl.Companion.logger
import com.copmCorda.DLTransactionContextFactory
import com.copmCorda.corda.CordaAssetPledge
import com.copmCorda.corda.CordaConfiguration
import com.copmCorda.types.DLTransactionParams
import com.copmCorda.validators.ValidatedPledgeAssetV1Request
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.PledgeAssetV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceOuterClass

suspend fun pledgeAssetV1Impl(request: DefaultServiceOuterClass.PledgeAssetV1Request,
                              contextFactory: DLTransactionContextFactory,
                              cordaConfig: CordaConfiguration): PledgeAssetV1200ResponsePb.PledgeAssetV1200ResponsePB {
    // Obtain the recipient certificate from the name of the recipient
    logger.info("starting pledge asset")
    val data = ValidatedPledgeAssetV1Request(request)
    val assetContract = cordaConfig.assetContract(data.asset)
    val transaction = contextFactory.getLocalTransactionContext(data.sourceAccount)
    logger.info("starting transaction")
    val params = CordaAssetPledge(data,
        assetContract.getStateAndRef,
        assetContract.assetBurn,
        cordaConfig.getIssuer(data.destinationAccount),
        cordaConfig.getObservers(data.destinationAccount))
    val result = transaction.invoke(
        DLTransactionParams(cordaConfig.copmContract,
            "AssetTransferPledge",
            listOf( params ))
    )
    return PledgeAssetV1200ResponsePb.PledgeAssetV1200ResponsePB
        .newBuilder()
        .setPledgeId(result?.toString())
        .build()

}