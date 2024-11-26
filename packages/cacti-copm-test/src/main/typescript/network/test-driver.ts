import { TestDockerNetwork } from "./test-docker-network";
import { TestProcess } from "./test-process";

export class TestDriver extends TestDockerNetwork {
  constructor(type: string, containerName: string, envFile: string) {
    /*
    	echo "starting corda driver 1"
	cd $(WORKSPACE)/weaver/core/drivers/corda-driver && \
	make deploy COMPOSE_ARG='--env-file docker-testnet-envs/.env.corda'
    */
    super(
      [
        new TestProcess(
          `/home/jennifer/cacti/weaver/core/drivers/${type}-driver`,
          "make",
          ["deploy"],
          { ...process.env, COMPOSE_ARG: `--env-file ${envFile}` },
        ),
      ],
      new TestProcess(
        `/home/jennifer/cacti/weaver/core/drivers/${type}-driver`,
        "make",
        ["stop"],
        { ...process.env, COMPOSE_ARG: `--env-file ${envFile}` },
      ),
      [containerName],
    );
  }
}
