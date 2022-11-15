#include "../types/campaignTypes.mligo"
#include "../types/campaignIndexers.mligo"


let addReward (p,s: reward * storage): operation list * storage =
  let (reward_id, stock): reward = p in
  let _: unit = assert_with_error (stock.1 > 0n) "Stock should be greater than 0" in
  match Map.find_opt reward_id s.rewards with
      Some _ -> (failwith "Reward Already Exists")
  |   None -> 
          let new_rewards = Map.update (reward_id: reward_id) (Some stock) s.rewards in
          ([]: operation list), {s with rewards = new_rewards}

let redeemReward (p,s: reward_id * storage): operation list * storage =
  let sender: address = Tezos.get_sender() in
  let now: timestamp = Tezos.get_now () in
  match Map.find_opt p s.rewards with
      Some stock ->
          let _: unit = assert_with_error (stock.1 > 0n) "No Stock Available" in
          let index = abs (stock.1 - 1n) in
          let new_stock:stock = (stock.0, index) in
          let new_rewards = Map.update (p: reward_id) (Some new_stock) s.rewards in
          let update_redeems = { s with redeem_rewards = (p, index, now, sender) :: s.redeem_rewards} in
          let new_storage = {update_redeems with rewards = new_rewards } in
          transfer ({
            from = sender; to_ = s.admin; value = stock.0
          }, new_storage)
  |   None -> (failwith "Reward Doesn't Exists")      
