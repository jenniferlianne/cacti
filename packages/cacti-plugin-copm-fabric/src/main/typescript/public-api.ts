import { IPluginFactoryOptions } from "@hyperledger/cactus-core-api";
import { PluginFactoryCopmFabric } from "./plugin-factory-copm-fabric";

export async function createPluginFactory(
  pluginFactoryOptions: IPluginFactoryOptions,
): Promise<PluginFactoryCopmFabric> {
  return new PluginFactoryCopmFabric(pluginFactoryOptions);
}

export { DefaultService } from "./generated/services/default_service_connect";