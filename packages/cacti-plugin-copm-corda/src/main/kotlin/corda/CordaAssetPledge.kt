package com.copmCorda.corda
import com.copmCorda.validators.ValidatedPledgeAssetV1Request
import net.corda.core.contracts.CommandData
import org.hyperledger.cacti.weaver.imodule.corda.states.AssetPledgeParameters

class CordaAssetPledge(private val data: ValidatedPledgeAssetV1Request,
                       private val getStateAndRef: String,
                       private val assetBurn : CommandData,
                       private val issuer: CordaParty,
                       private val observers: List<CordaParty>)
    : CordaType {

    override fun toCordaParam(rpc: NodeRPCConnection): Any {
        return AssetPledgeParameters(
            data.asset.assetType, // @property assetType
            data.asset.assetIdOrQuantity(),
            data.sourceAccount.organization, // @property localNetworkId
            data.destinationAccount.organization, // @property remoteNetworkId
            data.destinationCertificate, // @property recipientCert
            data.timeout, // @property expiryTimeSecs
            getStateAndRef,
            assetBurn,
            issuer.toCordaParam(rpc),
            observers.map { it.toCordaParam(rpc) }
        )
    }
}



/*
    val params = AssetPledgeParameters(
        data.asset.assetType, // @property assetType
        data.asset.assetIdOrQuantity(),
        data.sourceAccount.organization, // @property localNetworkId
        data.destinationAccount.organization, // @property remoteNetworkId
        data.destinationCertificate, // @property recipientCert
        data.timeout, // @property expiryTimeSecs
        assetContract.getStateAndRef,
        assetContract.assetBurn,
        cordaConfig.getIssuer(data.sourceAccount).toCordaParam(cordaConfig.getRPC(data.sourceAccount)),
        cordaConfig.getObservers(data.sourceAccount)
    )

 */