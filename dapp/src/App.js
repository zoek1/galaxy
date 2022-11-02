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


export default function App() {
  const [address, setAddress] = useState('');
  const [initReady, setInitReady] = useState(false);
  const Tezos = useRef(null);
  const wallet = useRef(null);
  const contract = useRef(null);

  useEffect(() => {
    const _ = async () => {
      Tezos.current = new TezosToolkit(config.GHOSTNET_RPC);
      wallet.current = new BeaconWallet({ name: 'Loyalty Dapp', preferredNetwork: NetworkType.GHOSTNET })
      contract.current = await Tezos.current.contract.at(config.LOYALTY_CONTRACT);

      setInitReady(true);
    }
    _();
  }, [])

  const onLogin = async () => {
    if (!wallet.current || address === '') {
      wallet.current = new BeaconWallet({ name: 'Loyalty Dapp' })
      Tezos.current.setWalletProvider(wallet)
      contract.current = await Tezos.current.contract.at(config.LOYALTY_CONTRACT);
    }

    try {
      await wallet.current.requestPermissions({
        network: {
          type: NetworkType.GHOSTNET,
          name: 'ghostnet',
          rpcUrl: config.GHOSTNET_RPC
        }
      });
      const address = await wallet.current.getPKH()
      setAddress(address)


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
      children: [
          {
            path:"think",
            element: <ThinkPage address={address} ready={initReady}/>
          },
          {
            path:"select",
            element: <SelectPage address={address} ready={initReady}/>
          }
      ]
    },
    {
      path:"/new",
      element: <NewCampaignPage address={address} ready={initReady}/>
    },
  ]);

  return (<Context.Provider  value={{
        Tezos: Tezos.current,
        wallet: wallet.current,
        contract: contract.current,
        address: address,
        onLogin: onLogin,
        onLogout: onLogout,

      }}>
      <RouterProvider router={router} />
    </Context.Provider>
  );
}
