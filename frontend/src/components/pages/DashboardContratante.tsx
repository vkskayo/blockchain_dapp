import React, { useEffect, useState } from "react";
import type { Contract, BigNumberish } from "ethers";
import { formatEther } from "ethers";
import { CreateJobForm } from "../contratante/CreateJobForm";
import { ProposalsList } from "../contratante/ProposalsList";

interface Job {
  id: BigNumberish;
  employer: string;
  description: string;
  budget: BigNumberish;
  isOpen: boolean;
  acceptedProposalId: BigNumberish;
}

interface Props {
  contract: Contract;
  account?: string;
}

export function DashboardContratante({ contract, account }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchJobs() {
    if (!contract || !account) return;

    setLoadingJobs(true);
    setError("");
    setSuccess("");

    try {
      const allJobs: Job[] = await contract.getAllJobs();
      const myJobs = allJobs.filter(
        (job) => job.employer.toLowerCase() === account.toLowerCase()
      );
      setJobs(myJobs);
    } catch (err: any) {
      setError("Erro ao buscar jobs: " + (err.message || err));
    }

    setLoadingJobs(false);
  }

  useEffect(() => {
    fetchJobs();
  }, [contract, account]);

  // Função para refrescar a lista após criação ou ações
  function refreshJobs() {
    fetchJobs();
    setSuccess("Atualizado com sucesso!");
    setTimeout(() => setSuccess(""), 3000);
  }

  if (!account) return <p>Conecte sua carteira para ver seus jobs.</p>;
  if (!contract) return <p>Conectando com o contrato...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Dashboard Contratante
      </h2>

      {/* Formulário para criar job */}
      <section
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: 8,
          backgroundColor: "#f5f5f5",
        }}
      >
        <CreateJobForm contract={contract} onJobCreated={refreshJobs} />
      </section>

      {/* Feedback global */}
      {loadingJobs && <p>Carregando jobs...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* Lista de jobs */}
      <section>
        {jobs.length === 0 && !loadingJobs ? (
          <p>Você ainda não criou nenhum job.</p>
        ) : (
          jobs.map((job) => (
            <JobItem
              key={job.id.toString()}
              job={job}
              contract={contract}
              refreshJobs={refreshJobs}
            />
          ))
        )}
      </section>
    </div>
  );
}

interface JobItemProps {
  job: Job;
  contract: Contract;
  refreshJobs: () => void;
}

function JobItem({ job, contract, refreshJobs }: JobItemProps) {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");

  async function releasePayment() {
    setPaymentLoading(true);
    setPaymentError("");
    setPaymentSuccess("");

    try {
      const tx = await contract.releasePayment(job.acceptedProposalId);
      await tx.wait();
      setPaymentSuccess("Pagamento liberado com sucesso!");
      refreshJobs();
    } catch (err: any) {
      setPaymentError("Erro ao liberar pagamento: " + (err.message || err));
    }

    setPaymentLoading(false);
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: "1rem",
        marginBottom: "1.5rem",
        backgroundColor: job.isOpen ? "#fff" : "#f9f9f9",
      }}
    >
      <h3>{job.description}</h3>
      <p>
        Orçamento: {formatEther(job.budget)} ETH -{" "}
        {job.isOpen ? "Aberto para propostas" : "Fechado"}
      </p>

      {/* Botão liberar pagamento */}
      {!job.isOpen && job.acceptedProposalId !== 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <button
            onClick={releasePayment}
            disabled={paymentLoading}
            style={{ padding: "0.5rem 1rem" }}
          >
            {paymentLoading ? "Liberando pagamento..." : "Liberar pagamento"}
          </button>
          {paymentError && <p style={{ color: "red" }}>{paymentError}</p>}
          {paymentSuccess && <p style={{ color: "green" }}>{paymentSuccess}</p>}
        </div>
      )}

      {/* Propostas para o job */}
      <ProposalsList
        contract={contract}
        jobId={job.id}
        onProposalsUpdated={refreshJobs}
      />
    </div>
  );
}
