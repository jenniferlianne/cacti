package com.copmCorda.interop.corda
import com.copmCorda.types.DLAsset
import com.copmCorda.types.DLTransactionParams
import com.copmCorda.interop.RemoteCopmContract
import com.copmCorda.validators.ValidatedClaimPledgedAssetV1Request

class RemoteCopmContractCordaFungible : RemoteCopmContract {
    override fun matchesNetworkTypeAndAsset(networkType: String, asset: DLAsset): Boolean {
        return networkType == "corda" && ! asset.isNFT
    }

    override fun getPledgeInfoCmd(claim: ValidatedClaimPledgedAssetV1Request): DLTransactionParams {
        return DLTransactionParams("com.cordaSimpleApplication.flow",
            "GetAssetPledgeStatusByPledgeId",
            listOf(claim.pledgeId, claim.destinationAccount.organization))
    }
}