package com.copmCorda.interop

import arrow.core.Either
import com.copmCorda.corda.CordaConfiguration
import com.copmCorda.DLAccount
import com.copmCorda.DLTransactionParams
import org.hyperledger.cacti.weaver.sdk.corda.InteroperableHelper
import net.corda.core.utilities.loggerFor

class RemoteTransaction(
    private val localAccount: DLAccount,
    private val interopConfig: InteropConfig,
    private val cordaConfiguration: CordaConfiguration
) {

    companion object {
        val logger = loggerFor<InteropConfig>()
    }

    fun invoke(remoteNetwork: String, params: DLTransactionParams): Any? {
        val relayConfig = this.interopConfig.getRelayConfig(this.localAccount.organization)
        val rpc = this.cordaConfiguration.getRPC(this.localAccount)
        val address = interopConfig.getViewAddress(remoteNetwork, params).toString()
        logger.info("invoking flow: $address at relay ${relayConfig.endpoint}")
        val result = InteroperableHelper.interopFlow(
            rpc.proxy,
            arrayOf(address),
            relayConfig.endpoint,
            this.localAccount.organization,
            externalStateParticipants = listOf(this.cordaConfiguration.getIssuer(this.localAccount).toCordaParam(rpc)),
            relayOptions = relayConfig.options
        )
        when (result) {
            is Either.Left<*> -> {
                throw IllegalStateException("Corda Error: ${result.a.toString()}\n")
            }
            is Either.Right<*> -> {
                return result.b
            }
        }
    }
}
