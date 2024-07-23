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

  constructor(public readonly opts: IPluginCopmFabricOptions) {}

  public async createCrpcSvcRegistrations(): Promise<
    ICrpcSvcRegistration<ServiceType>[]
  > {
    const out: ICrpcSvcRegistration<ServiceType>[] = [];

    const implementation = new CopmFabricImpl({
      logLevel: this.opts.logLevel,
    });

    const crpcSvcRegistration: ICrpcSvcRegistration<ServiceType> = {
      definition: DefaultService,
      serviceName: DefaultService.typeName,
      implementation,
    };
    out.push(crpcSvcRegistration);
    return out;
  }
}
