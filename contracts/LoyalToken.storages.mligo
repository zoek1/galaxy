#include "LoyalToken.mligo"

let initial_storage: storage = {
  tokens = Big_map.literal [
    (("tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6"  : address), 10000n);
    (("tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"  : address), 80000n);
    (("tz1Zwoh1QCVAvJ4sVTojMp9pLYp6Ji4NoZy6"  : address), 1000000n)
  ];
  allowances = Big_map.empty;
  total_amount = 100000000000n;
}
