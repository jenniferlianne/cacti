package com.copmCorda.corda

interface CordaType {
    fun toCordaParam(rpc: NodeRPCConnection) : Any
}