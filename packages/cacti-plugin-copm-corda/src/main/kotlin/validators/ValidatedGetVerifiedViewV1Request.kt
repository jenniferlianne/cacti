package com.copmCorda.validators

import com.copmCorda.types.DLAccount
import com.copmCorda.types.DLTransactionParams
import com.copmCorda.server.validators.validateAccount
import com.copmCorda.server.validators.validateRequiredString
import com.copmCorda.server.validators.validateViewRequest
import org.hyperledger.cacti.plugin.cacti.plugin.copm.core.services.defaultservice.DefaultServiceOuterClass

class ValidatedGetVerifiedViewV1Request(val account : DLAccount, val cmd : DLTransactionParams, val remoteNetwork: String) {
   constructor(request: DefaultServiceOuterClass.GetVerifiedViewV1Request) : this (
       validateAccount(request.getVerifiedViewV1RequestPB.account, "account"),
       validateViewRequest(request.getVerifiedViewV1RequestPB.view?.viewAddress, "view.viewAddress"),
       validateRequiredString(request.getVerifiedViewV1RequestPB.view.network, "view.network"))
   {
   }
}