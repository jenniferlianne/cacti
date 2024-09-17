import { JvmObject } from "@hyperledger/cactus-plugin-ledger-connector-corda";
import {
  createJvmCordaX500Name,
  createJvmString,
} from "@hyperledger/cactus-plugin-ledger-connector-corda";

export interface JvmSerializable {
  toJvmObject(): JvmObject;
}

export class CommandData implements JvmSerializable {
  clazz: string;
  constructor(clazz: string) {
    this.clazz = clazz;
  }

  public toJvmObject(): JvmObject {
    return {
      jvmTypeKind: "REFERENCE",
      jvmType: {
        fqClassName: this.clazz,
      },
      jvmCtorArgs: [],
    };
  }
}
export class CordaSerializablePB implements JvmSerializable {
  clazz: string;
  data: Uint8Array;
  serializer: string | undefined;

  constructor(data: Uint8Array, clazz: string, serializer: string | undefined) {
    this.clazz = clazz;
    this.data = data;
    this.serializer = serializer;
  }

  public toJvmObject(): JvmObject {
    //if (this.serializer) {
    //  return this.serializerObj();
    //} else {
      return this.mainClassObj();
    //}
  }

  private serializerObj(): JvmObject {
    if (!this.serializer) {
      throw Error("no serializer defined");
    }
    return {
      jvmTypeKind: "REFERENCE",
      jvmType: {
        fqClassName: this.serializer + "$Proxy",
        constructorName: "toProxy",
        invocationTarget: {
          jvmTypeKind: "REFERENCE",
          jvmType: {
            fqClassName: this.serializer,
          },
        },
      },
      jvmCtorArgs: [this.mainClassObj()],
    };
  }

  private mainClassObj(): JvmObject {
    return {
      jvmTypeKind: "REFERENCE",
      jvmType: {
        fqClassName: this.clazz,
        constructorName: "parseFrom",
      },
      jvmCtorArgs: [this.byteStringObj()],
    };
  }

  private byteStringObj(): JvmObject {
    return {
      jvmTypeKind: "REFERENCE",
      jvmType: {
        fqClassName: "com.google.protobuf.ByteString",
        constructorName: "fromHex",
      },
      jvmCtorArgs: [
        createJvmString({ data: Buffer.from(this.data).toString("hex") }),
      ],
    };
  }
}

export class CordaParty implements JvmSerializable {
  organization: string;
  locality: string;
  country: string;

  constructor(fullName: string) {
    const parts = fullName.split(",");
    let locality: string = "",
      org: string = "",
      country: string = "";
    for (const part of parts) {
      const [partType, value] = part.trim().split("=");
      switch (partType) {
        case "L":
          locality = value;
          break;
        case "O":
          org = value;
          break;
        case "C":
          country = value;
          break;
        default:
          throw Error(`Corda party unknown value ${part}`);
      }
    }
    this.locality = locality;
    this.country = country;
    this.organization = org;
  }

  public toString(): string {
    return `O=${this.organization}, L=${this.locality}, C=${this.country}`;
  }

  public toJvmObject(): JvmObject {
    return createJvmCordaX500Name({
      country: this.country,
      locality: this.locality,
      organisation: this.organization,
    });
  }
}

export type AssetCommands = {
  ref: string;
  add: string;
  update: string;
  del: CommandData;
};
