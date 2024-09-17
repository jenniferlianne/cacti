package com.copmCorda.interop.fabric

import com.copmCorda.types.DLAsset
import com.copmCorda.types.DLTransactionParams
import com.copmCorda.interop.RemoteCopmContract
import com.copmCorda.validators.ValidatedClaimPledgedAssetV1Request

class RemoteCopmContractFabricNFT : RemoteCopmContract {

    override fun matchesNetworkTypeAndAsset(networkType: String, asset: DLAsset): Boolean {
        return networkType == "fabric" && asset.isNFT
    }

    override fun getPledgeInfoCmd(claim: ValidatedClaimPledgedAssetV1Request): DLTransactionParams {
        return DLTransactionParams("simpleassettransfer",
            "GetAssetPledgeStatus",
            listOf<Any>(claim.pledgeId,
                claim.sourceCert,
                claim.destinationAccount.organization,
                claim.destCert ) )
    }

}
