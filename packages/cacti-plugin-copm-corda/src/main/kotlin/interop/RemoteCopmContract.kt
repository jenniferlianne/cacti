package com.copmCorda.interop

import com.copmCorda.types.DLAsset
import com.copmCorda.types.DLTransactionParams
import com.copmCorda.validators.ValidatedClaimPledgedAssetV1Request

interface RemoteCopmContract {
    fun matchesNetworkTypeAndAsset(networkType: String, asset: DLAsset): Boolean
    fun getPledgeInfoCmd(claim: ValidatedClaimPledgedAssetV1Request) : DLTransactionParams
}