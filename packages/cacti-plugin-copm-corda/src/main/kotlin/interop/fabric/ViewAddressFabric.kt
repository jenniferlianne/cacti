package com.copmCorda.interop.fabric

import com.copmCorda.types.DLTransactionParams
import com.copmCorda.interop.RemoteNetworkConfig
import com.copmCorda.interop.ViewAddressFormat
import org.hyperledger.cacti.weaver.sdk.corda.InteroperableHelper

class ViewAddressFabric: ViewAddressFormat {
    override fun forNetwork(): String {
        return "fabric"
    }

    override fun address(remoteNetworkConfig: RemoteNetworkConfig, cmd: DLTransactionParams): String {
        return InteroperableHelper.createFabricViewAddress(
            remoteNetworkConfig.networkId,
            remoteNetworkConfig.relayEndpoint,
            remoteNetworkConfig.channelName,
            cmd.contract,
            cmd.method,
            cmd.args.joinToString(separator=":") { it.toString() })
    }
}