package com.copmCorda.validators

import com.copmCorda.DLAccount
import com.copmCorda.DLAsset
import com.copmCorda.server.validators.validateAccount
import com.copmCorda.server.validators.validateAsset
import com.copmCorda.server.validators.validateHash
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceOuterClass.PledgeAssetV1Request
import org.hyperledger.cacti.weaver.sdk.corda.HashFunctions
import java.util.Calendar

class ValidatedPledgeAssetV1Request(val asset: DLAsset,
                                          val sourceAccount: DLAccount,
                                          val destinationAccount: DLAccount,
                                          val destinationCertificate: String,
                                          val timeout: Long) {

    constructor(request: PledgeAssetV1Request) : this(
        validateAsset(request.assetPledgeV1PB.asset,"asset"),
        validateAccount(request.assetPledgeV1PB.source, "source"),
        validateAccount(request.assetPledgeV1PB.destination, "destination"),
        request.assetPledgeV1PB.destinationCertificate ?: "",
        (Calendar.getInstance().timeInMillis / 1000) + (request.assetPledgeV1PB.expirySecs ?: 6400)
    )

}

