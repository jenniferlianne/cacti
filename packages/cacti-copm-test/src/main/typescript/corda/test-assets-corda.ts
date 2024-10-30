import {
  Interfaces as CopmIF,
  DLAccount,
} from "@hyperledger-cacti/cacti-copm-core";
import { TestAssets } from "../interfaces/test-assets";
import { TestCordaConfig } from "./test-corda-config";
import { Logger } from "@hyperledger/cactus-common";
import { TestCordaConnector } from "./test-corda-connector";
import { DefaultApi as CordaApi } from "@hyperledger/cactus-plugin-ledger-connector-corda";
import { WeaverInteropConfiguration } from "../lib/weaver-interop-configuration";
import {
  CordaConfiguration,
  CordaTransactionContextFactory,
} from "@hyperledger-cacti/cacti-plugin-copm-corda";
import { CordaApiClient } from "@hyperledger/cactus-plugin-ledger-connector-corda";
import { match } from "assert";

const fs = require("fs");
const path = require("path");

export class TestAssetsCorda implements TestAssets {
  account: DLAccount;
  contractName: string;
  log: Logger;
  contextFactory: CopmIF.DLTransactionContextFactory;
  cordaConfig: TestCordaConfig;
  connector: TestCordaConnector;

  constructor(
    owner: DLAccount,
    contractName: string,
    connector: TestCordaConnector,
    log: Logger,
  ) {
    this.account = owner;
    this.cordaConfig = new TestCordaConfig(log);
    this.contextFactory = new CordaTransactionContextFactory(
      this.cordaConfig,
      new WeaverInteropConfiguration("", log),
      log,
    );
    this.connector = connector;
    this.contractName = contractName;
    this.log = log;
  }

  public async start() {
    const api: CordaApi = await this.connector.start();
    this.cordaConfig.addTestUser(this.account, api);
  }

  public async stop() {
    this.connector.stop();
  }

  public async userOwnsNonFungibleAsset(
    assetType: string,
    assetId: string,
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  public async addToken(assetType: string, assetQuantity: number) {
    const transaction = await this.contextFactory.getTransactionContext(
      this.account,
    );

    await transaction.invoke({
      contract: this.contractName,
      method: "IssueAssetState",
      args: [assetQuantity, assetType],
    });
  }

  public async addNonFungibleAsset(assetType: string, assetId: string) {
    //rpc.proxy.startFlow(::IssueBondAssetState, asset.assetId, asset.assetType)
    const transaction = await this.contextFactory.getTransactionContext(
      this.account,
    );
    await transaction.invoke({
      contract: this.contractName,
      method: "IssueBondAssetState",
      args: [assetId, assetType],
    });
  }

  public async tokenBalance(tokenType: string): Promise<number> {
    const transaction = await this.contextFactory.getTransactionContext(
      this.account,
    );
    const res = await transaction.invoke({
      contract: this.contractName,
      method: "GetStatesByTokenType",
      args: [tokenType],
    });
    // AssetState(quantity=5, tokenType=t1, owner=O=PartyA, L=London, C=GB,
    const matches = res.match(/AssetState\(quantity=(\d+)/);
    if (matches) {
      return +matches[1];
    }
    throw new Error(`Failed to parse token balance from response: ${res}`);
  }
}
