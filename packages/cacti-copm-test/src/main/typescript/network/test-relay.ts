import { TestDockerNetwork } from "./test-docker-network";
import { TestProcess } from "./test-process";

export class TestRelay extends TestDockerNetwork {
  constructor(
    containerName: string,
    cordaEnvFile: string,
    networkName: string = "",
  ) {
    let env = {};
    if (networkName !== "") {
      env = {
        ...process.env,
        COMPOSE_ARG: `--env-file ${cordaEnvFile}`,
        NETWORK_NAME: networkName,
      };
    } else {
      env = { ...process.env, COMPOSE_ARG: `--env-file ${cordaEnvFile}` };
    }
    super(
      [new TestProcess("weaver/core/relay", "make", ["start-server"], env)],
      new TestProcess("weaver/core/relay", "make", ["stop"], env),
      [containerName],
    );
  }
}
