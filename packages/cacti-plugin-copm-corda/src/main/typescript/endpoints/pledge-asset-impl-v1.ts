import { Logger } from "@hyperledger/cactus-common";
import {
  PledgeAssetV1Request,
  Validators,
  Interfaces as CopmIF,
} from "@hyperledger/cacti-copm-core";
import { CordaConfiguration } from "../lib/corda-configuration";

export async function pledgeAssetV1Impl(
  req: PledgeAssetV1Request,
  log: Logger,
  contextFactory: CopmIF.DLTransactionContextFactory,
  cordaConfig: CordaConfiguration,
  contractName: string,
): Promise<string> {
  const params = Validators.validatePledgeAssetRequest(req);

  const transactionContext = await contextFactory.getTransactionContext(
    params.source,
  );

  const assetCmds = cordaConfig.getAssetCmds(params.asset);
  const pledgeId = await transactionContext.invoke({
    contract: contractName,
    method: "PledgeAsset",
    args: [
      params.asset.assetType,
      params.asset.idOrQuantity(),
      params.source.organization,
      params.destinationNetwork,
      params.destinationCertificate,
      (Math.floor(Date.now() / 1000) + params.expirySecs).toString(),
      assetCmds.ref,
      assetCmds.del,
      cordaConfig.getIssuer(params.asset),
      cordaConfig.getObservers(),
    ],
  });

  return pledgeId;
}
