//
//Hyperledger Cacti Plugin - Common Operator Primitives
//
//Contains/describes the Hyperledger Cacti Common Operator Primitives plugin.
//
//The version of the OpenAPI document: 2.0.0-rc.2
//
//Generated by OpenAPI Generator: https://openapi-generator.tech

// @generated by protoc-gen-es v1.8.0 with parameter "target=ts"
// @generated from file models/state_proof_v1_pb.proto (package org.hyperledger.cacti.plugin.cacti.plugin.copm.fabric, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { AssetAccountV1PB } from "./asset_account_v1_pb_pb.js";
import { ViewAddressV1PB } from "./view_address_v1_pb_pb.js";

/**
 * @generated from message org.hyperledger.cacti.plugin.cacti.plugin.copm.fabric.StateProofV1PB
 */
export class StateProofV1PB extends Message<StateProofV1PB> {
  /**
   * @generated from field: org.hyperledger.cacti.plugin.cacti.plugin.copm.fabric.AssetAccountV1PB user = 3599307;
   */
  user?: AssetAccountV1PB;

  /**
   * @generated from field: org.hyperledger.cacti.plugin.cacti.plugin.copm.fabric.ViewAddressV1PB view_address = 312477787;
   */
  viewAddress?: ViewAddressV1PB;

  constructor(data?: PartialMessage<StateProofV1PB>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "org.hyperledger.cacti.plugin.cacti.plugin.copm.fabric.StateProofV1PB";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 3599307, name: "user", kind: "message", T: AssetAccountV1PB },
    { no: 312477787, name: "view_address", kind: "message", T: ViewAddressV1PB },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): StateProofV1PB {
    return new StateProofV1PB().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): StateProofV1PB {
    return new StateProofV1PB().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): StateProofV1PB {
    return new StateProofV1PB().fromJsonString(jsonString, options);
  }

  static equals(a: StateProofV1PB | PlainMessage<StateProofV1PB> | undefined, b: StateProofV1PB | PlainMessage<StateProofV1PB> | undefined): boolean {
    return proto3.util.equals(StateProofV1PB, a, b);
  }
}

