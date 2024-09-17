package com.copmCorda

import com.copmCorda.corda.CordaConfiguration
import com.copmCorda.corda.LocalTransactionContext
import com.copmCorda.interop.InteropConfig
import com.copmCorda.types.DLAccount
import com.copmCorda.types.DLTransactionContext
import com.copmCorda.interop.RemoteTransactionContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class DLTransactionContextFactory {

    lateinit var cordaConfig: CordaConfiguration
    lateinit var interopConfig: InteropConfig


    @Autowired
    fun setupCordaConfig(config: CordaConfiguration) {
        this.cordaConfig = config
    }

    @Autowired
    fun setupInteropConfig(config: InteropConfig) {
        this.interopConfig = config
    }

    fun getLocalTransactionContext(account: DLAccount) : DLTransactionContext {
        return LocalTransactionContext(account, this.cordaConfig);
    }

    fun getRemoteTransactionContext(account: DLAccount, remoteNetwork: String): DLTransactionContext {
        return RemoteTransactionContext(account, remoteNetwork, this.interopConfig, this.cordaConfig);
    }
}