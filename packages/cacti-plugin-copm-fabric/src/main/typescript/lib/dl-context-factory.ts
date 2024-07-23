import { DLTransactionContext } from "./dl-transaction-context";
import { RemoteTransactionContext } from "./remote-transaction-context";
import { DLAccount } from "./types";

export interface TransactionContextFactoryFunc {
  (account: DLAccount): Promise<DLTransactionContext>;
}

export interface RemoteTransactionContextFactoryFunc {
  (
    account: DLAccount,
    remoteNetwork: string,
  ): Promise<RemoteTransactionContext>;
}

export interface DLTransactionContextFactory {
  getTransactionContext: TransactionContextFactoryFunc;
  getRemoteTransactionContext: RemoteTransactionContextFactoryFunc;
}
