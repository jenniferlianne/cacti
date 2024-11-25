import { TestDockerNetwork } from "../network/test-docker-network";
import { TestNetworkComponent } from "../network/test-network-component";
import { TestProcess } from "../network/test-process";

export class CordaLockNetwork {
  services: TestNetworkComponent[] = [];

  constructor() {
    this.services.push(
      new TestDockerNetwork(
        [
          new TestProcess(
            "/home/jennifer/cacti/weaver/tests/network-setups/corda",
            "/bin/bash",
            ["./scripts/get-cordapps.sh", "simple", "local"],
          ),
          new TestProcess(
            "/home/jennifer/cacti/weaver/tests/network-setups/corda",
            "make",
            ["start-local", "PROFILE=3-nodes"],
          ),
        ],
        new TestProcess("weaver/tests/network-setups/corda", "make", [
          "stop",
          "PROFILE=3-nodes",
        ]),
        ["corda_notary_1", "corda_partya_1", "corda_partyb_1"],
      ),
    );
  }

  public async start(): Promise<void> {
    for (const service of this.services) {
      await service.start();
    }
  }

  public async stop(): Promise<void> {
    for (const service of this.services) {
      await service.start();
    }
  }
}
