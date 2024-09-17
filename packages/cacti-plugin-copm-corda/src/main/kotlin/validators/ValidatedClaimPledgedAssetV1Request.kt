package com.copmCorda.validators

import com.copmCorda.DLAccount
import com.copmCorda.DLAsset
import com.copmCorda.server.validators.validateAccount
import com.copmCorda.server.validators.validateAsset
import com.copmCorda.server.validators.validateHash
import com.copmCorda.server.validators.validateRequiredString
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceOuterClass.ClaimPledgedAssetV1Request
import org.hyperledger.cacti.weaver.sdk.corda.HashFunctions
import java.util.Calendar

class ValidatedClaimPledgedAssetV1Request(val asset: DLAsset,
    val sourceAccount: DLAccount,
    val destinationAccount: DLAccount,
    val sourceCert: String,
    val destCert: String,
    val pledgeId: String) {

    constructor(request: ClaimPledgedAssetV1Request) : this(
        validateAsset(request.assetPledgeClaimV1PB.asset,"asset"),
        validateAccount(request.assetPledgeClaimV1PB.source, "source"),
        validateAccount(request.assetPledgeClaimV1PB.destination, "destination"),
        request.assetPledgeClaimV1PB.sourceCertificate ?: "",
        request.assetPledgeClaimV1PB.destCertificate ?: "",
        validateRequiredString( request.assetPledgeClaimV1PB.pledgeId, "pledgeId")
    )

}
