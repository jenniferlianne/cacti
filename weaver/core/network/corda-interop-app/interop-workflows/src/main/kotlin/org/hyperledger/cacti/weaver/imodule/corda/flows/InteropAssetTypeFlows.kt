/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

 package org.hyperledger.cacti.weaver.imodule.corda.flows

 import arrow.core.Either
 import arrow.core.Left
 import arrow.core.Right
 import arrow.core.flatMap
 import co.paralleluniverse.fibers.Suspendable
 import org.hyperledger.cacti.weaver.imodule.corda.contracts.InteropAssetTypeStateContract
 import org.hyperledger.cacti.weaver.imodule.corda.states.Member
 import org.hyperledger.cacti.weaver.imodule.corda.states.InteropAssetTypeState
 import net.corda.core.contracts.Command
 import net.corda.core.contracts.StateAndRef
 import net.corda.core.contracts.UniqueIdentifier
 import net.corda.core.contracts.requireThat
 import net.corda.core.flows.*
 import net.corda.core.node.ServiceHub
 import net.corda.core.node.services.queryBy
 import net.corda.core.transactions.TransactionBuilder
 import net.corda.core.transactions.SignedTransaction
 import net.corda.core.identity.Party
 import java.security.cert.X509Certificate
 import java.time.LocalDateTime
 import java.time.ZoneId
 
 /**
  * The CreateInteropAssetTypeState flow is used to store a [InteropAssetTypeState] in the Corda ledger.
  *
  * @property InteropAssetType The [InteropAssetTypeState] provided by the Corda client to be stored in the vault.
  */
 @InitiatingFlow
 @StartableByRPC
 class CreateInteropAssetTypeState(
     val assetTypeState: InteropAssetTypeState,
     val sharedParties: List<Party> = listOf<Party>()
 ) : FlowLogic<Either<Error, UniqueIdentifier>>() {
     /**
      * The call() method captures the logic to create a new [InteropAssetTypeState] state in the vault.
      *
      * @return Returns the linearId of the newly created [InteropAssetTypeState].
      */
     @Suspendable
     override fun call(): Either<Error, UniqueIdentifier> = try {
         println("Asset type to be stored in the vault: $assetTypeState")
 
         // 1. Check that a InteropAssetType for that securityDomain does not already exist
         subFlow(GetInteropAssetTypeStateByName(assetTypeState.assetType.name)).fold({
             // If the flow produces an error, then the InteropAssetType does not already exist.
 
             // Create the InteropAssetType to store with our identity listed as a participant
             val outputState = assetTypeState.copy(participants = listOf(ourIdentity) + sharedParties)
 
             // 2. Build the transaction
             val notary = serviceHub.networkMapCache.notaryIdentities.first()
             val command = Command(InteropAssetTypeStateContract.Commands.Issue(), ourIdentity.owningKey)
             val txBuilder = TransactionBuilder(notary)
                     .addOutputState(outputState, InteropAssetTypeStateContract.ID)
                     .addCommand(command)
 
             // 3. Verify and collect signatures on the transaction
             txBuilder.verify(serviceHub)
             val partSignedTx = serviceHub.signInitialTransaction(txBuilder)
             var sessions = listOf<FlowSession>()
             for (otherParty in sharedParties) {
                 val otherSession = initiateFlow(otherParty)
                 sessions += otherSession
             }
             val fullySignedTx = subFlow(CollectSignaturesFlow(partSignedTx, sessions))
             val storedState = subFlow(FinalityFlow(fullySignedTx, sessions)).tx.outputStates.first() as InteropAssetTypeState
 
             // 4. Return the linearId of the state
             println("Successfully stored asset type $storedState in the vault.\n")
             Right(storedState.linearId)
         }, {
             println("Interop asset type ${assetTypeState.assetType.name} already exists.")
             Left(Error("Corda Network Error: Interop asset type ${assetTypeState.assetType.name} already exists."))
         })
     } catch (e: Exception) {
         println("Error storing state in the ledger: ${e.message}\n")
         Left(Error("Failed to store state in ledger: ${e.message}"))
     }
 }

 @InitiatedBy(CreateInteropAssetTypeState::class)
 class CreateInteropAssetTypeStateResponder(val session: FlowSession) : FlowLogic<SignedTransaction>() {
     @Suspendable
     override fun call(): SignedTransaction {
         val signTransactionFlow = object : SignTransactionFlow(session) {
             override fun checkTransaction(stx: SignedTransaction) = requireThat {
             }
         }
         try {
             val txId = subFlow(signTransactionFlow).id
             println("${ourIdentity} signed transaction.")
             return subFlow(ReceiveFinalityFlow(session, expectedTxId = txId))
         } catch (e: Exception) {
             val errorMsg = "Error during transaction by ${ourIdentity}: ${e.message}\n"
             println(errorMsg)
             throw Error(errorMsg)
         }
     }
 }
 
 /**
  * The UpdateInteropAssetTypeState flow is used to update an existing [InteropAssetTypeState] in the Corda ledger.
  *
  * @property InteropAssetType The [InteropAssetTypeState] provided by the Corda client to replace the
  * existing [InteropAssetTypeState] for that network.
  */

  /* 
 @InitiatingFlow
 @StartableByRPC
 class UpdateInteropAssetTypeState(val InteropAssetType: InteropAssetTypeState) : FlowLogic<Either<Error, UniqueIdentifier>>() {
     @Suspendable
     override fun call(): Either<Error, UniqueIdentifier> = try {
         println("InteropAssetType to be updated in the vault: $InteropAssetType")
 
         // 1. Find the InteropAssetType that needs to be updated
         val states = serviceHub.vaultService.queryBy<InteropAssetTypeState>().states
         val inputState = states.find { it.state.data.securityDomain == InteropAssetType.securityDomain }
         if (inputState == null) {
             println("InteropAssetType for securityDomain ${InteropAssetType.securityDomain} does not exist.\n")
             Left(Error("Corda Network Error: InteropAssetType for securityDomain ${InteropAssetType.securityDomain} does not exist"))
         }
         println("Current version of InteropAssetType is $inputState")
 
         // 2. Create the output state from a copy of the input state with the provided identifiers
         // Note that the null status of the inputState has been checked above.
         val outputState = inputState!!.state.data.copy(
                 members = InteropAssetType.members
         )
 
         println("Updating state to $outputState\n")
 
         // 3. Build the transaction
         val notary = serviceHub.networkMapCache.notaryIdentities.first()
         val command = Command(InteropAssetTypeStateContract.Commands.Update(), listOf(ourIdentity.owningKey))
         val txBuilder = TransactionBuilder(notary)
                 .addInputState(inputState)
                 .addOutputState(outputState, InteropAssetTypeStateContract.ID)
                 .addCommand(command)
 
         // 3. Verify and collect signatures on the transaction
         txBuilder.verify(serviceHub)
         val partSignedTx = serviceHub.signInitialTransaction(txBuilder)
         
         var sessions = listOf<FlowSession>()
         for (otherParty in outputState.participants) {
             if (otherParty != ourIdentity) {
                 val otherSession = initiateFlow(otherParty)
                 sessions += otherSession
             }
         }
         val fullySignedTx = subFlow(CollectSignaturesFlow(partSignedTx, sessions))
         
         val finalTx = subFlow(FinalityFlow(fullySignedTx, sessions))
         println("Successfully updated InteropAssetType in the ledger: $finalTx\n")
 
         // 4. Return the linearId of the state
         Right(inputState.state.data.linearId)
     } catch (e: Exception) {
         println("Error updating InteropAssetType: ${e.message}\n")
         Left(Error("Failed to store state in ledger: ${e.message}"))
     }
 }
 @InitiatedBy(UpdateInteropAssetTypeState::class)
 class UpdateInteropAssetTypeStateResponder(val session: FlowSession) : FlowLogic<SignedTransaction>() {
     @Suspendable
     override fun call(): SignedTransaction {
         val signTransactionFlow = object : SignTransactionFlow(session) {
             override fun checkTransaction(stx: SignedTransaction) = requireThat {
             }
         }
         try {
             val txId = subFlow(signTransactionFlow).id
             println("${ourIdentity} signed transaction.")
             return subFlow(ReceiveFinalityFlow(session, expectedTxId = txId))
         } catch (e: Exception) {
             val errorMsg = "Error during transaction by ${ourIdentity}: ${e.message}\n"
             println(errorMsg)
             throw Error(errorMsg)
         }
     }
 }
*/

 /**
  * The DeleteInteropAssetTypeState flow is used to delete an existing [InteropAssetTypeState] in the Corda ledger.
  *
  * @property securityDomain The identifier for the network for which the [InteropAssetTypeState] is to be deleted.
  */
 @InitiatingFlow
 @StartableByRPC
 class DeleteInteropAssetTypeState(val name: String) : FlowLogic<Either<Error, UniqueIdentifier>>() {
 
     /**
      * The call() method captures the logic to build and sign a transaction that deletes a [InteropAssetTypeState].
      *
      * @return returns the linearId of the deleted state.
      */
     @Suspendable
     override fun call(): Either<Error, UniqueIdentifier> = try {
         println("InteropAssetType for securityDomain $name to be deleted from the ledger.")
 
         val notary = serviceHub.networkMapCache.notaryIdentities[0]
 
         // 1. Find the InteropAssetType that needs to be deleted
         val states = serviceHub.vaultService.queryBy<InteropAssetTypeState>().states
         val inputState = states.find { it.state.data.assetType.name == name }
         if (inputState == null) {
             println("InteropAssetType for securityDomain $name does not exist.\n")
             Left(Error("Corda Network Error: InteropAssetType for securityDomain $name does not exist"))
         }
 
         // 2. Build the transaction
         val participants = inputState!!.state.data.participants.map { it.owningKey }
         val txCommand = Command(InteropAssetTypeStateContract.Commands.Delete(), participants)
         val txBuilder = TransactionBuilder(notary)
                 .addInputState(inputState)
                 .addCommand(txCommand)
 
         // 3. Verify and collect signatures on the transaction
         txBuilder.verify(serviceHub)
         val partSignedTx = serviceHub.signInitialTransaction(txBuilder)
         
         var sessions = listOf<FlowSession>()
         for (otherParty in inputState.state.data.participants) {
             if (otherParty != ourIdentity) {
                 val otherSession = initiateFlow(otherParty)
                 sessions += otherSession
             }
         }
         val fullySignedTx = subFlow(CollectSignaturesFlow(partSignedTx, sessions))
         
         subFlow(FinalityFlow(fullySignedTx, sessions))
 
         // 4. Return the linearId of the state
         println("Successfully deleted InteropAssetType from the ledger.\n")
         Right(inputState.state.data.linearId)
     } catch (e: Exception) {
         println("Failed to delete InteropAssetType from the ledger: ${e.message}.\n")
         Left(Error("Corda Network Error: Error deleting InteropAssetType for $name: ${e.message}"))
     }
 }
 @InitiatedBy(DeleteInteropAssetTypeState::class)
 class DeleteInteropAssetTypeStateResponder(val session: FlowSession) : FlowLogic<SignedTransaction>() {
     @Suspendable
     override fun call(): SignedTransaction {
         val signTransactionFlow = object : SignTransactionFlow(session) {
             override fun checkTransaction(stx: SignedTransaction) = requireThat {
             }
         }
         try {
             val txId = subFlow(signTransactionFlow).id
             println("${ourIdentity} signed transaction.")
             return subFlow(ReceiveFinalityFlow(session, expectedTxId = txId))
         } catch (e: Exception) {
             val errorMsg = "Error during transaction by ${ourIdentity}: ${e.message}\n"
             println(errorMsg)
             throw Error(errorMsg)
         }
     }
 }
 
 /**
  * The GetInteropAssetTypeStateByName flow gets the [InteropAssetTypeState] for the provided id.
  *
  * @property name The id for the [InteropAssetTypeState] to be retrieved.
  */
 @StartableByRPC
 class GetInteropAssetTypeStateByName(val name: String)
     : FlowLogic<Either<Error, StateAndRef<InteropAssetTypeState>>>() {
 
     @Suspendable
     override fun call(): Either<Error, StateAndRef<InteropAssetTypeState>> = try {
         println("Getting interop asset type state by name $name.")
 
         val states = serviceHub.vaultService.queryBy<InteropAssetTypeState>().states
                 .filter { it.state.data.assetType.name == name }
         println("interop asset type states: $states\n")
         if (states.isEmpty()) {
             println("Interop asset type $name not found\n")
             Left(Error("Error: Interop asset type $name not found"))
         } else {
             Right(states.first())
         }
     } catch (e: Exception) {
         println("Error getting InteropAssetType: ${e.message}\n")
         Left(Error("Error getting InteropAssetType: ${e.message}"))
     }
 }
 
 /**
  * The GetInteropAssetTypeStates flow gets all the [InteropAssetTypeStates]s in the ledger.
  */
 @StartableByRPC
 class GetInteropAssetTypeStates() : FlowLogic<List<StateAndRef<InteropAssetTypeState>>>() {
 
     @Suspendable
     override fun call(): List<StateAndRef<InteropAssetTypeState>> {
         println("Getting all InteropAssetTypes.")
 
         val states = serviceHub.vaultService.queryBy<InteropAssetTypeState>().states
 
         println("Found InteropAssetTypes: $states\n")
         return states
     }
 }
 
