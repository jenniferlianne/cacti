package com.copmCorda

import com.copmCorda.interop.InteropConfig
import com.copmCorda.interop.RemoteTransaction
import com.copmCorda.corda.CordaConfiguration
import com.copmCorda.corda.LocalTransaction
import com.copmCorda.validators.*
import io.grpc.Status
import net.corda.core.CordaRuntimeException
import net.corda.core.messaging.startFlow
import net.corda.core.utilities.loggerFor
import com.cordaSimpleApplication.flow.IssueAssetState
import com.cordaSimpleApplication.flow.IssueBondAssetState
import com.cordaSimpleApplication.state.AssetState
import net.corda.core.contracts.UniqueIdentifier
import net.devh.boot.grpc.server.advice.GrpcAdvice
import net.devh.boot.grpc.server.advice.GrpcExceptionHandler
import net.devh.boot.grpc.server.service.GrpcService
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.ClaimPledgedAssetV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.GetVerifiedViewV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.LockAssetV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.PledgeAssetV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceGrpcKt
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceOuterClass
import org.hyperledger.cacti.weaver.imodule.corda.states.AssetPledgeParameters
import org.hyperledger.cacti.weaver.imodule.corda.states.AssetClaimParameters
import org.hyperledger.cacti.weaver.sdk.corda.AssetManager
import org.springframework.beans.factory.annotation.Autowired


@GrpcService
class ApiCopmCordaServiceImpl : DefaultServiceGrpcKt.DefaultServiceCoroutineImplBase() {

    lateinit var cordaConfig: CordaConfiguration
    lateinit var interopConfig: InteropConfig

    companion object {
        val logger = loggerFor<ApiCopmCordaServiceImpl>()
    }
    @Autowired 
    fun setupCordaConfig(config: CordaConfiguration) {
        this.cordaConfig = config
    }

    @Autowired
    fun setupInteropConfig(config: InteropConfig) {
        this.interopConfig = config
    }

    @Override
    override suspend fun claimLockedAssetV1(request: DefaultServiceOuterClass.ClaimLockedAssetV1Request): ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB {
        logger.info("start claimLockedAssetV1")
        val data = ValidatedClaimLockedAssetV1Request(request)
        val assetContract = cordaConfig.assetContract(data.asset)
        val localTransaction = LocalTransaction(data.recipient, this.cordaConfig)
        try {
            val result = localTransaction.invoke(
                DLTransactionParams(
                this.cordaConfig.copmContract,
                "ClaimAsset",
                listOf(data.contractId,
                AssetManager.createAssetClaimInfo(data.hash),
                    assetContract.assetIssue,
                    assetContract.updateAssetOwnerRef,
                this.cordaConfig.getIssuer(data.recipient),
                this.cordaConfig.getObservers(data.recipient))
            ))
            return ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB.newBuilder()
                    .setClaimId(result)
                    .build()
        } catch (e: CordaRuntimeException) {
            throw IllegalStateException(e.message)
        }
    }

    override suspend fun claimPledgedAssetV1(request: DefaultServiceOuterClass.ClaimPledgedAssetV1Request): ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB {
        logger.info("start claimPledgedAssetV1")
        try{
            val data = ValidatedClaimPledgedAssetV1Request(request)
            val assetContract = this.cordaConfig.assetContract(data.asset)
            val rpc = this.cordaConfig.getRPC(data.destinationAccount)
            val remoteTransaction = RemoteTransaction(data.destinationAccount, this.interopConfig, this.cordaConfig)
            val remoteContract = this.interopConfig.getRemoteCopmContract(data.sourceAccount.organization, data.asset)
            val remoteCmd = remoteContract.getPledgeInfoCmd(data)
            logger.info("getting remote pledge id")
            val pledgeStatusLinearId = (remoteTransaction.invoke(data.sourceAccount.organization, remoteCmd) as Array<UniqueIdentifier>)[0].toString()
            logger.info("claiming pledge $pledgeStatusLinearId")
            val params = AssetClaimParameters(
                data.pledgeId, // @property pledgeId
                assetContract.assetIssue, // @property createAssetStateCommand
                pledgeStatusLinearId, // @property pledgeStatusLinearId
                assetContract.getStateAndContractId, // @property getAssetAndContractIdFlowName
                data.asset.assetType, // @property assetType
                data.asset.assetIdOrQuantity(), // @property assetIdOrQuantity
                data.sourceCert, // @property pledgerCert
                data.destCert, // @property recipientCert
                this.cordaConfig.getIssuer(data.destinationAccount).toCordaParam(rpc), // @property issuer
                this.cordaConfig.getObservers(data.destinationAccount) // @property observers
            )
            val transaction = LocalTransaction(data.destinationAccount, this.cordaConfig)
            val res = transaction.invoke( DLTransactionParams(
                this.cordaConfig.copmContract,
                "AssetTransferClaim",
                listOf(params)
            ))
            logger.info("done claiming pledge ${res.toString()}")
            return ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB.newBuilder().setClaimId(res.toString())
                        .build()
        } catch (e: CordaRuntimeException) {
            throw IllegalStateException(e.message)
        }
    }

    @Override
    override suspend fun getVerifiedViewV1(request: DefaultServiceOuterClass.GetVerifiedViewV1Request): GetVerifiedViewV1200ResponsePb.GetVerifiedViewV1200ResponsePB {
        logger.info("start verified view")
        val data = ValidatedGetVerifiedViewV1Request(request)
        val remoteTransaction = RemoteTransaction(data.account, this.interopConfig, this.cordaConfig)
        val res = remoteTransaction.invoke(data.remoteNetwork, data.cmd)
        return GetVerifiedViewV1200ResponsePb.GetVerifiedViewV1200ResponsePB.newBuilder()
        .setData(res.toString())
        .build()
    }

    @Override
    override suspend fun lockAssetV1(request: DefaultServiceOuterClass.LockAssetV1Request): LockAssetV1200ResponsePb.LockAssetV1200ResponsePB
    {
        logger.info("start lockAssetV1")
        val data = ValidatedLockAssetV1Request(request)
        val contract = this.cordaConfig.assetContract(data.asset)
        val lockInfo = AssetManager.createAssetLockInfo(data.hash,data.expiryTimeFmt, data.expiryTime)
        val flow = if (data.asset.isNFT) "LockAsset" else "LockFungibleAsset"
        val agreement = if (data.asset.isNFT) AssetManager.createAssetExchangeAgreement(data.asset.assetType,data.asset.assetId, data.destCert,"")
        else AssetManager.createFungibleAssetExchangeAgreement(data.asset.assetType,data.asset.assetQuantity,data.destCert, "")
        try {
            this.makeTestAsset(data.owner, data.asset)
            val transaction = LocalTransaction(data.owner, this.cordaConfig)
            val result = transaction.invoke( DLTransactionParams(
                    this.cordaConfig.copmContract,
                    flow,
                    listOf(lockInfo,
                        agreement,
                        contract.getStateAndRef,
                        contract.assetBurn,
                        this.cordaConfig.getIssuer(data.owner),
                        this.cordaConfig.getObservers(data.owner))
                    ))
            return LockAssetV1200ResponsePb.LockAssetV1200ResponsePB
                .newBuilder()
                .setLockId(result.toString())
                .build()
        } catch (e: CordaRuntimeException) {
            logger.error(e.message)
            throw IllegalStateException(e.message)
        }
    }

    override suspend fun pledgeAssetV1(request: DefaultServiceOuterClass.PledgeAssetV1Request): PledgeAssetV1200ResponsePb.PledgeAssetV1200ResponsePB {
        // Obtain the recipient certificate from the name of the recipient
        logger.info("starting pledge asset")
        val data = ValidatedPledgeAssetV1Request(request)
        val assetContract = this.cordaConfig.assetContract(data.asset)

        this.makeTestAsset(data.sourceAccount, data.asset)

        val transaction = LocalTransaction(data.sourceAccount, this.cordaConfig)
        logger.info("starting transaction")
        val params = AssetPledgeParameters(
            data.asset.assetType, // @property assetType
            data.asset.assetIdOrQuantity(),
            data.sourceAccount.organization, // @property localNetworkId
            data.destinationAccount.organization, // @property remoteNetworkId
            data.destinationCertificate, // @property recipientCert
            data.timeout, // @property expiryTimeSecs
            assetContract.getStateAndRef,
            assetContract.assetBurn,
            this.cordaConfig.getIssuer(data.sourceAccount).toCordaParam(cordaConfig.getRPC(data.sourceAccount)),
            this.cordaConfig.getObservers(data.sourceAccount)
        )
        val result = transaction.invoke(DLTransactionParams(this.cordaConfig.copmContract,
                "AssetTransferPledge",
                listOf( params )))
        return PledgeAssetV1200ResponsePb.PledgeAssetV1200ResponsePB
                    .newBuilder()
                    .setPledgeId(result)
                    .build()

    }

    private fun makeTestAsset(account: DLAccount, asset: DLAsset) {
        val rpc = this.cordaConfig.getRPC(account)
        if( ! asset.isNFT ) {
            logger.info("issuing tokens")
            rpc.proxy.startFlow(::IssueAssetState, asset.assetQuantity, asset.assetType)
            .returnValue.get().tx.outputStates.first() as AssetState
        } else {
            logger.info("issuing bond")
            rpc.proxy.startFlow(::IssueBondAssetState, asset.assetId, asset.assetType)
                .returnValue.get().tx.outputStates.first()
        }
    }

}


@GrpcAdvice
class GlobalExceptionHandler {
    companion object {
        val logger = loggerFor<GlobalExceptionHandler>()
    }

    @GrpcExceptionHandler(IllegalArgumentException::class)
    fun handleMyCustomException(e: IllegalArgumentException): Status {
        logger.error(e.message)
        return Status.INVALID_ARGUMENT.withDescription(e.message)
    }

    @GrpcExceptionHandler(IllegalStateException::class)
    fun handleMyCustomException(e: IllegalStateException): Status {
        logger.error(e.message)
        return Status.INTERNAL.withDescription(e.message)
    }

    @GrpcExceptionHandler(CordaRuntimeException::class)
    fun handleMyCustomException(e: CordaRuntimeException): Status {
        logger.error(e.message)
        return Status.INTERNAL.withDescription(e.message)
    }
}
