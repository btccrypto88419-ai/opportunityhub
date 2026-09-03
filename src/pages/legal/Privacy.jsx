import React from "react";
import LegalLayout from "./LegalLayout";

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="September 2, 2026">
      <p>
        This Privacy Policy explains how OpportunityHub ("we", "us") collects, uses and
        protects your information.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li>Account information: name, email address, phone number (optional).</li>
        <li>Profile information: education, skills, location, and CV content you choose to provide.</li>
        <li>Usage data: saved opportunities, application tracker entries, submissions and reports.</li>
        <li>
          Payment-related information for manual verification (e.g. transaction reference or
          hash) — we do not store card numbers, bank PINs, or wallet private keys/seed phrases,
          and we will never ask you for them.
        </li>
      </ul>

      <h2>2. How we use your information</h2>
      <p>
        We use your information to operate the Platform, including authenticating your
        account, syncing saved opportunities and applications across devices, generating
        your CV, processing referrals, and manually verifying payments you submit.
      </p>

      <h2>3. Data storage</h2>
      <p>
        Account and application data is stored using Supabase, a third-party database and
        authentication provider, protected by Row Level Security policies so that users
        can only access their own data (except where explicitly shared, e.g. public
        opportunity listings).
      </p>

      <h2>4. Data sharing</h2>
      <p>
        We do not sell your personal information. We may share necessary information with
        service providers (such as our database/hosting provider) strictly to operate the
        Platform, or where required by law.
      </p>

      <h2>5. Your rights</h2>
      <p>
        You may edit or delete most of your profile information directly from your
        Profile page. You may request full account deletion by contacting Support.
      </p>

      <h2>6. Cookies and local storage</h2>
      <p>
        We use browser local storage to temporarily store draft CVs and saved
        opportunities for users who are not logged in. This data stays on your device
        until you log in (when it is merged into your account) or clear your browser
        data.
      </p>

      <h2>7. Changes to this policy</h2>
      <p>We may update this Privacy Policy from time to time; material changes will be reflected by updating the date above.</p>

      <h2>8. Contact</h2>
      <p>Questions about this policy can be sent via the Support page.</p>
    </LegalLayout>
  );
}
