import { DLAccount } from "@hyperledger-cacti/cacti-copm-core";
import { DefaultApi as CordaApi } from "@hyperledger/cactus-plugin-ledger-connector-corda";
import { CordaParty, AssetCommands } from "./corda_types";
import { TransferrableAsset } from "@hyperledger-cacti/cacti-copm-core";
export interface CordaConfiguration {
  getCordaAPI(user: DLAccount): CordaApi;
  getCordaParty(user: DLAccount): CordaParty;
  getIssuer(asset: TransferrableAsset): CordaParty;
  getAssetCmds(asset: TransferrableAsset): AssetCommands;
  getObservers(): CordaParty[];
}
