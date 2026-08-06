-- Run this against your Supabase project's SQL editor (or via the Supabase CLI) once real
-- credentials are configured. Not run automatically by this app.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id), -- nullable: guest checkout is allowed
  email text not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  paystack_reference text unique,
  total_amount integer not null, -- kobo
  currency text not null default 'NGN',
  shipping_name text,
  shipping_phone text,
  shipping_address text,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null, -- Sanity document _id (cross-system, not a foreign key)
  product_name text not null, -- snapshotted at purchase time
  unit_price integer not null,
  quantity integer not null
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

-- Fulfillment is tracked separately from `orders.status` (which is the *payment* status, written
-- only by the Paystack callback/webhook). Sharing one column would let a retried webhook stomp an
-- admin's "shipped" back to "paid".
alter table orders add column if not exists fulfillment_status text not null default 'unfulfilled'
  check (fulfillment_status in ('unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'));

create table if not exists admin_users (
  user_id uuid primary key references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists order_emails (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  kind text not null check (kind in ('confirmation', 'status_update', 'admin_alert')),
  recipient text not null,
  subject text not null,
  status text not null default 'sent' check (status in ('sent', 'failed')),
  error text,
  created_at timestamptz not null default now()
);

-- Idempotency guard: Paystack retries webhooks, and a retry must never re-email the customer.
--
-- Scoped to status = 'sent' deliberately. Without that clause a *failed* attempt also claimed
-- the slot, so an order whose confirmation failed (bad EMAIL_FROM, unverified domain, Resend
-- outage) could never be sent one — the customer silently never heard from us.
create unique index if not exists order_emails_confirmation_once
  on order_emails (order_id) where kind = 'confirmation' and status = 'sent';

alter table orders enable row level security;
alter table order_items enable row level security;
alter table newsletter_subscribers enable row level security;
alter table admin_users enable row level security;
alter table order_emails enable row level security;

create policy "Users can check their own admin status"
  on admin_users for select
  using (auth.uid() = user_id);

-- order_emails intentionally has no client-facing policies: only server code using the
-- service-role client reads or writes it.

-- Signed-in users can read/write their own orders. Guest checkout writes (user_id is null) and
-- the Paystack webhook go through the service-role client instead, which bypasses RLS entirely.
create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Users can view their own order items"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Anyone can subscribe to the newsletter"
  on newsletter_subscribers for insert
  with check (true);

-- Grant yourself admin access after running this file. Find your uid in the Supabase Auth
-- dashboard (sign up once through the shop's auth modal first), or:
--   select id from auth.users where email = 'you@example.com';
-- then:
--   insert into admin_users (user_id) values ('<your-auth-uid>');

-- ---------------------------------------------------------------------------
-- Wishlist (added with the customer account pages)
-- ---------------------------------------------------------------------------

-- Saved products, per signed-in user. Guests keep a wishlist in localStorage instead; it is
-- merged into this table the first time they sign in.
create table if not exists wishlist_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null, -- Sanity document _id (cross-system, not a foreign key)
  created_at timestamptz not null default now(),
  -- Composite key makes "save twice" a no-op instead of a duplicate row, which is what lets
  -- the guest-wishlist merge be a plain upsert.
  primary key (user_id, product_id)
);

alter table wishlist_items enable row level security;

-- Unlike orders, the wishlist is only ever touched by the signed-in owner, so it is read and
-- written through the cookie-bound client and these policies do the enforcing.
create policy "Users can view their own wishlist"
  on wishlist_items for select
  using (auth.uid() = user_id);

create policy "Users can add to their own wishlist"
  on wishlist_items for insert
  with check (auth.uid() = user_id);

create policy "Users can remove from their own wishlist"
  on wishlist_items for delete
  using (auth.uid() = user_id);
