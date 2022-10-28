type campaign_id = nat
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
    integrations: (integration_id * tokens) list;
    metadata_url: string;
    (* owner: address; *)
}

type redemption = {
    campaign: campaign_id;
    integration: integration_id;
    earned: nat;
    proof: nat
}

type redeemed = {
    earned: nat;
    proof: nat
}

type join_user_campaign = ((address * campaign_id), ((integration_id, redeemed) map)) big_map

(* 
type rewards = {
}
*)

(* Indexers *)
type integrations = (integration_id, integration) map 
type campaigns = (campaign_id, campaign) big_map
type user_campaigns = (address, {
    created: campaign_id set;
    joined: campaign_id set
}) big_map

type storage = {
    integrations: integrations;
    campaigns: campaigns;
    user_campaigns: user_campaigns;
    join_user_campaign: join_user_campaign
}


type action = 
     AddIntegration of integration_id * integration
|    AddCampaign of campaign_id * campaign
|    Redemption of redemption


let addIntegration (p,s: (integration_id * integration) * storage): operation list * storage =
  let (integration_id, integration): integration_id * integration = p in
  match Map.find_opt integration_id s.integrations with
      Some _ -> (failwith "Integration Already Exists")
  |   None -> 
          let new_integrations = Map.update (integration_id: integration_id) (Some integration) s.integrations in
          ([]: operation list), {s with integrations = new_integrations}
    
let addCampaign (p,s: (campaign_id * campaign) * storage): operation list * storage =
  let (campaign_id, campaign): campaign_id * campaign = p in
  let sender = Tezos.get_sender() in 
  match Big_map.find_opt campaign_id s.campaigns with
      Some _ -> (failwith "Campaign Already Exists")
  |   None ->
          let new_campaigns = Big_map.update (campaign_id: campaign_id) (Some campaign) s.campaigns in
          let new_user_campaigns = match Big_map.find_opt sender s.user_campaigns with
              Some user_campaigns -> let new_created = Set.add campaign_id user_campaigns.created in
                  let campaign_added = {user_campaigns with created = new_created } in
                  Big_map.update sender (Some campaign_added) s.user_campaigns 
          |   None -> 
                  let campaign_added = { created = Set.literal [ campaign_id ]; joined = (Set.empty: campaign_id set) } in
                  Big_map.update sender (Some campaign_added) s.user_campaigns
          in
          ([]: operation list), {s with campaigns = new_campaigns; user_campaigns = new_user_campaigns}


let redemption (p,s: redemption * storage): operation list * storage =
  let sender = Tezos.get_sender() in 
  let map_redemptions = match Big_map.find_opt (sender, p.campaign) s.join_user_campaign with
      Some map_redemption -> map_redemption
  |   None -> Map.empty
  in
  let new_map_redemption = match Map.find_opt p.integration map_redemptions with
      Some _ ->  (failwith "Reward already claimed")
  |   None -> Map.update p.integration (Some { earned = p.earned; proof = p.proof} ) map_redemptions
  in
  let new_user_campaigns = match Big_map.find_opt sender s.user_campaigns with
      Some user_campaigns -> let new_joined = Set.add p.campaign user_campaigns.joined in
          let campaign_added = {user_campaigns with joined = new_joined } in
          Big_map.update sender (Some campaign_added) s.user_campaigns 
  |   None -> 
          let campaign_added = { joined = Set.literal [ p.campaign ]; created = (Set.empty: campaign_id set) } in
          Big_map.update sender (Some campaign_added) s.user_campaigns
  in
  let new_redemptions = Big_map.update (sender, p.campaign) (Some new_map_redemption) s.join_user_campaign in
  ([]: operation list), {s with join_user_campaign = new_redemptions; user_campaigns = new_user_campaigns}


let main (a,s: action * storage) =
  match a with
      AddIntegration p -> addIntegration (p, s)
   |   AddCampaign p -> addCampaign (p,s)
   |   Redemption p -> redemption (p,s)