//
//Hyperledger Cacti Plugin - Common Operator Primitives
//
//Contains/describes the Hyperledger Cacti Common Operator Primitives plugin.
//
//The version of the OpenAPI document: 2.0.0-rc.2
//
//Generated by OpenAPI Generator: https://openapi-generator.tech

// @generated by protoc-gen-es v1.8.0 with parameter "target=ts"
// @generated from file models/verification_policy_v1_pb.proto (package org.hyperledger.cacti.plugin.cacti.plugin.copm.fabric, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { VerificationRuleV1PB } from "./verification_rule_v1_pb_pb.js";

/**
 * @generated from message org.hyperledger.cacti.plugin.cacti.plugin.copm.fabric.VerificationPolicyV1PB
 */
export class VerificationPolicyV1PB extends Message<VerificationPolicyV1PB> {
  /**
   * @generated from field: string security_domain = 364425893;
   */
  securityDomain = "";

  /**
   * @generated from field: repeated org.hyperledger.cacti.plugin.cacti.plugin.copm.fabric.VerificationRuleV1PB rules = 108873975;
   */
  rules: VerificationRuleV1PB[] = [];

  constructor(data?: PartialMessage<VerificationPolicyV1PB>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "org.hyperledger.cacti.plugin.cacti.plugin.copm.fabric.VerificationPolicyV1PB";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 364425893, name: "security_domain", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 108873975, name: "rules", kind: "message", T: VerificationRuleV1PB, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): VerificationPolicyV1PB {
    return new VerificationPolicyV1PB().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): VerificationPolicyV1PB {
    return new VerificationPolicyV1PB().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): VerificationPolicyV1PB {
    return new VerificationPolicyV1PB().fromJsonString(jsonString, options);
  }

  static equals(a: VerificationPolicyV1PB | PlainMessage<VerificationPolicyV1PB> | undefined, b: VerificationPolicyV1PB | PlainMessage<VerificationPolicyV1PB> | undefined): boolean {
    return proto3.util.equals(VerificationPolicyV1PB, a, b);
  }
}

