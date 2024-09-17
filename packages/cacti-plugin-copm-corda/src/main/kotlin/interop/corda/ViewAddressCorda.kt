package com.copmCorda.interop.corda

import com.copmCorda.types.DLTransactionParams
import com.copmCorda.interop.RemoteNetworkConfig
import com.copmCorda.interop.ViewAddressFormat
import org.hyperledger.cacti.weaver.sdk.corda.InteroperableHelper

class ViewAddressCorda: ViewAddressFormat {
    override fun forNetwork(): String {
        return "corda"
    }

    override fun address(remoteNetworkConfig: RemoteNetworkConfig, cmd: DLTransactionParams): String {
        return InteroperableHelper.createCordaViewAddress(
            remoteNetworkConfig.networkId,
            remoteNetworkConfig.relayEndpoint,
            remoteNetworkConfig.partyEndpoints,
            cmd.contract + "." + cmd.method,
            cmd.args.joinToString(separator=":") { it.toString() })
    }

}