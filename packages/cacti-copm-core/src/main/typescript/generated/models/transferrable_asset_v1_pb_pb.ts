//
//Hyperledger Cacti Plugin - Common Operator Primitives
//
//Contains/describes the Hyperledger Cacti Common Operator Primitives plugin.
//
//The version of the OpenAPI document: 2.0.0-rc.2
//
//Generated by OpenAPI Generator: https://openapi-generator.tech

// @generated by protoc-gen-es v1.8.0 with parameter "target=ts"
// @generated from file models/transferrable_asset_v1_pb.proto (package org.hyperledger.cacti.plugin.cacti.plugin.copm.core, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message org.hyperledger.cacti.plugin.cacti.plugin.copm.core.TransferrableAssetV1PB
 */
export class TransferrableAssetV1PB extends Message<TransferrableAssetV1PB> {
  /**
   * @generated from field: string asset_type = 519156524;
   */
  assetType = "";

  /**
   * encoded description of NFT
   *
   * @generated from field: string asset_id = 373202742;
   */
  assetId = "";

  /**
   * @generated from field: int32 asset_quantity = 386005244;
   */
  assetQuantity = 0;

  constructor(data?: PartialMessage<TransferrableAssetV1PB>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "org.hyperledger.cacti.plugin.cacti.plugin.copm.core.TransferrableAssetV1PB";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 519156524, name: "asset_type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 373202742, name: "asset_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 386005244, name: "asset_quantity", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): TransferrableAssetV1PB {
    return new TransferrableAssetV1PB().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): TransferrableAssetV1PB {
    return new TransferrableAssetV1PB().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): TransferrableAssetV1PB {
    return new TransferrableAssetV1PB().fromJsonString(jsonString, options);
  }

  static equals(a: TransferrableAssetV1PB | PlainMessage<TransferrableAssetV1PB> | undefined, b: TransferrableAssetV1PB | PlainMessage<TransferrableAssetV1PB> | undefined): boolean {
    return proto3.util.equals(TransferrableAssetV1PB, a, b);
  }
}

