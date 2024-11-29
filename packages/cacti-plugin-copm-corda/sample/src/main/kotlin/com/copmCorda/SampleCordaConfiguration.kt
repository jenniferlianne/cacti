package com.copmCorda

import org.json.JSONObject
import net.corda.core.utilities.loggerFor
import org.springframework.stereotype.Component
import org.hyperledger.cacti.plugin.copm.types.DLAccount
import org.hyperledger.cacti.plugin.copm.corda.CordaParty
import org.hyperledger.cacti.plugin.copm.interfaces.CordaConfiguration
import org.hyperledger.cacti.plugin.copm.corda.NodeRPCConnection

@Component
class SampleCordaConfiguration : CordaConfiguration {
    override val copmContract = "org.hyperledger.cacti.weaver.imodule.corda.flows"

    companion object {

        val logger = loggerFor<CordaConfiguration>()
    }

    override fun getRPC(account: DLAccount) : NodeRPCConnection {
        val accountKey = "${account.accountId}@${account.organization}"
        logger.debug("connecting $accountKey")
        val networksConfigJSON: JSONObject
        val rpcStr = System.getenv("COPM_CORDA_RPC") ?: "{}"
        networksConfigJSON = JSONObject(rpcStr)

        if (!networksConfigJSON.has(accountKey)) {
            throw IllegalStateException("ENV VAR COPM_CORDA_RPC configuration of networkID $accountKey.")
        }

        val accountJson = networksConfigJSON.getJSONObject(accountKey)
        val host = accountJson.getString("host")
        val port = accountJson.getInt("port")
        val username = accountJson.getString("username")
        val password = accountJson.getString("password")
        logger.debug("connecting to $host:${port.toString()}")
        return NodeRPCConnection(host, username, password, port)
    }

    override fun getObservers(account: DLAccount) : List<CordaParty> {
        return emptyList();
    }

}