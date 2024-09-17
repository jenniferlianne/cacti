package com.copmCorda.endpoints

import com.copmCorda.ApiCopmCordaServiceImpl.Companion.logger
import com.copmCorda.DLTransactionContextFactory
import com.copmCorda.validators.ValidatedGetVerifiedViewV1Request
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.GetVerifiedViewV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceOuterClass

suspend fun getVerifiedViewV1Impl(request: DefaultServiceOuterClass.GetVerifiedViewV1Request,
                              transactionContextFactory: DLTransactionContextFactory): GetVerifiedViewV1200ResponsePb.GetVerifiedViewV1200ResponsePB {
    logger.info("start verified view")
    val data = ValidatedGetVerifiedViewV1Request(request)
    val remoteTransaction = transactionContextFactory.getRemoteTransactionContext(data.account,
        data.remoteNetwork)
    val res = remoteTransaction.invoke(data.cmd)
    return GetVerifiedViewV1200ResponsePb.GetVerifiedViewV1200ResponsePB.newBuilder()
        .setData(res.toString())
        .build()
}
