import { PromiseClient } from "@connectrpc/connect";
import { DLAccount, DefaultService } from "@hyperledger-cacti/cacti-copm-core";
import { CopmTester } from "../interfaces/copm-tester";
import { copmTesterFactory } from "./copm-tester-factory";
import { TestAssets } from "../interfaces/test-assets";
import { Logger } from "@hyperledger/cactus-common";
import { CopmNetworkMode } from "./types";

export class CopmTestertMultiNetwork implements CopmTester {
  net1: CopmTester;
  net2: CopmTester;
  log: Logger;
  networkMode: CopmNetworkMode;
  net1Type: string;
  net2Type: string;

  constructor(
    log: Logger,
    net1Type: string,
    net2Type: string,
    mode: CopmNetworkMode,
  ) {
    this.net1 = copmTesterFactory(log, net1Type, mode);
    this.net2 = copmTesterFactory(log, net2Type, mode);
    this.log = log;
    this.networkMode = mode;
    this.net1Type = net1Type;
    this.net2Type = net2Type;
  }

  networkNames(): string[] {
    return this.net1.networkNames().concat(this.net2.networkNames());
  }

  async startServer() {
    await this.net1.startServer();
    await this.net2.startServer();
  }

  async stopServer() {
    await this.net1.stopServer();
    await this.net2.stopServer();
  }

  getPartyA(assetType: string): DLAccount {
    return this.net1.getPartyA(assetType);
  }

  getPartyB(assetType: string): DLAccount {
    if (
      this.net1Type != this.net2Type &&
      this.networkMode == CopmNetworkMode.Pledge
    ) {
      // for different network types,
      // cross network perms have only been set up for
      // the primary user on each network.
      return this.net2.getPartyA(assetType);
    } else {
      return this.net2.getPartyB(assetType);
    }
  }

  assetsFor(account: DLAccount): TestAssets {
    return this.getNetworkFor(account).assetsFor(account);
  }

  clientFor(account: DLAccount): PromiseClient<typeof DefaultService> {
    return this.getNetworkFor(account).clientFor(account);
  }

  async getCertificateString(account: DLAccount): Promise<string> {
    return await this.getNetworkFor(account).getCertificateString(account);
  }

  getVerifiedViewExpectedResult(): string {
    return this.net1.getVerifiedViewExpectedResult();
  }

  async getVerifyViewCmd(
    pledgeId: string,
    src_crt: string,
    dest_cert: string,
    organization: string,
  ): Promise<{
    contractId: string;
    function: string;
    input: string[];
  }> {
    return await this.net1.getVerifyViewCmd(
      pledgeId,
      src_crt,
      dest_cert,
      organization,
    );
  }

  private getNetworkFor(account: DLAccount): CopmTester {
    if (this.net1.networkNames().includes(account.organization)) {
      return this.net1;
    }
    if (this.net2.networkNames().includes(account.organization)) {
      return this.net2;
    }
    throw new Error("Unknown organization: " + account.organization);
  }
}
