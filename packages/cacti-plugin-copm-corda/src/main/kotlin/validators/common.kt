package com.copmCorda.server.validators 

import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.HashInfoV1Pb.HashInfoV1PB
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.TransferrableAssetV1Pb.TransferrableAssetV1PB
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.AssetAccountV1Pb.AssetAccountV1PB
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.ViewAddressV1Pb.ViewAddressV1PB

import com.copmCorda.DLAsset;
import com.copmCorda.DLAccount;
import com.copmCorda.DLTransactionParams
import org.hyperledger.cacti.weaver.sdk.corda.HashFunctions

fun validateHash(hashInfo: HashInfoV1PB?, label: String) : HashFunctions.Hash {
    if (hashInfo == null) {
        throw Exception("$label is required")
    }
    val hash : HashFunctions.Hash = if( hashInfo.hashFcn == "SHA512")
        HashFunctions.SHA512()
    else
        HashFunctions.SHA256()

    if (hashInfo.secret.isBlank()) {
        throw Exception("${label}.secret is required");
    }
    hash.setPreimage(hashInfo.secret);
    return hash;
}

fun validateAccount(account: AssetAccountV1PB?, label: String) : DLAccount {
    if (account == null) { throw Exception("$label is required") }
    if( account.network.isBlank()) throw Exception("$label.network is required");
    if( account.userId.isBlank()) throw Exception("$label.userId is required");

    return DLAccount(account.network, account.userId);
}

fun validateAsset(asset: TransferrableAssetV1PB?, label: String) : DLAsset {
    if(asset == null) throw Exception("$label is required")

    if ( asset.assetId.isNullOrBlank() && asset.assetQuantity == 0) {
        throw Exception("Either ${label}.assetId or ${label}.assetQuantity must be set");
    }
    return DLAsset(asset);
}

fun validateViewRequest(viewAddress: ViewAddressV1PB?, label: String) : DLTransactionParams {
    if( viewAddress == null) throw Exception("$label is required");
    if( viewAddress.contractId == null ) throw Exception("$label.contractId is required");
    if( viewAddress.function == null) throw Exception("$label.function is required");
    if( viewAddress.inputList == null) throw Exception("$label.input is required");
    return DLTransactionParams(viewAddress.contractId, viewAddress.function, viewAddress.inputList)
}
