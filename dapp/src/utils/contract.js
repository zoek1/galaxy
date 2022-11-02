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