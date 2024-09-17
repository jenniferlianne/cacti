package org.hyperledger.cactus.plugin.ledger.connector.corda.server.impl

import jakarta.annotation.PostConstruct
import jakarta.annotation.PreDestroy
import kotlinx.coroutines.*
import net.corda.client.rpc.CordaRPCClient
import net.corda.client.rpc.CordaRPCConnection
import net.corda.client.rpc.GracefulReconnect
import net.corda.core.messaging.CordaRPCOps
import net.corda.core.messaging.pendingFlowsCount
import net.corda.core.utilities.NetworkHostAndPort
import net.corda.core.serialization.SerializationCustomSerializer
import net.corda.core.utilities.loggerFor
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.AnnotationConfigApplicationContext
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component
import java.util.concurrent.CountDownLatch
import kotlin.time.DurationUnit
import kotlin.time.toDuration
import org.hyperledger.cactus.plugin.ledger.connector.corda.server.impl.CustomSerializationWhitelist
import org.hyperledger.cacti.weaver.imodule.corda.flows.customSerializers.AssetLockSerializer
import org.hyperledger.cacti.weaver.imodule.corda.flows.customSerializers.LockMechanismSerializer
import arrow.core.Either

private const val CACTUS_CORDA_RPC_USERNAME = "cactus.corda.rpc.username"
private const val CACTUS_CORDA_RPC_PASSWORD = "cactus.corda.rpc.password"
private const val CACTUS_CORDA_NODE_HOST = "cactus.corda.node.host"
private const val CACTUS_CORDA_RPC_PORT = "cactus.corda.rpc.port"

/**
 * Wraps an RPC connection to a Corda node.
 *
 * The RPC connection is configured using command line arguments.
 *
 * @param host The host of the node we are connecting to.
 * @param rpcPort The RPC port of the node we are connecting to.
 * @param username The username for logging into the RPC client.
 * @param password The password for logging into the RPC client.
 * @property proxy The RPC proxy.
 */
@Component
open class NodeRPCConnection(
    @Value("\${$CACTUS_CORDA_NODE_HOST}") private val host: String,
    @Value("\${$CACTUS_CORDA_RPC_USERNAME}") private val username: String,
    @Value("\${$CACTUS_CORDA_RPC_PASSWORD}") private val password: String,
    @Value("\${$CACTUS_CORDA_RPC_PORT}") private val rpcPort: Int
    ): AutoCloseable {

    var serializedWhitelistClasses: MutableList<String> = mutableListOf()

    final lateinit var rpcConnection: CordaRPCConnection
        private set
    final lateinit var proxy: CordaRPCOps
        private set
    final lateinit var jvmSerializer: JsonJvmObjectDeserializer

    companion object {
        val logger = loggerFor<NodeRPCConnection>();
    }

    @Autowired 
    fun JsonJvm(serializer: JsonJvmObjectDeserializer) {
        this.jvmSerializer = serializer
    }


    @PostConstruct
    fun initialiseNodeRPCConnection() {
        this.loadRpc();
    }

    fun addSerializer(serializer: String) {
        this.serializedWhitelistClasses.add(serializer);
        logger.info("ADDED ${serializer} ${this.serializedWhitelistClasses.size}")
    }

    fun loadRpc() {
        val rpcAddress = NetworkHostAndPort(host, rpcPort)

        /*  
        val customSerializers : MutableSet<SerializationCustomSerializer<*, *>> = mutableSetOf(
            AssetLockSerializer::class.java as SerializationCustomSerializer<*, *>,
            LockMechanismSerializer::class.java as SerializationCustomSerializer<*, *>

        )
        
        logger.info("ADDING ${this.serializedWhitelistClasses.size} classes to whitelist")

        for( className in this.serializedWhitelistClasses) {
            val clazz = this.jvmSerializer.getOrInferType(className);
            val toProxyMeth = clazz.methods.filter { c -> c.name == "toProxy" }.first()
            if( toProxyMeth != null) {
                logger.info("First toProxy param is ${toProxyMeth.parameterTypes.first()::class.java.name}")
            } else {
                logger.error("class does not have toProxy method")
            }
            val inst = clazz.kotlin.constructors.find { it.parameters.isEmpty() }?.call()
            if( inst is SerializationCustomSerializer<*, *>) {
                whitelistClasses.add(inst);
                logger.info("ADDED ${this.serializedWhitelistClasses.size} classes to whitelist")
            } else {
                logger.error("${className} not a serializer")
            }
        }

        logger.info("starting rpc whitelist size ${whitelistClasses.size}")
        */
        val rpcClient = CordaRPCClient(haAddressPool = listOf(rpcAddress))

        var numReconnects = 0
        val gracefulReconnect = GracefulReconnect(
            onDisconnect={ logger.info("GracefulReconnect:onDisconnect()")},
            onReconnect={ logger.info("GracefulReconnect:onReconnect() #${++numReconnects}")},
            maxAttempts = 30
        )

        // this workaround here is due to the Graceful Reconnect above not actually doing what it's supposed to
        // either because it has a bug or because I misread the documentation.
        // So this manual retry on top of the graceful reconnects is to make it resilient
        var tryIntervalSec = 2
        var numberOfTriesRemaining = 5
        while (numberOfTriesRemaining > 0) {
            numberOfTriesRemaining--
            try {
                logger.info("Trying to connect to RPC numberOfTriesRemaining=$numberOfTriesRemaining")
                rpcConnection = rpcClient.start(username, password, gracefulReconnect = gracefulReconnect)
                runBlocking {
                    val tryIntervalDuration = tryIntervalSec.toDuration(DurationUnit.SECONDS)
                    delay(tryIntervalDuration)
                    tryIntervalSec *= 2
                }
                break;
            } catch (ex: net.corda.client.rpc.RPCException) {
                logger.info("ManualReconnect:numberOfTriesRemaining=$numberOfTriesRemaining")
                if (numberOfTriesRemaining <= 0) {
                    throw ex
                }
            }
        }

        proxy = rpcConnection.proxy
    }

    @PreDestroy
    override fun close() {
        rpcConnection.notifyServerAndClose()
    }

    fun gracefulShutdown() {
        logger.debug(("Beginning graceful shutdown..."))
        val latch = CountDownLatch(1)
        @Suppress("DEPRECATION")
        val subscription = proxy.pendingFlowsCount().updates
            .doAfterTerminate(latch::countDown)
            .subscribe(
                // For each update.
                { (completed, total) -> logger.info("...remaining flows: $completed / $total") },
                // On error.
                {
                    logger.error(it.message)
                    throw it
                },
                // When completed.
                {
                    // This will only show up in the standalone Shell, because the embedded one
                    // is killed as part of a node's shutdown.
                    logger.info("...done shutting down gracefully.")
                }
            )
        proxy.terminate(true)
        latch.await()
        logger.debug("Concluded graceful shutdown OK")
        // Unsubscribe or we hold up the shutdown
        subscription.unsubscribe()
        rpcConnection.forceClose()
    }
}