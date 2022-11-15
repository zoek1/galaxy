#!/bin/bash
set -e

taq compile Campaign.mligo

taq originate -e testing Campaign.tz

taq transfer -e testing Campaign --param Campaign.parameter.add_integration_discord.tz
taq transfer -e testing Campaign --param Campaign.parameter.add_integration_twitter.tz

taq transfer -e testing Campaign --param Campaign.parameter.add_integration_email.tz

taq transfer -e testing Campaign --param Campaign.parameter.add_integration_ask_1.tz
taq transfer -e testing Campaign --param Campaign.parameter.add_integration_ask_2.tz
taq transfer -e testing Campaign --param Campaign.parameter.add_integration_ask_3.tz
taq transfer -e testing Campaign --param Campaign.parameter.add_integration_ask_4.tz
taq transfer -e testing Campaign --param Campaign.parameter.add_integration_ask_5.tz

taq transfer -e testing Campaign --param Campaign.parameter.add_integration_choose_1.tz
taq transfer -e testing Campaign --param Campaign.parameter.add_integration_choose_2.tz
taq transfer -e testing Campaign --param Campaign.parameter.add_integration_choose_3.tz
taq transfer -e testing Campaign --param Campaign.parameter.add_integration_choose_4.tz
taq transfer -e testing Campaign --param Campaign.parameter.add_integration_choose_5.tz