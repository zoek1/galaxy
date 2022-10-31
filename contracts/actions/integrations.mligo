#include "../types/campaignTypes.mligo"

let addIntegration (p,s: (integration_id * integration) * storage): operation list * storage =
  let (integration_id, integration): integration_id * integration = p in
  match Map.find_opt integration_id s.integrations with
      Some _ -> (failwith "Integration Already Exists")
  |   None -> 
          let new_integrations = Map.update (integration_id: integration_id) (Some integration) s.integrations in
          ([]: operation list), {s with integrations = new_integrations}