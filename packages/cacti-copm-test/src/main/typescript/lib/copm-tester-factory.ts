import { CopmTester } from "../interfaces/copm-tester";
import { CopmWeaverFabricTestnet } from "../fabric/copm-weaver-fabric-testnet";
import { CopmNetworkMode } from "../lib/types";
import { Logger } from "@hyperledger/cactus-common";
import { CopmWeaverCordaTestnet } from "../corda/copm-weaver-corda-testnet";

export function copmTesterFactory(
  log: Logger,
  netType: string,
  networkMode: CopmNetworkMode,
): CopmTester {
  if (netType === "fabric") {
    return new CopmWeaverFabricTestnet(log, networkMode);
  }
  if (netType == "corda") {
    return new CopmWeaverCordaTestnet(log, networkMode);
  }
  throw new Error("Unsupported network type: " + netType);
}
