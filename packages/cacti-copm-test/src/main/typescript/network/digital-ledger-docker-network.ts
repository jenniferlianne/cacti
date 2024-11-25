import { TestNetworkComponent } from "./test-network-component";
import { TestProcess } from "./test-process";
import { exec } from "child_process";

export class DigitalLedgerDockerNetwork implements TestNetworkComponent {
  private containerNames: string[] = [];
  private startProcess: TestProcess;
  private stopProcess: TestProcess;

  constructor(
    startProcess: TestProcess,
    stopProcess: TestProcess,
    containerNames: string[],
  ) {
    this.startProcess = startProcess;
    this.stopProcess = stopProcess;
    this.containerNames = containerNames;
  }

  idStr(): string {
    return this.containerNames.join("-");
  }

  async start(): Promise<void> {
    await this.startProcess.run();
  }
  async stop(): Promise<void> {
    await this.stopProcess.run();
  }

  isUp(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      exec("docker ps --format '{{.Names}}'", (error, stdout, stderr) => {
        if (error) {
          reject(`Error checking containers: ${stderr}`);
          return;
        }
        const runningContainers = stdout.split("\n").filter(Boolean);
        const allContainersUp = this.containerNames.every((name) =>
          runningContainers.includes(name),
        );
        resolve(allContainersUp);
      });
    });
  }
}
