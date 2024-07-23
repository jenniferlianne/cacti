//
//Hyperledger Cacti Plugin - Common Operator Primitives
//
//Contains/describes the Hyperledger Cacti Common Operator Primitives plugin.  These primitives require specific chaincode and weaver relays to be deployed on the network as described at https://hyperledger.github.io/cacti/weaver/introduction/.
//
//The version of the OpenAPI document: 2.0.0-rc.2
//
//Generated by OpenAPI Generator: https://openapi-generator.tech

// @generated by protoc-gen-es v1.8.0 with parameter "target=ts"
// @generated from file services/default_service.proto (package org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { AssetLockClaimV1PB } from "../models/asset_lock_claim_v1_pb_pb.js";
import { AssetPledgeClaimV1PB } from "../models/asset_pledge_claim_v1_pb_pb.js";
import { GetVerifiedViewV1RequestPB } from "../models/get_verified_view_v1_request_pb_pb.js";
import { AssetLockV1PB } from "../models/asset_lock_v1_pb_pb.js";
import { AssetPledgeV1PB } from "../models/asset_pledge_v1_pb_pb.js";

/**
 * @generated from message org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.ClaimLockedAssetV1Request
 */
export class ClaimLockedAssetV1Request extends Message<ClaimLockedAssetV1Request> {
  /**
   *
   *
   * @generated from field: org.hyperledger.cacti.plugin.cacti.plugin.copm.core.AssetLockClaimV1PB assetLockClaimV1PB = 1;
   */
  assetLockClaimV1PB?: AssetLockClaimV1PB;

  constructor(data?: PartialMessage<ClaimLockedAssetV1Request>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.ClaimLockedAssetV1Request";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "assetLockClaimV1PB", kind: "message", T: AssetLockClaimV1PB },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ClaimLockedAssetV1Request {
    return new ClaimLockedAssetV1Request().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ClaimLockedAssetV1Request {
    return new ClaimLockedAssetV1Request().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ClaimLockedAssetV1Request {
    return new ClaimLockedAssetV1Request().fromJsonString(jsonString, options);
  }

  static equals(a: ClaimLockedAssetV1Request | PlainMessage<ClaimLockedAssetV1Request> | undefined, b: ClaimLockedAssetV1Request | PlainMessage<ClaimLockedAssetV1Request> | undefined): boolean {
    return proto3.util.equals(ClaimLockedAssetV1Request, a, b);
  }
}

/**
 * @generated from message org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.ClaimPledgedAssetV1Request
 */
export class ClaimPledgedAssetV1Request extends Message<ClaimPledgedAssetV1Request> {
  /**
   *
   *
   * @generated from field: org.hyperledger.cacti.plugin.cacti.plugin.copm.core.AssetPledgeClaimV1PB assetPledgeClaimV1PB = 1;
   */
  assetPledgeClaimV1PB?: AssetPledgeClaimV1PB;

  constructor(data?: PartialMessage<ClaimPledgedAssetV1Request>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.ClaimPledgedAssetV1Request";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "assetPledgeClaimV1PB", kind: "message", T: AssetPledgeClaimV1PB },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ClaimPledgedAssetV1Request {
    return new ClaimPledgedAssetV1Request().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ClaimPledgedAssetV1Request {
    return new ClaimPledgedAssetV1Request().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ClaimPledgedAssetV1Request {
    return new ClaimPledgedAssetV1Request().fromJsonString(jsonString, options);
  }

  static equals(a: ClaimPledgedAssetV1Request | PlainMessage<ClaimPledgedAssetV1Request> | undefined, b: ClaimPledgedAssetV1Request | PlainMessage<ClaimPledgedAssetV1Request> | undefined): boolean {
    return proto3.util.equals(ClaimPledgedAssetV1Request, a, b);
  }
}

/**
 * @generated from message org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.GetVerifiedViewV1Request
 */
export class GetVerifiedViewV1Request extends Message<GetVerifiedViewV1Request> {
  /**
   *
   *
   * @generated from field: org.hyperledger.cacti.plugin.cacti.plugin.copm.core.GetVerifiedViewV1RequestPB getVerifiedViewV1RequestPB = 1;
   */
  getVerifiedViewV1RequestPB?: GetVerifiedViewV1RequestPB;

  constructor(data?: PartialMessage<GetVerifiedViewV1Request>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.GetVerifiedViewV1Request";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "getVerifiedViewV1RequestPB", kind: "message", T: GetVerifiedViewV1RequestPB },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetVerifiedViewV1Request {
    return new GetVerifiedViewV1Request().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetVerifiedViewV1Request {
    return new GetVerifiedViewV1Request().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetVerifiedViewV1Request {
    return new GetVerifiedViewV1Request().fromJsonString(jsonString, options);
  }

  static equals(a: GetVerifiedViewV1Request | PlainMessage<GetVerifiedViewV1Request> | undefined, b: GetVerifiedViewV1Request | PlainMessage<GetVerifiedViewV1Request> | undefined): boolean {
    return proto3.util.equals(GetVerifiedViewV1Request, a, b);
  }
}

/**
 * @generated from message org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.LockAssetV1Request
 */
export class LockAssetV1Request extends Message<LockAssetV1Request> {
  /**
   *
   *
   * @generated from field: org.hyperledger.cacti.plugin.cacti.plugin.copm.core.AssetLockV1PB assetLockV1PB = 1;
   */
  assetLockV1PB?: AssetLockV1PB;

  constructor(data?: PartialMessage<LockAssetV1Request>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.LockAssetV1Request";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "assetLockV1PB", kind: "message", T: AssetLockV1PB },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): LockAssetV1Request {
    return new LockAssetV1Request().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): LockAssetV1Request {
    return new LockAssetV1Request().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): LockAssetV1Request {
    return new LockAssetV1Request().fromJsonString(jsonString, options);
  }

  static equals(a: LockAssetV1Request | PlainMessage<LockAssetV1Request> | undefined, b: LockAssetV1Request | PlainMessage<LockAssetV1Request> | undefined): boolean {
    return proto3.util.equals(LockAssetV1Request, a, b);
  }
}

/**
 * @generated from message org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.PledgeAssetV1Request
 */
export class PledgeAssetV1Request extends Message<PledgeAssetV1Request> {
  /**
   *
   *
   * @generated from field: org.hyperledger.cacti.plugin.cacti.plugin.copm.core.AssetPledgeV1PB assetPledgeV1PB = 1;
   */
  assetPledgeV1PB?: AssetPledgeV1PB;

  constructor(data?: PartialMessage<PledgeAssetV1Request>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.PledgeAssetV1Request";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "assetPledgeV1PB", kind: "message", T: AssetPledgeV1PB },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PledgeAssetV1Request {
    return new PledgeAssetV1Request().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PledgeAssetV1Request {
    return new PledgeAssetV1Request().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): PledgeAssetV1Request {
    return new PledgeAssetV1Request().fromJsonString(jsonString, options);
  }

  static equals(a: PledgeAssetV1Request | PlainMessage<PledgeAssetV1Request> | undefined, b: PledgeAssetV1Request | PlainMessage<PledgeAssetV1Request> | undefined): boolean {
    return proto3.util.equals(PledgeAssetV1Request, a, b);
  }
}

