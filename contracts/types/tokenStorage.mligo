#if ONLY_TOKEN
#include "./tokenIndexers.mligo"
type storage = {
    ledger             : ledger;
    allowances         : allowances;
    totalSupply        : nat;
    admin              : address
}
#endif
