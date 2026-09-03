import React from "react";
import LegalLayout from "./LegalLayout";

export default function Refund() {
  return (
    <LegalLayout title="Refund Policy" updated="September 2, 2026">
      <p>
        This Refund Policy applies to any paid features offered on OpportunityHub, such as
        featured opportunity listings, and to the manual payment methods described in the
        Payment Center.
      </p>

      <h2>1. Manual verification</h2>
      <p>
        All payments — whether via OPay/bank transfer or cryptocurrency (USDT, BTC, USDC,
        ETH, BNB, SOL, TON) — are verified manually by our team. Submitting a payment does
        not guarantee approval. We reserve the right to reject a payment that cannot be
        verified, was sent on the wrong network, was underpaid, or otherwise fails our
        review.
      </p>

      <h2>2. Cryptocurrency payments are final</h2>
      <p>
        Cryptocurrency transactions are irreversible by nature. If you send funds to the
        wrong address, on the wrong network, or in the wrong amount, we cannot guarantee
        recovery of those funds, and no refund can be issued for user error of this kind.
      </p>

      <h2>3. Rejected payments</h2>
      <p>
        If a submitted payment is reviewed and rejected (e.g. because it could not be
        matched to a transaction, or the reference/hash provided was invalid), no service
        will be rendered for that submission. If you believe a rejection was made in
        error, contact Support with your transaction reference.
      </p>

      <h2>4. Approved payments and service delivery</h2>
      <p>
        Once a payment is approved, the corresponding feature (e.g. a featured listing
        placement) will be activated. Refunds for already-delivered services (e.g. time
        already spent as a featured listing) are not available, except where required by
        law.
      </p>

      <h2>5. Referral rewards</h2>
      <p>
        Referral rewards are not "payments" made by the user and are not covered by this
        refund policy; they are governed instead by the referral program terms in our
        Terms of Service.
      </p>

      <h2>6. Contact</h2>
      <p>For payment disputes, contact Support with your payment reference and account email.</p>
    </LegalLayout>
  );
}
