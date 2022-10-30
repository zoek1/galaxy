import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { NetworkType, DAppClient } from '@airgap/beacon-sdk';

import IndexPage from './pages/IndexPage';
import NewCampaignPage from './pages/NewCampaignPage';
import ViewCampaignPage from './pages/ViewCampaignPage';
import ThinkPage from './pages/ThinkPage';

export default function App() {
  const [address, setAddress] = useState('');
  const dAppClient = useRef(null);

  const onLogin = async () => {
    if (!dAppClient.current || address === '') {
      dAppClient.current = new DAppClient({ name: 'Loyalty Dapp' });
    }

    try {
      const permissions = await dAppClient.current.requestPermissions();
      setAddress(permissions.address)

      return permissions.address;
    } catch (e) {
      console.log('Failed to get address')
    }
  }

  const onLogout = async () => {
    dAppClient.current = null;
    setAddress('')
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <IndexPage address={address} onLogin={onLogin} onLogout={onLogout} />
    },
    {
      path:"/new",
      element: <NewCampaignPage/>
    },
    {
      path:"/campaign",
      element: <ViewCampaignPage/>
    },
    {
      path:"/think",
      element: <ThinkPage/>
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}
