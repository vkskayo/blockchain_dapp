import React, { useState } from "react";
import type { Contract, BigNumberish } from "ethers";
import { JobListToApply } from "../freelancer/JobListToApply";
import { SubmitProposalForm } from "../freelancer/SubmitProposalForm";

interface Props {
  account: string;
  contract: Contract;
}

export function DashboardFreelancer({ account, contract }: Props) {
  const [selectedJobId, setSelectedJobId] = useState<BigNumberish | null>(null);

  return (
    <div className="dashboard">
      <h2>Bem-vindo(a), Freelancer</h2>
      <p>Endereço conectado: {account}</p>

      <section>
        <h3>Jobs disponíveis</h3>
        <JobListToApply contract={contract} onSelectJob={setSelectedJobId} />
      </section>

      {selectedJobId !== null && (
        <section>
          <h3>Enviar proposta para o Job #{selectedJobId.toString()}</h3>
          <SubmitProposalForm
            contract={contract}
            jobId={selectedJobId}
            onProposalSent={() => setSelectedJobId(null)}
          />
        </section>
      )}
    </div>
  );
}
