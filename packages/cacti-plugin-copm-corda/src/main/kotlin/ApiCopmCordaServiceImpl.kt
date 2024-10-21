package com.copmCorda

import arrow.core.Either
import com.copmCorda.interop.InteropConfig
import com.copmCorda.interop.RemoteTransaction
import com.copmCorda.corda.CordaConfiguration
import com.copmCorda.corda.LocalTransaction
import com.copmCorda.server.validators.validateAccount
import com.copmCorda.server.validators.validateAsset
import com.copmCorda.server.validators.validateHash
import com.copmCorda.server.validators.validateViewRequest
import com.copmCorda.validators.ValidatedLockAssetV1Request
import io.grpc.Status
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import net.corda.core.CordaRuntimeException
import net.corda.core.identity.CordaX500Name
import net.corda.core.messaging.startFlow
import net.corda.core.utilities.loggerFor
import com.cordaSimpleApplication.contract.AssetContract
import com.cordaSimpleApplication.flow.IssueAssetState
import com.cordaSimpleApplication.state.AssetState

import net.devh.boot.grpc.server.advice.GrpcAdvice
import net.devh.boot.grpc.server.advice.GrpcExceptionHandler
import net.devh.boot.grpc.server.service.GrpcService
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.ClaimPledgedAssetV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.GetVerifiedViewV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.LockAssetV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.PledgeAssetV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceGrpcKt
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceOuterClass
import org.hyperledger.cacti.weaver.imodule.corda.flows.ClaimAsset
import org.hyperledger.cacti.weaver.imodule.corda.flows.LockAsset
import org.hyperledger.cacti.weaver.imodule.corda.flows.LockFungibleAsset
import org.hyperledger.cacti.weaver.protos.common.asset_locks.AssetLocks
import org.hyperledger.cacti.weaver.sdk.corda.AssetManager
import org.hyperledger.cacti.weaver.sdk.corda.AssetTransferSDK
import org.hyperledger.cacti.weaver.sdk.corda.InteroperableHelper
import org.springframework.beans.factory.annotation.Autowired
import kotlin.reflect.full.companionObject


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
        val asset = validateAsset(request.assetLockClaimV1PB.asset, "asset")
        val assetCommands = cordaConfig.assetInfo(asset)
        val contractId = request.assetLockClaimV1PB.lockId
        val recipient = validateAccount(request.assetLockClaimV1PB.destination, "destination")

        val hash = validateHash(request.assetLockClaimV1PB.hashInfo, "hashInfo")
        logger.info("done input validation contract id $contractId")
        try {

            val rpc = cordaConfig.getRPC(recipient)
            logger.info("start flow")
            val res = withContext(Dispatchers.IO) {
                rpc.proxy.startFlow(
                    ::ClaimAsset,
                    contractId,
                    AssetManager.createAssetClaimInfo(hash),
                    assetCommands.assetIssue,
                    assetCommands.updateAssetOwnerRef,
                    cordaConfig.getIssuer(recipient).toCordaParam(rpc),
                    cordaConfig.getObservers(recipient)
                ).returnValue.get()
            }
            val finalResult = res.fold(
                { "Error: ${it.message}" },
                { "$it" }
            )
            if (res.isRight()) {
                return ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB.newBuilder()
                    .setClaimId(finalResult)
                    .build()
            }
            throw IllegalStateException(finalResult)
        } catch (e: CordaRuntimeException) {
            throw IllegalStateException(e.message)
        }
    }

    override suspend fun claimPledgedAssetV1(request: DefaultServiceOuterClass.ClaimPledgedAssetV1Request): ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB {
        logger.info("start claimPledgedAssetV1")
        val asset = validateAsset(request.assetPledgeClaimV1PB.asset,"asset")
        val assetCommands = this.cordaConfig.assetInfo(asset)
        val destinationAccount = validateAccount(request.assetPledgeClaimV1PB.destination, "destination")
        val sourceAccount = validateAccount(request.assetPledgeClaimV1PB.source,"source")
        val pledgeId = request.assetPledgeClaimV1PB.pledgeId
        val rpc = this.cordaConfig.getRPC(destinationAccount)
        val sourceCert = request.assetPledgeClaimV1PB.sourceCertificate
        val destCert = request.assetPledgeClaimV1PB.destCertificate ?: ""
        val thisParty = rpc.proxy.wellKnownPartyFromX500Name(CordaX500Name.parse(destinationAccount.accountId))!!

        val remoteTransaction = RemoteTransaction(destinationAccount, this.interopConfig, this.cordaConfig)
        val getPledgeCmd = this.interopConfig.getRemoteNetworkConfig(request.assetPledgeClaimV1PB.source.network).getPledgeInfoCmd(request)
        val pledgeStatusLinearId: String = remoteTransaction.invoke(sourceAccount.organization, getPledgeCmd)

        val res = if (asset.isNFT) AssetTransferSDK.claimPledgedFungibleAsset(
                rpc.proxy,
                pledgeId!!,
                pledgeStatusLinearId,
                asset.assetType,          // Type
                asset.assetQuantity, // Quantity
                sourceCert,
                destCert,
                assetCommands.getStateAndContractId,
                assetCommands.assetIssue,
                thisParty,
                this.cordaConfig.getObservers(destinationAccount)
            ) else AssetTransferSDK.claimPledgedAsset(
                rpc.proxy,
                pledgeId!!,
                pledgeStatusLinearId,
                asset.assetType, // Type
                asset.assetId, // Id
                sourceCert,
                destCert,
                assetCommands.getStateAndContractId,
                assetCommands.assetIssue,
                thisParty,
                this.cordaConfig.getObservers(destinationAccount)
        )
        println("Pledged asset claim response: $res")
        when (res) {
            is Either.Left -> {
                println("Corda Network Error: Error running ClaimPledgeAsset flow: ${res.a.message}\n")
                throw IllegalStateException("Corda Network Error: Error running ClaimPledgeAsset flow: ${res.a.message}\n")
            }

            is Either.Right -> {
                println("AssetPledgeState created with pledge-id '${res.b}'")
                return ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB.newBuilder().setClaimId(res.b.toString())
                    .build()
            }
        }
    }

    @Override
    override suspend fun getVerifiedViewV1(request: DefaultServiceOuterClass.GetVerifiedViewV1Request): GetVerifiedViewV1200ResponsePb.GetVerifiedViewV1200ResponsePB {
        val account = validateAccount(request.getVerifiedViewV1RequestPB.account, "account")
        val rpc = this.cordaConfig.getRPC(account)
        val cmd = validateViewRequest(request.getVerifiedViewV1RequestPB.view?.viewAddress, "view.viewAddress")
        val remoteNetwork = if( request.getVerifiedViewV1RequestPB.view?.network != null) request.getVerifiedViewV1RequestPB.view.network else ""

        val remoteNetConfig = this.interopConfig.getRemoteNetworkConfig(remoteNetwork)
        val relayClient = this.interopConfig.getRelayClient(account.organization)
        val address = remoteNetConfig.getViewAddress(cmd)
        when (val res = InteroperableHelper.getRemoteView(rpc.proxy,account.organization, address, relayClient )) {
            is Either.Left -> {
                println("get view error: ${res.a.message}\n")
                throw IllegalStateException("Corda Network Error: Error running ClaimPledgeAsset flow: ${res.a.message}\n")
            }

            is Either.Right -> {
                println("get view returned successfully")
                return GetVerifiedViewV1200ResponsePb.GetVerifiedViewV1200ResponsePB.newBuilder()
                    .setData(res.b.toString())
                    .build()
            }
        }
    }

    @Override
    override suspend fun lockAssetV1(request: DefaultServiceOuterClass.LockAssetV1Request): LockAssetV1200ResponsePb.LockAssetV1200ResponsePB
    {
        logger.info("start lockAssetV1")
        val data = ValidatedLockAssetV1Request(request)
        val assetInfo = this.cordaConfig.assetInfo(data.asset)
        val lockInfo = AssetManager.createAssetLockInfo(data.hash,data.expiryTimeFmt, data.expiryTime)
        val flow = if (data.asset.isNFT) "LockAsset" else "LockFungibleAsset"
        val agreement = if (data.asset.isNFT) AssetManager.createAssetExchangeAgreement(data.asset.assetType,data.asset.assetId, data.destCert,"")
        else AssetManager.createFungibleAssetExchangeAgreement(data.asset.assetType,data.asset.assetQuantity,data.destCert, "")
        try {
            if( ! data.asset.isNFT ) {
                val rpc = this.cordaConfig.getRPC(data.owner)
                logger.info("issuing tokens")
                rpc.proxy.startFlow(::IssueAssetState, data.asset.assetQuantity, data.asset.assetType)
                .returnValue.get().tx.outputStates.first() as AssetState
            }
            val transaction = LocalTransaction(data.owner, this.cordaConfig)
            val result = transaction.invoke( DLTransactionParams(
                    assetInfo.copmContract,
                    flow,
                    listOf(lockInfo,
                        agreement,
                        assetInfo.getStateAndRef,
                        assetInfo.assetBurn,
                        this.cordaConfig.getIssuer(data.owner),
                        this.cordaConfig.getObservers(data.owner))
                    ))
            return LockAssetV1200ResponsePb.LockAssetV1200ResponsePB
                .newBuilder()
                .setLockId(result.toString())
                .build()

            /*
            val issuer = this.cordaConfig.getIssuer(data.owner).toCordaParam(rpc)
            val result = if( data.asset.isNFT ) AssetManager.createHTLC(
                rpc.proxy,
                data.asset.assetType,
                data.asset.assetId,
                data.destCert,
                data.hash,
                data.expiryTime,
                data.expiryTimeFmt,
                assetInfo.getStateAndRef,
                assetInfo.assetBurn,
                issuer,
                observers
            ) else AssetManager.createFungibleHTLC(
                rpc.proxy,
                data.asset.assetType,
                data.asset.assetQuantity,
                data.destCert,
                data.hash,
                data.expiryTime,
                data.expiryTimeFmt,
                assetInfo.getStateAndRef,
                assetInfo.assetBurn,
                issuer,
                observers
            )
            when (result) {
                is Either.Left -> {
                    throw IllegalStateException("Corda Network Error: Error running LockAsset flow: ${result.a.message}\n")
                }
                is Either.Right -> {
                    return LockAssetV1200ResponsePb.LockAssetV1200ResponsePB
                        .newBuilder()
                        .setLockId(result.b.toString())
                        .build()
                }
            }

             */
        } catch (e: CordaRuntimeException) {
            logger.error(e.message)
            throw IllegalStateException(e.message)
        }
    }

    override suspend fun pledgeAssetV1(request: DefaultServiceOuterClass.PledgeAssetV1Request): PledgeAssetV1200ResponsePb.PledgeAssetV1200ResponsePB {
        // Obtain the recipient certificate from the name of the recipient
        val recipientCert: String = request.assetPledgeV1PB.destinationCertificate
        val asset = validateAsset(request.assetPledgeV1PB.asset, "asset")
        val assetCmds = this.cordaConfig.assetInfo(asset)
        val sourceAccount = validateAccount(request.assetPledgeV1PB.source, "source")
        val destinationAccount = validateAccount(request.assetPledgeV1PB.destination, "destination")
        val rpc = this.cordaConfig.getRPC(sourceAccount)
        val timeout = request.assetPledgeV1PB.expirySecs ?: 6400

        val result = if (asset.isNFT)
            AssetTransferSDK.createFungibleAssetPledge(
                rpc.proxy,
                sourceAccount.organization,
                destinationAccount.organization,
                asset.assetType,          // Type
                asset.assetQuantity, // Quantity
                recipientCert,
                timeout,
                assetCmds.getStateAndRef,
                assetCmds.assetBurn,
                this.cordaConfig.getIssuer(sourceAccount).toCordaParam(rpc),
                this.cordaConfig.getObservers(sourceAccount)
            )
        else AssetTransferSDK.createAssetPledge(
            rpc.proxy,
            sourceAccount.organization,
            destinationAccount.organization,
            asset.assetType,      // Type
            asset.assetId,      // ID
            recipientCert,
            timeout,
            assetCmds.getStateAndRef,
            assetCmds.assetBurn,
            this.cordaConfig.getIssuer(sourceAccount).toCordaParam(rpc),
            this.cordaConfig.getObservers(sourceAccount)
        )
        when (result) {
            is Either.Left -> {
                throw IllegalStateException("Corda Network Error: Error running PledgeAsset flow: ${result.a.message}\n")
            }

            is Either.Right -> {
                return PledgeAssetV1200ResponsePb.PledgeAssetV1200ResponsePB
                    .newBuilder()
                    .setPledgeId(result.b)
                    .build()
            }
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
