import {
  DefaultApi as CordaApi,
  FlowInvocationType,
  JvmObject,
  InvokeContractV1Request,
  createJvmString,
  createJvmLong,
} from "@hyperledger/cactus-plugin-ledger-connector-corda";
import { OK } from "http-errors-enhanced-cjs";
import {
  Interfaces,
  DLTransactionParams,
  DLAccount,
} from "@hyperledger-cacti/cacti-copm-core";
import { Logger } from "@hyperledger/cactus-common";

export class CordaTransactionContext
  implements Interfaces.DLTransactionContext
{
  private cordaAPI: CordaApi;
  private account: DLAccount;
  private log: Logger;

  constructor(cordaAPI: CordaApi, account: DLAccount, log: Logger) {
    this.cordaAPI = cordaAPI;
    this.account = account;
    this.log = log;
  }

  public async invoke(transactionParams: DLTransactionParams): Promise<string> {
    const req = {
      flowFullClassName:
        transactionParams.contract + "." + transactionParams.method,
      flowInvocationType: FlowInvocationType.TrackedFlowDynamic,
      timeoutMs: 60000,
      params: this.jvmParams(transactionParams.args),
    } as InvokeContractV1Request;
    this.log.debug(req);
    const contractInvocation = await this.cordaAPI.invokeContractV1(req);
    if (contractInvocation.status != OK) {
      throw Error(`corda invocation error ${contractInvocation.statusText}`);
    }
    this.log.debug(contractInvocation.data);
    return contractInvocation.data.callOutput.toString();
  }

  private jvmParams(params: any[]): JvmObject[] {
    const jvmParams: JvmObject[] = [];
    for (const param of params) {
      jvmParams.push(this.jvmParam(param));
    }
    return jvmParams;
  }

  private jvmParam(param: any): JvmObject {
    this.log.debug(`encoding ${param} type ${typeof param}`);
    switch (typeof param) {
      case "number": {
        return createJvmLong(param);
      }
      case "string": {
        return createJvmString({ data: param as string });
      }
      case "object": {
        if ("toJvmObject" in param) {
          return param.toJvmObject();
        } else if (Array.isArray(param)) {
          return this.listJVMObject();
        }
        throw Error("unknown object type");
      }
      default:
        throw Error("unknown type");
    }
  }

  private listJVMObject(): JvmObject {
    return {
      jvmTypeKind: "REFERENCE",
      jvmType: {
        fqClassName: "java.util.ArrayList<Party>",
      },
      jvmCtorArgs: [],
    };
  }
}
