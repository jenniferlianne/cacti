/*
Hyperledger Cacti Plugin - Connector Aries

Can communicate with other Aries agents and Cacti Aries connectors

API version: 2.1.0
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-aries

import (
	"encoding/json"
	"fmt"
)

// WatchConnectionStateV1 Websocket requests for monitoring connection change events.
type WatchConnectionStateV1 string

// List of WatchConnectionStateV1
const (
	Subscribe WatchConnectionStateV1 = "org.hyperledger.cactus.api.async.hlaries.WatchConnectionStateV1.Subscribe"
	Next WatchConnectionStateV1 = "org.hyperledger.cactus.api.async.hlaries.WatchConnectionStateV1.Next"
	Unsubscribe WatchConnectionStateV1 = "org.hyperledger.cactus.api.async.hlaries.WatchConnectionStateV1.Unsubscribe"
	Error WatchConnectionStateV1 = "org.hyperledger.cactus.api.async.hlaries.WatchConnectionStateV1.Error"
	Complete WatchConnectionStateV1 = "org.hyperledger.cactus.api.async.hlaries.WatchConnectionStateV1.Complete"
)

// All allowed values of WatchConnectionStateV1 enum
var AllowedWatchConnectionStateV1EnumValues = []WatchConnectionStateV1{
	"org.hyperledger.cactus.api.async.hlaries.WatchConnectionStateV1.Subscribe",
	"org.hyperledger.cactus.api.async.hlaries.WatchConnectionStateV1.Next",
	"org.hyperledger.cactus.api.async.hlaries.WatchConnectionStateV1.Unsubscribe",
	"org.hyperledger.cactus.api.async.hlaries.WatchConnectionStateV1.Error",
	"org.hyperledger.cactus.api.async.hlaries.WatchConnectionStateV1.Complete",
}

func (v *WatchConnectionStateV1) UnmarshalJSON(src []byte) error {
	var value string
	err := json.Unmarshal(src, &value)
	if err != nil {
		return err
	}
	enumTypeValue := WatchConnectionStateV1(value)
	for _, existing := range AllowedWatchConnectionStateV1EnumValues {
		if existing == enumTypeValue {
			*v = enumTypeValue
			return nil
		}
	}

	return fmt.Errorf("%+v is not a valid WatchConnectionStateV1", value)
}

// NewWatchConnectionStateV1FromValue returns a pointer to a valid WatchConnectionStateV1
// for the value passed as argument, or an error if the value passed is not allowed by the enum
func NewWatchConnectionStateV1FromValue(v string) (*WatchConnectionStateV1, error) {
	ev := WatchConnectionStateV1(v)
	if ev.IsValid() {
		return &ev, nil
	} else {
		return nil, fmt.Errorf("invalid value '%v' for WatchConnectionStateV1: valid values are %v", v, AllowedWatchConnectionStateV1EnumValues)
	}
}

// IsValid return true if the value is valid for the enum, false otherwise
func (v WatchConnectionStateV1) IsValid() bool {
	for _, existing := range AllowedWatchConnectionStateV1EnumValues {
		if existing == v {
			return true
		}
	}
	return false
}

// Ptr returns reference to WatchConnectionStateV1 value
func (v WatchConnectionStateV1) Ptr() *WatchConnectionStateV1 {
	return &v
}

type NullableWatchConnectionStateV1 struct {
	value *WatchConnectionStateV1
	isSet bool
}

func (v NullableWatchConnectionStateV1) Get() *WatchConnectionStateV1 {
	return v.value
}

func (v *NullableWatchConnectionStateV1) Set(val *WatchConnectionStateV1) {
	v.value = val
	v.isSet = true
}

func (v NullableWatchConnectionStateV1) IsSet() bool {
	return v.isSet
}

func (v *NullableWatchConnectionStateV1) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableWatchConnectionStateV1(val *WatchConnectionStateV1) *NullableWatchConnectionStateV1 {
	return &NullableWatchConnectionStateV1{value: val, isSet: true}
}

func (v NullableWatchConnectionStateV1) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableWatchConnectionStateV1) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}

