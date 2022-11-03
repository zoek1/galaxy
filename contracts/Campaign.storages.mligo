#include "LoyalToken.mligo"
#include "./types/campaignStorage.mligo"


let initial_storage: storage = {
  metadata           = Big_map.literal [
    ("", Bytes.pack("https://my.token.json"));
    ("name", Bytes.pack("Loyal Token"));
    ("symbol", Bytes.pack("LYT"));
    ("decimals", Bytes.pack("0"));
  ];
  integrations       = Map.empty;
  campaigns          = Big_map.empty;
  user_campaigns     = Big_map.empty;
  join_user_campaign = Big_map.empty;
  admin              = ("tz1cSjTrRBE2UZGJ4xduR3Kw71vKur8J4Uxb": address );
  ledger = Big_map.literal [
    (("tz1cSjTrRBE2UZGJ4xduR3Kw71vKur8J4Uxb"  : address), 1000000000000000n);
  ];
  allowances = Big_map.empty;
  totalSupply = 1000000000000000n;
}
