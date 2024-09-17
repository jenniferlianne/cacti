package org.hyperledger.cacti.plugin.copm.interop.fabric

import org.hyperledger.cacti.plugin.copm.types.DLTransactionParams
import org.hyperledger.cacti.plugin.copm.interop.RemoteNetworkConfig
import org.hyperledger.cacti.plugin.copm.interop.ViewAddressFormat
import org.hyperledger.cacti.weaver.sdk.corda.InteroperableHelper

class ViewAddressFabric(private val remoteNetworkConfig: RemoteNetworkConfig): ViewAddressFormat {
    override fun address(cmd: DLTransactionParams): String {
        return InteroperableHelper.createFabricViewAddress(
            this.remoteNetworkConfig.networkId,
            this.remoteNetworkConfig.relayEndpoint,
            this.remoteNetworkConfig.channelName,
            cmd.contract,
            cmd.method,
            cmd.args.joinToString(separator=":") { it.toString() })
    }
}