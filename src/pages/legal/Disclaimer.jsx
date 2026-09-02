import React from "react";
import LegalLayout from "./LegalLayout";

export default function Disclaimer() {
  return (
    <LegalLayout title="Disclaimer" updated="September 2, 2026">
      <h2>No guarantee of acceptance</h2>
      <p>
        OpportunityHub is an information and discovery platform. We do not guarantee that
        any user will be accepted into, hired for, admitted to, shortlisted for, or
        awarded any job, scholarship, grant, internship, fellowship, competition,
        training program or other opportunity listed on the Platform. All decisions are
        made solely by the third-party organization offering the opportunity.
      </p>

      <h2>Third-party listings</h2>
      <p>
        Opportunities listed on OpportunityHub are provided by third parties or submitted
        by users/organizations. While we take reasonable steps to review submissions and
        may mark certain listings as "Verified," we cannot guarantee the ongoing accuracy
        of every detail (including deadlines and eligibility). Always confirm details on
        the organization's official website before applying.
      </p>

      <h2>Not financial or legal advice</h2>
      <p>
        Nothing on this Platform, including career resources, constitutes financial,
        legal, immigration, or professional advice. Consult a qualified professional for
        advice specific to your situation.
      </p>

      <h2>Cryptocurrency risk</h2>
      <p>
        Cryptocurrency values are volatile and transactions are irreversible.
        OpportunityHub's payment verification is manual, not automatic, and we are not
        responsible for losses resulting from sending funds to an incorrect address, on
        an unsupported network, or in the wrong amount.
      </p>

      <h2>Scam awareness</h2>
      <p>
        Legitimate opportunities do not typically require you to pay a fee to be
        considered. If any listing asks you for payment to "process," "secure," or
        "guarantee" your application, treat it with suspicion and report it using the
        Report button on the listing.
      </p>
    </LegalLayout>
  );
}
