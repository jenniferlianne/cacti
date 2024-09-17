package com.copmCorda.validators

import com.copmCorda.types.DLAccount
import com.copmCorda.types.DLAsset
import com.copmCorda.server.validators.validateAccount
import com.copmCorda.server.validators.validateAsset
import com.copmCorda.server.validators.validateHash
import com.copmCorda.server.validators.validateRequiredString
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceOuterClass.ClaimLockedAssetV1Request
import org.hyperledger.cacti.weaver.sdk.corda.HashFunctions

class ValidatedClaimLockedAssetV1Request(val asset: DLAsset,
                                         val contractId: String,
                                         val recipient: DLAccount,
                                         val hash: HashFunctions.Hash ) {

    constructor(request: ClaimLockedAssetV1Request) : this(
        validateAsset(request.assetLockClaimV1PB.asset, "asset"),
        validateRequiredString(request.assetLockClaimV1PB.lockId, "lockId"),
        validateAccount(request.assetLockClaimV1PB.destination, "destination"),
        validateHash(request.assetLockClaimV1PB.hashInfo, "hashInfo")
    ) {
    }
}