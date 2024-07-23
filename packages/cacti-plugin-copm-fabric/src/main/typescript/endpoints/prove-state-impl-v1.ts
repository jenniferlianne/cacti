import {
  ProvestateV1Request,
  Validators,
  Interfaces as CopmIF,
} from "@hyperledger/cacti-copm-core";
import { Logger } from "@hyperledger/cactus-common";

export async function proveStateV1Impl(
  req: ProvestateV1Request,
  contextFactory: CopmIF.DLTransactionContextFactory,
  log: Logger,
): Promise<boolean> {
  const data = Validators.validateProveStateRequest(req);
  const remoteContext = await contextFactory.getRemoteTransactionContext(
    data.account,
    data.remoteNetwork,
  );

  await remoteContext.invoke({
    contract: data.contractId,
    method: data.method,
    args: data.args,
  });

  log.debug("view complete");
  return true;
}
