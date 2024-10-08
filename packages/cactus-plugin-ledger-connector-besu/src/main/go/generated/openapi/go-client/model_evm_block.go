/*
Hyperledger Cactus Plugin - Connector Besu

Can perform basic tasks on a Besu ledger

API version: 2.0.0-rc.7
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-besu

import (
	"encoding/json"
)

// checks if the EvmBlock type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &EvmBlock{}

// EvmBlock struct for EvmBlock
type EvmBlock struct {
	Number *float32 `json:"number,omitempty"`
	Hash *string `json:"hash,omitempty"`
	ParentHash *string `json:"parentHash,omitempty"`
	Nonce *string `json:"nonce,omitempty"`
	Sha3Uncles *string `json:"sha3Uncles,omitempty"`
	LogsBloom *string `json:"logsBloom,omitempty"`
	TransactionsRoot *string `json:"transactionsRoot,omitempty"`
	StateRoot *string `json:"stateRoot,omitempty"`
	Miner *string `json:"miner,omitempty"`
	Difficulty *float32 `json:"difficulty,omitempty"`
	TotalDifficulty *float32 `json:"totalDifficulty,omitempty"`
	ExtraData *string `json:"extraData,omitempty"`
	Size *float32 `json:"size,omitempty"`
	GasLimit *float32 `json:"gasLimit,omitempty"`
	GasUsed *float32 `json:"gasUsed,omitempty"`
	Timestamp interface{} `json:"timestamp,omitempty"`
	Transactions []interface{} `json:"transactions,omitempty"`
	Uncles []interface{} `json:"uncles,omitempty"`
}

// NewEvmBlock instantiates a new EvmBlock object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewEvmBlock() *EvmBlock {
	this := EvmBlock{}
	return &this
}

// NewEvmBlockWithDefaults instantiates a new EvmBlock object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewEvmBlockWithDefaults() *EvmBlock {
	this := EvmBlock{}
	return &this
}

// GetNumber returns the Number field value if set, zero value otherwise.
func (o *EvmBlock) GetNumber() float32 {
	if o == nil || IsNil(o.Number) {
		var ret float32
		return ret
	}
	return *o.Number
}

// GetNumberOk returns a tuple with the Number field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetNumberOk() (*float32, bool) {
	if o == nil || IsNil(o.Number) {
		return nil, false
	}
	return o.Number, true
}

// HasNumber returns a boolean if a field has been set.
func (o *EvmBlock) HasNumber() bool {
	if o != nil && !IsNil(o.Number) {
		return true
	}

	return false
}

// SetNumber gets a reference to the given float32 and assigns it to the Number field.
func (o *EvmBlock) SetNumber(v float32) {
	o.Number = &v
}

// GetHash returns the Hash field value if set, zero value otherwise.
func (o *EvmBlock) GetHash() string {
	if o == nil || IsNil(o.Hash) {
		var ret string
		return ret
	}
	return *o.Hash
}

// GetHashOk returns a tuple with the Hash field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetHashOk() (*string, bool) {
	if o == nil || IsNil(o.Hash) {
		return nil, false
	}
	return o.Hash, true
}

// HasHash returns a boolean if a field has been set.
func (o *EvmBlock) HasHash() bool {
	if o != nil && !IsNil(o.Hash) {
		return true
	}

	return false
}

// SetHash gets a reference to the given string and assigns it to the Hash field.
func (o *EvmBlock) SetHash(v string) {
	o.Hash = &v
}

// GetParentHash returns the ParentHash field value if set, zero value otherwise.
func (o *EvmBlock) GetParentHash() string {
	if o == nil || IsNil(o.ParentHash) {
		var ret string
		return ret
	}
	return *o.ParentHash
}

// GetParentHashOk returns a tuple with the ParentHash field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetParentHashOk() (*string, bool) {
	if o == nil || IsNil(o.ParentHash) {
		return nil, false
	}
	return o.ParentHash, true
}

// HasParentHash returns a boolean if a field has been set.
func (o *EvmBlock) HasParentHash() bool {
	if o != nil && !IsNil(o.ParentHash) {
		return true
	}

	return false
}

// SetParentHash gets a reference to the given string and assigns it to the ParentHash field.
func (o *EvmBlock) SetParentHash(v string) {
	o.ParentHash = &v
}

// GetNonce returns the Nonce field value if set, zero value otherwise.
func (o *EvmBlock) GetNonce() string {
	if o == nil || IsNil(o.Nonce) {
		var ret string
		return ret
	}
	return *o.Nonce
}

// GetNonceOk returns a tuple with the Nonce field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetNonceOk() (*string, bool) {
	if o == nil || IsNil(o.Nonce) {
		return nil, false
	}
	return o.Nonce, true
}

// HasNonce returns a boolean if a field has been set.
func (o *EvmBlock) HasNonce() bool {
	if o != nil && !IsNil(o.Nonce) {
		return true
	}

	return false
}

// SetNonce gets a reference to the given string and assigns it to the Nonce field.
func (o *EvmBlock) SetNonce(v string) {
	o.Nonce = &v
}

// GetSha3Uncles returns the Sha3Uncles field value if set, zero value otherwise.
func (o *EvmBlock) GetSha3Uncles() string {
	if o == nil || IsNil(o.Sha3Uncles) {
		var ret string
		return ret
	}
	return *o.Sha3Uncles
}

// GetSha3UnclesOk returns a tuple with the Sha3Uncles field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetSha3UnclesOk() (*string, bool) {
	if o == nil || IsNil(o.Sha3Uncles) {
		return nil, false
	}
	return o.Sha3Uncles, true
}

// HasSha3Uncles returns a boolean if a field has been set.
func (o *EvmBlock) HasSha3Uncles() bool {
	if o != nil && !IsNil(o.Sha3Uncles) {
		return true
	}

	return false
}

// SetSha3Uncles gets a reference to the given string and assigns it to the Sha3Uncles field.
func (o *EvmBlock) SetSha3Uncles(v string) {
	o.Sha3Uncles = &v
}

// GetLogsBloom returns the LogsBloom field value if set, zero value otherwise.
func (o *EvmBlock) GetLogsBloom() string {
	if o == nil || IsNil(o.LogsBloom) {
		var ret string
		return ret
	}
	return *o.LogsBloom
}

// GetLogsBloomOk returns a tuple with the LogsBloom field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetLogsBloomOk() (*string, bool) {
	if o == nil || IsNil(o.LogsBloom) {
		return nil, false
	}
	return o.LogsBloom, true
}

// HasLogsBloom returns a boolean if a field has been set.
func (o *EvmBlock) HasLogsBloom() bool {
	if o != nil && !IsNil(o.LogsBloom) {
		return true
	}

	return false
}

// SetLogsBloom gets a reference to the given string and assigns it to the LogsBloom field.
func (o *EvmBlock) SetLogsBloom(v string) {
	o.LogsBloom = &v
}

// GetTransactionsRoot returns the TransactionsRoot field value if set, zero value otherwise.
func (o *EvmBlock) GetTransactionsRoot() string {
	if o == nil || IsNil(o.TransactionsRoot) {
		var ret string
		return ret
	}
	return *o.TransactionsRoot
}

// GetTransactionsRootOk returns a tuple with the TransactionsRoot field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetTransactionsRootOk() (*string, bool) {
	if o == nil || IsNil(o.TransactionsRoot) {
		return nil, false
	}
	return o.TransactionsRoot, true
}

// HasTransactionsRoot returns a boolean if a field has been set.
func (o *EvmBlock) HasTransactionsRoot() bool {
	if o != nil && !IsNil(o.TransactionsRoot) {
		return true
	}

	return false
}

// SetTransactionsRoot gets a reference to the given string and assigns it to the TransactionsRoot field.
func (o *EvmBlock) SetTransactionsRoot(v string) {
	o.TransactionsRoot = &v
}

// GetStateRoot returns the StateRoot field value if set, zero value otherwise.
func (o *EvmBlock) GetStateRoot() string {
	if o == nil || IsNil(o.StateRoot) {
		var ret string
		return ret
	}
	return *o.StateRoot
}

// GetStateRootOk returns a tuple with the StateRoot field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetStateRootOk() (*string, bool) {
	if o == nil || IsNil(o.StateRoot) {
		return nil, false
	}
	return o.StateRoot, true
}

// HasStateRoot returns a boolean if a field has been set.
func (o *EvmBlock) HasStateRoot() bool {
	if o != nil && !IsNil(o.StateRoot) {
		return true
	}

	return false
}

// SetStateRoot gets a reference to the given string and assigns it to the StateRoot field.
func (o *EvmBlock) SetStateRoot(v string) {
	o.StateRoot = &v
}

// GetMiner returns the Miner field value if set, zero value otherwise.
func (o *EvmBlock) GetMiner() string {
	if o == nil || IsNil(o.Miner) {
		var ret string
		return ret
	}
	return *o.Miner
}

// GetMinerOk returns a tuple with the Miner field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetMinerOk() (*string, bool) {
	if o == nil || IsNil(o.Miner) {
		return nil, false
	}
	return o.Miner, true
}

// HasMiner returns a boolean if a field has been set.
func (o *EvmBlock) HasMiner() bool {
	if o != nil && !IsNil(o.Miner) {
		return true
	}

	return false
}

// SetMiner gets a reference to the given string and assigns it to the Miner field.
func (o *EvmBlock) SetMiner(v string) {
	o.Miner = &v
}

// GetDifficulty returns the Difficulty field value if set, zero value otherwise.
func (o *EvmBlock) GetDifficulty() float32 {
	if o == nil || IsNil(o.Difficulty) {
		var ret float32
		return ret
	}
	return *o.Difficulty
}

// GetDifficultyOk returns a tuple with the Difficulty field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetDifficultyOk() (*float32, bool) {
	if o == nil || IsNil(o.Difficulty) {
		return nil, false
	}
	return o.Difficulty, true
}

// HasDifficulty returns a boolean if a field has been set.
func (o *EvmBlock) HasDifficulty() bool {
	if o != nil && !IsNil(o.Difficulty) {
		return true
	}

	return false
}

// SetDifficulty gets a reference to the given float32 and assigns it to the Difficulty field.
func (o *EvmBlock) SetDifficulty(v float32) {
	o.Difficulty = &v
}

// GetTotalDifficulty returns the TotalDifficulty field value if set, zero value otherwise.
func (o *EvmBlock) GetTotalDifficulty() float32 {
	if o == nil || IsNil(o.TotalDifficulty) {
		var ret float32
		return ret
	}
	return *o.TotalDifficulty
}

// GetTotalDifficultyOk returns a tuple with the TotalDifficulty field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetTotalDifficultyOk() (*float32, bool) {
	if o == nil || IsNil(o.TotalDifficulty) {
		return nil, false
	}
	return o.TotalDifficulty, true
}

// HasTotalDifficulty returns a boolean if a field has been set.
func (o *EvmBlock) HasTotalDifficulty() bool {
	if o != nil && !IsNil(o.TotalDifficulty) {
		return true
	}

	return false
}

// SetTotalDifficulty gets a reference to the given float32 and assigns it to the TotalDifficulty field.
func (o *EvmBlock) SetTotalDifficulty(v float32) {
	o.TotalDifficulty = &v
}

// GetExtraData returns the ExtraData field value if set, zero value otherwise.
func (o *EvmBlock) GetExtraData() string {
	if o == nil || IsNil(o.ExtraData) {
		var ret string
		return ret
	}
	return *o.ExtraData
}

// GetExtraDataOk returns a tuple with the ExtraData field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetExtraDataOk() (*string, bool) {
	if o == nil || IsNil(o.ExtraData) {
		return nil, false
	}
	return o.ExtraData, true
}

// HasExtraData returns a boolean if a field has been set.
func (o *EvmBlock) HasExtraData() bool {
	if o != nil && !IsNil(o.ExtraData) {
		return true
	}

	return false
}

// SetExtraData gets a reference to the given string and assigns it to the ExtraData field.
func (o *EvmBlock) SetExtraData(v string) {
	o.ExtraData = &v
}

// GetSize returns the Size field value if set, zero value otherwise.
func (o *EvmBlock) GetSize() float32 {
	if o == nil || IsNil(o.Size) {
		var ret float32
		return ret
	}
	return *o.Size
}

// GetSizeOk returns a tuple with the Size field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetSizeOk() (*float32, bool) {
	if o == nil || IsNil(o.Size) {
		return nil, false
	}
	return o.Size, true
}

// HasSize returns a boolean if a field has been set.
func (o *EvmBlock) HasSize() bool {
	if o != nil && !IsNil(o.Size) {
		return true
	}

	return false
}

// SetSize gets a reference to the given float32 and assigns it to the Size field.
func (o *EvmBlock) SetSize(v float32) {
	o.Size = &v
}

// GetGasLimit returns the GasLimit field value if set, zero value otherwise.
func (o *EvmBlock) GetGasLimit() float32 {
	if o == nil || IsNil(o.GasLimit) {
		var ret float32
		return ret
	}
	return *o.GasLimit
}

// GetGasLimitOk returns a tuple with the GasLimit field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetGasLimitOk() (*float32, bool) {
	if o == nil || IsNil(o.GasLimit) {
		return nil, false
	}
	return o.GasLimit, true
}

// HasGasLimit returns a boolean if a field has been set.
func (o *EvmBlock) HasGasLimit() bool {
	if o != nil && !IsNil(o.GasLimit) {
		return true
	}

	return false
}

// SetGasLimit gets a reference to the given float32 and assigns it to the GasLimit field.
func (o *EvmBlock) SetGasLimit(v float32) {
	o.GasLimit = &v
}

// GetGasUsed returns the GasUsed field value if set, zero value otherwise.
func (o *EvmBlock) GetGasUsed() float32 {
	if o == nil || IsNil(o.GasUsed) {
		var ret float32
		return ret
	}
	return *o.GasUsed
}

// GetGasUsedOk returns a tuple with the GasUsed field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetGasUsedOk() (*float32, bool) {
	if o == nil || IsNil(o.GasUsed) {
		return nil, false
	}
	return o.GasUsed, true
}

// HasGasUsed returns a boolean if a field has been set.
func (o *EvmBlock) HasGasUsed() bool {
	if o != nil && !IsNil(o.GasUsed) {
		return true
	}

	return false
}

// SetGasUsed gets a reference to the given float32 and assigns it to the GasUsed field.
func (o *EvmBlock) SetGasUsed(v float32) {
	o.GasUsed = &v
}

// GetTimestamp returns the Timestamp field value if set, zero value otherwise (both if not set or set to explicit null).
func (o *EvmBlock) GetTimestamp() interface{} {
	if o == nil {
		var ret interface{}
		return ret
	}
	return o.Timestamp
}

// GetTimestampOk returns a tuple with the Timestamp field value if set, nil otherwise
// and a boolean to check if the value has been set.
// NOTE: If the value is an explicit nil, `nil, true` will be returned
func (o *EvmBlock) GetTimestampOk() (*interface{}, bool) {
	if o == nil || IsNil(o.Timestamp) {
		return nil, false
	}
	return &o.Timestamp, true
}

// HasTimestamp returns a boolean if a field has been set.
func (o *EvmBlock) HasTimestamp() bool {
	if o != nil && IsNil(o.Timestamp) {
		return true
	}

	return false
}

// SetTimestamp gets a reference to the given interface{} and assigns it to the Timestamp field.
func (o *EvmBlock) SetTimestamp(v interface{}) {
	o.Timestamp = v
}

// GetTransactions returns the Transactions field value if set, zero value otherwise.
func (o *EvmBlock) GetTransactions() []interface{} {
	if o == nil || IsNil(o.Transactions) {
		var ret []interface{}
		return ret
	}
	return o.Transactions
}

// GetTransactionsOk returns a tuple with the Transactions field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetTransactionsOk() ([]interface{}, bool) {
	if o == nil || IsNil(o.Transactions) {
		return nil, false
	}
	return o.Transactions, true
}

// HasTransactions returns a boolean if a field has been set.
func (o *EvmBlock) HasTransactions() bool {
	if o != nil && !IsNil(o.Transactions) {
		return true
	}

	return false
}

// SetTransactions gets a reference to the given []interface{} and assigns it to the Transactions field.
func (o *EvmBlock) SetTransactions(v []interface{}) {
	o.Transactions = v
}

// GetUncles returns the Uncles field value if set, zero value otherwise.
func (o *EvmBlock) GetUncles() []interface{} {
	if o == nil || IsNil(o.Uncles) {
		var ret []interface{}
		return ret
	}
	return o.Uncles
}

// GetUnclesOk returns a tuple with the Uncles field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *EvmBlock) GetUnclesOk() ([]interface{}, bool) {
	if o == nil || IsNil(o.Uncles) {
		return nil, false
	}
	return o.Uncles, true
}

// HasUncles returns a boolean if a field has been set.
func (o *EvmBlock) HasUncles() bool {
	if o != nil && !IsNil(o.Uncles) {
		return true
	}

	return false
}

// SetUncles gets a reference to the given []interface{} and assigns it to the Uncles field.
func (o *EvmBlock) SetUncles(v []interface{}) {
	o.Uncles = v
}

func (o EvmBlock) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o EvmBlock) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	if !IsNil(o.Number) {
		toSerialize["number"] = o.Number
	}
	if !IsNil(o.Hash) {
		toSerialize["hash"] = o.Hash
	}
	if !IsNil(o.ParentHash) {
		toSerialize["parentHash"] = o.ParentHash
	}
	if !IsNil(o.Nonce) {
		toSerialize["nonce"] = o.Nonce
	}
	if !IsNil(o.Sha3Uncles) {
		toSerialize["sha3Uncles"] = o.Sha3Uncles
	}
	if !IsNil(o.LogsBloom) {
		toSerialize["logsBloom"] = o.LogsBloom
	}
	if !IsNil(o.TransactionsRoot) {
		toSerialize["transactionsRoot"] = o.TransactionsRoot
	}
	if !IsNil(o.StateRoot) {
		toSerialize["stateRoot"] = o.StateRoot
	}
	if !IsNil(o.Miner) {
		toSerialize["miner"] = o.Miner
	}
	if !IsNil(o.Difficulty) {
		toSerialize["difficulty"] = o.Difficulty
	}
	if !IsNil(o.TotalDifficulty) {
		toSerialize["totalDifficulty"] = o.TotalDifficulty
	}
	if !IsNil(o.ExtraData) {
		toSerialize["extraData"] = o.ExtraData
	}
	if !IsNil(o.Size) {
		toSerialize["size"] = o.Size
	}
	if !IsNil(o.GasLimit) {
		toSerialize["gasLimit"] = o.GasLimit
	}
	if !IsNil(o.GasUsed) {
		toSerialize["gasUsed"] = o.GasUsed
	}
	if o.Timestamp != nil {
		toSerialize["timestamp"] = o.Timestamp
	}
	if !IsNil(o.Transactions) {
		toSerialize["transactions"] = o.Transactions
	}
	if !IsNil(o.Uncles) {
		toSerialize["uncles"] = o.Uncles
	}
	return toSerialize, nil
}

type NullableEvmBlock struct {
	value *EvmBlock
	isSet bool
}

func (v NullableEvmBlock) Get() *EvmBlock {
	return v.value
}

func (v *NullableEvmBlock) Set(val *EvmBlock) {
	v.value = val
	v.isSet = true
}

func (v NullableEvmBlock) IsSet() bool {
	return v.isSet
}

func (v *NullableEvmBlock) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableEvmBlock(val *EvmBlock) *NullableEvmBlock {
	return &NullableEvmBlock{value: val, isSet: true}
}

func (v NullableEvmBlock) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableEvmBlock) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}

