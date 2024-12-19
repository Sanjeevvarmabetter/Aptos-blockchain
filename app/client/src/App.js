import './App.css';
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import Create from "./components/Create";
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import { AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Account, Aptos, } from '@aptos-labs/ts-sdk';

function App() {
  const aptosConfig = new AptosConfig({ network: Network.DEVNET });
  const aptosClient = new Aptos(aptosConfig);

  const moduleName = "nft";
  const moduleAddress = "0x1845ddb3309cfc7b0c2b0aca55403660570154962e961e4662d2a239830aee9e";

  const [userAccount, setUserAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { connected, account, connect, disconnect, client } = useWallet();

  useEffect(() => {
    if (connected && account) {
      setUserAccount(account.address);
      setIsConnected(true);
    } else {
      setUserAccount(null);
      setIsConnected(false);
    }
  }, [connected, account]);

  return (
      <BrowserRouter>
        <ToastContainer />
        <div className="App min-h-screen">
          <div className='gradient-bg-welcome h-screen w-screen'>
            <Nav />
            <div className="wallet-connection-container">
              {!connected ? (
                  <WalletSelector />
              ) : (
                  <div>
                    <p>Connected: {account?.address}</p>
                    <button onClick={() => disconnect()} className="disconnect-button">Disconnect</button>
                  </div>
              )}
            </div>
            <Routes>
              <Route
                  path="/"
                  element={<Home aptosClient={aptosClient} nftMarketPlaceAddress={moduleAddress} />}
              />
              <Route
                  path="/create"
                  element={<Create moduleName={moduleName} moduleAddress={moduleAddress} connected={isConnected} account={account} client={client} />}
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
  );
}

export default App;
