import { TestNetworkComponent } from "./test-network-component";
import { TestProcess } from "./test-process";

export class ProcessPair implements TestNetworkComponent {
  private startProcess: TestProcess;
  private stopProcess: TestProcess | null;

  constructor(start: TestProcess, stop: TestProcess | null = null) {
    this.startProcess = start;
    this.stopProcess = stop;
  }

  public async start(): Promise<void> {
    await this.startProcess.run();
  }
  public async stop(): Promise<void> {
    if (this.stopProcess != null) {
      await this.stopProcess.run();
    }
  }
  public async isUp(): Promise<boolean> {
    return true;
  }
  public idStr(): string {
    return this.startProcess.idStr();
  }
}
