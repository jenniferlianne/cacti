import { LogLevelDesc } from "@hyperledger/cactus-common";
import {
  ICactusPluginOptions,
  ICrpcSvcRegistration,
  IPluginCrpcService,
} from "@hyperledger/cactus-core-api";
import { ServiceType } from "@bufbuild/protobuf";
import { DefaultService } from "./generated/services/default_service_connect";
import { CopmFabricImpl } from "./service-implementation";

export interface IPluginCopmFabricOptions extends ICactusPluginOptions {
  logLevel?: LogLevelDesc;
}

export class PluginCopmFabric implements IPluginCrpcService {
  public static readonly CLASS_NAME = "PluginCopmFabric";
  private readonly instanceId: string;
  private readonly logLevel: LogLevelDesc;

  constructor(public readonly opts: IPluginCopmFabricOptions) {

    this.logLevel = opts.logLevel || "INFO";
    this.instanceId = this.opts.instanceId;
  }

  public async createCrpcSvcRegistrations(): Promise<
    ICrpcSvcRegistration<ServiceType>[]
  > {
    const out: ICrpcSvcRegistration<ServiceType>[] = [];

    const implementation = new CopmFabricImpl(this.logLevel);

    const crpcSvcRegistration: ICrpcSvcRegistration<ServiceType> = {
      definition: DefaultService,
      serviceName: DefaultService.typeName,
      implementation,
    };
    out.push(crpcSvcRegistration);
    return out;
  }
}
