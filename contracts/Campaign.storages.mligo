#include "LoyalToken.mligo"
#include "./types/campaignStorage.mligo"


let initial_storage: storage = {
  token_metadata     = Big_map.literal [
    (0n, (0n, Map.literal [
           ("name", 0x47616c617879204c6f79616c747920546f6b656e);
           ("symbol", 0x674c7859);
           ("decimals", 0x30);
           ("thumbnailUri", 0x68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f7a6f656b312f6c6f79616c74792d646170702f6d61737465722f646170702f7075626c69632f6c6f676f3531322e706e67);
         ]))
  ];
  metadata           = Big_map.literal [
    ("", 0x697066733a2f2f516d65566d6f76686e63626e7a5653564c434a41624d615568575363346943755468617734755259516b777a684e);
    ("name", 0x47616c617879204c6f79616c747920546f6b656e);
    ("symbol", 0x674c7859);
    ("decimals", 0x30);
    ("thumbnailUri", 0x68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f7a6f656b312f6c6f79616c74792d646170702f6d61737465722f646170702f7075626c69632f6c6f676f3531322e706e67);
  ];
  integrations       = Map.empty;
  campaigns          = Big_map.empty;
  user_campaigns     = Big_map.empty;
  join_user_campaign = Big_map.empty;
  rewards            = Map.empty;
  redeem_rewards     = [];
  admin              = ("tz1cSjTrRBE2UZGJ4xduR3Kw71vKur8J4Uxb": address );
  ledger = Big_map.literal [
    (("tz1cSjTrRBE2UZGJ4xduR3Kw71vKur8J4Uxb"  : address), 1000000000000000n);
  ];
  allowances = Big_map.empty;
  totalSupply = 1000000000000000n;
}
