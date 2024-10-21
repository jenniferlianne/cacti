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
        val cordaParams = this.cordaParams(rpc, params.args).toTypedArray()
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
    }


    private fun cordaParams(rpc: NodeRPCConnection, params: List<Any>): List<Any> {
        return params.toTypedArray().map {
            if( it is CordaParam) {
                it.toCordaParam(rpc)
            } else {
                it
            }
        }
    }

}