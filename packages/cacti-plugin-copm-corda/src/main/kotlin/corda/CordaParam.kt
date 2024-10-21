package com.copmCorda.corda

import com.copmCorda.NodeRPCConnection

interface CordaParam {
    fun toCordaParam(rpc: NodeRPCConnection) : Any
}