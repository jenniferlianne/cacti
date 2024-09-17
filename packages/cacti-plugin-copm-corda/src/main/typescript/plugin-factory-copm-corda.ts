import { IPluginFactoryOptions } from "@hyperledger/cactus-core-api";
import { PluginFactory } from "@hyperledger/cactus-core-api";

import { IPluginCopmCordaOptions, PluginCopmCorda } from "./plugin-copm-corda";

export class PluginFactoryCopmFabric extends PluginFactory<
  PluginCopmCorda,
  IPluginCopmCordaOptions,
  IPluginFactoryOptions
> {
  async create(
    pluginOptions: IPluginCopmCordaOptions,
  ): Promise<PluginCopmCorda> {
    return new PluginCopmCorda(pluginOptions);
  }
}
