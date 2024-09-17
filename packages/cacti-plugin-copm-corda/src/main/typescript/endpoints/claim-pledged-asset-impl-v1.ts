import { Logger } from "@hyperledger/cactus-common";
import {
  ClaimPledgedAssetV1Request,
  Interfaces as CopmIF,
  Validators,
} from "@hyperledger-cacti/cacti-copm-core";
import { CordaConfiguration } from "../lib/corda-configuration";

export async function claimPledgedAssetV1Impl(
  req: ClaimPledgedAssetV1Request,
  log: Logger,
  contextFactory: CopmIF.DLTransactionContextFactory,
  cordaConfig: CordaConfiguration,
  contractName: string,
): Promise<string> {
  const data = new Validators.ValidatedClaimPledgedAssetRequest(req);

  const remoteContext = await contextFactory.getRemoteTransactionContext(
    data.destAccount,
    data.sourceNetwork,
  );
  const pledgeString = remoteContext.invoke({
    contract: contractName,
    method: "GetAssetPledgeStatus",
    args: [
      data.pledgeId,
      data.sourceCert,
      data.destAccount.organization,
      data.destCert,
    ],
  });

  const context = await contextFactory.getTransactionContext(data.destAccount);

  /*
                      val claimArgs: AssetClaimParameters = AssetClaimParameters(
                        pledgeId, // @property pledgeId
                        createAssetStateCommand, // @property createAssetStateCommand
                        pledgeStatusLinearId, // @property pledgeStatusLinearId
                        getAssetAndContractIdFlowName, // @property getAssetAndContractIdFlowName
                        tokenType, // @property assetType
                        numUnits, // @property assetIdOrQuantity
                        pledgerCert, // @property pledgerCert
                        recipientCert, // @property recipientCert
                        issuer, // @property issuer
                        observers // @property observers
                    )

*/
  /* 
                    val claimArgs: AssetClaimParameters = AssetClaimParameters(
                        pledgeId, // @property pledgeId
                        createAssetStateCommand, // @property createAssetStateCommand
                        pledgeStatusLinearId, // @property pledgeStatusLinearId
                        getAssetAndContractIdFlowName, // @property getAssetAndContractIdFlowName
                        assetType, // @property assetType
                        assetId, // @property assetIdOrQuantity
                        pledgerCert, // @property pledgerCert
                        recipientCert, // @property recipientCert
                        issuer, // @property issuer
                        observers // @property observers
                    )
*/

  const cordaCmds = cordaConfig.getAssetCmds(data.asset);
  const claimId = context.invoke({
    contract: contractName,
    method: "AssetTransferClaim",
    args: [
      data.pledgeId,
      cordaCmds.add,
      pledgeString,
      cordaCmds.ref,
      data.asset.assetType,
      data.asset.idOrQuantity(),
      data.sourceCert,
      data.destCert,
      cordaConfig.getIssuer(data.asset),
      cordaConfig.getObservers(),
    ],
  });

  log.debug("claim pledged asset complete");
  return claimId;
}
