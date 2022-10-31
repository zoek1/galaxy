#include "../types/campaignTypes.mligo"
#include "../types/tokenTypes.mligo"

#include "../LoyalToken.mligo"

let _approve (p,s : (approve * storage)): operation list * storage =
  let sender = Tezos.get_sender() in 
  let previous_value = match Big_map.find_opt (p.spender, sender) s.allowances with
      Some value -> value
  |    None -> 0n
  in
  if previous_value > 0n && p.value > 0n then
      let new_allowances = Big_map.update (p.spender, sender) (Some (previous_value + p.value)) s.allowances in
      ([] : operation list), {s with allowances = new_allowances}
  else
      let new_allowances = Big_map.update (p.spender, sender) (Some (p.value)) s.allowances in
      ([] : operation list), {s with allowances = new_allowances}

let approveRedeem (p,s: redemption * storage): operation list * storage =
  match Big_map.find_opt p.campaign s.campaigns with
    None -> (failwith "Campaign Doesn't Exists")
  | Some campaign -> 
      let reward = match Map.find_opt p.integration campaign.integrations with
          Some reward -> reward
      |   None -> (failwith "Integration not associated to this campaign")
      in
      let map_redemptions = match Big_map.find_opt (p.spender, p.campaign) s.join_user_campaign with
          Some map_redemption -> map_redemption
      |   None -> Map.empty
      in
      let new_map_redemption = match Map.find_opt p.integration map_redemptions with
          Some _ ->  (failwith "Reward already allowed")
      |   None -> Map.update p.integration (Some { 
          earned = reward; proof = p.proof; claimed = false;
      }) map_redemptions
      in
      let new_user_campaigns = match Big_map.find_opt p.spender s.user_campaigns with
          Some user_campaigns -> let new_joined = Set.add p.campaign user_campaigns.joined in
              let campaign_added = {user_campaigns with joined = new_joined } in
              Big_map.update p.spender (Some campaign_added) s.user_campaigns 
      |   None -> 
              let campaign_added = { joined = Set.literal [ p.campaign ]; created = (Set.empty: campaign_id set) } in
              Big_map.update p.spender (Some campaign_added) s.user_campaigns
      in
      let new_redemptions = Big_map.update (p.spender, p.campaign) (Some new_map_redemption) s.join_user_campaign in
      let new_storage = {s with join_user_campaign = new_redemptions; user_campaigns = new_user_campaigns} in
      _approve ({ spender = p.spender; value = reward}, new_storage)


let redeem (p,s: redeem * storage): operation list * storage =
  let sender = Tezos.get_sender() in 
  match Big_map.find_opt p.campaign s.campaigns with
    None -> (failwith "Campaign Doesn't Exists")
  | Some campaign -> 
      let reward = match Map.find_opt p.integration campaign.integrations with
          Some reward -> reward
      |   None -> (failwith "Integration not associated to this campaign")
      in
      let map_redemptions = match Big_map.find_opt (sender, p.campaign) s.join_user_campaign with
          Some map_redemption -> map_redemption
      |   None -> Map.empty
      in
      let new_map_redemption = match Map.find_opt p.integration map_redemptions with
          Some redeem -> if redeem.claimed 
            then (failwith "Reward already claimed")
            else Map.update p.integration (Some { 
                    redeem with claimed = true 
                }) map_redemptions
      |   None -> (failwith "No Reward active for this integration")
      in
      let new_redemptions = Big_map.update (sender, p.campaign) (Some new_map_redemption) s.join_user_campaign in
      let new_storage = {s with join_user_campaign = new_redemptions; } in
      transfer ({
        from = s.admin; to_ = sender; value = reward
      }, new_storage)
