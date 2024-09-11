import { LogLevelDesc } from "@hyperledger/cactus-common";
import {
  ICactusPluginOptions,
  ICrpcSvcRegistration,
  IPluginCrpcService,
} from "@hyperledger/cactus-core-api";
import { ServiceType } from "@bufbuild/protobuf";
import { DefaultService } from "@hyperledger/cacti-copm-core";
import { CopmFabricImpl } from "./service-implementation";
import { DLTransactionContextFactory } from "./lib/dl-context-factory";
import { CopmContractNames } from "./lib/types";

export interface IPluginCopmFabricOptions extends ICactusPluginOptions {
  logLevel?: LogLevelDesc;
  DLTransactionContextFactory: DLTransactionContextFactory;
  contractNames: CopmContractNames;
}

export class PluginCopmFabric implements IPluginCrpcService {
  public static readonly CLASS_NAME = "PluginCopmFabric";
  private readonly instanceId: string;
  private readonly logLevel: LogLevelDesc;
  private DLTransactionContextFactory: DLTransactionContextFactory;
  private copmContractNames: CopmContractNames;

  constructor(public readonly opts: IPluginCopmFabricOptions) {
    this.logLevel = opts.logLevel || "INFO";
    this.DLTransactionContextFactory = opts.DLTransactionContextFactory;
    this.copmContractNames = opts.contractNames;
    this.instanceId = this.opts.instanceId;
  }

  public async createCrpcSvcRegistrations(): Promise<
    ICrpcSvcRegistration<ServiceType>[]
  > {
    const out: ICrpcSvcRegistration<ServiceType>[] = [];

    const implementation = new CopmFabricImpl(
      this.logLevel,
      this.DLTransactionContextFactory,
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
