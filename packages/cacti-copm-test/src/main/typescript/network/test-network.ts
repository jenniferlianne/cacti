import { TestNetworkComponent } from "../network/test-network-component";
import { Logger } from "@hyperledger/cactus-common";

export class TestNetwork {
  services: TestNetworkComponent[] = [];
  log: Logger;
  name: string;

  constructor(log: Logger, name: string) {
    this.log = log;
    this.name = name;
  }

  public add(component: TestNetworkComponent) {
    this.services.push(component);
  }

  public async start(): Promise<void> {
    if (await this.isUp()) {
      this.log.info(`${this.name} already started`);
      return;
    }
    for (const service of this.services) {
      this.log.info(`starting service ${service.idStr()}`);
      await service.start();
    }
    this.log.info(`${this.name} started`);
  }

  public async stop(): Promise<void> {
    for (const service of this.services) {
      this.log.info(`stopping service ${service.idStr()}`);
      await service.stop();
    }
  }

  private async isUp(): Promise<boolean> {
    for (const service of this.services) {
      if (!(await service.isUp())) {
        return false;
      }
    }
    return true;
  }
}
