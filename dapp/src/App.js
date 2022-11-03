import React, { useState, useRef, useEffect } from 'react';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { NetworkType, DAppClient } from '@airgap/beacon-sdk';
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";

import './index.css';
import config from './config.js';
import Context from './context.js';

import IndexPage from './pages/IndexPage';
import NewCampaignPage from './pages/NewCampaignPage';
import ViewCampaignPage from './pages/ViewCampaignPage';
import ThinkPage from './pages/ThinkPage';
import SelectPage from './pages/SelectPage';
import {getBalance} from "./utils/contract";


export default function App() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [initReady, setInitReady] = useState(false);
  const Tezos = useRef(null);
  const wallet = useRef(null);
  const contract = useRef(null);

  useEffect(() => {
    const _ = async () => {
      Tezos.current = new TezosToolkit(config.GHOSTNET_RPC);
      wallet.current = new BeaconWallet({ name: 'Loyalty Dapp', preferredNetwork: NetworkType.GHOSTNET })
      contract.current = await Tezos.current.wallet.at(config.LOYALTY_CONTRACT);
      /*
      const activeAccount = await wallet.current.client.getActiveAccount();

      if (activeAccount) {
        setAddress(activeAccount.address)
      }
      */
      setInitReady(true);
    }
    _();
  }, [])

  const updateBalance = async (address) => {
    const balance = await getBalance(address,  Tezos.current)
    setBalance(balance.toString());

    return balance;
  }

  const network = {
      network: {
        type: NetworkType.GHOSTNET
      }
    }

  const onLogin = async () => {
    if (!wallet.current || address === '') {
      wallet.current = new BeaconWallet({ name: 'Loyalty Dapp' })
      Tezos.current.setWalletProvider(wallet)

      contract.current = await Tezos.current.wallet.at(config.LOYALTY_CONTRACT);
    }

    try {
      const activeAccount = await wallet.current.client.getActiveAccount();
      let address;
      if (!activeAccount) {
        const permissions = await wallet.current.client.requestPermissions(network);
        console.log("New connection:", permissions.address);
        address = permissions.address;
        setAddress(permissions.address);
      } else {
        setAddress(activeAccount.address)
        address = activeAccount.address;
      }
      console.log(address)
      await updateBalance(address);

      return address;
    } catch (e) {
      console.log(e)
      console.log('Failed to get address')
    }
  }

  const onLogout = async () => {
    wallet.current = null;
    setAddress('')
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <IndexPage address={address} ready={initReady} />
    },
    {
      path:"/campaign/:campaignId",
      element: <ViewCampaignPage address={address} ready={initReady}/>,
    },
    {
      path:"/campaign/:campaignId/question/:integrationId",
      element: <ThinkPage address={address} ready={initReady}/>
    },
    {
      path:"/campaign/:campaignId/select/:integrationId",
      element: <SelectPage address={address} ready={initReady}/>
    },
    {
      path:"/new",
      element: <NewCampaignPage address={address} ready={initReady}/>
    },
  ]);

  return (<Context.Provider  value={{
        Tezos: Tezos,
        wallet: wallet,
        contract: contract,
        address,
        balance,
        updateBalance,
        onLogin,
        onLogout,
      }}>
      <RouterProvider router={router} />
    </Context.Provider>
  );
}
