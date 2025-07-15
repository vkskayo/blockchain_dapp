import React, { useState } from "react";
import type { Contract, BigNumberish } from "ethers";

interface Props {
  contract?: Contract;
  proposalId: BigNumberish;
  onPaymentReleased?: () => void; // opcional callback para pai atualizar
}

export function ReleasePaymentButton({ contract, proposalId, onPaymentReleased }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function release() {
    if (!contract) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const tx = await contract.releasePayment(proposalId);
      await tx.wait();
      setSuccess("Pagamento liberado com sucesso!");
      if (onPaymentReleased) onPaymentReleased();
    } catch (err: any) {
      setError("Erro ao liberar pagamento: " + (err.message || err));
    }
    setLoading(false);
  }

  return (
    <div>
      <button onClick={release} disabled={loading} style={{ padding: "0.5rem 1rem" }}>
        {loading ? "Processando..." : "Liberar Pagamento"}
      </button>
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "0.5rem" }}>{success}</p>}
    </div>
  );
}
