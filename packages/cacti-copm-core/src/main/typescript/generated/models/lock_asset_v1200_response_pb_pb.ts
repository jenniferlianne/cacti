//
//Hyperledger Cacti Plugin - Common Operator Primitives
//
//Contains/describes the Hyperledger Cacti Common Operator Primitives plugin.  These primitives require specific chaincode and weaver relays to be deployed on the network as described at https://hyperledger-cacti.github.io/cacti/weaver/introduction/.
//
//The version of the OpenAPI document: 2.0.0
//
//Generated by OpenAPI Generator: https://openapi-generator.tech

// @generated by protoc-gen-es v1.8.0 with parameter "target=ts"
// @generated from file models/lock_asset_v1200_response_pb.proto (package org.hyperledger.cacti.plugin.copm.core, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message org.hyperledger.cacti.plugin.copm.core.LockAssetV1200ResponsePB
 */
export class LockAssetV1200ResponsePB extends Message<LockAssetV1200ResponsePB> {
  /**
   * @generated from field: string lock_id = 1;
   */
  lockId = "";

  constructor(data?: PartialMessage<LockAssetV1200ResponsePB>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "org.hyperledger.cacti.plugin.copm.core.LockAssetV1200ResponsePB";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "lock_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): LockAssetV1200ResponsePB {
    return new LockAssetV1200ResponsePB().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): LockAssetV1200ResponsePB {
    return new LockAssetV1200ResponsePB().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): LockAssetV1200ResponsePB {
    return new LockAssetV1200ResponsePB().fromJsonString(jsonString, options);
  }

  static equals(a: LockAssetV1200ResponsePB | PlainMessage<LockAssetV1200ResponsePB> | undefined, b: LockAssetV1200ResponsePB | PlainMessage<LockAssetV1200ResponsePB> | undefined): boolean {
    return proto3.util.equals(LockAssetV1200ResponsePB, a, b);
  }
}

