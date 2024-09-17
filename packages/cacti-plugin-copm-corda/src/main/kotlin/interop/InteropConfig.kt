package com.copmCorda.interop

import com.copmCorda.types.DLAsset
import com.copmCorda.types.DLTransactionParams
import com.copmCorda.interop.corda.RemoteCopmContractCordaFungible
import com.copmCorda.interop.corda.RemoteCopmContractCordaNFT
import com.copmCorda.interop.corda.ViewAddressCorda
import com.copmCorda.interop.fabric.RemoteCopmContractFabricFungible
import com.copmCorda.interop.fabric.RemoteCopmContractFabricNFT
import com.copmCorda.interop.fabric.ViewAddressFabric
import org.hyperledger.cacti.weaver.sdk.corda.RelayOptions
import org.json.JSONObject
import org.springframework.stereotype.Component
import java.io.File
import net.corda.core.utilities.loggerFor

@Component
class InteropConfig {

    companion object {
        val logger = loggerFor<InteropConfig>()
        val remoteCopmContracts = listOf(
            RemoteCopmContractFabricNFT(),
            RemoteCopmContractFabricFungible(),
            RemoteCopmContractCordaNFT(),
            RemoteCopmContractCordaFungible()
        )
        val viewAddressFormats = listOf(
            ViewAddressFabric(),
            ViewAddressCorda(),
        )
    }

    fun getRelayConfig(localNetwork: String): RelayConfig {
        val netConfigJson = this.remoteNetworkJson(localNetwork)
        val localRelayEndpoint: String = netConfigJson.getString("relayEndpoint")
        val localRelayPort = localRelayEndpoint.split(":").last().toInt()
        return RelayConfig("localhost:$localRelayPort", this.relayOptions())
    }

    fun getViewAddress(remoteNetwork: String, params: DLTransactionParams) : String {
        val networkConfig = this.getRemoteNetworkConfig(remoteNetwork)
        for (viewAddressFormat in viewAddressFormats) {
            if (viewAddressFormat.forNetwork() == networkConfig.networkType) {
                return viewAddressFormat.address(networkConfig, params)
            }
        }
        throw IllegalStateException("no view address formatter found for $remoteNetwork")
    }

    fun getRemoteCopmContract(remoteNetwork: String, asset: DLAsset) : RemoteCopmContract {
        val networkConfig = this.getRemoteNetworkConfig(remoteNetwork)
        for (contract in remoteCopmContracts) {
            if (contract.matchesNetworkTypeAndAsset(networkConfig.networkType, asset)) {
                return contract
            }
        }
        throw IllegalStateException("no contract found for $remoteNetwork matching asset ${asset.assetType}")
    }

    private fun getRemoteNetworkConfig(remoteNetwork: String): RemoteNetworkConfig {
        val netConfigJson = remoteNetworkJson(remoteNetwork)
        logger.info("getting configuration for $remoteNetwork")
        logger.info(netConfigJson.toString())
        val relayEndpoint: String = netConfigJson.getString("relayEndpoint")
        val networkType: String = netConfigJson.getString("type")
        logger.info("$remoteNetwork is of type $networkType")

        if (networkType == "corda") {
            return RemoteNetworkConfig(
                remoteNetwork,
                networkType,
                relayEndpoint,
                "",
                listOf(netConfigJson.getString("partyEndPoint"))
            )
        } else {
            return RemoteNetworkConfig(
                remoteNetwork,
                networkType,
                relayEndpoint,
                netConfigJson.getString("channelName"),
                emptyList()
            )
        }
    }

    private fun remoteNetworkJson(networkID: String): JSONObject {
        val currentDir = File(".") 
        val relPath = "../../weaver/samples/corda/corda-simple-application/clients/src/main/resources/config/remote-network-config.json"
        val networksConfigJSON: JSONObject
        val networksConfigFile: File
        try {
            networksConfigFile = File(currentDir, relPath)
            if (!networksConfigFile.exists()) {
                println("File ${networksConfigFile.absolutePath} doesn't exist to fetch the network configuration of networkID $networkID.")
                throw IllegalStateException("File ${networksConfigFile.absolutePath} doesn't exist to fetch the network configuration of networkID $networkID.")
            } else {
                // if file exists, read the contents of the file
                networksConfigJSON = JSONObject(networksConfigFile.readText(Charsets.UTF_8))
            }

            // throw exception if the networkID is not present in the file
            if (!networksConfigJSON.has(networkID)) {
                println("File $networksConfigFile doesn't contain the configuration of networkID $networkID.")
                throw IllegalStateException("File $networksConfigFile doesn't contain the configuration of networkID $networkID.")
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
