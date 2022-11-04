#!/bin/bash
set -e

taq compile Campaign.mligo

taq originate Campaign.tz

taq transfer Campaign --param Campaign.parameter.add_integration_discord.tz
taq transfer Campaign --param Campaign.parameter.add_integration_telegram.tz
taq transfer Campaign --param Campaign.parameter.add_integration_twitter.tz

taq transfer Campaign --param Campaign.parameter.add_campaign_brain_food.tz
taq transfer Campaign --param Campaign.parameter.add_campaign_cupcake.tz

taq transfer Campaign --param Campaign.parameter.approve_redeem_brain_discord.tz

# taq transfer Campaign --param Campaign.parameter.redeem_brain_discord.tz

taq transfer Campaign --param Campaign.parameter.update_brain_integrations.tz
taq transfer Campaign --param Campaign.parameter.update_cupcake_integrations.tz
taq transfer Campaign --param Campaign.parameter.update_brain_deadline.tz

