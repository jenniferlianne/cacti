// source: msp/identities.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = (function() {
  if (this) { return this; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  if (typeof self !== 'undefined') { return self; }
  return Function('return this')();
}.call(null));

goog.exportSymbol('proto.msp.SerializedIdemixIdentity', null, global);
goog.exportSymbol('proto.msp.SerializedIdentity', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.msp.SerializedIdentity = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.msp.SerializedIdentity, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.msp.SerializedIdentity.displayName = 'proto.msp.SerializedIdentity';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.msp.SerializedIdemixIdentity = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.msp.SerializedIdemixIdentity, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.msp.SerializedIdemixIdentity.displayName = 'proto.msp.SerializedIdemixIdentity';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.msp.SerializedIdentity.prototype.toObject = function(opt_includeInstance) {
  return proto.msp.SerializedIdentity.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.msp.SerializedIdentity} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msp.SerializedIdentity.toObject = function(includeInstance, msg) {
  var f, obj = {
    mspid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    idBytes: msg.getIdBytes_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.msp.SerializedIdentity}
 */
proto.msp.SerializedIdentity.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.msp.SerializedIdentity;
  return proto.msp.SerializedIdentity.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.msp.SerializedIdentity} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.msp.SerializedIdentity}
 */
proto.msp.SerializedIdentity.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setMspid(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setIdBytes(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.msp.SerializedIdentity.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.msp.SerializedIdentity.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.msp.SerializedIdentity} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msp.SerializedIdentity.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMspid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getIdBytes_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
};


/**
 * optional string mspid = 1;
 * @return {string}
 */
proto.msp.SerializedIdentity.prototype.getMspid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.msp.SerializedIdentity} returns this
 */
proto.msp.SerializedIdentity.prototype.setMspid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bytes id_bytes = 2;
 * @return {!(string|Uint8Array)}
 */
proto.msp.SerializedIdentity.prototype.getIdBytes = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes id_bytes = 2;
 * This is a type-conversion wrapper around `getIdBytes()`
 * @return {string}
 */
proto.msp.SerializedIdentity.prototype.getIdBytes_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getIdBytes()));
};


/**
 * optional bytes id_bytes = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getIdBytes()`
 * @return {!Uint8Array}
 */
proto.msp.SerializedIdentity.prototype.getIdBytes_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getIdBytes()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.msp.SerializedIdentity} returns this
 */
proto.msp.SerializedIdentity.prototype.setIdBytes = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.msp.SerializedIdemixIdentity.prototype.toObject = function(opt_includeInstance) {
  return proto.msp.SerializedIdemixIdentity.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.msp.SerializedIdemixIdentity} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msp.SerializedIdemixIdentity.toObject = function(includeInstance, msg) {
  var f, obj = {
    nymX: msg.getNymX_asB64(),
    nymY: msg.getNymY_asB64(),
    ou: msg.getOu_asB64(),
    role: msg.getRole_asB64(),
    proof: msg.getProof_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.msp.SerializedIdemixIdentity}
 */
proto.msp.SerializedIdemixIdentity.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.msp.SerializedIdemixIdentity;
  return proto.msp.SerializedIdemixIdentity.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.msp.SerializedIdemixIdentity} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.msp.SerializedIdemixIdentity}
 */
proto.msp.SerializedIdemixIdentity.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setNymX(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setNymY(value);
      break;
    case 3:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setOu(value);
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setRole(value);
      break;
    case 5:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setProof(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.msp.SerializedIdemixIdentity.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.msp.SerializedIdemixIdentity.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.msp.SerializedIdemixIdentity} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msp.SerializedIdemixIdentity.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getNymX_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getNymY_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getOu_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      3,
      f
    );
  }
  f = message.getRole_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      4,
      f
    );
  }
  f = message.getProof_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      5,
      f
    );
  }
};


/**
 * optional bytes nym_x = 1;
 * @return {!(string|Uint8Array)}
 */
proto.msp.SerializedIdemixIdentity.prototype.getNymX = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes nym_x = 1;
 * This is a type-conversion wrapper around `getNymX()`
 * @return {string}
 */
proto.msp.SerializedIdemixIdentity.prototype.getNymX_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getNymX()));
};


/**
 * optional bytes nym_x = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getNymX()`
 * @return {!Uint8Array}
 */
proto.msp.SerializedIdemixIdentity.prototype.getNymX_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getNymX()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.msp.SerializedIdemixIdentity} returns this
 */
proto.msp.SerializedIdemixIdentity.prototype.setNymX = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional bytes nym_y = 2;
 * @return {!(string|Uint8Array)}
 */
proto.msp.SerializedIdemixIdentity.prototype.getNymY = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes nym_y = 2;
 * This is a type-conversion wrapper around `getNymY()`
 * @return {string}
 */
proto.msp.SerializedIdemixIdentity.prototype.getNymY_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getNymY()));
};


/**
 * optional bytes nym_y = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getNymY()`
 * @return {!Uint8Array}
 */
proto.msp.SerializedIdemixIdentity.prototype.getNymY_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getNymY()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.msp.SerializedIdemixIdentity} returns this
 */
proto.msp.SerializedIdemixIdentity.prototype.setNymY = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * optional bytes ou = 3;
 * @return {!(string|Uint8Array)}
 */
proto.msp.SerializedIdemixIdentity.prototype.getOu = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * optional bytes ou = 3;
 * This is a type-conversion wrapper around `getOu()`
 * @return {string}
 */
proto.msp.SerializedIdemixIdentity.prototype.getOu_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getOu()));
};


/**
 * optional bytes ou = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getOu()`
 * @return {!Uint8Array}
 */
proto.msp.SerializedIdemixIdentity.prototype.getOu_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getOu()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.msp.SerializedIdemixIdentity} returns this
 */
proto.msp.SerializedIdemixIdentity.prototype.setOu = function(value) {
  return jspb.Message.setProto3BytesField(this, 3, value);
};


/**
 * optional bytes role = 4;
 * @return {!(string|Uint8Array)}
 */
proto.msp.SerializedIdemixIdentity.prototype.getRole = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * optional bytes role = 4;
 * This is a type-conversion wrapper around `getRole()`
 * @return {string}
 */
proto.msp.SerializedIdemixIdentity.prototype.getRole_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getRole()));
};


/**
 * optional bytes role = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getRole()`
 * @return {!Uint8Array}
 */
proto.msp.SerializedIdemixIdentity.prototype.getRole_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getRole()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.msp.SerializedIdemixIdentity} returns this
 */
proto.msp.SerializedIdemixIdentity.prototype.setRole = function(value) {
  return jspb.Message.setProto3BytesField(this, 4, value);
};


/**
 * optional bytes proof = 5;
 * @return {!(string|Uint8Array)}
 */
proto.msp.SerializedIdemixIdentity.prototype.getProof = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * optional bytes proof = 5;
 * This is a type-conversion wrapper around `getProof()`
 * @return {string}
 */
proto.msp.SerializedIdemixIdentity.prototype.getProof_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getProof()));
};


/**
 * optional bytes proof = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getProof()`
 * @return {!Uint8Array}
 */
proto.msp.SerializedIdemixIdentity.prototype.getProof_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getProof()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.msp.SerializedIdemixIdentity} returns this
 */
proto.msp.SerializedIdemixIdentity.prototype.setProof = function(value) {
  return jspb.Message.setProto3BytesField(this, 5, value);
};


goog.object.extend(exports, proto.msp);
