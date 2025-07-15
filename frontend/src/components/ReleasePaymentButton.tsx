import React, { useState } from "react";
import type { Contract, BigNumberish } from "ethers";

interface Props {
  contract?: Contract;
  proposalId: BigNumberish;
}

export function ReleasePaymentButton({ contract, proposalId }: Props) {
  const [loading, setLoading] = useState(false);

  async function release() {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.releasePayment(proposalId);
      await tx.wait();
      alert("Pagamento liberado!");
    } catch (err) {
      alert("Erro ao liberar pagamento: " + (err as Error).message);
    }
    setLoading(false);
  }

  return (
    <button onClick={release} disabled={loading}>
      Liberar Pagamento
    </button>
  );
}
