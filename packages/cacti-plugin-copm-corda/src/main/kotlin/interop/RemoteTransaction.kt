package com.copmCorda.interop

import com.copmCorda.CordaConfiguration
import com.copmCorda.DLAccount
import com.copmCorda.DLTransactionParams;
import org.hyperledger.cacti.weaver.sdk.corda.InteroperableHelper
import net.corda.core.contracts.UniqueIdentifier

class RemoteTransaction(
    private val localAccount: DLAccount,
    private val interopConfig: InteropConfig,
    private val cordaConfiguration: CordaConfiguration
) {

    fun invoke(remoteNetwork: String, params: DLTransactionParams): String {
        val relayConfig = this.interopConfig.getRelayConfig(this.localAccount.organization)
        val remoteNetworkConfig = this.interopConfig.getRemoteNetworkConfig(remoteNetwork)
        val rpc = this.cordaConfiguration.getRPC(this.localAccount)
        val address = remoteNetworkConfig.getViewAddress(params)

        val result = InteroperableHelper.interopFlow(
            rpc.proxy,
            arrayOf(address),
            relayConfig.endpoint,
            this.localAccount.organization,
            externalStateParticipants = listOf(this.cordaConfiguration.getIssuer(this.localAccount)),
            relayOptions = relayConfig.options
        ).fold({
            "Error in Interop Flow: ${it.message}"
        }, {
            (it as Array<*>)[0].toString()
        })
        return result;
    }
}
