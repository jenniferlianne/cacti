import {
  DLTransactionContextFactory,
  DLRemoteTransactionContext,
  DLTransactionContext,
} from "../interfaces";
import { DLTransactionParams, DLAccount } from "./types";

export type InteropStep = {
  orgKey: string;
  params: DLTransactionParams;
};

export class InteropFlow {
  private localOrgKey: string;
  private contextFactory: DLTransactionContextFactory;

  constructor(
    localOrgKey: string,
    contextFactory: DLTransactionContextFactory,
  ) {
    this.contextFactory = contextFactory;
    this.localOrgKey = localOrgKey;
  }

  public async invoke(account: DLAccount, steps: InteropStep[]) {
    let lastResult;
    for (const step of steps) {
      if (lastResult) {
        const replaceIndices = step.params.args.findIndex(
          (element) => element == "",
        );
        step.params.args[replaceIndices] = lastResult;
      }
      const context = this.getContext(account, step.orgKey);
      lastResult = (await context).invoke(step.params);
    }
    return lastResult;
  }

  private getContext(
    account: DLAccount,
    orgKey: string,
  ): Promise<DLRemoteTransactionContext | DLTransactionContext> {
    if (orgKey == this.localOrgKey) {
      return this.contextFactory.getTransactionContext(account);
    } else {
      return this.contextFactory.getRemoteTransactionContext(account, orgKey);
    }
  }
}
