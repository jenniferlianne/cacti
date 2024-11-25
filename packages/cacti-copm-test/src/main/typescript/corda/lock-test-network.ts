import { TestProcess } from "../lib/test-process-pair";
import { TestService } from "../lib/test-service";

export class CordaLockNetwork {
  services: TestService[] = [];
  start_processes: TestProcess[] = [];
  stop_processes: TestProcess[] = [];

  constructor() {
    this.start_processes.push(
      new TestProcess(
        "weaver/tests/network-setups/corda",
        "./scripts/get-cordapps.sh ",
        ["simple", "local"],
      ),
    );
    this.start_processes.push(
      new TestProcess("weaver/tests/network-setups/corda", "make", [
        "start-local",
        "PROFILE=3-nodes",
      ]),
    );

    this.stop_processes.push(
      new TestProcess("weaver/tests/network-setups/corda", "make", ["stop"]),
    );
  }

  public async start(): Promise<void> {
    for (const proc of this.start_processes) {
      await proc.run();
    }
    for (const service of this.services) {
      await service.start();
    }
  }

  public async stop(): Promise<void> {
    for (const proc of this.stop_processes) {
      await proc.run();
    }
    for (const service of this.services) {
      await service.start();
    }
  }
}
