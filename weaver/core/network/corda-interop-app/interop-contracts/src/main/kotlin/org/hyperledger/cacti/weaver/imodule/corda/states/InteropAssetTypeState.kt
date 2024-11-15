/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

 package org.hyperledger.cacti.weaver.imodule.corda.states

 import org.hyperledger.cacti.weaver.imodule.corda.contracts.InteropAssetTypeStateContract
 import net.corda.core.contracts.BelongsToContract
 import net.corda.core.contracts.LinearState
 import net.corda.core.contracts.UniqueIdentifier
 import net.corda.core.identity.Party
 import net.corda.core.serialization.CordaSerializable
 import net.corda.core.contracts.CommandData

/**
  *
  * @property securityDomain The identifier for the foreign network.
  * @property identifiers The identifiers for a particular view, e.g. a view address. Can be an empty list.
  * @property linearId The unique identifier for the state.
  * @property participants The list of parties that are participants of the state.
  */
 @BelongsToContract(InteropAssetTypeStateContract::class)
 data class InteropAssetTypeState(
         val assetType: InteropAssetType,
         override val linearId: UniqueIdentifier = UniqueIdentifier(),
         override val participants: List<Party> = listOf()
 ) : LinearState
 
 @CordaSerializable
 data class InteropAssetType(
         val name: String,
         val getAssetStateAndRef: String,
         val getAssetStateAndContractId: String,
         val updateAssetOwnerFromPointer: String,
         val issueAssetCommand: CommandData,
         val deleteAssetCommand: CommandData,
         val getAssetIssuer: String,
 )
 