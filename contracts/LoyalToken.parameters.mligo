#include "LoyalToken.mligo"
let trasfer_100_to_alice : action = Transfer { 
  from = ("tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6" : address);
  to_   = ("tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb" : address);
  value = 100n;
}