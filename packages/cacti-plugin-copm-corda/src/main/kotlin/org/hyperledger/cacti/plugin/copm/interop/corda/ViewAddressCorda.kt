package org.hyperledger.cacti.plugin.copm.interop.corda

import org.hyperledger.cacti.plugin.copm.types.DLTransactionParams
import org.hyperledger.cacti.plugin.copm.interop.RemoteNetworkConfig
import org.hyperledger.cacti.plugin.copm.interop.ViewAddressFormat
import org.hyperledger.cacti.weaver.sdk.corda.InteroperableHelper

class ViewAddressCorda(private val remoteNetworkConfig: RemoteNetworkConfig): ViewAddressFormat {
    override fun address(cmd: DLTransactionParams): String {
        return InteroperableHelper.createCordaViewAddress(
            this.remoteNetworkConfig.networkId,
            this.remoteNetworkConfig.relayEndpoint,
            this.remoteNetworkConfig.partyEndpoints,
            cmd.contract + "." + cmd.method,
            cmd.args.joinToString(separator=":") { it.toString() })
    }

}