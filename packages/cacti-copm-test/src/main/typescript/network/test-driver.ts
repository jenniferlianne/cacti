import { TestDockerNetwork } from "./test-docker-network";
import { TestProcess } from "./test-process";

export class TestDriver extends TestDockerNetwork {
  constructor(containerName: string, cordaEnvFile: string) {
    /*
    	echo "starting corda driver 1"
	cd $(WORKSPACE)/weaver/core/drivers/corda-driver && \
	make deploy COMPOSE_ARG='--env-file docker-testnet-envs/.env.corda'
    */
    super(
      [
        new TestProcess(
          "/home/jennifer/cacti/weaver/core/drivers/corda-driver",
          "make",
          ["deploy"],
          { ...process.env, COMPOSE_ARG: `--env-file ${cordaEnvFile}` },
        ),
      ],
      new TestProcess(
        "/home/jennifer/cacti/weaver/core/drivers/corda-driver",
        "make",
        ["stop"],
        { ...process.env, COMPOSE_ARG: `--env-file ${cordaEnvFile}` },
      ),
      [containerName],
    );
  }
}
