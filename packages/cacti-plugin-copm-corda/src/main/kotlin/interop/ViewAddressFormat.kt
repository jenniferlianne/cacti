package com.copmCorda.interop

import com.copmCorda.DLTransactionParams

interface ViewAddressFormat {
    fun forNetwork() : String
    fun address(remoteNetworkConfig: RemoteNetworkConfig, cmd: DLTransactionParams) : String
}