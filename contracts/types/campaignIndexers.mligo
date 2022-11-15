#include "./campaignTypes.mligo"

type integrations = (integration_id, integration) map 

type campaigns = (campaign_id, campaign) big_map

type user_campaigns = (address, {
    created: campaign_id set;
    joined: campaign_id set
}) big_map

type join_user_campaign = ((address * campaign_id), ((integration_id, redeemed) map)) big_map

type rewards = (reward_id, stock) map

type redeem_rewards = (reward_id * nat * timestamp * address) list
