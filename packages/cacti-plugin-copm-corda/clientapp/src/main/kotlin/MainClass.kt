package com.copmCorda

//import org.hyperledger.cacti.weaver.imodule.corda.flows.customSerializers.AssetLockSerializer
import org.hyperledger.cacti.weaver.sdk.corda.AssetManager
import org.hyperledger.cacti.weaver.sdk.corda.HashFunctions
import net.corda.core.identity.CordaX500Name
import com.cordaSimpleApplication.contract.AssetContract
import com.cordaSimpleApplication.state.AssetState
import net.corda.core.messaging.startFlow
import com.cordaSimpleApplication.flow.IssueAssetState
import org.hyperledger.cacti.weaver.imodule.corda.flows.LockFungibleAsset
import net.corda.core.identity.Party
import org.springframework.boot.runApplication


fun main(args: Array<String>) {
    // val fqClassName = AssetContract.Commands.Delete::class.java.name;
    /*
    val fqClassName = AssetLockSerializer::class.java.name;
    println("fqClassName=${fqClassName}")

    val theClass = Class.forName(fqClassName)
    println("theClass=${theClass}")

    //val constructor: Constructor<*> = theClass.constructors.first()
    //println("constructor=${constructor}")
    for( method in theClass.methods) {
        println("method=${method.name} args=${method.parameterTypes.contentToString()}")
    }
    println("We can instantiate the class by its fully qualified name which is: '$fqClassName'. Yay!")
     */

    val rpc = NodeRPCConnection(
        host = "192.168.0.148",
        username = "clientUser1",
        password = "test",
        rpcPort = 10009)

    val issuer = rpc.proxy.wellKnownPartyFromX500Name(CordaX500Name.parse("O=PartyA,L=London,C=GB"))!!
    val assetType = "token1";
    val assetQuantity : Long = 2;
    val recipient = "O=PartyA,L=London,C=GB"
    val timeSpec = 1;
    val expiryTimeSecs : Long = 3600;
    val createdState = rpc.proxy.startFlow(::IssueAssetState, 2, "token1")
        .returnValue.get().tx.outputStates.first() as AssetState

    val hash: HashFunctions.Hash = HashFunctions.SHA256()
    hash.setPreimage("secret")
/*    val id = AssetManager.createFungibleHTLC(
            rpc.proxy,
            "token1",          // Type
            2, // Quantity
            "O=PartyA,L=London,C=GB",
            hash,
            3600,
            1,                  // nTimeout represents Duration
            "com.cordaSimpleApplication.flow.RetrieveStateAndRef",
            AssetContract.Commands.Delete(),
            issuer
        )

*/
    val assetAgreement = AssetManager.createFungibleAssetExchangeAgreement(assetType, assetQuantity, recipient, "")
    val lockInfo = AssetManager.createAssetLockInfo(hash, timeSpec, expiryTimeSecs)
    val observers : List<Party> = emptyList()

    val id = rpc.proxy.startFlow(::LockFungibleAsset, lockInfo, assetAgreement, "com.cordaSimpleApplication.flow.RetrieveStateAndRef", AssetContract.Commands.Delete(), issuer, observers)
        .returnValue.get()

    println("HTLC Lock State created with contract ID ${id}.")

    runApplication<Application>(*args)
}
