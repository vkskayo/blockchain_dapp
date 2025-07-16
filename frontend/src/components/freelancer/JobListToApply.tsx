import React, { useEffect, useState } from "react";
import { Contract, formatEther } from "ethers";
import type { BigNumberish } from "ethers";

interface Job {
  id: BigNumberish;
  employer: string;
  description: string;
  budget: BigNumberish;
  isOpen: boolean;
  acceptedProposalId: BigNumberish;
}

interface Proposal {
  id: BigNumberish;
  jobId: BigNumberish;
  freelancer: string;
  proposalText: string;
  accepted: boolean;
  paid: boolean;
}

interface Props {
  contract: Contract;
  account: string;
  onSelectJob: (jobId: number) => void;
  refreshTrigger: boolean;
}

export function JobListToApply({ contract, account, refreshTrigger, onSelectJob }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAvailableJobs() {
    setLoading(true);
    try {
      const allJobs: Job[] = await contract.getAllJobs();
      const openJobs = allJobs.filter(job => job.isOpen);

      // Filtra os jobs para os quais o freelancer já enviou proposta
      const filteredJobs: Job[] = [];

      await Promise.all(
        openJobs.map(async (job) => {
          const proposals: Proposal[] = await contract.getProposalsByJob(job.id);
          const hasProposed = proposals.some(
            (p) => p.freelancer.toLowerCase() === account.toLowerCase()
          );
          if (!hasProposed) {
            filteredJobs.push(job);
          }
        })
      );

      setJobs(filteredJobs);
    } catch (error) {
      console.error("Erro ao buscar jobs:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (contract && account) {
      fetchAvailableJobs();
    }
  }, [contract, account, refreshTrigger]);

  return (
    <div>
      <h3 style={{ marginBottom: "1rem" }}>Jobs Disponíveis para Proposta</h3>

      {loading ? (
        <p>Carregando...</p>
      ) : jobs.length === 0 ? (
        <p>Não há jobs disponíveis no momento.</p>
      ) : (
        <ul
          style={{
            padding: 0,
            listStyle: "none",
            maxWidth: 700,
            margin: "0 auto",
          }}
        >
          {jobs.map((job) => (
            <li
              key={job.id.toString()}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: "1rem 1.5rem",
                marginBottom: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fafafa",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ flex: 1, marginRight: 16 }}>
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    marginBottom: 6,
                  }}
                >
                  {job.description}
                </p>
                <p style={{ color: "#555", margin: 0 }}>
                  Orçamento:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {formatEther(job.budget)} ETH
                  </span>
                </p>
              </div>

              <button
                onClick={() => onSelectJob(Number(job.id))}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#0056b3")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#007bff")
                }
              >
                Enviar Proposta
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
