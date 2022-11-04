import {DAppClient, TezosOperationType} from "@airgap/beacon-sdk";
import config from "../config";

export const get_campaigns = async (address, contract, s=null) => {
    const storage = !s ? await contract.storage() : s;

    return storage['user_campaigns'].get(address);
}

export const get_campaign_activity = async (address, campaigId, contract, s=null) => {
    const storage = !s ? await contract.storage() : s;

    return storage['join_user_campaign'].get({
        0: address,
        1: campaigId
    });
}

export const getIntegrations = async (contract, s=null) => {
    const storage = !s ? await contract.storage() : s;

    const integrations = await storage['integrations'];

    return [...integrations.entries()].map(
        ([key, obj]) => ({...obj, id: key})
    )

}

export const get_campaign = async (address, contract, campaignId, s=null) => {
    const storage = !s ? await contract.storage() : s;

    const campaign = await storage['campaigns'].get(campaignId);

    let activity;
    let hasParticipated;
    let isCreator;

    if (address) {
        const user_campaigns = await get_campaigns(address, contract, storage)

        activity = await get_campaign_activity(address, campaignId, contract, storage);
        hasParticipated = user_campaigns.joined.indexOf(campaignId) !== -1;
        isCreator = user_campaigns.created.indexOf(campaignId) !== -1;
    } else {
        activity = null;
        hasParticipated = false;
        isCreator = false;
    }

    return {
        ...campaign,
        hasParticipated,
        isCreator,
        activity
    }
}

export const getBalance = async (address, Tezos) => {
    const contract = await Tezos.contract.at(config.LOYALTY_CONTRACT);
    const storage = await contract.storage();
    const balance = storage['ledger'].get(address);

    return balance || 0;
}

const getDapp = async () => {
    const dAppClient = new DAppClient({ name: 'Loyalty Dapp' });
    const activeAccount = await dAppClient.getActiveAccount();

    if (activeAccount) {
      // User already has account connected, everything is ready
      // You can now do an operation request, sign request, or send another permission request to switch wallet
      console.log("Already connected:", activeAccount.address);
    } else {
      const permissions = await dAppClient.requestPermissions();
      console.log("New connection:", permissions.address);
    }

    return dAppClient;
}

export const redeem = async (campaignId, integrationId, Tezos) => {
    const dAppClient = await getDapp();

    try {
        const result = await dAppClient.requestOperation({
          operationDetails: [{
            kind: TezosOperationType.TRANSACTION,
            amount: "0",
            destination: config.LOYALTY_CONTRACT,
            parameters: {
              entrypoint: "redeem",
              value: [
                  { string: campaignId },
                  { string: integrationId }
              ]
            },
          }],
        });

        /*
        const data ={
            "version": "2",
            "id": "6e9b5333-54ef-88f9-11fb-c1162ed4cf58",
            "senderId": "3dngUpc7q9aph",
            "type": "operation_response",
            "transactionHash": "oofSjSUpndcWMCCNS4NsuSkX98NBcxNnFMxyS9KFdfspHZaKJeJ"
        }
        */
        console.log(result);
        return result;
    } catch (error) {
      console.log(
        `The contract call failed and the following error was returned:`,
        error?.data[1]?.with?.string
      );
    }
/*
    const contract = await Tezos.wallet.at(config.LOYALTY_CONTRACT);
    const result = await contract
        .methods
        .redeem(campaignId, integrationId)
        .send();

    console.log(result);

    return result;

 */
}