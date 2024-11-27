import { TestDockerNetwork } from "../../network/test-docker-network";
import { Logger } from "@hyperledger/cactus-common";
import { TestProcess } from "../../network/test-process";
import { TestNetwork } from "../../network/test-network";
export class CordaLockNetwork extends TestNetwork {
  constructor(log: Logger) {
    super(log, "CordaLockNetwork");
    this.add(
      new TestDockerNetwork(
        [
          new TestProcess("weaver/tests/network-setups/corda", "/bin/bash", [
            "./scripts/get-cordapps.sh",
            "simple",
            "local",
          ]),
          new TestProcess("weaver/tests/network-setups/corda", "make", [
            "start-local",
            "PROFILE=3-nodes",
          ]),
        ],
        new TestProcess("weaver/tests/network-setups/corda", "make", [
          "stop",
          "PROFILE=3-nodes",
        ]),
        ["corda_notary_1", "corda_partya_1", "corda_partyb_1"],
      ),
    );
  }
}
