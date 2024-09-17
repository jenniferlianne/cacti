import { PromiseClient } from "@connectrpc/connect";
import { DefaultService, DLAccount } from "@hyperledger-cacti/cacti-copm-core";

export interface InteropTester {
  getPledgePartyA(assetType: string): DLAccount;

  getPledgePartyB(assetType: string): DLAccount;

  clientFor(account: DLAccount): PromiseClient<typeof DefaultService>;

  getCertificateString(account: DLAccount): string;

  getVerifiedViewExpectedResult(): string;

  getVerifyViewCmd();
}
