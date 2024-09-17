//
//Hyperledger Cacti Plugin - Common Operator Primitives
//
//Contains/describes the Hyperledger Cacti Common Operator Primitives plugin.  These primitives require specific chaincode and weaver relays to be deployed on the network as described at https://hyperledger-cacti.github.io/cacti/weaver/introduction/.
//
//The version of the OpenAPI document: 2.0.0
//
//Generated by OpenAPI Generator: https://openapi-generator.tech

// @generated by protoc-gen-es v1.8.0 with parameter "target=ts"
// @generated from file models/get_verified_view_v1_request_pb.proto (package org.hyperledger.cacti.plugin.copm.core, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { AssetAccountV1PB } from "./asset_account_v1_pb_pb.js";
import { ViewV1PB } from "./view_v1_pb_pb.js";

/**
 * @generated from message org.hyperledger.cacti.plugin.copm.core.GetVerifiedViewV1RequestPB
 */
export class GetVerifiedViewV1RequestPB extends Message<GetVerifiedViewV1RequestPB> {
  /**
   * @generated from field: org.hyperledger.cacti.plugin.copm.core.AssetAccountV1PB account = 103577045;
   */
  account?: AssetAccountV1PB;

  /**
   * @generated from field: org.hyperledger.cacti.plugin.copm.core.ViewV1PB view = 3619493;
   */
  view?: ViewV1PB;

  constructor(data?: PartialMessage<GetVerifiedViewV1RequestPB>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "org.hyperledger.cacti.plugin.copm.core.GetVerifiedViewV1RequestPB";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 103577045, name: "account", kind: "message", T: AssetAccountV1PB },
    { no: 3619493, name: "view", kind: "message", T: ViewV1PB },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetVerifiedViewV1RequestPB {
    return new GetVerifiedViewV1RequestPB().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetVerifiedViewV1RequestPB {
    return new GetVerifiedViewV1RequestPB().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetVerifiedViewV1RequestPB {
    return new GetVerifiedViewV1RequestPB().fromJsonString(jsonString, options);
  }

  static equals(a: GetVerifiedViewV1RequestPB | PlainMessage<GetVerifiedViewV1RequestPB> | undefined, b: GetVerifiedViewV1RequestPB | PlainMessage<GetVerifiedViewV1RequestPB> | undefined): boolean {
    return proto3.util.equals(GetVerifiedViewV1RequestPB, a, b);
  }
}

