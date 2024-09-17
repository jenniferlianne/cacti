package org.hyperledger.cacti.plugin.copm.endpoints

import org.hyperledger.cacti.plugin.copm.ApiCopmCordaServiceImpl.Companion.logger
import org.hyperledger.cacti.plugin.copm.DLTransactionContextFactory
import org.hyperledger.cacti.plugin.copm.corda.CordaAssetClaim
import org.hyperledger.cacti.plugin.copm.interfaces.CordaConfiguration
import org.hyperledger.cacti.plugin.copm.interfaces.InteropConfig
import org.hyperledger.cacti.plugin.copm.types.DLTransactionParams
import org.hyperledger.cacti.plugin.copm.validators.ValidatedClaimPledgedAssetV1Request
import net.corda.core.CordaRuntimeException
import net.corda.core.contracts.UniqueIdentifier
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.ClaimPledgedAssetV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceOuterClass

suspend fun claimPledgedAssetV1Impl(request: DefaultServiceOuterClass.ClaimPledgedAssetV1Request,
                                    contextFactory: DLTransactionContextFactory,
                                    cordaConfig: CordaConfiguration,
                                    interopConfig: InteropConfig
): ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB {
    logger.info("start claimPledgedAssetV1")
    try{
        val data = ValidatedClaimPledgedAssetV1Request(request)
        val assetContract = cordaConfig.assetContract(data.asset)
        val remoteContext = contextFactory.getRemoteTransactionContext(data.destinationAccount, data.sourceAccount.organization)
        val remoteCmd = interopConfig.getRemoteCopmContract(data.sourceAccount.organization, data.asset).getPledgeInfoCmd(data)
        logger.info("getting remote pledge id")
        @Suppress("Unchecked_cast")
        val pledgeStatusLinearId = (remoteContext.invoke(remoteCmd) as Array<UniqueIdentifier>)[0].toString()
        logger.info("claiming pledge $pledgeStatusLinearId")
        val params = CordaAssetClaim(
            data, // @property pledgeId
            pledgeStatusLinearId, // @property pledgeStatusLinearId
            assetContract.assetIssue, // @property createAssetStateCommand
            assetContract.getStateAndContractId, // @property getAssetAndContractIdFlowName
            cordaConfig.getIssuer(data.destinationAccount), // @property issuer
            cordaConfig.getObservers(data.destinationAccount) // @property observers
        )
        val transaction = contextFactory.getLocalTransactionContext(data.destinationAccount)
        val res = transaction.invoke(
            DLTransactionParams(
                cordaConfig.copmContract,
                "AssetTransferClaim",
                listOf(params)
            )
        )
        logger.info("done claiming pledge ${res.toString()}")
        return ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB.newBuilder().setClaimId(res.toString())
            .build()
    } catch (e: CordaRuntimeException) {
        throw IllegalStateException(e.message)
    }
}
