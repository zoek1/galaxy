#include "../types/campaignTypes.mligo"

let exists_integration_in (integrations: integrations)
                        (integration_id, amount: integration_id * tokens): unit =
    match Map.find_opt integration_id integrations with
        Some _ -> 
            if amount <= 0n then
                (failwith ("Integration " ^ integration_id ^ " reward should be greater than 0"):  unit)
            else ()
    |   None -> (failwith ("Integration " ^ integration_id ^ " Doesn't Exists") : unit )


let update_user_created_integrations (campaign_id, sender, campaign_indexer: campaign_id * address * user_campaigns): user_campaigns =
  match Big_map.find_opt sender campaign_indexer with
    Some user_campaigns -> 
        let new_created = Set.add campaign_id user_campaigns.created in
        let campaign_added = {user_campaigns with created = new_created } in
        Big_map.update sender (Some campaign_added) campaign_indexer
    | None -> 
        let campaign_added = { created = Set.literal [ campaign_id ]; joined = (Set.empty: campaign_id set) } in
        Big_map.update sender (Some campaign_added) campaign_indexer


let addCampaign (p,s: base_campaign * storage): operation list * storage =
  let ({campaign_id; name; deadline; integrations; metadata_url}) = p in
  let sender = Tezos.get_sender() in 
  let _: unit = Map.iter (exists_integration_in s.integrations) integrations in
  match Big_map.find_opt campaign_id s.campaigns with
      Some _ -> (failwith "Campaign Already Exists")
  |   None ->
          let campaign = ({ 
              name = name; 
              deadline = deadline; 
              created = Tezos.get_now ();
              integrations = integrations; 
              metadata_url = metadata_url; 
              owner = sender;
          } : campaign) in
          let new_campaigns = Big_map.update (campaign_id: campaign_id) (Some campaign) s.campaigns in
          let new_user_campaigns = update_user_created_integrations (campaign_id, sender, s.user_campaigns)
          in
          ([]: operation list), {s with campaigns = new_campaigns; user_campaigns = new_user_campaigns}


let updateCampaignIntegrations (p,s: update_integrations * storage): operation list * storage =
  let {campaign_id; integrations;} = p in
  let sender = Tezos.get_sender() in
  let _: unit = Map.iter (exists_integration_in s.integrations) integrations in
  match Big_map.find_opt campaign_id s.campaigns with
    Some campaign -> 
      let _: unit = assert_with_error (sender = campaign.owner) "Only owner can update integrations." in
      let new_campaign = { campaign with integrations = integrations} in
      let new_campaigns = Big_map.update (campaign_id: campaign_id) (Some new_campaign) s.campaigns in
      ([]: operation list), {s with campaigns = new_campaigns }
  | None -> (failwith "Campaign Doesn't Already Exists")


let updateCampaignDeadline (p,s: update_deadline * storage): operation list * storage =
  let {campaign_id; deadline;} = p in
  let sender = Tezos.get_sender() in
  match Big_map.find_opt campaign_id s.campaigns with
    Some campaign -> 
      let _: unit = assert_with_error (sender = campaign.owner) "Only owner can update deadline." in
      let _: unit = assert_with_error (campaign.created < deadline) "Deadline should be greater than the campaign created time." in
      let new_campaign = { campaign with deadline = deadline} in
      let new_campaigns = Big_map.update (campaign_id: campaign_id) (Some new_campaign) s.campaigns in
      ([]: operation list), {s with campaigns = new_campaigns }
  | None -> (failwith "Campaign Doesn't Already Exists")
