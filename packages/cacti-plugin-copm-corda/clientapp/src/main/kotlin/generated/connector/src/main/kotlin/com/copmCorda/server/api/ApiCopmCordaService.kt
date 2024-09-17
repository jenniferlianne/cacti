package com.copmCorda.server.api

import com.copmCorda.server.model.InvokeContractV1Request
import com.copmCorda.server.model.InvokeContractV1Response

interface ApiCopmCordaService {

    /**
     * POST /api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-corda/invoke-contract : Invokes a contract on a Corda ledger (e.g. a flow)
     *
     * @param invokeContractV1Request  (required)
     * @return OK (status code 200)
     * @see ApiCopmCorda#invokeContractV1
     */
    fun invokeContractV1(invokeContractV1Request: InvokeContractV1Request): InvokeContractV1Response
}
