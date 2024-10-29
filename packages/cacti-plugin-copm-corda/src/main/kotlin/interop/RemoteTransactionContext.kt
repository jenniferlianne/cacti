package com.copmCorda.interop

import arrow.core.Either
import com.copmCorda.corda.CordaConfiguration
import com.copmCorda.corda.CordaParty
import com.copmCorda.corda.NodeRPCConnection
import com.copmCorda.types.DLAccount
import com.copmCorda.types.DLTransactionContext
import com.copmCorda.types.DLTransactionParams
import org.hyperledger.cacti.weaver.sdk.corda.InteroperableHelper
import net.corda.core.utilities.loggerFor

class RemoteTransactionContext(
    private val localOrgKey: String,
    private val relayConfig: RelayConfig,
    private val viewAddressFormat: ViewAddressFormat,
    private val rpc: NodeRPCConnection,
    private val participants: List<CordaParty>
) : DLTransactionContext  {

    companion object {
        val logger = loggerFor<InteropConfig>()
    }

    override suspend fun invoke(cmd: DLTransactionParams): Any? {
        val address = this.viewAddressFormat.address(cmd)
        logger.info("invoking flow: $address at relay ${relayConfig.endpoint}")
        val result = InteroperableHelper.interopFlow(
            this.rpc.proxy,
            arrayOf(address),
            relayConfig.endpoint,
            localOrgKey,
            externalStateParticipants = this.participants.map { it.toCordaParam(rpc) },
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
