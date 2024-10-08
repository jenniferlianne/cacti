/*
Hyperledger Cacti Plugin - Connector CDL

Can perform basic tasks on Fujitsu CDL service.

API version: 2.0.0-rc.7
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-cdl

import (
	"encoding/json"
	"fmt"
)

// AuthInfoV1 - struct for AuthInfoV1
type AuthInfoV1 struct {
	AuthInfoAccessTokenV1 *AuthInfoAccessTokenV1
	AuthInfoSubscriptionKeyV1 *AuthInfoSubscriptionKeyV1
}

// AuthInfoAccessTokenV1AsAuthInfoV1 is a convenience function that returns AuthInfoAccessTokenV1 wrapped in AuthInfoV1
func AuthInfoAccessTokenV1AsAuthInfoV1(v *AuthInfoAccessTokenV1) AuthInfoV1 {
	return AuthInfoV1{
		AuthInfoAccessTokenV1: v,
	}
}

// AuthInfoSubscriptionKeyV1AsAuthInfoV1 is a convenience function that returns AuthInfoSubscriptionKeyV1 wrapped in AuthInfoV1
func AuthInfoSubscriptionKeyV1AsAuthInfoV1(v *AuthInfoSubscriptionKeyV1) AuthInfoV1 {
	return AuthInfoV1{
		AuthInfoSubscriptionKeyV1: v,
	}
}


// Unmarshal JSON data into one of the pointers in the struct
func (dst *AuthInfoV1) UnmarshalJSON(data []byte) error {
	var err error
	match := 0
	// try to unmarshal data into AuthInfoAccessTokenV1
	err = newStrictDecoder(data).Decode(&dst.AuthInfoAccessTokenV1)
	if err == nil {
		jsonAuthInfoAccessTokenV1, _ := json.Marshal(dst.AuthInfoAccessTokenV1)
		if string(jsonAuthInfoAccessTokenV1) == "{}" { // empty struct
			dst.AuthInfoAccessTokenV1 = nil
		} else {
			match++
		}
	} else {
		dst.AuthInfoAccessTokenV1 = nil
	}

	// try to unmarshal data into AuthInfoSubscriptionKeyV1
	err = newStrictDecoder(data).Decode(&dst.AuthInfoSubscriptionKeyV1)
	if err == nil {
		jsonAuthInfoSubscriptionKeyV1, _ := json.Marshal(dst.AuthInfoSubscriptionKeyV1)
		if string(jsonAuthInfoSubscriptionKeyV1) == "{}" { // empty struct
			dst.AuthInfoSubscriptionKeyV1 = nil
		} else {
			match++
		}
	} else {
		dst.AuthInfoSubscriptionKeyV1 = nil
	}

	if match > 1 { // more than 1 match
		// reset to nil
		dst.AuthInfoAccessTokenV1 = nil
		dst.AuthInfoSubscriptionKeyV1 = nil

		return fmt.Errorf("data matches more than one schema in oneOf(AuthInfoV1)")
	} else if match == 1 {
		return nil // exactly one match
	} else { // no match
		return fmt.Errorf("data failed to match schemas in oneOf(AuthInfoV1)")
	}
}

// Marshal data from the first non-nil pointers in the struct to JSON
func (src AuthInfoV1) MarshalJSON() ([]byte, error) {
	if src.AuthInfoAccessTokenV1 != nil {
		return json.Marshal(&src.AuthInfoAccessTokenV1)
	}

	if src.AuthInfoSubscriptionKeyV1 != nil {
		return json.Marshal(&src.AuthInfoSubscriptionKeyV1)
	}

	return nil, nil // no data in oneOf schemas
}

// Get the actual instance
func (obj *AuthInfoV1) GetActualInstance() (interface{}) {
	if obj == nil {
		return nil
	}
	if obj.AuthInfoAccessTokenV1 != nil {
		return obj.AuthInfoAccessTokenV1
	}

	if obj.AuthInfoSubscriptionKeyV1 != nil {
		return obj.AuthInfoSubscriptionKeyV1
	}

	// all schemas are nil
	return nil
}

type NullableAuthInfoV1 struct {
	value *AuthInfoV1
	isSet bool
}

func (v NullableAuthInfoV1) Get() *AuthInfoV1 {
	return v.value
}

func (v *NullableAuthInfoV1) Set(val *AuthInfoV1) {
	v.value = val
	v.isSet = true
}

func (v NullableAuthInfoV1) IsSet() bool {
	return v.isSet
}

func (v *NullableAuthInfoV1) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableAuthInfoV1(val *AuthInfoV1) *NullableAuthInfoV1 {
	return &NullableAuthInfoV1{value: val, isSet: true}
}

func (v NullableAuthInfoV1) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableAuthInfoV1) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}

