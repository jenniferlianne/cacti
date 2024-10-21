package com.copmCorda.interop

import com.copmCorda.DLTransactionParams
import org.hyperledger.cacti.weaver.sdk.corda.RelayOptions
import org.hyperledger.cacti.weaver.sdk.corda.RelayClient
import org.hyperledger.cacti.weaver.sdk.corda.InteroperableHelper
import org.json.JSONObject
import io.grpc.ManagedChannel
import org.springframework.stereotype.Component
import java.io.File

@Component
class InteropConfig {

    val copmContractName : String = "org.hyperledger.cacti.weaver.imodule.corda.flows"

    fun getRelayConfig(localNetwork: String): RelayConfig {
        val netConfigJson = remoteNetworkJson(localNetwork)
        val localRelayEndpoint: String = netConfigJson.getString("relayEndpoint")
        return RelayConfig(localRelayEndpoint, this.relayOptions())
    }

    fun getRelayClient(localNetwork: String): RelayClient {
        val netConfigJson = remoteNetworkJson(localNetwork)
        val localRelayEndpoint: String = netConfigJson.getString("relayEndpoint")
        val localRelayHost = localRelayEndpoint.split(":").first()
        val localRelayPort = localRelayEndpoint.split(":").last().toInt()
        val channel: ManagedChannel
        try {
            channel = InteroperableHelper.getChannelToRelay(
                localRelayHost,
                localRelayPort,
                this.relayOptions()
            )
        } catch (e: Exception) {
            println("Error creating channel to relay: ${e.message}\n")
            throw e
        }
        return RelayClient(channel)
    }

    fun getRemoteNetworkConfig(remoteNetwork: String): RemoteNetworkConfig {
        val netConfigJson = remoteNetworkJson(remoteNetwork)
        val relayEndpoint: String = netConfigJson.getString("relayEndpoint")
        val networkType: String = netConfigJson.getString("type")
        val relayConfig = RelayConfig(relayEndpoint, this.relayOptions())
        if (networkType == "Corda") {
            val partyEndpoints: List<String> = listOf(netConfigJson.getString("partyEndPoint"))
            return RemoteNetworkConfigCorda(
                remoteNetwork,
                DLTransactionParams("com.cordaSimpleApplication.flow", "GetAssetPledgeStatusByPledgeId", emptyList()),
                DLTransactionParams(
                    "com.cordaSimpleApplication.flow",
                    "GetBondAssetPledgeStatusByPledgeId",
                    emptyList()
                ),
                relayConfig,
                partyEndpoints
            )
        } else {
            val channelName: String = netConfigJson.getString("channelName")
            return RemoteNetworkConfigFabric(
                remoteNetwork,
                DLTransactionParams("simpeassettransfer", "GetTokenAssetPledgeStatus", emptyList()),
                DLTransactionParams("simpleassettransfer", "GetAssetPledgeStatus", emptyList()),
                relayConfig,
                channelName
            )
        }
    }

    private fun remoteNetworkJson(networkID: String): JSONObject {
        val credentialPath: String =
            System.getenv("MEMBER_CREDENTIAL_FOLDER") ?: "clients/src/main/resources/config/credentials"
        val filepath = "$credentialPath/../remote-network-config.json"

        val networksConfigJSON: JSONObject
        val networksConfigFile: File
        try {
            networksConfigFile = File(filepath)
            if (!networksConfigFile.exists()) {
                // if file doesn't exits, throw an exception
                println("File $filepath doesn't exist to fetch the network configuration of networkID $networkID.")
                throw IllegalStateException("File $filepath doesn't exist to fetch the network configuration of networkID $networkID.")
            } else {
                // if file exists, read the contents of the file
                networksConfigJSON = JSONObject(networksConfigFile.readText(Charsets.UTF_8))
            }

            // throw exception if the networkID is not present in the file
            if (!networksConfigJSON.has(networkID)) {
                println("File $filepath doesn't contain the configuration of networkID $networkID.")
                throw IllegalStateException("File $filepath doesn't contain the configuration of networkID $networkID.")
            }
        } catch (e: Exception) {
            println("Error: $e")
            throw e
        }
        return networksConfigJSON.getJSONObject(networkID)
    }

    private fun relayOptions(): RelayOptions {
        val relayTLS = System.getenv("RELAY_TLS") ?: "false"
        val relayTrustStore = System.getenv("RELAY_TLSCA_TRUST_STORE") ?: ""
        val relayTrustStorePassword = System.getenv("RELAY_TLSCA_TRUST_STORE_PASSWORD") ?: ""
        val relayCertPaths = System.getenv("RELAY_TLSCA_CERT_PATHS") ?: ""
        return RelayOptions(
            useTlsForRelay = relayTLS.toBoolean(),
            relayTlsTrustStorePath = relayTrustStore,
            relayTlsTrustStorePassword = relayTrustStorePassword,
            tlsCACertPathsForRelay = relayCertPaths
        )
    }
}
