package com.copmCorda.interop

class RemoteNetworkConfig(val networkId: String,
                          val networkType: String,
                          val relayEndpoint: String,
                          val channelName: String, // fabric-specific
                          val partyEndpoints: List<String> // corda-specific
    )
{
}

