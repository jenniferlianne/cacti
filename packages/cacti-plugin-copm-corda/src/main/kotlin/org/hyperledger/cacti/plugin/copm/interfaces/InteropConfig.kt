package org.hyperledger.cacti.plugin.copm.interfaces
import org.hyperledger.cacti.plugin.copm.interop.RelayConfig
import org.hyperledger.cacti.plugin.copm.interop.RemoteCopmContract
import org.hyperledger.cacti.plugin.copm.interop.RemoteNetworkConfig
import org.hyperledger.cacti.plugin.copm.interop.ViewAddressFormat
import org.hyperledger.cacti.plugin.copm.types.DLAsset

interface InteropConfig {
    fun getRelayConfig(localNetwork: String): RelayConfig;
    fun getViewAddressFormat(remoteNetwork: String) : ViewAddressFormat;
    fun getRemoteCopmContract(remoteNetwork: String, asset: DLAsset) : RemoteCopmContract;
    fun getRemoteNetworkConfig(remoteNetwork: String): RemoteNetworkConfig;
}
