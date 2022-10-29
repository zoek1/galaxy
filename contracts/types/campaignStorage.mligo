#include "./campaignIndexers.mligo"
#include "./tokenIndexers.mligo"

type storage = {
    integrations       : integrations;
    campaigns          : campaigns;
    user_campaigns     : user_campaigns;
    join_user_campaign : join_user_campaign;
    admin              : address;
    ledger             : ledger;
    allowances         : allowances;
    totalSupply        : nat;
}