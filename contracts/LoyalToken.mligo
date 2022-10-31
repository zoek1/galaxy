#include "./types/campaignStorage.mligo"
#include "./types/tokenTypes.mligo"

type action =
      Transfer       of transfer
|    Approve        of approve
|    GetAllowance   of getAllowance
|    GetBalance     of getBalance
|    GetTotalSupply of getTotalSupply

let transfer (p,s : transfer * storage) : operation list * storage =
   let new_allowances =
        if Tezos.get_sender() = p.from then s.allowances
        else
            let authorized_value = match Big_map.find_opt (Tezos.get_sender(),p.from) s.allowances with
                Some value -> value
            |    None       -> 0n
            in
            if (authorized_value < p.value)
            then (failwith "Not Enough Allowance" : allowances)
            else Big_map.update (Tezos.get_sender(),p.from) (Some (abs(authorized_value - p.value))) s.allowances
   in
    let sender_balance = match Big_map.find_opt p.from s.ledger with
        Some value -> value
    |    None        -> 0n
    in
    if (sender_balance < p.value)
    then (failwith "Not Enough Balance" : operation list * storage)
    else
        let new_ledger = Big_map.update p.from (Some (abs(sender_balance - p.value))) s.ledger in
        let receiver_balance = match Big_map.find_opt p.to_ s.ledger with
            Some value -> value
        |    None        -> 0n
        in
        let new_ledger = Big_map.update p.to_ (Some (receiver_balance + p.value)) new_ledger in
        ([]:operation list), {s with ledger = new_ledger; allowances = new_allowances}

let approve (p,s : approve * storage) : operation list * storage =
    let previous_value = match Big_map.find_opt (p.spender, Tezos.get_sender()) s.allowances with
        Some value -> value
    |    None -> 0n
    in
    if previous_value > 0n && p.value > 0n
    then (failwith "Unsafe Allowance Change" : operation list * storage)
    else
        let new_allowances = Big_map.update (p.spender, Tezos.get_sender()) (Some (p.value)) s.allowances in
        ([] : operation list), {s with allowances = new_allowances}

let getAllowance (p,s : getAllowance * storage) : operation list * storage =
    let value = match Big_map.find_opt (p.owner, p.spender) s.allowances with
        Some value -> value
    |    None -> 0n
    in
    let op = Tezos.transaction value 0mutez p.callback in
    ([op],s)

let getBalance (p,s : getBalance * storage) : operation list * storage =
    let value = match Big_map.find_opt p.owner s.ledger with
        Some value -> value
    |    None -> 0n
    in
    let op = Tezos.transaction value 0mutez p.callback in
    ([op],s)

let getTotalSupply (p,s : getTotalSupply * storage) : operation list * storage =
  let total = s.totalSupply in
  let op    = Tezos.transaction total 0mutez p.callback in
  ([op],s)


let main (a,s:action * storage) =
     match a with
       Transfer p -> transfer (p,s)
    |    Approve  p -> approve (p,s)
    |    GetAllowance p -> getAllowance (p,s)
    |    GetBalance p -> getBalance (p,s)
    |    GetTotalSupply p -> getTotalSupply (p,s)