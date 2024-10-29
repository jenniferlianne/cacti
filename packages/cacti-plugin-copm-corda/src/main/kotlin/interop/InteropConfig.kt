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
import kotlin.reflect.KClass

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
        val viewAddressFormats:  Map<String, KClass<*>> = mapOf(
                "corda" to ViewAddressCorda::class,
                "fabric" to ViewAddressFabric::class
        )
    }

    fun getRelayConfig(localNetwork: String): RelayConfig {
        val relayConfigJSON = JSONObject(System.getenv("COPM_RELAY_CONFIG"))
            
        // throw exception if the networkID is not present in the file
        if (!relayConfigJSON.has(localNetwork)) {
            throw IllegalStateException("env var COPM_RELAY_CONFIG doesn't contain the configuration of networkID $localNetwork.")
        }

        val netConfigJson = relayConfigJSON.getJSONObject(localNetwork)
        val localRelayEndpoint: String = netConfigJson.getString("relayEndpoint")
        logger.info("messages from ${localNetwork} will be sent to ${localRelayEndpoint}")
        return RelayConfig(localRelayEndpoint, this.relayOptions())
    }

    fun getViewAddressFormat(remoteNetwork: String) : ViewAddressFormat {
        val networkConfig = this.getRemoteNetworkConfig(remoteNetwork)
        if (! viewAddressFormats.contains(networkConfig.networkType)) {
            throw IllegalStateException("no view address formatter found for $remoteNetwork")
        }
        val clazz = viewAddressFormats[networkConfig.networkType]
        return clazz!!.constructors.first().call(networkConfig) as ViewAddressFormat;
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

    fun getRemoteNetworkConfig(remoteNetwork: String): RemoteNetworkConfig {
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
        val networksConfigJSON = JSONObject(System.getenv("COPM_REMOTE_CONFIG"))
            
        // throw exception if the networkID is not present in the file
        if (!networksConfigJSON.has(networkID)) {
            throw IllegalStateException("env var COPM_REMOTE_CONFIG doesn't contain the configuration of networkID $networkID.")
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
