import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import { ServiceImpl } from "@connectrpc/connect";
import type { ServiceType } from "@bufbuild/protobuf";
import { DefaultService } from "./generated/services/default_service_connect";
import {
  ClaimLockedAssetV1Request,
  ClaimPledgedAssetV1Request,
  LockAssetV1Request,
  PledgeAssetV1Request,
  ProvestateV1Request,
} from "./generated/services/default_service_pb.js";
import { ClaimAssetV1200ResponsePB } from "./generated//models/claim_asset_v1200_response_pb_pb";
import { PledgeAssetV1200ResponsePB } from "./generated/models/pledge_asset_v1200_response_pb_pb";
import { LockAssetV1200ResponsePB } from "./generated/models/lock_asset_v1200_response_pb_pb";
import { pledgeAssetV1Impl } from "./endpoints/pledge-asset-impl-v1";
import { claimLockedAssetV1Impl } from "./endpoints/claim-locked-asset-v1";
import { claimPledgedAssetV1Impl } from "./endpoints/claim-pledged-asset-v1";
import { proveStateV1Impl } from "./endpoints/prove-state-impl-v1";
import { lockAssetV1Impl } from "./endpoints/lock-asset-impl-v1";
import { DLTransactionContextFactory } from "./lib/dl-context-factory";
import { CopmContractNames } from "./lib/types";

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
  private readonly DLTransactionContextFactory: DLTransactionContextFactory;
  private readonly contractNames: CopmContractNames;

  constructor(
    logLevel: LogLevelDesc,
    DLTransactionContextFactory: DLTransactionContextFactory,
    copmContractNames: CopmContractNames,
  ) {
    this.log = LoggerProvider.getOrCreate({
      level: logLevel,
      label: "CopmFabricImpl",
    });
    this.DLTransactionContextFactory = DLTransactionContextFactory;
    this.contractNames = copmContractNames;
  }

  public async pledgeAssetV1(
    req: PledgeAssetV1Request,
  ): Promise<PledgeAssetV1200ResponsePB> {
    try {
      this.log.debug("pledgeAssetV1 ENTRY req=%o", req);
      const pledgeId = await pledgeAssetV1Impl(
        req,
        this.log,
        this.DLTransactionContextFactory,
        this.contractNames.pledgeContract,
      );
      const res = new PledgeAssetV1200ResponsePB({ pledgeId: pledgeId });
      return res;
    } catch (ex) {
      this.log.error(ex.message);
      throw ex;
    }
  }

  public async claimLockedAssetV1(
    req: ClaimLockedAssetV1Request,
  ): Promise<ClaimAssetV1200ResponsePB> {
    try {
      this.log.debug("claimAssetV1 ENTRY req=%o", req);
      const claimId = await claimLockedAssetV1Impl(
        req,
        this.log,
        this.DLTransactionContextFactory,
        this.contractNames.lockContract,
      );
      const res = new ClaimAssetV1200ResponsePB({ claimId: claimId });
      return res;
    } catch (ex) {
      this.log.error(ex.message);
      throw ex;
    }
  }

  public async claimPledgedAssetV1(
    req: ClaimPledgedAssetV1Request,
  ): Promise<ClaimAssetV1200ResponsePB> {
    this.log.debug("claimAssetV1 ENTRY req=%o", req);
    const claimId = await claimPledgedAssetV1Impl(
      req,
      this.log,
      this.DLTransactionContextFactory,
      this.contractNames.pledgeContract,
    );
    const res = new ClaimAssetV1200ResponsePB({ claimId: claimId });
    return res;
  }

  public async lockAssetV1(
    req: LockAssetV1Request,
  ): Promise<LockAssetV1200ResponsePB> {
    this.log.debug("lockAssetV1 ENTRY req=%o", req);
    try {
      const lockId = await lockAssetV1Impl(
        req,
        this.log,
        this.DLTransactionContextFactory,
        this.contractNames.lockContract,
      );
      const res = new LockAssetV1200ResponsePB({ lockId: lockId });
      return res;
    } catch (error) {
      this.log.error(error);
      throw error;
    }
  }

  public async provestateV1(req: ProvestateV1Request): Promise<void> {
    this.log.debug("provestateV1 ENTRY req=%o", req);
    await proveStateV1Impl(req, this.DLTransactionContextFactory, this.log);
  }
}
