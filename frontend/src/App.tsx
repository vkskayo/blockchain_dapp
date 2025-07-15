import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import ContractABI from "./abi/FreelancePlatform.json";
import { ConnectWallet } from "./components/ConnectWallet";
import { RegisterUserForm } from "./components/RegisterUserForm";
import { CreateJobForm } from "./components/CreateJobForm";
import { JobList } from "./components/JobList";
import { SubmitProposalForm } from "./components/SubmitProposalForm";
import { ProposalsList } from "./components/ProposalsList";
import { ReleasePaymentButton } from "./components/ReleasePaymentButton";

// 👇 substitua pelo endereço real após deploy
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [account, setAccount] = useState<string>();
  const [provider, setProvider] = useState<BrowserProvider>();
  const [contract, setContract] = useState<Contract>();

  useEffect(() => {
    async function setupContract() {
      if (provider) {
        const signer = await provider.getSigner(); // Ethers v6: agora é assíncrono
        const contractInstance = new Contract(CONTRACT_ADDRESS, ContractABI, signer);
        setContract(contractInstance);
      }
    }
    setupContract();
  }, [provider]);

  return (
    <div>
      <h1>Freelance Platform</h1>
      <ConnectWallet setAccount={setAccount} setProvider={setProvider} />
      {account && <p>Conectado: {account}</p>}
      {contract && (
        <>
          <RegisterUserForm contract={contract} account={account} />
          <CreateJobForm contract={contract} />
          <JobList contract={contract} />
        </>
      )}
    </div>
  );
}

export default App;
