import React, { useState } from "react";
import { BrowserProvider } from "ethers";

interface Props {
  onConnect: (account: string, provider: BrowserProvider) => void;
}

export function ConnectWallet({ onConnect }: Props) {
  const [isConnecting, setIsConnecting] = useState(false);

  async function handleConnect() {
    if (!window.ethereum) {
      alert("MetaMask não encontrada. Instale a extensão para continuar.");
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();

      onConnect(account, provider);
    } catch (error) {
      console.error("Erro ao conectar:", error);
      alert("Erro ao conectar à carteira.");
    } finally {
      setIsConnecting(false);
    }
  }

  return (
    <button onClick={handleConnect} disabled={isConnecting}>
      {isConnecting ? "Conectando..." : "Conectar com MetaMask"}
    </button>
  );
}
