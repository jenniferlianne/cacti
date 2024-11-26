import { TestNetwork } from "../../network/test-network";
import { Logger } from "@hyperledger/cactus-common";
import { TestDockerNetwork } from "../../network/test-docker-network";
import { TestProcess } from "../../network/test-process";
import { TestRelay } from "../../network/test-relay";
import { TestDriver } from "../../network/test-driver";
import { IINAgentService } from "./iin-agent-service";
import { ProcessPair } from "../../network/test-process-pair";

export class FabricInteropTestNetwork extends TestNetwork {
  constructor(log: Logger) {
    super(log, "FabricInteropTestNetwork");
    this.log = log;
    this.add(
      new ProcessPair(
        new TestProcess("packages/cacti-copm-test", "make", [
          "-f",
          "Makefile_fabric",
          "setup",
          `PATH=${process.env.PATH}`,
        ]),
      ),
    );

    /* 	export GO111MODULE=auto
	echo "making fabric DL network"
	cd $(WORKSPACE)/weaver/tests/network-setups/fabric/dev && \
	make start-interop-local CHAINCODE_NAME=$(chaincode) PROFILE='2-nodes'
        */

    this.add(
      new TestDockerNetwork(
        [
          new TestProcess(
            "/home/jennifer/cacti/weaver/tests/network-setups/fabric/dev",
            "make",
            ["start-interop-local", `PATH=${process.env.PATH}`],
            {
              CHAINCODE_NAME: "simpleassettransfer",
              PROFILE: "2-nodes",
              GO111MODULE: "auto",
              GOPATH: process.env.GOPATH,
              HOME: process.env.HOME,
            },
          ),
        ],
        new TestProcess(
          "weaver/tests/network-setups/fabric/dev",
          "make",
          ["stop"],
          {
            PROFILE: "2-nodes",
          },
        ),
        ["peer0.org1.network1.com", "peer0.org1.network2.com"],
      ),
    );

    this.add(
      new TestRelay(
        "relay-network1",
        "docker/testnet-envs/.env.n1",
        "network1",
      ),
    );
    this.add(
      new TestRelay(
        "relay-network2",
        "docker/testnet-envs/.env.n2",
        "network2",
      ),
    );

    this.add(
      new TestDriver(
        "fabric",
        "driver-fabric-network1",
        "docker-testnet-envs/.env.n1",
      ),
    );
    this.add(
      new TestDriver(
        "fabric",
        "driver-fabric-network2",
        "docker-testnet-envs/.env.n2",
      ),
    );

    // iin servers
    this.add(
      new IINAgentService(
        "iin-agent-Org1MSP-network1",
        "docker-testnet/envs/.env.n1.org1",
        "/home/jennifer/cacti/weaver/tests/network-setups/fabric/shared/network1/peerOrganizations/org1.network1.com",
      ),
    );
    this.add(
      new IINAgentService(
        "iin-agent-Org2MSP-network1",
        "docker-testnet/envs/.env.n1.org2",
        "/home/jennifer/cacti/weaver/tests/network-setups/fabric/shared/network1/peerOrganizations/org2.network1.com",
      ),
    );
    this.add(
      new IINAgentService(
        "iin-agent-Org1MSP-network2",
        "docker-testnet/envs/.env.n2.org1",
        "/home/jennifer/cacti/weaver/tests/network-setups/fabric/shared/network2/peerOrganizations/org1.network2.com",
      ),
    );

    this.add(
      new IINAgentService(
        "iin-agent-Org2MSP-network2",
        "docker-testnet/envs/.env.n2.org2",
        "/home/jennifer/cacti/weaver/tests/network-setups/fabric/shared/network2/peerOrganizations/org2.network2.com",
      ),
    );
    this.add(
      new ProcessPair(
        new TestProcess("packages/cacti-copm-test", "make", [
          "-f",
          "Makefile_fabric",
          "fabric-cli",
          `PATH=${process.env.PATH}`,
        ]),
      ),
    );
  }
}
