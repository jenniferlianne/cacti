import { DigitalLedgerDockerNetwork } from "../network/digital-ledger-docker-network";
import { TestService } from "../network/test-service";
import { TestNetworkComponent } from "../network/test-network-component";
import { Logger } from "@hyperledger/cactus-common";
import { TestProcess } from "../network/test-process";
const fs = require("fs");

export class CordaInteropTestNetwork {
  services: TestNetworkComponent[] = [];
  start_processes: TestProcess[] = [];
  stop_processes: TestProcess[] = [];
  log: Logger;
  pid_filename: string = "/tmp/corda-interop-test-network.pid";

  constructor(log: Logger) {
    this.log = log;
    this.services.push(
      new DigitalLedgerDockerNetwork(
        new TestProcess(
          "/home/jennifer/cacti/weaver/tests/network-setups/corda",
          "/bin/bash",
          ["./scripts/get-cordapps.sh", "simple", "local"],
        ),
        new TestProcess("weaver/tests/network-setups/corda", "make", [
          "stop",
          " PROFILE=3-nodes",
        ]),
        [
          "corda_network2_notary_1",
          "corda_network2_partya_1",
          "corda_notary_1",
          "corda_partya_1",
        ],
      ),
    );
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

    this.start_processes.push(
      new TestProcess("weaver/samples/corda/corda-simple-application", "make", [
        "initialise-vault-asset-transfer",
      ]),
    );

  }

  public async start(): Promise<void> {
    if (this.isUp()) {
      this.log.info("CordaInteropTestNetwork already started");
      return;
    }
    for (const service of this.services) {
      this.log.info(`starting service ${service.idStr()}`);
      await service.start();
    }
    for (const proc of this.start_processes) {
      this.log.info(`running start process ${proc.idStr()}`);
      await proc.run();
      this.log.info(`completed ${proc.idStr()}`);
    }
    this.log.info("CordaInteropTestNetwork started");
  }

  public async stop(): Promise<void> {
    for (const proc of this.stop_processes) {
      await proc.run();
    }
    for (const service of this.services) {
      await service.start();
    }
  }

  private isUp(): boolean {
    if (!fs.existsSync(this.pid_filename)) {
      return false;
    }
    const pids = fs.readFileSync(this.pid_filename, "utf-8").split(" ");
    for (const pid of pids) {
      try {
        process.kill(parseInt(pid), 0);
      } catch (e) {
        return false;
      }
    }
    return true;
  }
}
