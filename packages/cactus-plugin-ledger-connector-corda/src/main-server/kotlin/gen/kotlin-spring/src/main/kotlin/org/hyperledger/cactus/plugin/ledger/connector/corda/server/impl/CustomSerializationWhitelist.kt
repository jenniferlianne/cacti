/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
package org.hyperledger.cactus.plugin.ledger.connector.corda.server.impl

import arrow.core.Either
import net.corda.core.serialization.SerializationWhitelist
import net.corda.core.utilities.loggerFor

import org.hyperledger.cacti.weaver.imodule.corda.flows.customSerializers.AssetLockSerializer
import org.hyperledger.cacti.weaver.imodule.corda.flows.customSerializers.LockMechanismSerializer
import org.hyperledger.cacti.weaver.protos.common.asset_locks.AssetLocks

// TODO: Documentation
class CustomSerializationWhitelist : SerializationWhitelist {
  
        override val whitelist: List<Class<*>> = listOf(
            Either::class.java,
            Either.Right::class.java,
            Either.Left::class.java)



    //override val whitelist: List<Class<*>> =  listOf(AssetLockSerializer::class.java, LockMechanismSerializer::class.java)
    //override val whitelist: List<Class<*>> =  listOf(AssetLocks.AssetLock::class.java)

/*     companion object {
        val logger = loggerFor<CustomSerializationWhitelist>();
        fun logContent() {
            for (item in whitelist) {
                logger.info("WHITELISTED: ${item::class.java.name}")
            }

        }
    }
*/

}
