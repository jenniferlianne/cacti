package org.hyperledger.cacti.plugin.copm.interfaces
import org.hyperledger.cacti.plugin.copm.corda.CordaAssetContract
import org.hyperledger.cacti.plugin.copm.corda.CordaParty
import org.hyperledger.cacti.plugin.copm.corda.NodeRPCConnection
import org.hyperledger.cacti.plugin.copm.types.DLAccount
import org.hyperledger.cacti.plugin.copm.types.DLAsset

interface CordaConfiguration {
    val copmContract: String
    fun assetContract(asset: DLAsset) : CordaAssetContract
    fun getIssuer(account: DLAccount) : CordaParty
    fun getRPC(account: DLAccount) : NodeRPCConnection
    fun getObservers(account: DLAccount) : List<CordaParty>
}