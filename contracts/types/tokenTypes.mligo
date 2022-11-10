#if !TOKEN_TYPES
#define TOKEN_TYPES

type transfer = 
[@layout:comb] { 
   from : address; 
   [@annot:to]to_: address; 
   value: nat; 
}
type approve =
[@layout:comb] {
    spender : address;
    value   : nat;
}

type getAllowance  = {
    owner    : address;
    spender  : address;
}

type getBalance =
[@layout:comb] {
    owner    : address;
    callback : nat contract;
}

type getTotalSupply = {
    callback : nat contract;
}

#endif