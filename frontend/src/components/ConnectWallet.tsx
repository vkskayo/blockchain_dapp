import React, { useState } from "react";
import { BrowserProvider } from "ethers";

interface Props {
  setAccount: (account: string) => void;
  setProvider: (provider: BrowserProvider) => void;
}

export function ConnectWallet({ setAccount, setProvider }: Props) {
  const [isConnecting, setIsConnecting] = useState(false);

  async function connect() {
    if (isConnecting) return; // bloqueia se já estiver conectando

    setIsConnecting(true);

    try {
      if (!window.ethereum) {
        alert("Instale o MetaMask");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      setAccount(addr);
      setProvider(provider);
    } catch (error) {
      console.error("Erro ao conectar:", error);
    } finally {
      setIsConnecting(false);
    }
  }

  return (
    <button onClick={connect} disabled={isConnecting}>
      {isConnecting ? "Conectando..." : "Conectar MetaMask"}
    </button>
  );
}
