import { DLTransactionParams } from "./types";
export interface DLTransactionContext {
  invoke(transactionParams: DLTransactionParams): Promise<string>;
}
