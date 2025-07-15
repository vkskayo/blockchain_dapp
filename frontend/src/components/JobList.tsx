import React, { useEffect, useState } from "react";
import { Contract } from "ethers";
import { formatEther } from "ethers";
import type { BigNumberish } from "ethers";

interface Job {
  id: BigNumberish;
  employer: string;
  description: string;
  budget: BigNumberish;
  isOpen: boolean;
  acceptedProposalId: BigNumberish;
}

interface Props {
  contract?: Contract;
}

export function JobList({ contract }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);

  async function fetchJobs() {
    if (!contract) return;
    try {
      const allJobs: Job[] = await contract.getAllJobs();
      setJobs(allJobs);
    } catch (err) {
      console.error("Erro ao buscar jobs:", err);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, [contract]);

  return (
    <div>
      <h2>Jobs Disponíveis</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id.toString()}>
            {job.description} - Orçamento: {formatEther(job.budget)} ETH -{" "}
            {job.isOpen ? "Aberto" : "Fechado"}
          </li>
        ))}
      </ul>
    </div>
  );
}
