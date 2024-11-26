import { CopmNetworkMode } from "../lib/types";
import { Logger } from "@hyperledger/cactus-common";
import { CordaLockNetwork } from "../corda/networks/lock-test-network";
import { TestNetwork } from "../interfaces/test-network";
import { CordaInteropTestNetwork } from "../corda/networks/interop-test-network";
import { FabricInteropTestNetwork } from "../fabric/networks/interop-test-network";

/**
 * Manages the docker network for the weaver and digital ledger
 * test environment
 */

export class TestNetworks {
  private log: Logger;
  private mode: CopmNetworkMode;
  private networks: Map<string, TestNetwork>;

  supportedNetworks: string[] = ["fabric", "corda"];

  constructor(log: Logger, mode: CopmNetworkMode) {
    this.log = log;
    this.mode = mode;
    this.networks = new Map<string, TestNetwork>();
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
    if (this.networks.has(networkType)) {
      this.log.info(`already started network of type ${networkType}`);
      return;
    }
    const newNetwork = this.newNetwork(networkType);
    await newNetwork.start();
    this.networks.set(networkType, newNetwork);
  }

  public async stopNetworks() {
    for (const network of this.networks.values()) {
      await network.stop();
    }
  }

  private newNetwork(networkType: string): TestNetwork {
    switch (networkType) {
      case "fabric":
        switch (this.mode) {
          case CopmNetworkMode.Lock:
          //return new FabricLockNetwork();
          case CopmNetworkMode.Pledge:
            return new FabricInteropTestNetwork(this.log);
          default:
            throw new Error(
              `Unsupported network mode: ${this.mode} for ${networkType}`,
            );
        }
      case "corda":
        switch (this.mode) {
          case CopmNetworkMode.Lock:
            return new CordaLockNetwork(this.log);
          case CopmNetworkMode.Pledge:
            return new CordaInteropTestNetwork(this.log);
          default:
            throw new Error(
              `Unsupported network mode: ${this.mode} for ${networkType}`,
            );
        }
      default:
        throw new Error(`Unsupported network type: ${networkType}`);
    }
  }
}
