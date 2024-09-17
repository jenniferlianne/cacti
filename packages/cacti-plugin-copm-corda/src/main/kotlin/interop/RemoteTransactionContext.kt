package com.copmCorda.interop

import arrow.core.Either
import com.copmCorda.corda.CordaConfiguration
import com.copmCorda.types.DLAccount
import com.copmCorda.types.DLTransactionContext
import com.copmCorda.types.DLTransactionParams
import org.hyperledger.cacti.weaver.sdk.corda.InteroperableHelper
import net.corda.core.utilities.loggerFor

class RemoteTransactionContext(
    private val localAccount: DLAccount,
    private val remoteNetwork: String,
    private val interopConfig: InteropConfig,
    private val cordaConfiguration: CordaConfiguration
) : DLTransactionContext  {

    companion object {
        val logger = loggerFor<InteropConfig>()
    }

    override suspend fun invoke(cmd: DLTransactionParams): Any? {
        val relayConfig = this.interopConfig.getRelayConfig(this.localAccount.organization)
        val rpc = this.cordaConfiguration.getRPC(this.localAccount)
        val address = interopConfig.getViewAddress(this.remoteNetwork, cmd).toString()
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
