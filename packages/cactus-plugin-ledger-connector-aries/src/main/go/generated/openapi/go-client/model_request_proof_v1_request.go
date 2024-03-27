/*
Hyperledger Cacti Plugin - Connector Aries

Can communicate with other Aries agents and Cacti Aries connectors

API version: 2.0.0-rc.3
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-aries

import (
	"encoding/json"
)

// checks if the RequestProofV1Request type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &RequestProofV1Request{}

// RequestProofV1Request Request for RequestProof endpoint.
type RequestProofV1Request struct {
	// Aries label of an agent to be used to connect using URL
	AgentName string `json:"agentName"`
	// Peer connection ID from which we want to request a proof.
	ConnectionId string `json:"connectionId"`
	ProofAttributes []CactiProofRequestAttributeV1 `json:"proofAttributes"`
}

// NewRequestProofV1Request instantiates a new RequestProofV1Request object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewRequestProofV1Request(agentName string, connectionId string, proofAttributes []CactiProofRequestAttributeV1) *RequestProofV1Request {
	this := RequestProofV1Request{}
	this.AgentName = agentName
	this.ConnectionId = connectionId
	this.ProofAttributes = proofAttributes
	return &this
}

// NewRequestProofV1RequestWithDefaults instantiates a new RequestProofV1Request object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewRequestProofV1RequestWithDefaults() *RequestProofV1Request {
	this := RequestProofV1Request{}
	return &this
}

// GetAgentName returns the AgentName field value
func (o *RequestProofV1Request) GetAgentName() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.AgentName
}

// GetAgentNameOk returns a tuple with the AgentName field value
// and a boolean to check if the value has been set.
func (o *RequestProofV1Request) GetAgentNameOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.AgentName, true
}

// SetAgentName sets field value
func (o *RequestProofV1Request) SetAgentName(v string) {
	o.AgentName = v
}

// GetConnectionId returns the ConnectionId field value
func (o *RequestProofV1Request) GetConnectionId() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.ConnectionId
}

// GetConnectionIdOk returns a tuple with the ConnectionId field value
// and a boolean to check if the value has been set.
func (o *RequestProofV1Request) GetConnectionIdOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.ConnectionId, true
}

// SetConnectionId sets field value
func (o *RequestProofV1Request) SetConnectionId(v string) {
	o.ConnectionId = v
}

// GetProofAttributes returns the ProofAttributes field value
func (o *RequestProofV1Request) GetProofAttributes() []CactiProofRequestAttributeV1 {
	if o == nil {
		var ret []CactiProofRequestAttributeV1
		return ret
	}

	return o.ProofAttributes
}

// GetProofAttributesOk returns a tuple with the ProofAttributes field value
// and a boolean to check if the value has been set.
func (o *RequestProofV1Request) GetProofAttributesOk() ([]CactiProofRequestAttributeV1, bool) {
	if o == nil {
		return nil, false
	}
	return o.ProofAttributes, true
}

// SetProofAttributes sets field value
func (o *RequestProofV1Request) SetProofAttributes(v []CactiProofRequestAttributeV1) {
	o.ProofAttributes = v
}

func (o RequestProofV1Request) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o RequestProofV1Request) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["agentName"] = o.AgentName
	toSerialize["connectionId"] = o.ConnectionId
	toSerialize["proofAttributes"] = o.ProofAttributes
	return toSerialize, nil
}

type NullableRequestProofV1Request struct {
	value *RequestProofV1Request
	isSet bool
}

func (v NullableRequestProofV1Request) Get() *RequestProofV1Request {
	return v.value
}

func (v *NullableRequestProofV1Request) Set(val *RequestProofV1Request) {
	v.value = val
	v.isSet = true
}

func (v NullableRequestProofV1Request) IsSet() bool {
	return v.isSet
}

func (v *NullableRequestProofV1Request) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableRequestProofV1Request(val *RequestProofV1Request) *NullableRequestProofV1Request {
	return &NullableRequestProofV1Request{value: val, isSet: true}
}

func (v NullableRequestProofV1Request) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableRequestProofV1Request) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}

