package com.copmCorda.corda

import net.corda.core.identity.Party
import org.springframework.stereotype.Component
import com.cordaSimpleApplication.contract.AssetContract
import com.cordaSimpleApplication.contract.BondAssetContract

import com.copmCorda.DLAccount
import com.copmCorda.DLAsset
import com.copmCorda.NodeRPCConnection
import net.corda.core.utilities.loggerFor

@Component
class CordaConfiguration {

    private val host = "192.168.0.148"
    private val username = "clientUser1"
    private val password = "test"

    companion object {
        val logger = loggerFor<CordaConfiguration>()
        private val exampleNFTAssetInfo = CordaAssetInfo(
            "com.cordaSimpleApplication.contract.BondAssetContract",
            "org.hyperledger.cacti.weaver.imodule.corda.flows",
            "com.cordaSimpleApplication.flow.RetrieveBondAssetStateAndRef",
            "com.cordaSimpleApplication.flow.GetBondAssetStateAndContractId",
            "com.cordaSimpleApplication.flow.UpdateBondAssetOwnerFromPointer",
            BondAssetContract.Commands.Issue(),
            BondAssetContract.Commands.Delete()
        )
        private val exampleFungibleAssetInfo = CordaAssetInfo(
            "com.cordaSimpleApplication.contract.AssetContract",
            "org.hyperledger.cacti.weaver.imodule.corda.flows",
            "com.cordaSimpleApplication.flow.RetrieveStateAndRef",
            "com.cordaSimpleApplication.flow.GetAssetStateAndContractId",
            "com.cordaSimpleApplication.flow.UpdateAssetOwnerFromPointer",
            AssetContract.Commands.Issue(),
            AssetContract.Commands.Delete()
        )
    }

    fun assetInfo(asset: DLAsset) : CordaAssetInfo {
        return if (asset.isNFT) exampleNFTAssetInfo else exampleFungibleAssetInfo;
    }


    fun getIssuer(account: DLAccount) : CordaParty {
        return CordaParty("O=PartyA,L=London,C=GB")
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