package com.copmCorda.interop

import com.copmCorda.DLAsset
import com.copmCorda.DLTransactionParams
import com.copmCorda.validators.ValidatedClaimPledgedAssetV1Request

interface RemoteCopmContract {
    fun matchesNetworkTypeAndAsset(networkType: String, asset: DLAsset): Boolean
    fun getPledgeInfoCmd(claim: ValidatedClaimPledgedAssetV1Request) : DLTransactionParams
}