package com.copmCorda.corda
import arrow.core.Either
import com.copmCorda.DLAccount
import com.copmCorda.DLTransactionParams
import com.copmCorda.NodeRPCConnection
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import net.corda.core.flows.FlowLogic

class LocalTransaction(val account: DLAccount, val cordaConfig: CordaConfiguration) {

    suspend fun invoke(params: DLTransactionParams) : String {
        val rpc = this.cordaConfig.getRPC(this.account)
        val cordaParams = this.cordaParams(params.args, rpc).toTypedArray()
        @Suppress("UNCHECKED_CAST")
        val cordaFlow = Class.forName("${params.contract}.${params.method}") as Class<out FlowLogic<*>>
        val result = withContext(Dispatchers.IO) {
            rpc.proxy.startFlowDynamic(
                cordaFlow,
                *cordaParams
            ).returnValue.get()
        }
        when (result) {
            is Either.Left<*> -> {
                throw IllegalStateException("Corda Error: ${result.a.toString()}\n")
            }
            is Either.Right<*> -> {
                return result.b.toString()
            }
        }
        throw IllegalStateException("Corda did not return an EITHER\n")
    }

    private fun cordaParams(params: List<Any>, rpc: NodeRPCConnection) : List<Any> {
        return params.map {
            when (it) {
                is CordaParam -> it.toCordaParam(rpc)
                is List<*> -> this.cordaParams(it.map { it as Any}, rpc)
                else -> it
            }
        }
    }

}