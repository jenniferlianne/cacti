/*
Hyperledger Cacti Plugin - Connector Sawtooth

Can perform basic tasks on a Sawtooth ledger

API version: 2.1.0
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-sawtooth

import (
	"encoding/json"
)

// checks if the WatchBlocksV1Options type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &WatchBlocksV1Options{}

// WatchBlocksV1Options struct for WatchBlocksV1Options
type WatchBlocksV1Options struct {
	Type *WatchBlocksV1ListenerType `json:"type,omitempty"`
	TxFilterBy *WatchBlocksV1TransactionFilter `json:"txFilterBy,omitempty"`
}

// NewWatchBlocksV1Options instantiates a new WatchBlocksV1Options object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewWatchBlocksV1Options() *WatchBlocksV1Options {
	this := WatchBlocksV1Options{}
	return &this
}

// NewWatchBlocksV1OptionsWithDefaults instantiates a new WatchBlocksV1Options object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewWatchBlocksV1OptionsWithDefaults() *WatchBlocksV1Options {
	this := WatchBlocksV1Options{}
	return &this
}

// GetType returns the Type field value if set, zero value otherwise.
func (o *WatchBlocksV1Options) GetType() WatchBlocksV1ListenerType {
	if o == nil || IsNil(o.Type) {
		var ret WatchBlocksV1ListenerType
		return ret
	}
	return *o.Type
}

// GetTypeOk returns a tuple with the Type field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *WatchBlocksV1Options) GetTypeOk() (*WatchBlocksV1ListenerType, bool) {
	if o == nil || IsNil(o.Type) {
		return nil, false
	}
	return o.Type, true
}

// HasType returns a boolean if a field has been set.
func (o *WatchBlocksV1Options) HasType() bool {
	if o != nil && !IsNil(o.Type) {
		return true
	}

	return false
}

// SetType gets a reference to the given WatchBlocksV1ListenerType and assigns it to the Type field.
func (o *WatchBlocksV1Options) SetType(v WatchBlocksV1ListenerType) {
	o.Type = &v
}

// GetTxFilterBy returns the TxFilterBy field value if set, zero value otherwise.
func (o *WatchBlocksV1Options) GetTxFilterBy() WatchBlocksV1TransactionFilter {
	if o == nil || IsNil(o.TxFilterBy) {
		var ret WatchBlocksV1TransactionFilter
		return ret
	}
	return *o.TxFilterBy
}

// GetTxFilterByOk returns a tuple with the TxFilterBy field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *WatchBlocksV1Options) GetTxFilterByOk() (*WatchBlocksV1TransactionFilter, bool) {
	if o == nil || IsNil(o.TxFilterBy) {
		return nil, false
	}
	return o.TxFilterBy, true
}

// HasTxFilterBy returns a boolean if a field has been set.
func (o *WatchBlocksV1Options) HasTxFilterBy() bool {
	if o != nil && !IsNil(o.TxFilterBy) {
		return true
	}

	return false
}

// SetTxFilterBy gets a reference to the given WatchBlocksV1TransactionFilter and assigns it to the TxFilterBy field.
func (o *WatchBlocksV1Options) SetTxFilterBy(v WatchBlocksV1TransactionFilter) {
	o.TxFilterBy = &v
}

func (o WatchBlocksV1Options) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o WatchBlocksV1Options) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	if !IsNil(o.Type) {
		toSerialize["type"] = o.Type
	}
	if !IsNil(o.TxFilterBy) {
		toSerialize["txFilterBy"] = o.TxFilterBy
	}
	return toSerialize, nil
}

type NullableWatchBlocksV1Options struct {
	value *WatchBlocksV1Options
	isSet bool
}

func (v NullableWatchBlocksV1Options) Get() *WatchBlocksV1Options {
	return v.value
}

func (v *NullableWatchBlocksV1Options) Set(val *WatchBlocksV1Options) {
	v.value = val
	v.isSet = true
}

func (v NullableWatchBlocksV1Options) IsSet() bool {
	return v.isSet
}

func (v *NullableWatchBlocksV1Options) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableWatchBlocksV1Options(val *WatchBlocksV1Options) *NullableWatchBlocksV1Options {
	return &NullableWatchBlocksV1Options{value: val, isSet: true}
}

func (v NullableWatchBlocksV1Options) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableWatchBlocksV1Options) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


