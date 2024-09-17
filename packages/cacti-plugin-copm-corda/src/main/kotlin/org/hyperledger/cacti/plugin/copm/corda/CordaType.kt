package org.hyperledger.cacti.plugin.copm.corda

interface CordaType {
    fun toCordaParam(rpc: NodeRPCConnection) : Any
}