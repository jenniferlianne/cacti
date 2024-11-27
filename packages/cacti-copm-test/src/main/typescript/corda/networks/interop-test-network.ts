import { TestNetwork } from "../../network/test-network";
import { Logger } from "@hyperledger/cactus-common";
import { TestDockerNetwork } from "../../network/test-docker-network";
import { TestProcess } from "../../network/test-process";
import { TestRelay } from "../../network/test-relay";
import { TestDriver } from "../../network/test-driver";
import { ProcessPair } from "../../network/test-process-pair";
import path from "path";

const WEAVER_RELATIVE_PATH = path.join(__dirname, "../../../../../weaver/");

export class CordaInteropTestNetwork extends TestNetwork {
  constructor(log: Logger) {
    super(log, "CordaInteropTestNetwork");
    this.add(
      new ProcessPair(
        new TestProcess("packages/cacti-copm-test", "env", []),
        null,
      ),
    );
    this.add(
      new ProcessPair(
        new TestProcess("packages/cacti-copm-test", "make", [
          "-f",
          "Makefile_corda",
          "setup",
          `PATH=${process.env.PATH}`,
        ]),
        null,
      ),
    );
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
          ]),
        ],
        new TestProcess("weaver/tests/network-setups/corda", "make", ["stop"]),
        [
          "corda_network2_notary_1",
          "corda_network2_partya_1",
          "corda_notary_1",
          "corda_partya_1",
        ],
      ),
    );
    this.add(new TestRelay("relay-corda", "docker/testnet-envs/.env.corda"));
    this.add(new TestRelay("relay-corda2", "docker/testnet-envs/.env.corda2"));
    this.add(
      new TestDriver(
        "corda",
        "driver-corda-Corda_Network",
        "docker-testnet-envs/.env.corda",
      ),
    );
    this.add(
      new TestDriver(
        "corda",
        "driver-corda-Corda_Network2",
        "docker-testnet-envs/.env.corda2",
      ),
    );
    this.add(
      new ProcessPair(
        new TestProcess(
          "weaver/samples/corda/corda-simple-application",
          "docker",
          ["container", "ls"],
        ),
        null,
      ),
    );
    this.add(
      new ProcessPair(
        new TestProcess(
          "weaver/samples/corda/corda-simple-application",
          "make",
          ["initialise-vault-asset-transfer-docker"],
        ),
        null,
      ),
    );

    /*
    // two relays
    this.services.push(
      new TestService(
        "relay-corda1",
        "weaver/core/relay",
        "cargo",
        ["run", "--bin", "server"],
        { RELAY_CONFIG: "config/Corda_Relay.toml", PATH: process.env.PATH },
      ),
    );

    this.services.push(
      new TestService(
        "relay-corda2",
        "weaver/core/relay",
        "cargo",
        ["run", "--bin", "server"],
        { RELAY_CONFIG: "config/Corda_Relay2.toml", PATH: process.env.PATH },
      ),
    );

    this.services.push(
      new TestService(
        "driver-corda1",
        "weaver/core/drivers/corda-driver",
        "./build/install/driver-corda/bin/driver-corda",
        [],
      ),
    );

    this.services.push(
      new TestService(
        "driver-corda2",
        "weaver/core/drivers/corda-driver",
        "./build/install/driver-corda/bin/driver-corda",
        [],
        { DRIVER_PORT: "9098" },
      ),
    );
*/
  }
}
