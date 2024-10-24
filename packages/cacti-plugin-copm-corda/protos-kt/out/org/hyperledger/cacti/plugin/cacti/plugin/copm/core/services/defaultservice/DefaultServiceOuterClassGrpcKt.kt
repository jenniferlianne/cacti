package org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice

import io.grpc.CallOptions
import io.grpc.CallOptions.DEFAULT
import io.grpc.Channel
import io.grpc.Metadata
import io.grpc.MethodDescriptor
import io.grpc.ServerServiceDefinition
import io.grpc.ServerServiceDefinition.builder
import io.grpc.ServiceDescriptor
import io.grpc.Status.UNIMPLEMENTED
import io.grpc.StatusException
import io.grpc.kotlin.AbstractCoroutineServerImpl
import io.grpc.kotlin.AbstractCoroutineStub
import io.grpc.kotlin.ClientCalls.unaryRpc
import io.grpc.kotlin.ServerCalls.unaryServerMethodDefinition
import io.grpc.kotlin.StubFor
import kotlin.String
import kotlin.coroutines.CoroutineContext
import kotlin.coroutines.EmptyCoroutineContext
import kotlin.jvm.JvmOverloads
import kotlin.jvm.JvmStatic
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.ClaimPledgedAssetV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.GetVerifiedViewV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.LockAssetV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.PledgeAssetV1200ResponsePb
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceGrpc.getServiceDescriptor

/**
 * Holder for Kotlin coroutine-based client and server APIs for
 * org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultService.
 */
public object DefaultServiceGrpcKt {
  public const val SERVICE_NAME: String = DefaultServiceGrpc.SERVICE_NAME

  @JvmStatic
  public val serviceDescriptor: ServiceDescriptor
    get() = getServiceDescriptor()

  public val claimLockedAssetV1Method:
      MethodDescriptor<DefaultServiceOuterClass.ClaimLockedAssetV1Request, ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB>
    @JvmStatic
    get() = DefaultServiceGrpc.getClaimLockedAssetV1Method()

  public val claimPledgedAssetV1Method:
      MethodDescriptor<DefaultServiceOuterClass.ClaimPledgedAssetV1Request, ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB>
    @JvmStatic
    get() = DefaultServiceGrpc.getClaimPledgedAssetV1Method()

  public val getVerifiedViewV1Method:
      MethodDescriptor<DefaultServiceOuterClass.GetVerifiedViewV1Request, GetVerifiedViewV1200ResponsePb.GetVerifiedViewV1200ResponsePB>
    @JvmStatic
    get() = DefaultServiceGrpc.getGetVerifiedViewV1Method()

  public val lockAssetV1Method:
      MethodDescriptor<DefaultServiceOuterClass.LockAssetV1Request, LockAssetV1200ResponsePb.LockAssetV1200ResponsePB>
    @JvmStatic
    get() = DefaultServiceGrpc.getLockAssetV1Method()

  public val pledgeAssetV1Method:
      MethodDescriptor<DefaultServiceOuterClass.PledgeAssetV1Request, PledgeAssetV1200ResponsePb.PledgeAssetV1200ResponsePB>
    @JvmStatic
    get() = DefaultServiceGrpc.getPledgeAssetV1Method()

  /**
   * A stub for issuing RPCs to a(n)
   * org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultService service
   * as suspending coroutines.
   */
  @StubFor(DefaultServiceGrpc::class)
  public class DefaultServiceCoroutineStub @JvmOverloads constructor(
    channel: Channel,
    callOptions: CallOptions = DEFAULT,
  ) : AbstractCoroutineStub<DefaultServiceCoroutineStub>(channel, callOptions) {
    override fun build(channel: Channel, callOptions: CallOptions): DefaultServiceCoroutineStub =
        DefaultServiceCoroutineStub(channel, callOptions)

    /**
     * Executes this RPC and returns the response message, suspending until the RPC completes
     * with [`Status.OK`][io.grpc.Status].  If the RPC completes with another status, a
     * corresponding
     * [StatusException] is thrown.  If this coroutine is cancelled, the RPC is also cancelled
     * with the corresponding exception as a cause.
     *
     * @param request The request message to send to the server.
     *
     * @param headers Metadata to attach to the request.  Most users will not need this.
     *
     * @return The single response from the server.
     */
    public suspend
        fun claimLockedAssetV1(request: DefaultServiceOuterClass.ClaimLockedAssetV1Request,
        headers: Metadata = Metadata()):
        ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB = unaryRpc(
      channel,
      DefaultServiceGrpc.getClaimLockedAssetV1Method(),
      request,
      callOptions,
      headers
    )

    /**
     * Executes this RPC and returns the response message, suspending until the RPC completes
     * with [`Status.OK`][io.grpc.Status].  If the RPC completes with another status, a
     * corresponding
     * [StatusException] is thrown.  If this coroutine is cancelled, the RPC is also cancelled
     * with the corresponding exception as a cause.
     *
     * @param request The request message to send to the server.
     *
     * @param headers Metadata to attach to the request.  Most users will not need this.
     *
     * @return The single response from the server.
     */
    public suspend
        fun claimPledgedAssetV1(request: DefaultServiceOuterClass.ClaimPledgedAssetV1Request,
        headers: Metadata = Metadata()):
        ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB = unaryRpc(
      channel,
      DefaultServiceGrpc.getClaimPledgedAssetV1Method(),
      request,
      callOptions,
      headers
    )

    /**
     * Executes this RPC and returns the response message, suspending until the RPC completes
     * with [`Status.OK`][io.grpc.Status].  If the RPC completes with another status, a
     * corresponding
     * [StatusException] is thrown.  If this coroutine is cancelled, the RPC is also cancelled
     * with the corresponding exception as a cause.
     *
     * @param request The request message to send to the server.
     *
     * @param headers Metadata to attach to the request.  Most users will not need this.
     *
     * @return The single response from the server.
     */
    public suspend fun getVerifiedViewV1(request: DefaultServiceOuterClass.GetVerifiedViewV1Request,
        headers: Metadata = Metadata()):
        GetVerifiedViewV1200ResponsePb.GetVerifiedViewV1200ResponsePB = unaryRpc(
      channel,
      DefaultServiceGrpc.getGetVerifiedViewV1Method(),
      request,
      callOptions,
      headers
    )

    /**
     * Executes this RPC and returns the response message, suspending until the RPC completes
     * with [`Status.OK`][io.grpc.Status].  If the RPC completes with another status, a
     * corresponding
     * [StatusException] is thrown.  If this coroutine is cancelled, the RPC is also cancelled
     * with the corresponding exception as a cause.
     *
     * @param request The request message to send to the server.
     *
     * @param headers Metadata to attach to the request.  Most users will not need this.
     *
     * @return The single response from the server.
     */
    public suspend fun lockAssetV1(request: DefaultServiceOuterClass.LockAssetV1Request,
        headers: Metadata = Metadata()): LockAssetV1200ResponsePb.LockAssetV1200ResponsePB =
        unaryRpc(
      channel,
      DefaultServiceGrpc.getLockAssetV1Method(),
      request,
      callOptions,
      headers
    )

    /**
     * Executes this RPC and returns the response message, suspending until the RPC completes
     * with [`Status.OK`][io.grpc.Status].  If the RPC completes with another status, a
     * corresponding
     * [StatusException] is thrown.  If this coroutine is cancelled, the RPC is also cancelled
     * with the corresponding exception as a cause.
     *
     * @param request The request message to send to the server.
     *
     * @param headers Metadata to attach to the request.  Most users will not need this.
     *
     * @return The single response from the server.
     */
    public suspend fun pledgeAssetV1(request: DefaultServiceOuterClass.PledgeAssetV1Request,
        headers: Metadata = Metadata()): PledgeAssetV1200ResponsePb.PledgeAssetV1200ResponsePB =
        unaryRpc(
      channel,
      DefaultServiceGrpc.getPledgeAssetV1Method(),
      request,
      callOptions,
      headers
    )
  }

  /**
   * Skeletal implementation of the
   * org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultService service
   * based on Kotlin coroutines.
   */
  public abstract class DefaultServiceCoroutineImplBase(
    coroutineContext: CoroutineContext = EmptyCoroutineContext,
  ) : AbstractCoroutineServerImpl(coroutineContext) {
    /**
     * Returns the response to an RPC for
     * org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultService.ClaimLockedAssetV1.
     *
     * If this method fails with a [StatusException], the RPC will fail with the corresponding
     * [io.grpc.Status].  If this method fails with a [java.util.concurrent.CancellationException],
     * the RPC will fail
     * with status `Status.CANCELLED`.  If this method fails for any other reason, the RPC will
     * fail with `Status.UNKNOWN` with the exception as a cause.
     *
     * @param request The request from the client.
     */
    public open suspend
        fun claimLockedAssetV1(request: DefaultServiceOuterClass.ClaimLockedAssetV1Request):
        ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB = throw
        StatusException(UNIMPLEMENTED.withDescription("Method org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultService.ClaimLockedAssetV1 is unimplemented"))

    /**
     * Returns the response to an RPC for
     * org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultService.ClaimPledgedAssetV1.
     *
     * If this method fails with a [StatusException], the RPC will fail with the corresponding
     * [io.grpc.Status].  If this method fails with a [java.util.concurrent.CancellationException],
     * the RPC will fail
     * with status `Status.CANCELLED`.  If this method fails for any other reason, the RPC will
     * fail with `Status.UNKNOWN` with the exception as a cause.
     *
     * @param request The request from the client.
     */
    public open suspend
        fun claimPledgedAssetV1(request: DefaultServiceOuterClass.ClaimPledgedAssetV1Request):
        ClaimPledgedAssetV1200ResponsePb.ClaimPledgedAssetV1200ResponsePB = throw
        StatusException(UNIMPLEMENTED.withDescription("Method org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultService.ClaimPledgedAssetV1 is unimplemented"))

    /**
     * Returns the response to an RPC for
     * org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultService.GetVerifiedViewV1.
     *
     * If this method fails with a [StatusException], the RPC will fail with the corresponding
     * [io.grpc.Status].  If this method fails with a [java.util.concurrent.CancellationException],
     * the RPC will fail
     * with status `Status.CANCELLED`.  If this method fails for any other reason, the RPC will
     * fail with `Status.UNKNOWN` with the exception as a cause.
     *
     * @param request The request from the client.
     */
    public open suspend
        fun getVerifiedViewV1(request: DefaultServiceOuterClass.GetVerifiedViewV1Request):
        GetVerifiedViewV1200ResponsePb.GetVerifiedViewV1200ResponsePB = throw
        StatusException(UNIMPLEMENTED.withDescription("Method org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultService.GetVerifiedViewV1 is unimplemented"))

    /**
     * Returns the response to an RPC for
     * org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultService.LockAssetV1.
     *
     * If this method fails with a [StatusException], the RPC will fail with the corresponding
     * [io.grpc.Status].  If this method fails with a [java.util.concurrent.CancellationException],
     * the RPC will fail
     * with status `Status.CANCELLED`.  If this method fails for any other reason, the RPC will
     * fail with `Status.UNKNOWN` with the exception as a cause.
     *
     * @param request The request from the client.
     */
    public open suspend fun lockAssetV1(request: DefaultServiceOuterClass.LockAssetV1Request):
        LockAssetV1200ResponsePb.LockAssetV1200ResponsePB = throw
        StatusException(UNIMPLEMENTED.withDescription("Method org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultService.LockAssetV1 is unimplemented"))

    /**
     * Returns the response to an RPC for
     * org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultService.PledgeAssetV1.
     *
     * If this method fails with a [StatusException], the RPC will fail with the corresponding
     * [io.grpc.Status].  If this method fails with a [java.util.concurrent.CancellationException],
     * the RPC will fail
     * with status `Status.CANCELLED`.  If this method fails for any other reason, the RPC will
     * fail with `Status.UNKNOWN` with the exception as a cause.
     *
     * @param request The request from the client.
     */
    public open suspend fun pledgeAssetV1(request: DefaultServiceOuterClass.PledgeAssetV1Request):
        PledgeAssetV1200ResponsePb.PledgeAssetV1200ResponsePB = throw
        StatusException(UNIMPLEMENTED.withDescription("Method org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultService.PledgeAssetV1 is unimplemented"))

    final override fun bindService(): ServerServiceDefinition = builder(getServiceDescriptor())
      .addMethod(unaryServerMethodDefinition(
      context = this.context,
      descriptor = DefaultServiceGrpc.getClaimLockedAssetV1Method(),
      implementation = ::claimLockedAssetV1
    ))
      .addMethod(unaryServerMethodDefinition(
      context = this.context,
      descriptor = DefaultServiceGrpc.getClaimPledgedAssetV1Method(),
      implementation = ::claimPledgedAssetV1
    ))
      .addMethod(unaryServerMethodDefinition(
      context = this.context,
      descriptor = DefaultServiceGrpc.getGetVerifiedViewV1Method(),
      implementation = ::getVerifiedViewV1
    ))
      .addMethod(unaryServerMethodDefinition(
      context = this.context,
      descriptor = DefaultServiceGrpc.getLockAssetV1Method(),
      implementation = ::lockAssetV1
    ))
      .addMethod(unaryServerMethodDefinition(
      context = this.context,
      descriptor = DefaultServiceGrpc.getPledgeAssetV1Method(),
      implementation = ::pledgeAssetV1
    )).build()
  }
}
