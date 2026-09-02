-- =============================================================================
-- OpportunityHub — Referral reward automation
-- =============================================================================
-- Marks a referral as "qualified" and issues a reward the first time a
-- referred user's payment is approved by an admin. This runs server-side via
-- a trigger, so it cannot be bypassed from the client, and it is idempotent —
-- each qualifying payment can only ever trigger one reward.
-- =============================================================================

create or replace function public.handle_payment_approved()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_referral record;
  v_reward numeric;
begin
  -- Only act when a payment transitions INTO 'approved'.
  if new.status = 'approved' and (old.status is distinct from 'approved') then

    select r.* into v_referral
    from public.referrals r
    where r.referred_id = new.user_id
      and r.status = 'pending'
    limit 1;

    if v_referral.id is not null then
      select referral_reward_usdt into v_reward from public.site_settings where id = 1;
      v_reward := coalesce(v_reward, 2);

      update public.referrals
      set status = 'rewarded',
          reward_amount = v_reward,
          qualifying_transaction_id = new.id,
          rewarded_at = now()
      where id = v_referral.id
        and status = 'pending'; -- guards against double-reward races

      if found then
        insert into public.notifications (user_id, type, title, message)
        values (
          v_referral.referrer_id,
          'referral_reward',
          'You earned a referral reward!',
          format('Your referral completed a qualifying payment. You are eligible for a %s USDT reward, pending final review.', v_reward)
        );
      end if;
    end if;

    insert into public.notifications (user_id, type, title, message)
    values (new.user_id, 'payment_approved', 'Payment approved', 'Your payment has been verified and approved.');

  elsif new.status = 'rejected' and (old.status is distinct from 'rejected') then
    insert into public.notifications (user_id, type, title, message)
    values (new.user_id, 'payment_rejected', 'Payment rejected', 'Your payment could not be verified. Contact support if you believe this is an error.');
  end if;

  return new;
end;
$$;

drop trigger if exists trg_payment_approved on public.payments;
create trigger trg_payment_approved
  after update on public.payments
  for each row execute procedure public.handle_payment_approved();
