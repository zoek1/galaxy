metadata = {
    "name": "Galaxy Loyalty Token",
    "symbol": "gLxY",
    "decimals": "0",
    "thumbnailUri": "https://raw.githubusercontent.com/zoek1/loyalty-dapp/master/dapp/public/logo512.png",
    "": "ipfs://QmeVmovhncbnzVSVLCJAbMaUhWSc4iCuThaw4uRYQkwzhN"
}

for k,v in metadata:
    print(f'${k}: 0x${v.encode("utf-8").hex()}')
