package com.copmCorda.interop

import com.copmCorda.DLTransactionParams
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceOuterClass.ClaimPledgedAssetV1Request
import com.copmCorda.server.validators.validateAsset
import org.hyperledger.cacti.weaver.sdk.corda.InteroperableHelper

class RemoteNetworkConfigFabric(private val networkId: String,
                                private val fungiblePledgeCmd: DLTransactionParams,
                                private val `non-fungiblePledgeCmd`: DLTransactionParams,
                                private val relayConfig: RelayConfig,
                                private val channelName: String) : RemoteNetworkConfig
{
    override fun getPledgeInfoCmd(request: ClaimPledgedAssetV1Request) : DLTransactionParams {
        val asset = validateAsset(request.assetPledgeClaimV1PB.asset, "asset")
        val cmd = if (asset.isNFT) this.`non-fungiblePledgeCmd` else this.fungiblePledgeCmd
        val destCert = request.assetPledgeClaimV1PB.destCertificate ?: ""
        val params  = listOf<Any>(request.assetPledgeClaimV1PB.pledgeId, request.assetPledgeClaimV1PB.sourceCertificate, request.assetPledgeClaimV1PB.destination.network, destCert )
        return DLTransactionParams(cmd.contract, cmd.method, params )
    }

    override fun getViewAddress(cmd: DLTransactionParams) : String {
        return InteroperableHelper.createFabricViewAddress(this.networkId,
            this.relayConfig.endpoint,
            this.channelName,
            cmd.contract, cmd.method, cmd.args.joinToString(separator=":") { it.toString() })
    }

}