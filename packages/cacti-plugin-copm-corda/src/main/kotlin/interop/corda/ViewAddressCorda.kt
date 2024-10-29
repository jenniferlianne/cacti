package com.copmCorda.interop.corda

import com.copmCorda.types.DLTransactionParams
import com.copmCorda.interop.RemoteNetworkConfig
import com.copmCorda.interop.ViewAddressFormat
import org.hyperledger.cacti.weaver.sdk.corda.InteroperableHelper

class ViewAddressCorda(private val remoteNetworkConfig: RemoteNetworkConfig): ViewAddressFormat {
    override fun forNetwork(): String {
        return "corda"
    }

    override fun address(cmd: DLTransactionParams): String {
        return InteroperableHelper.createCordaViewAddress(
            this.remoteNetworkConfig.networkId,
            this.remoteNetworkConfig.relayEndpoint,
            this.remoteNetworkConfig.partyEndpoints,
            cmd.contract + "." + cmd.method,
            cmd.args.joinToString(separator=":") { it.toString() })
    }

}