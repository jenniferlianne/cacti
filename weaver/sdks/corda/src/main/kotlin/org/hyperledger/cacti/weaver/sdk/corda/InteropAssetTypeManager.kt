/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

 package org.hyperledger.cacti.weaver.sdk.corda;

 import arrow.core.Either
 import arrow.core.Left
 import arrow.core.Right
 import arrow.core.flatMap
 import kotlinx.coroutines.runBlocking
 import java.lang.Exception
 import org.slf4j.LoggerFactory
 
 import net.corda.core.messaging.startFlow
 import net.corda.core.messaging.CordaRPCOps
 import net.corda.core.contracts.UniqueIdentifier
 import net.corda.core.identity.Party
 
 import org.hyperledger.cacti.weaver.imodule.corda.states.InteropAssetTypeState
 import org.hyperledger.cacti.weaver.imodule.corda.states.Member
 import org.hyperledger.cacti.weaver.imodule.corda.flows.*
 
 
 class InteropAssetTypeManager {
     companion object {
         private val logger = LoggerFactory.getLogger(MembershipManager::class.java)

         /**
          * Function to create an membership state in Vault
          */
         @JvmStatic
         @JvmOverloads
         fun createAssetTypeState(
             proxy: CordaRPCOps,
             assetTypeState: InteropAssetTypeState,
             sharedParties: List<Party> = listOf<Party>()
         ): Either<Error, String> {
             return try {
                 runCatching {
                     proxy.startFlow(::CreateInteropAssetTypeState, assetTypeState, sharedParties)
                         .returnValue.get()
                 }.fold({
                     it.flatMap {
                         Right(it.toString())
                     }
                 }, {
                     Left(Error("Error running CreateMembership flow: ${it.message}"))
                     })
             } catch (e: Exception) {
                 Left(Error("${e.message}"))
             }
         }
     }
 }
 