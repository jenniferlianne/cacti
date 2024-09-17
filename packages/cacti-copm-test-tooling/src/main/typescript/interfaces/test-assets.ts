import { DLAccount } from "@hyperledger-cacti/cacti-copm-core";

export interface TestAssets {
  addToken(
    assetType: string,
    assetQuantity: number,
    owner: DLAccount,
  ): Promise<void>;

  addNonFungibleAsset(
    assetType: string,
    assetId: string,
    account: DLAccount,
  ): Promise<void>;

  tokenBalance(tokenType: string, account: DLAccount): Promise<number>;

  userOwnsNonFungibleAsset(
    assetType: string,
    assetId: string,
    account: DLAccount,
  ): Promise<boolean>;
}
