import { TestProcess } from "../lib/test-process-pair";
import { TestService } from "../lib/test-service";
import { Logger } from "@hyperledger/cactus-common";
const fs = require("fs");

export class CordaInteropTestNetwork {
  services: TestService[] = [];
  start_processes: TestProcess[] = [];
  stop_processes: TestProcess[] = [];
  log: Logger;
  pid_filename: string = "/tmp/corda-interop-test-network.pid";

  constructor(log: Logger) {
    this.log = log;
    this.start_processes.push(
      new TestProcess(
        "/home/jennifer/cacti/weaver/tests/network-setups/corda",
        "/bin/bash",
        ["./scripts/get-cordapps.sh", "simple", "local"],
      ),
    );
    this.start_processes.push(
      new TestProcess("weaver/tests/network-setups/corda", "make", [
        "start-local",
      ]),
    );
    this.start_processes.push(
      new TestProcess("weaver/samples/corda/corda-simple-application", "make", [
        "initialise-vault-asset-transfer",
      ]),
    );

    // two relays
    this.services.push(
      new TestService(
        "weaver/core/relay",
        "cargo",
        ["run", "--bin", "server"],
        "/tmp/relay-corda1.log",
        { RELAY_CONFIG: "config/Corda_Relay.toml", PATH: process.env.PATH },
      ),
    );

    this.services.push(
      new TestService(
        "weaver/core/relay",
        "cargo",
        ["run", "--bin", "server"],
        "/tmp/relay-corda2.log",
        { RELAY_CONFIG: "config/Corda_Relay2.toml", PATH: process.env.PATH },
      ),
    );

    this.services.push(
      new TestService(
        "weaver/core/drivers/corda-driver",
        "./build/install/driver-corda/bin/driver-corda",
        [],
        "/tmp/corda-driver1.log",
      ),
    );

    this.services.push(
      new TestService(
        "weaver/core/drivers/corda-driver",
        "./build/install/driver-corda/bin/driver-corda",
        [],
        "/tmp/corda-driver2.log",
        { DRIVER_PORT: "9098" },
      ),
    );

    this.stop_processes.push(
      new TestProcess("weaver/tests/network-setups/corda", "make", [
        "stop",
        " PROFILE=3-nodes",
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
    const pids = this.services.map((service) => service.pid);
    if (!pids.includes(-1)) {
      fs.writeFileSync(this.pid_filename, pids.join(" "), "utf-8");
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
