import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
} from "@hyperledger/cactus-common";

import { DefaultService } from "./generated/services/default_service_connect";
import {
  ClaimAssetV1Request,
  PledgeAssetV1Request,
  ProvestateV1Request,
} from "./generated/services/default_service_pb.js";
import { ClaimAssetV1200ResponsePB } from "./generated//models/claim_asset_v1200_response_pb_pb";
import { PledgeAssetV1200ResponsePB } from "./generated/models/pledge_asset_v1200_response_pb_pb";
import { IPluginCopmFabricOptions } from "./plugin-copm-fabric";

type DefaultServiceMethodDefinitions = typeof DefaultService.methods;
type DefaultServiceMethodNames = keyof DefaultServiceMethodDefinitions;

type ICopmFabricApi = {
  [key in DefaultServiceMethodNames]: (...args: never[]) => unknown;
};

export class CopmFabricImpl implements ICopmFabricApi {
  public readonly logLevel: LogLevelDesc;
  private readonly log: Logger;

  constructor(readonly opts: IPluginCopmFabricOptions) {
    this.logLevel = opts.logLevel ? opts.logLevel : "WARN";
    this.log = LoggerProvider.getOrCreate({
      level: this.logLevel,
      label: "CopmFabricImpl",
    });
  }

  public pledgeAssetV1(req: PledgeAssetV1Request): PledgeAssetV1200ResponsePB {
    this.log.debug("pledgeAssetV1 ENTRY req=%o", req);
    const res: PledgeAssetV1200ResponsePB = {
      pledgeId: "mypledgeId",
    };
    return res;
  }

  public claimAssetV1(req: ClaimAssetV1Request): ClaimAssetV1200ResponsePB {
    this.log.debug("claimAssetV1 ENTRY req=%o", req);
    let res: ClaimAssetV1200ResponsePB;
    return res;
  }

  public async provestateV1(req: ProvestateV1Request): Promise<> {
    this.log.debug("provestateV1 ENTRY req=%o", req);
    return;
  }
}
