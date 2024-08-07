import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import { ServiceImpl } from "@connectrpc/connect";
import type { ServiceType } from "@bufbuild/protobuf";
import * as utils from "./lib/utils"
import { DefaultService } from "./generated/services/default_service_connect";
import {
  ClaimAssetV1Request,
  PledgeAssetV1Request,
  ProvestateV1Request,
} from "./generated/services/default_service_pb.js";
import { ClaimAssetV1200ResponsePB } from "./generated//models/claim_asset_v1200_response_pb_pb";
import { PledgeAssetV1200ResponsePB } from "./generated/models/pledge_asset_v1200_response_pb_pb";
import { pledgeAssetV1Impl } from "./pledge-asset/pledge-asset-impl-v1";

type DefaultServiceMethodDefinitions = typeof DefaultService.methods;
type DefaultServiceMethodNames = keyof DefaultServiceMethodDefinitions;

type ICopmFabricApi = {
  [key in DefaultServiceMethodNames]: (...args: never[]) => unknown;
};

export class CopmFabricImpl
  implements ICopmFabricApi, Partial<ServiceImpl<ServiceType>>
{
  // We cannot avoid this due to how the types of the upstream library are
  // structured/designed hence we just disable the linter on this particular line.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;

  private readonly log: Logger;
  private readonly fabricSettings: utils.FabricSettings;

  constructor(logLevel: LogLevelDesc) {
    this.log = LoggerProvider.getOrCreate({
      level: logLevel,
      label: "CopmFabricImpl",
    });
    this.fabricSettings = {
      channelName: "placeholder",
      connProfilePath: "placeholder",
      contractName: "simpleasset"
    }
  }

  public startFabric(): void {
    // todo start fabric with the chaincode functions
  }

  public async pledgeAssetV1(
    req: PledgeAssetV1Request,
  ): Promise<PledgeAssetV1200ResponsePB> {
    this.log.debug("pledgeAssetV1 ENTRY req=%o", req);
    const pledgeId = await pledgeAssetV1Impl(
      req,
      this.log,
      this.fabricSettings
    );
    const res = new PledgeAssetV1200ResponsePB({ pledgeId: pledgeId });
    return res;
  }

  public claimAssetV1(req: ClaimAssetV1Request): ClaimAssetV1200ResponsePB {
    this.log.debug("claimAssetV1 ENTRY req=%o", req);
    const res = new ClaimAssetV1200ResponsePB({ claimId: "myclaimid" });
    return res;
  }

  public provestateV1(req: ProvestateV1Request): void {
    this.log.debug("provestateV1 ENTRY req=%o", req);
    return;
  }
}
