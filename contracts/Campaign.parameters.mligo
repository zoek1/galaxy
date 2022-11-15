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
let add_integration_email : action = AddIntegration ("ASK_QUESTION_0", {
  name = "Email";
  provider = "Loyal";
  active = true
})
let add_integration_ask_1 : action = AddIntegration ("ASK_QUESTION_1", {
  name = "Open question";
  provider = "Loyal";
  active = true
})
let add_integration_ask_2 : action = AddIntegration ("ASK_QUESTION_2", {
  name = "Open question";
  provider = "Loyal";
  active = true
})
let add_integration_ask_3 : action = AddIntegration ("ASK_QUESTION_3", {
  name = "Open question";
  provider = "Loyal";
  active = true
})
let add_integration_ask_4 : action = AddIntegration ("ASK_QUESTION_4", {
  name = "Open question";
  provider = "Loyal";
  active = true
})
let add_integration_ask_5 : action = AddIntegration ("ASK_QUESTION_5", {
  name = "Open question";
  provider = "Loyal";
  active = true
})

let add_integration_choose_1 : action = AddIntegration ("CHOOSE_OPTION_1", {
  name = "Choose options";
  provider = "Loyal";
  active = true
})
let add_integration_choose_2 : action = AddIntegration ("CHOOSE_OPTION_2", {
  name = "Choose options";
  provider = "Loyal";
  active = true
})
let add_integration_choose_3 : action = AddIntegration ("CHOOSE_OPTION_3", {
  name = "Choose options";
  provider = "Loyal";
  active = true
})
let add_integration_choose_4 : action = AddIntegration ("CHOOSE_OPTION_4", {
  name = "Choose options";
  provider = "Loyal";
  active = true
})
let add_integration_choose_5 : action = AddIntegration ("CHOOSE_OPTION_5", {
  name = "Choose options";
  provider = "Loyal";
  active = true
})

let add_campaign_test: action = AddCampaign {
  campaign_id = "TEST_CAMPAIGN_4";
  name = "Test Campaign";
  deadline = Tezos.get_now () + (86_400 * 15); (* In Fifteen Days *)
  integrations = Map.literal [
    ("ASK_QUESTION_1", 15n);
    ("DISCORD_JOIN_CHANNEL", 100n);
    ("TWITTER_FOLLOW", 30n);
    ("ASK_QUESTION_2", 15n);
    ("ASK_QUESTION_3", 15n);
    ("CHOOSE_OPTION_1", 18n);
  ];
  metadata_url = "ipfs://Qmf6RBKw8XCMCfAjSFd126G7oLuwfAwiR7uTAPdhkiGqDE"
}

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

let add_reward: action = AddReward ("Brain_Food_1", 15n, 10n)

let redeem_reward: action = RedeemReward "Brain_Food_1"