import { IPluginFactoryOptions } from "@hyperledger/cactus-core-api";

export {
  PluginCopmFabric,
  IPluginKeyCopmFabric,
} from "./plugin-copm-fabric";

export { PluginFactoryCopmFabric } from "./plugin-factory-copm-fabric";


export async function createPluginFactory(
  pluginFactoryOptions: IPluginFactoryOptions,
): Promise<PluginFactoryKeychain> {
  return new PluginFactoryCopm(pluginFactoryOptions);
};


export { DefaultService } from "./generated/services/default_service_connect";
