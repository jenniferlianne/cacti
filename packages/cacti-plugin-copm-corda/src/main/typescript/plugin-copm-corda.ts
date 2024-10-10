import {
  LogLevelDesc,
  LoggerProvider,
  Logger,
} from "@hyperledger/cactus-common";
import {
  ICactusPluginOptions,
  ICrpcSvcRegistration,
  IPluginCrpcService,
} from "@hyperledger/cactus-core-api";
import { ServiceType } from "@bufbuild/protobuf";
import {
  DefaultService,
  CopmContractNames,
  Interfaces as CopmIF,
} from "@hyperledger/cacti-copm-core";
import { CopmCordaImpl } from "./service-implementation";
import { CordaTransactionContextFactory } from "./lib/corda-transaction-context-factory";
import { CordaConfiguration } from "./lib/corda-configuration";

export interface IPluginCopmCordaOptions extends ICactusPluginOptions {
  logLevel?: LogLevelDesc;
  cordaConfig: CordaConfiguration;
  interopConfig: CopmIF.InteropConfiguration;
  contractNames: CopmContractNames;
}

export class PluginCopmCorda implements IPluginCrpcService {
  public static readonly CLASS_NAME = "PluginCopmCorda";
  private readonly instanceId: string;
  private readonly logLevel: LogLevelDesc;
  private contextFactory: CordaTransactionContextFactory;
  private copmContractNames: CopmContractNames;
  private cordaConfig: CordaConfiguration;
  private readonly log: Logger;

  constructor(public readonly opts: IPluginCopmCordaOptions) {
    this.logLevel = opts.logLevel || "INFO";
    this.log = LoggerProvider.getOrCreate({
      level: this.logLevel,
      label: "CopmFabricImpl",
    });

    this.contextFactory = new CordaTransactionContextFactory(
      opts.cordaConfig,
      opts.interopConfig,
      this.log,
    );
    this.copmContractNames = opts.contractNames;
    this.cordaConfig = opts.cordaConfig;
    this.instanceId = this.opts.instanceId;
  }

  public async createCrpcSvcRegistrations(): Promise<
    ICrpcSvcRegistration<ServiceType>[]
  > {
    const out: ICrpcSvcRegistration<ServiceType>[] = [];

    const implementation = new CopmCordaImpl(
      this.log,
      this.contextFactory,
      this.cordaConfig,
      this.copmContractNames,
    );

    const crpcSvcRegistration: ICrpcSvcRegistration<ServiceType> = {
      definition: DefaultService,
      serviceName: DefaultService.typeName,
      implementation,
    };
    out.push(crpcSvcRegistration);
    return out;
  }

  public getInstanceId(): string {
    return this.instanceId;
  }

  public getPackageName(): string {
    return `@hyperledger/cacti-plugin-copm-fabric`;
  }

  public async onPluginInit(): Promise<unknown> {
    return;
  }
}
