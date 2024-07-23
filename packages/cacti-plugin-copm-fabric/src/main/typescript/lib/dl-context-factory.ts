import { DLTransactionContext } from "./dl-transaction-context";
import { RemoteTransactionContext } from "./remote-transaction-context";

export interface TransactionContextFactoryFunc {
  (organization: string, userId: string): Promise<DLTransactionContext>;
}

export interface RemoteTransactionContextFactoryFunc {
  (
    organization: string,
    userId: string,
    remoteNetwork: string,
  ): Promise<RemoteTransactionContext>;
}

export interface DLTransactionContextFactory {
  getTransactionContext: TransactionContextFactoryFunc;
  getRemoteTransactionContext: RemoteTransactionContextFactoryFunc;
}
