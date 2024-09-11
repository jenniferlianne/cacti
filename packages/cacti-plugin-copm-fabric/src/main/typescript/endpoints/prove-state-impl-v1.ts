import { ProvestateV1Request } from "@hyperledger/cacti-copm-core";
import { Logger } from "@hyperledger/cactus-common";
import { DLTransactionContextFactory } from "../lib/dl-context-factory";

export async function proveStateV1Impl(
  req: ProvestateV1Request,
  contextFactory: DLTransactionContextFactory,
  log: Logger,
): Promise<boolean> {
  const localOrg = req.stateProofV1PB?.account?.network
    ? req.stateProofV1PB.account.network
    : "";
  const user = req.stateProofV1PB?.account?.userId
    ? req.stateProofV1PB.account.userId
    : "";
  const remoteNetwork = req.stateProofV1PB?.view?.network
    ? req.stateProofV1PB.view.network
    : "";
  const contractId = req.stateProofV1PB?.view?.viewAddress?.contractId
    ? req.stateProofV1PB.view.viewAddress.contractId
    : "";
  const func = req.stateProofV1PB?.view?.viewAddress?.function
    ? req.stateProofV1PB.view.viewAddress.function
    : "";
  const args = req.stateProofV1PB?.view?.viewAddress?.input
    ? req.stateProofV1PB.view.viewAddress.input
    : [];

  const remoteContext = await contextFactory.getRemoteTransactionContext(
    { organization: localOrg, userId: user },
    remoteNetwork,
  );

  log.debug("getting view");
  await remoteContext.invoke({
    contract: contractId,
    method: func,
    args: args,
  });
  log.debug("done getting view");

  return true;
}
