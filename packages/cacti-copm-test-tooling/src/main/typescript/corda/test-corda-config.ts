/*
import { DLAccount } from "@hyperledger-cacti/cacti-copm-core";
import { DefaultApi as CordaApi } from "@hyperledger/cactus-plugin-ledger-connector-corda";
import { TransferrableAsset } from "@hyperledger-cacti/cacti-copm-core";
import { CordaConfiguration } from "../../../main/typescript/lib/corda-configuration";
import {
  CordaParty,
  CommandData,
  AssetCommands,
} from "../../../main/typescript/lib/corda_types";
import { Logger } from "@hyperledger/cactus-common";

export class TestCordaConfig implements CordaConfiguration {
  private cordaApiMap: Map<string, CordaApi> = new Map<string, CordaApi>();
  private log: Logger;

  constructor(log: Logger) {
    this.log = log;
  }

  private apiMapKey(account: DLAccount): string {
    return account.organization + "#" + account.userId;
  }

  public addTestUser(account: DLAccount, api: CordaApi) {
    const key = this.apiMapKey(account);
    this.log.info(`adding api for user ${key}`);
    this.cordaApiMap.set(key, api);
  }

  public getCordaAPI(user: DLAccount): CordaApi {
    const key = this.apiMapKey(user);
    this.log.info(`getting api for user ${key}`);
    const api = this.cordaApiMap.get(key);
    if (!api) {
      throw Error(`no API initialized for ${user.organization} ${user.userId}`);
    }
    return api;
  }
  public getCordaParty(user: DLAccount): CordaParty {
    return new CordaParty(user.userId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getIssuer(_asset: TransferrableAsset): CordaParty {
    return new CordaParty("O=PartyA,L=London,C=GB");
  }

  public getAssetCmds(asset: TransferrableAsset): AssetCommands {
    return asset.isNFT()
      ? {
          ref: "com.cordaSimpleApplication.flow.RetrieveBondAssetStateAndRef",
          add: "BondAssetContract.Commands.Issue",
          update:
            "com.cordaSimpleApplication.flow.UpdateBondAssetOwnerFromPointer",
          del: new CommandData(
            "com.cordaSimpleApplication.contract.BondAssetContract$Commands$Delete",
          ),
        }
      : {
          ref: "com.cordaSimpleApplication.flow.RetrieveStateAndRef",
          add: "AssetContract.Commands.Issue()",
          update: "com.cordaSimpleApplication.flow.UpdateAssetOwnerFromPointer",
          del: new CommandData(
            "com.cordaSimpleApplication.contract.AssetContract$Commands$Delete",
          ),
        };
  }

  public getObservers(): CordaParty[] {
    return [];
  }
}
*/