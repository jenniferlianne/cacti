package org.hyperledger.cacti.plugin.copm.corda
import net.corda.core.contracts.CommandData

class CordaAssetContract(
                     val getStateAndRef: String,
                     val getStateAndContractId: String,
                     val updateAssetOwnerRef: String,
                     val assetIssue: CommandData,
                     val assetBurn: CommandData) {
}
