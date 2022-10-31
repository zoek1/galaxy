#include "types/campaignStorage.mligo"
#include "types/campaignTypes.mligo"
#include "types/tokenTypes.mligo"

#include "actions/integrations.mligo"
#include "actions/campaigns.mligo"
#include "actions/redeem.mligo"

#include "LoyalToken.mligo"

type action = 
     AddIntegration of integration_id * integration
|    AddCampaign    of base_campaign
|    UpdateCampaignIntegrations of update_integrations
|    UpdateCampaignDeadline of update_deadline
|    ApproveRedeem  of redemption
|    Redeem         of redeem
|    Transfer       of transfer
|    Approve        of approve
|    GetAllowance   of getAllowance
|    GetBalance     of getBalance
|    GetTotalSupply of getTotalSupply


let main (a,s: action * storage) =
  match a with
      AddIntegration p -> addIntegration (p, s)
   |   AddCampaign p -> addCampaign (p,s)
   |   UpdateCampaignIntegrations p -> updateCampaignIntegrations (p,s)
   |   UpdateCampaignDeadline p -> updateCampaignDeadline (p,s)
   |   ApproveRedeem p -> approveRedeem (p,s)
   |   Redeem p -> redeem (p,s)
   |   Transfer p -> transfer (p,s)
   |   Approve  p -> approve (p,s)
   |   GetAllowance p -> getAllowance (p,s)
   |   GetBalance p -> getBalance (p,s)
   |   GetTotalSupply p -> getTotalSupply (p,s)
