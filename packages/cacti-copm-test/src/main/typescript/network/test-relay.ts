import { TestDockerNetwork } from "./test-docker-network";
import { TestProcess } from "./test-process";

export class TestRelay extends TestDockerNetwork {
  constructor(containerName: string, cordaEnvFile: string) {
    /*
        cd $(WORKSPACE)/weaver/core/relay &&\
	make start-server COMPOSE_ARG='--env-file docker/testnet-envs/.env.corda' 
    */
    super(
      [
        new TestProcess(
          "/home/jennifer/cacti/weaver/core/relay",
          "make",
          ["start-server"],
          { ...process.env, COMPOSE_ARG: `--env-file ${cordaEnvFile}` },
        ),
      ],
      new TestProcess(
        "/home/jennifer/cacti/weaver/core/relay",
        "make",
        ["stop"],
        { ...process.env, COMPOSE_ARG: `--env-file ${cordaEnvFile}` },
      ),
      [containerName],
    );
  }
}
