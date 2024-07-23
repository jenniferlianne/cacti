//
//Hyperledger Cacti Plugin - Common Operator Primitives
//
//Contains/describes the Hyperledger Cacti Common Operator Primitives plugin.
//
//The version of the OpenAPI document: 2.0.0-rc.2
//
//Generated by OpenAPI Generator: https://openapi-generator.tech

// @generated by protoc-gen-es v1.8.0 with parameter "target=ts"
// @generated from file models/asset_pledge_v1_pb.proto (package org.hyperledger.cacti.plugin.cacti.plugin.copm.fabric, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";
import { AssetAccountV1PB } from "./asset_account_v1_pb_pb.js";
import { TransferrableAssetV1PB } from "./transferrable_asset_v1_pb_pb.js";

/**
 * @generated from message org.hyperledger.cacti.plugin.cacti.plugin.copm.fabric.AssetPledgeV1PB
 */
export class AssetPledgeV1PB extends Message<AssetPledgeV1PB> {
  /**
   * @generated from field: org.hyperledger.cacti.plugin.cacti.plugin.copm.fabric.AssetAccountV1PB source = 359634918;
   */
  source?: AssetAccountV1PB;

  /**
   * @generated from field: org.hyperledger.cacti.plugin.cacti.plugin.copm.fabric.AssetAccountV1PB destination = 356105204;
   */
  destination?: AssetAccountV1PB;

  /**
   * @generated from field: org.hyperledger.cacti.plugin.cacti.plugin.copm.fabric.TransferrableAssetV1PB asset = 93121264;
   */
  asset?: TransferrableAssetV1PB;

  /**
   * @generated from field: int64 expiry_secs = 476369358;
   */
  expirySecs = protoInt64.zero;

  /**
   * @generated from field: string destination_certificate = 101302555;
   */
  destinationCertificate = "";

  constructor(data?: PartialMessage<AssetPledgeV1PB>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "org.hyperledger.cacti.plugin.cacti.plugin.copm.fabric.AssetPledgeV1PB";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 359634918, name: "source", kind: "message", T: AssetAccountV1PB },
    { no: 356105204, name: "destination", kind: "message", T: AssetAccountV1PB },
    { no: 93121264, name: "asset", kind: "message", T: TransferrableAssetV1PB },
    { no: 476369358, name: "expiry_secs", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 101302555, name: "destination_certificate", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AssetPledgeV1PB {
    return new AssetPledgeV1PB().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AssetPledgeV1PB {
    return new AssetPledgeV1PB().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AssetPledgeV1PB {
    return new AssetPledgeV1PB().fromJsonString(jsonString, options);
  }

  static equals(a: AssetPledgeV1PB | PlainMessage<AssetPledgeV1PB> | undefined, b: AssetPledgeV1PB | PlainMessage<AssetPledgeV1PB> | undefined): boolean {
    return proto3.util.equals(AssetPledgeV1PB, a, b);
  }
}

