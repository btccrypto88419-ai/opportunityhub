-- =============================================================================
-- OpportunityHub — Optional seed data
-- =============================================================================
-- Safe to run once on a fresh project to populate a handful of example
-- PUBLISHED opportunities and placeholder payment destinations, so the app
-- has something to display immediately after setup.
--
-- Replace the placeholder wallet addresses in payment_destinations with your
-- REAL receiving addresses before going live. Never commit real private keys
-- or seed phrases anywhere — only public receiving addresses belong here.
-- =============================================================================

insert into public.opportunities
  (title, organization, category, location, mode, description, requirements, benefits, deadline, application_url, is_verified, is_featured, status)
values
  (
    'Software Engineering Internship',
    'TechBridge Africa',
    'internships',
    'Lagos, Nigeria',
    'hybrid',
    'Join our engineering team for a 3-month internship building real production features alongside senior engineers.',
    'Currently studying or recently graduated in Computer Science or a related field. Basic knowledge of JavaScript or Python.',
    'Monthly stipend, mentorship, letter of recommendation, possibility of full-time offer.',
    (current_date + interval '45 days')::date,
    'https://example.com/apply/techbridge-internship',
    true,
    true,
    'published'
  ),
  (
    'Nigerian Undergraduate Excellence Scholarship',
    'Futures Foundation',
    'scholarships',
    'Nigeria',
    'onsite',
    'A fully funded scholarship covering tuition and a stipend for outstanding Nigerian undergraduate students.',
    'Nigerian citizen, enrolled full-time in an accredited university, minimum CGPA of 4.0/5.0.',
    'Full tuition coverage, ₦50,000 monthly stipend, mentorship program.',
    (current_date + interval '60 days')::date,
    'https://example.com/apply/futures-scholarship',
    true,
    true,
    'published'
  ),
  (
    'Remote Junior Data Analyst',
    'Global Insights Ltd',
    'remote-jobs',
    'Remote (Worldwide)',
    'remote',
    'Support our analytics team by cleaning data, building dashboards and reporting on key business metrics.',
    '1+ years experience with SQL and Excel; familiarity with Python or R is a plus.',
    'Competitive salary in USD, flexible hours, fully remote.',
    (current_date + interval '21 days')::date,
    'https://example.com/apply/global-insights-analyst',
    false,
    false,
    'published'
  ),
  (
    'Early-Stage Founders Grant',
    'Naija Innovate Fund',
    'grants',
    'Nigeria',
    'onsite',
    'Non-dilutive grant funding for early-stage Nigerian startups solving problems in agriculture, health, or education.',
    'Registered Nigerian business, product with early traction, founding team of 2+.',
    'Up to ₦5,000,000 in non-dilutive funding, plus incubation support.',
    (current_date + interval '30 days')::date,
    'https://example.com/apply/naija-innovate-grant',
    true,
    false,
    'published'
  )
on conflict do nothing;

insert into public.payment_destinations (method, network, address, label, is_active)
values
  ('opay', null, 'REPLACE-WITH-REAL-ACCOUNT-NUMBER', 'OPay — OpportunityHub (replace before launch)', true),
  ('usdt', 'TRC20 (Tron)', 'REPLACE-WITH-REAL-TRC20-ADDRESS', 'USDT (TRC20)', true),
  ('usdt', 'BEP20 (BNB Smart Chain)', 'REPLACE-WITH-REAL-BEP20-ADDRESS', 'USDT (BEP20)', true),
  ('btc', 'Bitcoin', 'REPLACE-WITH-REAL-BTC-ADDRESS', 'Bitcoin', true),
  ('eth', 'ERC20 (Ethereum)', 'REPLACE-WITH-REAL-ETH-ADDRESS', 'Ethereum', true)
on conflict do nothing;

-- To make your own account an admin after signing up through the app, run:
--   update public.profiles set role = 'admin' where id = '<your-auth-user-uuid>';
