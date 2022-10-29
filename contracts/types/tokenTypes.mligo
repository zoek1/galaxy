type transfer = 
[@layout:comb] { 
   from : address; 
   [@annot:to]to_: address; 
   value: nat; 
}
type approve = {
    spender : address;
    value   : nat;
}

type getAllowance = {
    owner    : address;
    spender  : address;
    callback : nat contract;
}

type getBalance = {
    owner    : address;
    callback : nat contract;
}

type getTotalSupply = {
    callback : nat contract;
}