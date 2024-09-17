import { Logger } from "@hyperledger/cactus-common";
import { AssetManager } from "@hyperledger/cacti-weaver-sdk-fabric";
import {
  DLTransactionParams,
  Validators,
  ClaimLockedAssetV1Request,
  Interfaces as CopmIF,
} from "@hyperledger-cacti/cacti-copm-core";
import { CordaConfiguration } from "../lib/corda-configuration";

export async function claimLockedAssetV1Impl(
  req: ClaimLockedAssetV1Request,
  log: Logger,
  contextFactory: CopmIF.DLTransactionContextFactory,
  cordaConfig: CordaConfiguration,
  contractName: string,
): Promise<string> {
  const params = Validators.validateClaimLockedAssetRequest(req);
  const claimInfoStr = AssetManager.createAssetClaimInfoSerialized(
    params.hashInfo,
  );

  const assetCmds = cordaConfig.getAssetCmds(params.asset);

  const transactionContext = await contextFactory.getTransactionContext(
    params.destination,
  );

  //proxy.startFlow(::ClaimAsset, contractId, claimInfo, createAssetStateCommand, updateAssetStateOwnerFlow, issuer, observers)

  const claimId = await transactionContext.invoke({
    contract: contractName,
    method: "ClaimAsset",
    args: [
      params.lockId,
      claimInfoStr,
      assetCmds.add,
      assetCmds.update,
      cordaConfig.getIssuer(params.asset),
      cordaConfig.getObservers(),
    ],
  });

  log.debug("claim complete");
  return claimId;
}
