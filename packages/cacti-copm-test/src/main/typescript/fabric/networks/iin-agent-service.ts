import { TestDockerNetwork } from "../../network/test-docker-network";
import { TestProcess } from "../../network/test-process";

// 	make deploy COMPOSE_ARG='--env-file docker-testnet/envs/.env.n1.org1' DLT_SPECIFIC_DIR=$(WORKSPACE)/weaver/tests/network-setups/fabric/shared/network1/peerOrganizations/org1.network1.com && \

export class IINAgentService extends TestDockerNetwork {
  static code_dir = "weaver/core/identity-management/iin-agent";

  constructor(containerName: string, cordaEnvFile: string, dltDir: string) {
    const env = {
      ...process.env,
      COMPOSE_ARG: `--env-file ${cordaEnvFile}`,
      DLT_SPECIFIC_DIR: dltDir,
    };

    super(
      [new TestProcess(IINAgentService.code_dir, "make", ["deploy"], env)],
      new TestProcess(IINAgentService.code_dir, "make", ["stop"], env),
      [containerName],
    );
  }
}
