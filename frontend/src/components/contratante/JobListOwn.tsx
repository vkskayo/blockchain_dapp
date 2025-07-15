import React, { useEffect, useState } from "react";
import { Contract, formatEther } from "ethers";
import { BigNumberish } from "ethers";

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
  account: string;
  onSelectJob?: (jobId: number) => void; // útil se quiser abrir as propostas depois
}

export function JobListOwn({ contract, account, onSelectJob }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOwnJobs() {
    setLoading(true);
    try {
      const allJobs: Job[] = await contract.getAllJobs();
      const ownJobs = allJobs.filter(job => job.employer.toLowerCase() === account.toLowerCase());
      setJobs(ownJobs);
    } catch (error) {
      console.error("Erro ao buscar jobs do contratante:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (contract && account) {
      fetchOwnJobs();
    }
  }, [contract, account]);

  return (
    <div>
      <h3>Meus Jobs Criados</h3>
      {loading ? (
        <p>Carregando...</p>
      ) : jobs.length === 0 ? (
        <p>Você ainda não criou nenhum job.</p>
      ) : (
        <ul>
          {jobs.map(job => (
            <li key={job.id.toString()}>
              <strong>{job.description}</strong> - {formatEther(job.budget)} ETH -{" "}
              {job.isOpen ? "Aberto" : "Fechado"}
              {onSelectJob && (
                <button onClick={() => onSelectJob(Number(job.id))} style={{ marginLeft: "1rem" }}>
                  Ver propostas
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
