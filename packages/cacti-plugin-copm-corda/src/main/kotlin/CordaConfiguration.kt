package com.copmCorda

import net.corda.core.contracts.CommandData
import net.corda.core.identity.CordaX500Name
import net.corda.core.identity.Party

import org.springframework.stereotype.Component
import com.cordaSimpleApplication.contract.AssetContract
import com.cordaSimpleApplication.contract.BondAssetContract

import com.copmCorda.DLAccount
import net.corda.core.utilities.loggerFor

class AssetCommands(val getStateAndRef: String,
                    val getStateAndContractId: String,
                    val updateAssetOwnerRef: String,
                    val assetIssue: CommandData,
                    val assetBurn: CommandData) {
}

@Component
class CordaConfiguration {

    private val host = "192.168.0.148";
    private val username = "clientUser1"
    private val password = "test"

    companion object {
        val logger = loggerFor<ApiCopmCordaServiceImpl>()
        private val nftCommandSet = AssetCommands(
            "com.cordaSimpleApplication.flow.RetrieveBondAssetStateAndRef",
            "com.cordaSimpleApplication.flow.GetBondAssetStateAndContractId",
            "com.cordaSimpleApplication.flow.UpdateBondAssetOwnerFromPointer",
            BondAssetContract.Commands.Issue(),
            BondAssetContract.Commands.Delete()
        )
        private val fungibleCommandSet = AssetCommands(
            "com.cordaSimpleApplication.flow.RetrieveStateAndRef",
            "com.cordaSimpleApplication.flow.GetAssetStateAndContractId",
            "com.cordaSimpleApplication.flow.UpdateAssetOwnerFromPointer",
            AssetContract.Commands.Issue(),
            AssetContract.Commands.Delete()
        )
    }

    fun assetCommands(asset: DLAsset) : AssetCommands {
        return if (asset.isNFT) nftCommandSet else fungibleCommandSet;
    }


    fun getIssuer(account: DLAccount) : Party {
        val rpc = this.getRPC(account);
        val party = rpc.proxy.wellKnownPartyFromX500Name(CordaX500Name.parse("O=PartyA,L=London,C=GB"))!!
        rpc.close()
        return party
    }

    fun getRPC(account: DLAccount) : NodeRPCConnection {
        logger.info("connecting ${account.organization}-${account.accountId}")
        var rpcPort = 10009
        if( account.accountId == "O=PartyA, L=London, C=GB" ) {
            rpcPort = 10006
        }
        logger.info("connecting to $host:$rpcPort")
        return NodeRPCConnection(host, username, password, rpcPort);
    }

    fun getObservers(account: DLAccount) : List<Party> {
        return emptyList();
    }

}