package com.copmCorda.server.impl

// import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule

import com.copmCorda.JsonJvmObjectDeserializer
import com.copmCorda.NodeRPCConnection
import com.copmCorda.server.api.ApiCopmCordaService
import com.copmCorda.server.model.*
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.*
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.databind.ser.BeanSerializerModifier
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import net.corda.core.contracts.ContractState
import net.corda.core.flows.FlowLogic
import net.corda.core.messaging.CordaRPCOps
import net.corda.core.messaging.FlowProgressHandle
import net.corda.core.transactions.SignedTransaction
import net.corda.core.utilities.loggerFor
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.stereotype.Service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.util.HtmlUtils.htmlEscape
import java.io.IOException
import java.io.InputStream
import java.util.*
import java.util.concurrent.TimeUnit


// TODO Look into this project for powering the connector of ours:
// https://github.com/180Protocol/codaptor
@Service
class ApiCopmCordaServiceImpl (
) : ApiCopmCordaService {

    final lateinit var jsonJvmObjectDeserializer: JsonJvmObjectDeserializer

    final lateinit var rpc: NodeRPCConnection

    companion object {
        val logger = loggerFor<ApiCopmCordaServiceImpl>()

        // FIXME: do not recreate the mapper for every service implementation instance that we create...
        val mapper: ObjectMapper = jacksonObjectMapper()
            .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
            .disable(SerializationFeature.FAIL_ON_EMPTY_BEANS)
            // .registerModule(JavaTimeModule())

        val writer: ObjectWriter = mapper.writer()
    }

    @Autowired 
    fun SetupJsonJvm(serializer: JsonJvmObjectDeserializer) {
        this.jsonJvmObjectDeserializer = serializer
    }


    private fun dynamicInvoke(rpc: CordaRPCOps, req: InvokeContractV1Request): InvokeContractV1Response {
        val classFlowLogic = try {
            @Suppress("UNCHECKED_CAST")
            jsonJvmObjectDeserializer.getOrInferType(req.flowFullClassName) as Class<out FlowLogic<*>>
        } catch (ex: ClassNotFoundException) {
            val reason = "flowFullClassName ${req.flowFullClassName} could not be loaded. Are you sure you have installed the correct .jar file(s)?"
            logger.error(reason);
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, reason, ex)
        }
        val params = req.params.map { p -> jsonJvmObjectDeserializer.instantiate(p) }.toTypedArray()

       for (param in params) {
            logger.info("param type ${param!!::class.simpleName}");    // body of loop
        }
        
        logger.info("params={}", params)

        val flowHandle = when (req.flowInvocationType) {
            FlowInvocationType.TRACKED_FLOW_DYNAMIC -> rpc.startTrackedFlowDynamic(classFlowLogic, *params)
            FlowInvocationType.FLOW_DYNAMIC -> rpc.startFlowDynamic(classFlowLogic, *params)
        }

        val timeoutMs: Long = req.timeoutMs?.toLong() ?: 60000
        logger.debug("Invoking flow with timeout of $timeoutMs ms ...")
        val progress: List<String> = when (req.flowInvocationType) {
            FlowInvocationType.TRACKED_FLOW_DYNAMIC -> (flowHandle as FlowProgressHandle<*>)
                .progress
                .toList()
                .toBlocking()
                .first()
            FlowInvocationType.FLOW_DYNAMIC -> emptyList()
        }
        logger.debug("Starting to wait for flow completion now...")
        val returnValue = flowHandle.returnValue.get(timeoutMs, TimeUnit.MILLISECONDS)
        val id = flowHandle.id

        // allow returnValue to be something different to SignedTransaction
        var callOutput: kotlin.Any = ""
        var transactionId: kotlin.String? = null

        if (returnValue is SignedTransaction) {
            logger.trace("returnValue is SignedTransaction - using returnValue.id.toString() ...");
            transactionId = returnValue.id.toString();

            callOutput = mapOf(
                "tx" to mapOf(
                    "id" to returnValue.tx.id,
                    "notary" to returnValue.tx.notary,
                    "requiredSigningKeys" to returnValue.tx.requiredSigningKeys,
                    "merkleTree" to returnValue.tx.merkleTree,
                    "privacySalt" to returnValue.tx.privacySalt,
                    "attachments" to returnValue.tx.attachments,
                    "commands" to returnValue.tx.commands,
                    // "digestService" to returnValue.tx.digestService,
                    "inputs" to returnValue.tx.inputs,
                    "networkParametersHash" to returnValue.tx.networkParametersHash,
                    "references" to returnValue.tx.references,
                    "timeWindow" to returnValue.tx.timeWindow
                ),
                "id" to returnValue.id,
                "inputs" to returnValue.inputs,
                "networkParametersHash" to returnValue.networkParametersHash,
                "notary" to returnValue.notary,
                "references" to returnValue.references,
                "requiredSigningKeys" to returnValue.requiredSigningKeys,
                "sigs" to returnValue.sigs
            );

        } else if (returnValue != null) {
            callOutput = try {
                val returnValueJson = writer.writeValueAsString(returnValue);
                logger.trace("returnValue JSON serialized OK, using returnValue ...");
                returnValueJson;
            } catch (ex: Exception) {
                logger.trace("returnValue JSON serialized failed, using returnValue.toString() ...");
                returnValue.toString();
            }
        }

        logger.info("Progress(${progress.size})={}", progress)
        logger.info("ReturnValue={}", returnValue)
        logger.info("Id=$id")
        // FIXME: If the full return value (SignedTransaction instance) gets returned as "returnValue"
        // then Jackson crashes like this:
        // 2021-03-01 06:58:25.608 ERROR 7 --- [nio-8080-exec-7] o.a.c.c.C.[.[.[/].[dispatcherServlet]:
        // Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception
        // [Request processing failed; nested exception is org.springframework.http.converter.HttpMessageNotWritableException:
        // Could not write JSON: Failed to deserialize group OUTPUTS_GROUP at index 0 in transaction:
        // net.corda.samples.obligation.states.IOUState: Interface net.corda.core.contracts.LinearState
        // requires a field named participants but that isn't found in the schema or any superclass schemas;
        // nested exception is com.fasterxml.jackson.databind.JsonMappingException:
        // Failed to deserialize group OUTPUTS_GROUP at index 0 in transaction: net.corda.samples.obligation.states.IOUState:
        // Interface net.corda.core.contracts.LinearState requires a field named participants but that isn't found in
        // the schema or any superclass schemas (through reference chain:
        // org.hyperledger.cactus.plugin.ledger.connector.corda.server.model.InvokeContractV1Response["returnValue"]->
        // net.corda.client.jackson.internal.StxJson["wire"]->net.corda.client.jackson.internal.WireTransactionJson["outputs"])]
        // with root cause
        return InvokeContractV1Response(true, callOutput, id.toString(), transactionId, progress)
    }


    override fun invokeContractV1(invokeContractV1Request: InvokeContractV1Request): InvokeContractV1Response {
        return dynamicInvoke(rpc.proxy, invokeContractV1Request)
    }

}
