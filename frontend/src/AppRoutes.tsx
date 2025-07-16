import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ContractABI from "./abi/FreelancePlatform.json";

import { ConnectWallet } from "./components/auth/ConnectWallet";
import { RegisterUserForm } from "./components/auth/RegisterUserForm";
import { Home } from "./components/pages/Home";
import { DashboardFreelancer } from "./components/pages/DashboardFreelancer";
import { DashboardContratante } from "./components/pages/DashboardContratante";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export function AppRoutes() {
  const [account, setAccount] = useState<string>();
  const [provider, setProvider] = useState<BrowserProvider>();
  const [contract, setContract] = useState<Contract>();
  const [userProfile, setUserProfile] = useState<"freelancer" | "contratante" | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const navigate = useNavigate();

  // Recupera conexão após F5
  useEffect(() => {
    async function checkIfWalletIsConnected() {
      if (!window.ethereum) return;

      const accounts: string[] = await window.ethereum.request({ method: "eth_accounts" });

      if (accounts.length > 0) {
        const prov = new BrowserProvider(window.ethereum);
        const signer = await prov.getSigner();
        const acc = await signer.getAddress();

        setAccount(acc);
        setProvider(prov);
      }
    }

    checkIfWalletIsConnected();
  }, []);

  // Setup contrato
  useEffect(() => {
    async function setupContract() {
      if (!provider) return;
      const signer = await provider.getSigner();
      const contractInstance = new Contract(CONTRACT_ADDRESS, ContractABI, signer);
      setContract(contractInstance);
    }
    setupContract();
  }, [provider]);

  // Buscar perfil
  useEffect(() => {
    async function fetchUserProfile() {
      if (!contract || !account) {
        setUserProfile(null);
        return;
      }

      setLoadingProfile(true);
      try {
        const [_, isFreelancer, exists] = await contract.getUser(account);
        if (exists) {
          setUserProfile(isFreelancer ? "freelancer" : "contratante");
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        setUserProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchUserProfile();
  }, [account, contract]);

  // Escutar desconexão ou troca de conta
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(undefined);
        setProvider(undefined);
        setContract(undefined);
        setUserProfile(null);
        navigate("/");
      } else {
        const newAccount = accounts[0];
        const newProvider = new BrowserProvider(window.ethereum);
        setAccount(newAccount);
        setProvider(newProvider);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [navigate]);

  if (loadingProfile) {
    return <div>Carregando perfil...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          account ? (
            userProfile ? (
              userProfile === "freelancer" ? (
                <Navigate to="/freelancer" replace />
              ) : (
                <Navigate to="/contratante" replace />
              )
            ) : contract ? (
              <RegisterUserForm
                contract={contract}
                account={account}
                onRegistered={(role) => setUserProfile(role)}
              />
            ) : (
              <div>Carregando contrato...</div>
            )
          ) : (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <h1>Bem-vindo à Freelance Platform</h1>
              <ConnectWallet
                onConnect={(acc, prov) => {
                  setAccount(acc);
                  setProvider(prov);
                }}
              />
            </div>
          )
        }
      />

      <Route
        path="/freelancer"
        element={
          account && userProfile === "freelancer" && contract ? (
            <DashboardFreelancer contract={contract} account={account} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/contratante"
        element={
          account && userProfile === "contratante" && contract ? (
            <DashboardContratante contract={contract} account={account} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
