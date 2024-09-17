import { DLAccount } from "@hyperledger-cacti/cacti-copm-core";
import * as fs from "fs";
import * as path from "path";

export class CordaRPCConfig {
  private static readonly cordaRpcFile = path.join(
    __dirname,
    "../../../../",
    "corda_rpc.json",
  );

  public static getRPCData(account: DLAccount): {
    host: string;
    port: number;
    username: string;
    password: string;
  } {
    const accountKey = account.userId + "@" + account.organization;
    const config = JSON.parse(fs.readFileSync(this.cordaRpcFile).toString());
    if (!config[accountKey]) {
      throw Error(`account ${accountKey} not found in ${this.cordaRpcFile}`);
    }
    return config[accountKey];
  }
}
