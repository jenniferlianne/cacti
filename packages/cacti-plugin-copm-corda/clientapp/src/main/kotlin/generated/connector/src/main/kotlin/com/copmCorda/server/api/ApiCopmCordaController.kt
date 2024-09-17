package com.copmCorda.server.api

import com.copmCorda.server.model.InvokeContractV1Request
import com.copmCorda.server.model.InvokeContractV1Response
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity

import org.springframework.web.bind.annotation.*
import org.springframework.validation.annotation.Validated
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.beans.factory.annotation.Autowired

import jakarta.validation.Valid
import jakarta.validation.constraints.DecimalMax
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

import kotlin.collections.List
import kotlin.collections.Map

@RestController
@Validated
@RequestMapping("\${api.base-path:}")
open class ApiCopmCordaController(@Autowired(required = true) val service: ApiCopmCordaService) {


    @RequestMapping(
        method = [RequestMethod.POST],
        value = ["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-corda/invoke-contract"],
        produces = ["application/json"],
        consumes = ["application/json"]
    )
    open fun invokeContractV1( @Valid @RequestBody invokeContractV1Request: InvokeContractV1Request): ResponseEntity<InvokeContractV1Response> {
        return ResponseEntity(service.invokeContractV1(invokeContractV1Request), HttpStatus.valueOf(200))
    }
}
