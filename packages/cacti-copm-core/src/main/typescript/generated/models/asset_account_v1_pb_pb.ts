//
//Hyperledger Cacti Plugin - Common Operator Primitives
//
//Contains/describes the Hyperledger Cacti Common Operator Primitives plugin.  These primitives require specific chaincode and weaver relays to be deployed on the network as described at https://hyperledger-cacti.github.io/cacti/weaver/introduction/.
//
//The version of the OpenAPI document: 2.0.0
//
//Generated by OpenAPI Generator: https://openapi-generator.tech

// @generated by protoc-gen-es v1.8.0 with parameter "target=ts"
// @generated from file models/asset_account_v1_pb.proto (package org.hyperledger.cacti.plugin.copm.core, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message org.hyperledger.cacti.plugin.copm.core.AssetAccountV1PB
 */
export class AssetAccountV1PB extends Message<AssetAccountV1PB> {
  /**
   * @generated from field: string network = 1;
   */
  network = "";

  /**
   * @generated from field: string user_id = 2;
   */
  userId = "";

  constructor(data?: PartialMessage<AssetAccountV1PB>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "org.hyperledger.cacti.plugin.copm.core.AssetAccountV1PB";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "network", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "user_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AssetAccountV1PB {
    return new AssetAccountV1PB().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AssetAccountV1PB {
    return new AssetAccountV1PB().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AssetAccountV1PB {
    return new AssetAccountV1PB().fromJsonString(jsonString, options);
  }

  static equals(a: AssetAccountV1PB | PlainMessage<AssetAccountV1PB> | undefined, b: AssetAccountV1PB | PlainMessage<AssetAccountV1PB> | undefined): boolean {
    return proto3.util.equals(AssetAccountV1PB, a, b);
  }
}

