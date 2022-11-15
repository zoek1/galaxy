#include "types/campaignStorage.mligo"
#include "types/campaignTypes.mligo"
#include "types/tokenTypes.mligo"

#include "actions/integrations.mligo"
#include "actions/campaigns.mligo"
#include "actions/redeem.mligo"
#include "actions/rewards.mligo"


#include "LoyalToken.mligo"

type action = 
     AddIntegration of integration_id * integration
|    AddCampaign    of base_campaign
|    UpdateCampaignIntegrations of update_integrations
|    UpdateCampaignDeadline of update_deadline
|    ApproveRedeem  of redemption
|    Redeem         of redeem
|    AddReward      of reward_id * price * existence
|    RedeemReward   of reward_id
|    Transfer       of transfer
|    Approve        of approve
|    GetAllowance   of getAllowance * nat contract
|    GetBalance     of getBalance
|    GetTotalSupply of (unit * getTotalSupply )


let main (a,s: action * storage) =
  match a with
      AddIntegration p -> addIntegration (p, s)
   |   AddCampaign p -> addCampaign (p,s)
   |   UpdateCampaignIntegrations p -> updateCampaignIntegrations (p,s)
   |   UpdateCampaignDeadline p -> updateCampaignDeadline (p,s)
   |   ApproveRedeem p -> approveRedeem (p,s)
   |   Redeem p -> redeem (p,s)
   |   AddReward p ->   addReward (((p.0: reward_id), ((p.1, p.2):stock)), s)
   |   RedeemReward p -> redeemReward (p,s)
   |   Transfer p -> transfer (p,s)
   |   Approve  p -> approve (p,s)
   |   GetAllowance p -> getAllowance (p,s)
   |   GetBalance p -> getBalance (p,s)
   |   GetTotalSupply p -> getTotalSupply (p,s)
