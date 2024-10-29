package com.copmCorda.interop

import com.copmCorda.types.DLTransactionParams

interface ViewAddressFormat {
    fun forNetwork() : String
    fun address(cmd: DLTransactionParams) : String
}