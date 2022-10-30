#include "Campaign.mligo"

let trasfer_100_to_alice : action = Transfer { 
  from = ("tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6" : address);
  to_   = ("tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb" : address);
  value = 100n;
}

let add_integration_discord : action = AddIntegration ("DISCORD_JOIN_CHANNEL", {
  name = "Join Discord Channel";
  provider = "discord";
  active = true
})

let add_integration_telegram : action = AddIntegration ("TELEGRAM_JOIN_GROUP", {
  name = "Join Telegram Group";
  provider = "telegram";
  active = true
})

let add_integration_twitter : action = AddIntegration ("TWITTER_FOLLOW", {
  name = "Follow Twitter Account";
  provider = "twitter";
  active = true
})

let add_campaign_brain_food: action = AddCampaign {
  campaign_id = "Brain_Food";
  name = "Brain Food";
  deadline = Tezos.get_now () + (86_400 * 15); (* In Five Days *)
  integrations = Map.literal [("DISCORD_JOIN_CHANNEL", 100n)];
  metadata_url = ""
}

let add_campaign_cupcake: action = AddCampaign {
  campaign_id = "CUPCAKE_IPSUM";
  name = "Cupcake Ipsum";
  deadline = Tezos.get_now () + (86_400 * 15); (* In Five Days *)
  integrations = Map.literal [("DISCORD_JOIN_CHANNEL", 100n); ("TWITTER_FOLLOW", 30n)];
  metadata_url = ""
}

let approve_redeem_brain_discord: action = ApproveRedeem {
  campaign = "Brain_Food";
  integration = "DISCORD_JOIN_CHANNEL";
  earned = 100n;
  proof = "0X000000000000000000000000000000"; 
  spender = ("tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb" : address);
}

let redeem_brain_discord: action = Redeem {
  campaign = "Brain_Food";
  integration = "DISCORD_JOIN_CHANNEL";
}

let update_brain_integrations: action = UpdateCampaignIntegrations {
  campaign_id = "Brain_Food";
  integrations = Map.literal [("DISCORD_JOIN_CHANNEL", 100n); ("TELEGRAM_JOIN_GROUP", 80n)];
}

let update_cupcake_integrations: action = UpdateCampaignIntegrations {
  campaign_id = "CUPCAKE_IPSUM";
  integrations = Map.literal [("DISCORD_JOIN_CHANNEL", 100n); ];
}

let update_brain_deadline: action = UpdateCampaignDeadline {
    campaign_id = "Brain_Food";
    deadline = Tezos.get_now () + (86_400 * 25); (* In Five Days *)
}