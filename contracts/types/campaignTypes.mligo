type campaign_id = string
type integration_id = string
type tokens = nat

type integration = {
    name: string;
    provider: string;
    active: bool;
}

type campaign = {
    name: string;
    deadline: timestamp;
    integrations: (integration_id, tokens) map;
    metadata_url: string;
    (* owner: address; *)
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