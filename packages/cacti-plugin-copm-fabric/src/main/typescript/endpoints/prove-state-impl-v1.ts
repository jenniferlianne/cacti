import { ProvestateV1Request } from "../generated/services/default_service_pb.js";
import { Logger } from "@hyperledger/cactus-common";
import { DLTransactionContextFactory } from "../lib/dl-context-factory";

export async function proveStateV1Impl(
  req: ProvestateV1Request,
  contextFactory: DLTransactionContextFactory,
  log: Logger,
): Promise<boolean> {
  const localOrg = req.stateProofV1PB?.user?.network
    ? req.stateProofV1PB.user.network
    : "unknown-network";
  const user = req.stateProofV1PB?.user?.userId
    ? req.stateProofV1PB.user.userId
    : "unknown-user";
  const remoteNetwork = req.stateProofV1PB?.viewAddress?.network
    ? req.stateProofV1PB.viewAddress.network
    : "unknown-network";
  const contractId = req.stateProofV1PB?.viewAddress?.view?.contractId
    ? req.stateProofV1PB.viewAddress.view.contractId
    : "unknown-contract-id";
  const func = req.stateProofV1PB?.viewAddress?.view?.function
    ? req.stateProofV1PB.viewAddress.view.function
    : "unknown-function";
  const args = req.stateProofV1PB?.viewAddress?.view?.input
    ? req.stateProofV1PB.viewAddress.view.input
    : "";

  const remoteContext = await contextFactory.getRemoteTransactionContext(
    localOrg,
    user,
    remoteNetwork,
  );

  log.debug("getting view");
  await remoteContext.invoke({
    contract: contractId,
    method: func,
    args: args.split(";"),
  });
  log.debug("verifying view");
  await remoteContext.verify();

  return true;
}
