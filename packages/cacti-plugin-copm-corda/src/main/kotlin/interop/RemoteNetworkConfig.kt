package com.copmCorda.interop

import com.copmCorda.DLTransactionParams
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceOuterClass.ClaimPledgedAssetV1Request

interface RemoteNetworkConfig
{
    fun getPledgeInfoCmd(claim: ClaimPledgedAssetV1Request) : DLTransactionParams
    fun getViewAddress(cmd: DLTransactionParams) : String
}

