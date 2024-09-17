package com.copmCorda.validators
import com.copmCorda.types.DLAccount
import com.copmCorda.types.DLAsset
import com.copmCorda.server.validators.validateAccount
import com.copmCorda.server.validators.validateAsset
import com.copmCorda.server.validators.validateHash
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceOuterClass.LockAssetV1Request
import org.hyperledger.cacti.weaver.sdk.corda.HashFunctions

class ValidatedLockAssetV1Request(val asset: DLAsset,
                                  val owner: DLAccount,
                                  val hash: HashFunctions.Hash,
                                  val sourceCert: String,
                                  val destCert: String,
                                  val expiryTimeFmt: Int,
                                  val expiryTime: Long) {
    constructor(req: LockAssetV1Request) : this(
        validateAsset(req.assetLockV1PB.asset, "asset"),
        validateAccount(req.assetLockV1PB.owner, "owner"),
        validateHash(req.assetLockV1PB.hashInfo, "hashInfo"),
        req.assetLockV1PB.sourceCertificate ?: "",
        req.assetLockV1PB.destinationCertificate ?: "",
        1,
        req.assetLockV1PB.expirySecs)

}