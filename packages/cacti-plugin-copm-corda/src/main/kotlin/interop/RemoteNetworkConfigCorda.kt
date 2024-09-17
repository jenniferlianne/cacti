package com.copmCorda.interop

import com.copmCorda.DLTransactionParams
import com.copmCorda.server.validators.validateAsset
import org.hyperledger.cacti.weaver.sdk.corda.InteroperableHelper
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceOuterClass.ClaimPledgedAssetV1Request



class RemoteNetworkConfigCorda(private val networkId: String,
                               private val fungiblePledgeFlow: DLTransactionParams,
                               private val nftPledgeFlow: DLTransactionParams,
                               private val relayConfig: RelayConfig,
                               private val cordaPartyEndpoints: List<String>) :
    RemoteNetworkConfig {

    override fun getPledgeInfoCmd(request: ClaimPledgedAssetV1Request) : DLTransactionParams {
        val asset = validateAsset(request.assetPledgeClaimV1PB.asset, "asset")
        val cmd = if (asset.isNFT) this.nftPledgeFlow else this.fungiblePledgeFlow
        return DLTransactionParams(cmd.contract, cmd.method, listOf(request.assetPledgeClaimV1PB.pledgeId, request.assetPledgeClaimV1PB.destination.network))
    }

    override fun getViewAddress(cmd: DLTransactionParams) : String {
        val relayEndpoint: String = this.relayConfig.endpoint
        val cordaHosts: List<String> = this.cordaPartyEndpoints

        return InteroperableHelper.createCordaViewAddress(this.networkId, relayEndpoint, cordaHosts,
            cmd.contract + "." + cmd.method, cmd.args.joinToString(separator=":") { it.toString() })
    }

}

