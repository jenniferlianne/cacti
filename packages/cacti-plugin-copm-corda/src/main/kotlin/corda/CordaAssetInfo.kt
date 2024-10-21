package com.copmCorda.corda
import net.corda.core.contracts.CommandData

class CordaAssetInfo(val contractName: String,
                     val copmContract: String,
                     val getStateAndRef: String,
                     val getStateAndContractId: String,
                     val updateAssetOwnerRef: String,
                     val assetIssue: CommandData,
                     val assetBurn: CommandData) {
}
