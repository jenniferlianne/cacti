/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

package main

import (
	"errors"
	"fmt"
	"os"

	wutils "github.com/hyperledger/cacti/weaver/core/network/fabric-interop-cc/libs/utils/v2"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	log "github.com/sirupsen/logrus"
)

const e2eConfidentialityKey = "e2eConfidentialityFlag"

// SmartContract provides functions for managing arbitrary key-value pairs
type SmartContract struct {
	contractapi.Contract
}

func init() {
	if os.Getenv("FABRIC_INTEROP_CC_MODE") == "production" {
		log.SetLevel(log.InfoLevel)
	} else {
		log.SetLevel(log.DebugLevel)
	}
	log.SetOutput(os.Stdout)
}

// InitLedger initilises ledger with data. Need the application chaincode id so the handleExtnernalRequest flow can
// call the application chaincode.
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	var err error
	var confFlag string

	_, args := ctx.GetStub().GetFunctionAndParameters()

	if len(args) > 1 {
		confFlag = "true"
	} else {
		confFlag = "false"
	}
	err = ctx.GetStub().PutState(e2eConfidentialityKey, []byte(confFlag))
	if err != nil {
		errMsg := fmt.Sprintf("Error saving E2E-Confidentiality Flag: %s", err.Error())
		fmt.Printf(errMsg)
		return errors.New(errMsg)
	}

	// Infer local chaincode ID
	localCCId, err := wutils.GetLocalChaincodeID(ctx.GetStub())
	if err != nil {
		errMsg := fmt.Sprintf("Error getting this chaincode's ID: %s", err.Error())
		fmt.Printf(errMsg)
		return errors.New(errMsg)
	}
	// Record local chaincode ID for lookup during asset lock management
	err = ctx.GetStub().PutState(wutils.GetLocalChaincodeIDKey(), []byte(localCCId))
	if err != nil {
		errMsg := fmt.Sprintf("Error saving this chaincode's ID: %s", err.Error())
		fmt.Printf(errMsg)
		return errors.New(errMsg)
	}
	// This is the Interop chaincode; record its ID for lookup during asset lock management
	err = ctx.GetStub().PutState(wutils.GetInteropChaincodeIDKey(), []byte(localCCId))
	if err != nil {
		errMsg := fmt.Sprintf("Error saving this chaincode's ID: %s", err.Error())
		fmt.Printf(errMsg)
		return errors.New(errMsg)
	}

	return nil
}

//----------------------------------------------------------------------------------------
// start functions from weaver simplestate
//----------------------------------------------------------------------------------------

// CreateAndReturnKey adds a new entry with the specified key and value, and returns the key
func (s *SmartContract) CreateAndReturnKey(ctx contractapi.TransactionContextInterface, key string, value string) (string, error) {
	bytes := []byte(value)
	fmt.Printf("CreateAndReturnKey called. Key: %s Value: %s\n", key, value)

	err := ctx.GetStub().PutState(key, bytes)
	if err != nil {
		return "", err
	}
	return key, nil
}

// Create adds a new entry with the specified key and value
func (s *SmartContract) Create(ctx contractapi.TransactionContextInterface, key string, value string) error {
	bytes := []byte(value)
	fmt.Printf("Create called. Key: %s Value: %s\n", key, value)

	err := ctx.GetStub().PutState(key, bytes)
	if err != nil {
		return err
	} else {
		err = ctx.GetStub().SetEvent("CreateSimpleState", []byte(key))
		if err != nil {
			fmt.Printf("Unable to set 'CreateSimpleState' event: %+v\n", err)
		}
	}
	return nil
}

// Read returns the value of the entry with the specified key
func (s *SmartContract) Read(ctx contractapi.TransactionContextInterface, key string) (string, error) {
	bytes, err := ctx.GetStub().GetState(key)

	if err != nil {
		return "", fmt.Errorf("Failed to read key '%s' from world state. %s", key, err.Error())
	}

	value := string(bytes)
	return value, nil
}

// Update updates the value of the entry with specified key, using the given value
func (s *SmartContract) Update(ctx contractapi.TransactionContextInterface, key string, value string) error {
	_, err := ctx.GetStub().GetState(key)

	if err != nil {
		return fmt.Errorf("Failed to read key '%s' from world state. %s", key, err.Error())
	}

	bytes := []byte(value)
	return ctx.GetStub().PutState(key, bytes)
}

// Delete deletes the entry with the specified key
func (s *SmartContract) Delete(ctx contractapi.TransactionContextInterface, key string) error {
	return ctx.GetStub().DelState(key)
}

// ----------------------------------------------------------------------------------------
// end functions from weaver simplestate
// ----------------------------------------------------------------------------------------

func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error creating Interop chaincode: %s", err.Error())
		return
	}

	_, ok := os.LookupEnv("EXTERNAL_SERVICE")
	if ok {
		server := &shim.ChaincodeServer{
			CCID:    os.Getenv("CHAINCODE_CCID"),
			Address: os.Getenv("CHAINCODE_ADDRESS"),
			CC:      chaincode,
			TLSProps: shim.TLSProperties{
				Disabled: true,
			},
		}
		// Start the chaincode external server
		err = server.Start()
	} else {
		err = chaincode.Start()
	}
	if err != nil {
		fmt.Printf("Error starting Interop chaincode: %s", err)
	}

}
