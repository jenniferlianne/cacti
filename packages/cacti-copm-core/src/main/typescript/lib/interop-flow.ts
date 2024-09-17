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

export type InteropStepResult = {
  orgKey: string;
  cmd: DLTransactionParams;
  context: TransactionContext;
  result: any;
};

type TransactionContext = DLRemoteTransactionContext | DLTransactionContext;

export class InteropFlow {
  localAccount: DLAccount;
  contextFactory: DLTransactionContextFactory;

  constructor(
    localAccount: DLAccount,
    contextFactory: DLTransactionContextFactory,
  ) {
    this.contextFactory = contextFactory;
    this.localAccount = localAccount;
  }
  /*
  public async invoke(steps: InteropStep[]) {
    const stepResults: InteropStepResult[] = [];
    steps.forEach(async (step, index) => {
      const context = await this.getContext(step.orgKey);
      const args = this.getFlowParams(index, steps, stepResults);
      const cmd : DLTransactionParams = {
        contract: step.params.contract,
        method: step.params.method,
        args: args,
      } 
      const result = await context.invoke(cmd);
      stepResults.push(
      {
          orgKey: step.orgKey,
          cmd: cmd,
          context: context,
          result: result,
        }),
    });
  }

  private getFlowParams(
    current_step: number,
    steps: InteropStep[],
    results: InteropStepResult[],
  ): any[] {
    const params: any[] = [];
    for (const param of steps[current_step].params.args) {
      if (param instanceof FlowParam) {
        params.concat(param.toFlowParam(results));
      } else {
        params.push(param);
      }
    }
    return params;
  }

  public async getContext(orgKey: string): Promise<TransactionContext> {
    if (orgKey == this.localAccount.organization) {
      return this.contextFactory.getTransactionContext(this.localAccount);
    } else {
      return this.contextFactory.getRemoteTransactionContext(
        this.localAccount,
        orgKey,
      );
    }
  }
    */
}

export abstract class FlowParam {
  abstract toFlowParam(results: InteropStepResult[]): Promise<any[]>;
}

export class StepResultParam implements FlowParam {
  from_step: number;

  constructor(from_step: number) {
    this.from_step = from_step;
  }

  async toFlowParam(results: InteropStepResult[]): Promise<any[]> {
    return [results[this.from_step].result];
  }
}

// this is specifically for WriteExternalState
export class AllFlowContext implements FlowParam {
  from_step: number;

  constructor(from_step: number) {
    this.from_step = from_step;
  }

  async toFlowParam(results: InteropStepResult[]): Promise<any[]> {
    const params: any[] = [];
    const result = results[this.from_step];
    /*
    for (const context_part of result.context.identify()) {
      params.push(context_part);
    }

      const ccArgs = [
    localChaincode,
    localChannel,
    localCCFunc,
    JSON.stringify(localCCArgs),
    JSON.stringify(interopArgIndices),
    JSON.stringify(viewAddresses),
    JSON.stringify(viewsSerializedBase64),
    JSON.stringify(viewContentsBase64),
  ];

    */
    params.push(result.cmd.contract);
    params.push(result.cmd.method);
    params.push(JSON.stringify(result.cmd.args));
    return params;
  }
}
