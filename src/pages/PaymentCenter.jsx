import React, { useEffect, useState } from "react";
import { Copy, ShieldAlert, Wallet, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { PAYMENT_METHODS, CRYPTO_NETWORKS } from "../lib/constants";
import {
  fetchPaymentDestinations,
  submitPayment,
  fetchMyPayments,
} from "../services/paymentsService";
import { LoadingState, EmptyState } from "../components/ui/States";

const STATUS_ICON = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
};

export default function PaymentCenter() {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const [method, setMethod] = useState(PAYMENT_METHODS[0].value);
  const [network, setNetwork] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [purpose, setPurpose] = useState("featured_listing");
  const [destinations, setDestinations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isCrypto = PAYMENT_METHODS.find((m) => m.value === method)?.group === "crypto";
  const networks = CRYPTO_NETWORKS[method] || [];
  const destination = destinations.find(
    (d) => d.method === method && (!isCrypto || d.network === network)
  );

  useEffect(() => {
    if (isCrypto && networks.length && !networks.includes(network)) {
      setNetwork(networks[0]);
    }
    if (!isCrypto) setNetwork("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const { data: dest } = await fetchPaymentDestinations();
      if (!cancelled) setDestinations(dest);
      if (isAuthenticated && user) {
        const { data: pays } = await fetchMyPayments(user.id);
        if (!cancelled) setPayments(pays);
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user]);

  function copyDestination() {
    if (!destination) return;
    navigator.clipboard.writeText(destination.address);
    toast.success("Destination copied to clipboard.");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.warning("Please log in to submit a payment.");
      return;
    }
    if (!amount || !reference) {
      toast.warning("Enter the amount and your transaction reference/hash.");
      return;
    }
    setSubmitting(true);
    const { data, error } = await submitPayment({
      user_id: user.id,
      method,
      network: isCrypto ? network : null,
      amount,
      reference,
      purpose,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Could not submit payment.");
      return;
    }
    setPayments((prev) => [data, ...prev]);
    setAmount("");
    setReference("");
    toast.success("Payment submitted. Our team will manually verify it shortly.");
  }

  return (
    <section className="section">
      <div className="container narrow">
        <div className="section-heading">
          <div>
            <span className="section-label">PAYMENT CENTER</span>
            <h2>Manual payments</h2>
          </div>
        </div>

        <div className="notice-banner notice-warning">
          <ShieldAlert size={16} style={{ marginRight: 8 }} />
          All payments are verified <strong>manually</strong> by our team — there is no automatic
          blockchain verification. Never share your wallet's private key or seed phrase; we will
          never ask for it.
        </div>

        {loading && <LoadingState label="Loading payment options…" />}

        {!loading && (
          <>
            <form onSubmit={handleSubmit} className="auth-form payment-form">
              <label>
                What are you paying for?
                <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                  <option value="featured_listing">Featured opportunity listing</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label>
                Payment method
                <select value={method} onChange={(e) => setMethod(e.target.value)}>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>

              {isCrypto && (
                <label>
                  Network
                  <select value={network} onChange={(e) => setNetwork(e.target.value)}>
                    {networks.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="payment-destination">
                <div>
                  <span className="payment-destination-label">
                    <Wallet size={14} /> Send to:
                  </span>
                  <code>{destination?.address || "Not configured yet — see admin setup notes"}</code>
                  {isCrypto && destination?.network && (
                    <span className="network-pill">Network: {destination.network}</span>
                  )}
                </div>
                <button type="button" className="outline-button" onClick={copyDestination}>
                  <Copy size={14} /> Copy
                </button>
              </div>

              <label>
                Amount sent
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={isCrypto ? "e.g. 2 USDT" : "e.g. ₦2,000"}
                  required
                />
              </label>

              <label>
                Transaction reference / hash
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Paste your transaction hash or bank reference"
                  required
                />
              </label>

              <button className="primary-large-button" type="submit" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit payment for verification"}
              </button>
            </form>

            <div className="section-heading" style={{ marginTop: 40 }}>
              <div>
                <h3>Your payment history</h3>
              </div>
            </div>

            {!isAuthenticated && (
              <EmptyState
                icon={Wallet}
                title="Log in to view payment history"
                description="Your submitted payments and their status will appear here once you're logged in."
              />
            )}

            {isAuthenticated && payments.length === 0 && (
              <EmptyState icon={Wallet} title="No payments yet" description="Payments you submit will appear here." />
            )}

            {isAuthenticated && payments.length > 0 && (
              <div className="payment-history">
                {payments.map((p) => {
                  const Icon = STATUS_ICON[p.status] || Clock;
                  return (
                    <div key={p.id} className={`payment-row status-${p.status}`}>
                      <Icon size={16} />
                      <div>
                        <strong>{p.amount}</strong> via {p.method.toUpperCase()}
                        {p.network && ` (${p.network})`}
                        <div className="payment-row-sub">Ref: {p.reference}</div>
                      </div>
                      <span className={`status-pill status-${p.status}`}>{p.status}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
