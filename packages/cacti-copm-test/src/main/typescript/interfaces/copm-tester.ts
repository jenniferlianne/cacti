import { PromiseClient } from "@connectrpc/connect";
import { DefaultService, DLAccount } from "@hyperledger-cacti/cacti-copm-core";
import { TestAssets } from "./test-assets";
export interface CopmTester {
  networkNames(): string[];

  startServer();
  stopServer();

  getPartyA(assetType: string): DLAccount;

  getPartyB(assetType: string): DLAccount;

  clientFor(account: DLAccount): PromiseClient<typeof DefaultService>;
  assetsFor(account: DLAccount): Promise<TestAssets>;

  getCertificateString(account: DLAccount): Promise<string>;

  getVerifiedViewExpectedResult(): string;

  getVerifyViewCmd(
    pledgeId: string,
    src_crt: string,
    dest_cert: string,
    organization: string,
  ): Promise<{
    contractId: string;
    function: string;
    input: string[];
  }>;
}
