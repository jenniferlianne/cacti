import { DLAccount } from "../lib/types";
import { ConnectError, Code } from "@connectrpc/connect";
import { validateAssetAccount } from "./common";
import { ProvestateV1Request } from "../generated/services/default_service_pb";

export function validateProveStateRequest(req: ProvestateV1Request): {
  account: DLAccount;
  method: string;
  contractId: string;
  args: string[];
  remoteNetwork: string;
} {
  if (!req.stateProofV1PB) {
    throw new ConnectError("request data required", Code.InvalidArgument);
  }
  if (!req.stateProofV1PB.view) {
    throw new ConnectError("view required", Code.InvalidArgument);
  }
  if (!req.stateProofV1PB.view.network) {
    throw new ConnectError("view.network required", Code.InvalidArgument);
  }
  if (!req.stateProofV1PB.view.viewAddress) {
    throw new ConnectError("view.viewAddress required", Code.InvalidArgument);
  }
  if (!req.stateProofV1PB.view.viewAddress.contractId) {
    throw new ConnectError(
      "view.viewAddress.contractId required",
      Code.InvalidArgument,
    );
  }
  if (!req.stateProofV1PB.view.viewAddress.function) {
    throw new ConnectError(
      "view.viewAddress.function required",
      Code.InvalidArgument,
    );
  }

  const args = req.stateProofV1PB?.view?.viewAddress?.input
    ? req.stateProofV1PB.view.viewAddress.input
    : [];

  return {
    account: validateAssetAccount(req.stateProofV1PB.account, "account"),
    remoteNetwork: req.stateProofV1PB.view.network,
    contractId: req.stateProofV1PB.view.viewAddress.contractId,
    method: req.stateProofV1PB.view.viewAddress.function,
    args: args,
  };
}
