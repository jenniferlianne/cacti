import { v4 as uuidv4 } from "uuid";

import { IPluginFactoryOptions } from "@hyperledger/cactus-core-api";
import { PluginFactory } from "@hyperledger/cactus-core-api";

import {
  IPluginCopmFabricOptions,
  PluginCopmFabric,
} from "./plugin-copm-fabric";

export class PluginFactoryCopmFabric extends PluginFactory<
  PluginKeychainMemory,
  IPluginCopmFabricOptions,
  IPluginFactoryOptions
> {
  async create(
    pluginOptions: IPluginCopmFabricOptions = {
      backend: new Map(),
      instanceId: uuidv4(),
      keychainId: uuidv4(),
      logLevel: "TRACE",
    },
  ): Promise<PluginCopmFabric> {
    return new PluginCopmFabric(pluginOptions);
  }
}
