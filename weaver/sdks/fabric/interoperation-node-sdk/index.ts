/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * This is the main module for the "fabric-interop-client" package.
 */

// Using this module to host the couple of "typedef" sections used by api.js
// because jsdoc3 generator seems to not able to find them in the api.js module
// likely due to that module containing multiple classes

import * as  RelayHelper from "./src/Relay";
import * as InteroperableHelper from "./src/InteroperableHelper";
import * as  AssetManager  from "./src/AssetManager";
import * as SatpAssetManager  from "./src/SatpAssetManager";
import * as  HashFunctions  from "./src/HashFunctions";
import * as EventsManager  from "./src/EventsManager";
import * as MembershipManager from "./src/MembershipManager";
export { RelayHelper, InteroperableHelper, AssetManager, SatpAssetManager, HashFunctions, EventsManager, MembershipManager };