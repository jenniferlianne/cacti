import { PledgeAssetV1Request } from "../generated/services/default_service_pb.js";
import { Logger } from "@hyperledger/cactus-common";
import { fabricHelper } from "../../../../../../weaver/samples/fabric/fabric-cli/src/helpers/fabric-functions";
import { getUserCertFromFile } from "../../../../../../weaver/samples/fabric/fabric-cli/src/helpers/helpers";
import { FabricSettings } from "../lib/utils"

export async function pledgeAssetV1Impl(
  req: PledgeAssetV1Request,
  log: Logger,
  fabricSettings: FabricSettings
): Promise<string> {
  /*
  const currentQuery = {
    channel: fabricSettings.channelName,
    contractName: fabricSettings.contractName,
    ccFunc: "",
    args: [],
  };

  const sourceNetwork = req.assetPledgeV1PB?.source?.network
    ? req.assetPledgeV1PB.source.network
    : "unknown-network";
  const destNetwork = req.assetPledgeV1PB?.destination?.network
    ? req.assetPledgeV1PB.source.network
    : "unknown-network";
  const destUser = req.assetPledgeV1PB?.destination?.userId
    ? req.assetPledgeV1PB.destination.userId
    : "unknown-user";

  const { gateway, contract, wallet } = await fabricHelper({
    channel: fabricSettings.channelName,
    contractName: fabricSettings.contractName,
    connProfilePath: fabricSettings.connProfilePath,
    networkName: sourceNetwork,
    mspId: global.__DEFAULT_MSPID__,
    userString: req.assetPledgeV1PB?.source?.userId,
    registerUser: false,
  });
  const recipientCert = getUserCertFromFile(destUser, destNetwork);
  const expirationTime = Math.floor(
    Date.now() / 1000 + req.assetPledgeV1PB?.expirySecs,
  ).toString();
  const ccType = req.assetPledgeV1PB?.asset?.assetType;
  if (ccType == "bond") {
    currentQuery.ccFunc = "PledgeAsset";
    currentQuery.args = [
      ...currentQuery.args,
      ccType,
      req.assetPledgeV1PB?.asset?.assetId,
      req.assetPledgeV1PB?.destination?.network,
      recipientCert,
      expirationTime,
    ];
  } else if (ccType == "token") {
    currentQuery.ccFunc = "PledgeTokenAsset";
    currentQuery.args = [
      ...currentQuery.args,
      ccType,
      "" + req.assetPledgeV1PB?.asset?.assetQuantity,
      req.assetPledgeV1PB?.destination?.network,
      recipientCert,
      expirationTime,
    ];
  } else {
    throw new Error(`Unrecognized/unsupported asset category: ${ccType}`);
  }
  log.debug(currentQuery);
  */
  try {
    /*
    const read = await contract.submitTransaction(
      currentQuery.ccFunc,
      ...currentQuery.args,
    );
    const state = Buffer.from(read).toString();
    if (state) {
      log.debug(`Response From Network: ${state}`);
    } else {
      log.debug("No Response from network");
    }

    // Disconnect from the gateway.
    await gateway.disconnect();
 */    
    return "mypledgeid";
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    throw new Error(error);
  }
}
