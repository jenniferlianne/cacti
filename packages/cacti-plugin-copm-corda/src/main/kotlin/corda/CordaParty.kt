package com.copmCorda.corda

import com.copmCorda.NodeRPCConnection
import net.corda.core.identity.CordaX500Name
import net.corda.core.identity.Party

class CordaParty(private val name: String) : CordaParam {
    override fun toCordaParam(rpc: NodeRPCConnection) : Party {
        return rpc.proxy.wellKnownPartyFromX500Name(CordaX500Name.parse(name))!!
    }
}