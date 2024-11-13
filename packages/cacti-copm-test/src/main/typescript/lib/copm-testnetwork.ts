import { CopmNetworkMode } from "./types";
import { spawn } from "child_process";
import { Logger } from "@hyperledger/cactus-common";

/**
 * Manages the docker network for the weaver and digital ledger
 * test environment
 */

export class CopmTestNetwork {
  private log: Logger;
  private mode: CopmNetworkMode;

  supportedNetworks: string[] = ["fabric", "corda"];

  constructor(log: Logger, mode: CopmNetworkMode) {
    this.log = log;
    this.mode = mode;
  }

  public supportedNetworkMatrix(): string[][] {
    const supportedCombos = [];
    for (const val1 of this.supportedNetworks) {
      for (const val2 of this.supportedNetworks) {
        supportedCombos.push([val1, val2]);
      }
    }
    return supportedCombos;
  }

  public async startNetworksOfType(networkTypes: string[]) {
    for (const networkType of networkTypes) {
      await this.startNetworkOfType(networkType);
    }
  }

  public async startNetworkOfType(networkType: string) {
    const networkModeStr =
      this.mode == CopmNetworkMode.Lock ? "lock" : "pledge";
    if (!this.supportedNetworks.includes(networkType)) {
      throw new Error(`Unsupported network type: ${networkType}`);
    }
    await this.runCliCommand(
      `packages/cacti-plugin-copm-${networkType}`,
      "make",
      [`${networkModeStr}-network`],
      true,
    );
  }

  public async stopNetworks() {
    await this.runCliCommand("packages/cacti-copm-core", "make", [
      "stop-network",
    ]);
  }

  private async runCliCommand(
    directory: string,
    command: string,
    args: string[],
    show_progress = false,
  ): Promise<void> {
    this.log.info(`Running command: ${command} ${args.join(" ")}`);
    return new Promise((resolve, reject) => {
      const cmd = spawn(command, args, { cwd: directory });
      if (show_progress) {
        cmd.stdout.on("data", function (data) {
          console.log(data.toString());
        });

        cmd.stderr.on("data", function (data) {
          console.log(data.toString());
        });
      }
      cmd.on("exit", function (code) {
        console.log(`child process exited with code ${code || "unknown"}`);
        if (code && code != 0) {
          reject(new Error(`Command failed with code ${code}`));
        } else {
          resolve();
        }
      });
    });
  }
}
