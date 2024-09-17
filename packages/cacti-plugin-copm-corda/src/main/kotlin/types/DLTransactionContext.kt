package com.copmCorda.types

interface DLTransactionContext {
    suspend fun invoke(cmd: DLTransactionParams) : Any?
}