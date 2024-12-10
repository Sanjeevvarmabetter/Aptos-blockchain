import './App.css';
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import Create from './components/Create';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import 'react-toastify/dist/ReactToastify.css';

import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

function App() {
  const aptosConfig = new AptosConfig({ network: Network.DEVNET });
  const client = new Aptos(aptosConfig);

  const moduleName = "nft";
  const moduleAddress = "0xa817c48739252236274629df8fff952b3d3be385862263b26eeaa9477d3b5d6b";

  const [loading, setLoading] = useState(true);
  const [userAccount, setUserAccount] = useState("");
  const [nftitem, setNFTitem] = useState({});
  const { connected, account, connect, disconnect } = useWallet();  // Use useWallet to track wallet state
  const [currNft, setCurrNft] = useState(null);
  const [player, setPlayer] = useState(false);

  useEffect(() => {
    if (connected && account) {
      setUserAccount(account.address);
    }
  }, [connected, account]);

  return (
    <BrowserRouter>
      <ToastContainer />
      <div className="App min-h-screen">
        <div className='gradient-bg-welcome h-screen w-screen'>
          <Nav setUserAccount={setUserAccount} setAccount={setUserAccount} />
          
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
              element={<Home 
                        moduleAddress={moduleAddress} 
                        moduleName={moduleName} 
                        setNFTitem={setNFTitem} 
                        player={player} 
                        setPlayer={setPlayer} 
                        nftitem={nftitem} />} 
            />
            <Route 
              path="/create" 
              element={<Create 
                        moduleAddress={moduleAddress} 
                        moduleName={moduleName} 
                        connected={connected} 
                        account={userAccount} 
                        client={client} />} 
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
