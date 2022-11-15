#if !CAMPAIGN_TYPES
#define CAMPAIGN_TYPES

type campaign_id = string
type existence = nat
type price = nat
type stock = price * existence
type reward_id = string

type integration_id = string
type tokens = nat

type metadata = (string, bytes) big_map

type token_metadata = (nat, (nat * (string, bytes)  map)) big_map

type reward = reward_id * stock 

type integration = {
    name: string;
    provider: string;
    active: bool;
}

type campaign = {
    name: string;
    deadline: timestamp;
    created: timestamp;
    integrations: (integration_id, tokens) map;
    metadata_url: string;
    owner: address;
}

type base_campaign = {
    campaign_id: campaign_id;
    name: string;
    deadline: timestamp;
    integrations: (integration_id, tokens) map;
    metadata_url: string;
}

type update_integrations = {
    campaign_id: campaign_id;
    integrations: (integration_id, tokens) map;
} 

type update_deadline = {
    campaign_id: campaign_id;
    deadline: timestamp;
} 

type redemption = {
    campaign: campaign_id;
    integration: integration_id;
    earned: nat;
    proof: string; 
    spender: address;
}

type redeem = {
    campaign: campaign_id;
    integration: integration_id;
}

type redeemed = {
    earned: nat;
    proof: string;
    claimed: bool;
}

#endif