#include "LoyalToken.mligo"
#include "./types/campaignStorage.mligo"


let initial_storage: storage = {
  integrations       = Map.empty;
  campaigns          = Big_map.empty;
  user_campaigns     = Big_map.empty;
  join_user_campaign = Big_map.empty;
  admin              = ("tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6": address );
  ledger = Big_map.literal [
    (("tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6"  : address), 1000000000000000n);
    (("tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"  : address), 0n);
    (("tz1Zwoh1QCVAvJ4sVTojMp9pLYp6Ji4NoZy6"  : address), 0n)
  ];
  allowances = Big_map.empty;
  totalSupply = 1000000000000000n;
}
