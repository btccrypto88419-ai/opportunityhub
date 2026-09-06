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
  ('opay', null, '9031371539', 'OPay — Ojattah Wisdom Onuche', true),
  ('btc', 'Bitcoin', 'bc1qtvz7264naty2m99s4lcjvy4wdnqxx6w4r339zg', 'Bitcoin (Mainnet)', true),
  ('usdt', 'BEP20 (BNB Smart Chain)', '0x1dC115f4399636297A79cbD816843619385AD981', 'USDT (BEP20)', true),
  ('usdt', 'ERC20 (Ethereum)', '0x1dC115f4399636297A79cbD816843619385AD981', 'USDT (ERC20)', true),
  ('usdt', 'TRC20 (Tron)', 'TRtWncMKhArbCiBLYDkqprumtg7jNzCBPQ', 'USDT (TRC20)', true),
  ('usdt', 'Solana', 'HgTZ3KRr73nRyRSVMm742mnaU2G3K6uFAtCWF4t1ogRT', 'USDT (Solana)', true),
  ('usdt', 'TON', 'UQDxl8X4zJhssUx7_cwc4A3eyQen18i2cNhP6u2Ag4W2zfVQ', 'USDT (TON)', true),
  ('usdc', 'BEP20 (BNB Smart Chain)', '0x1dC115f4399636297A79cbD816843619385AD981', 'USDC (BEP20)', true),
  ('usdc', 'ERC20 (Ethereum)', '0x1dC115f4399636297A79cbD816843619385AD981', 'USDC (ERC20)', true),
  ('usdc', 'Solana', 'HgTZ3KRr73nRyRSVMm742mnaU2G3K6uFAtCWF4t1ogRT', 'USDC (Solana)', true),
  ('eth', 'ERC20 (Ethereum)', '0x1dC115f4399636297A79cbD816843619385AD981', 'ETH (Mainnet)', true),
  ('eth', 'Base', '0x1dC115f4399636297A79cbD816843619385AD981', 'ETH (Base)', true),
  ('bnb', 'BEP20 (BNB Smart Chain)', '0x1dC115f4399636297A79cbD816843619385AD981', 'BNB (BEP20)', true),
  ('sol', 'Solana', 'HgTZ3KRr73nRyRSVMm742mnaU2G3K6uFAtCWF4t1ogRT', 'SOL (Mainnet)', true),
  ('ton', 'TON', 'UQDxl8X4zJhssUx7_cwc4A3eyQen18i2cNhP6u2Ag4W2zfVQ', 'TON (Mainnet)', true)
on conflict do nothing;

-- To make your own account an admin after signing up through the app, run:
--   update public.profiles set role = 'admin' where id = '<your-auth-user-uuid>';
