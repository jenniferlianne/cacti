package com.copmCorda.server.model

import java.util.Objects
import com.fasterxml.jackson.annotation.JsonValue
import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.DecimalMax
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import jakarta.validation.Valid

/**
* Determines which flow starting method will be used on the back-end when invoking the flow. Based on the value here the plugin back-end might invoke the rpc.startFlowDynamic() method or the rpc.startTrackedFlowDynamic() method. Streamed responses are aggregated and returned in a single response to HTTP callers who are not equipped to handle streams like WebSocket/gRPC/etc. do.
* Values: TRACKED_FLOW_DYNAMIC,FLOW_DYNAMIC
*/
enum class FlowInvocationType(@get:JsonValue val value: kotlin.String) {

    TRACKED_FLOW_DYNAMIC("TRACKED_FLOW_DYNAMIC"),
    FLOW_DYNAMIC("FLOW_DYNAMIC");

    companion object {
        @JvmStatic
        @JsonCreator
        fun forValue(value: kotlin.String): FlowInvocationType {
                return values().first{it -> it.value == value}
        }
    }
}

