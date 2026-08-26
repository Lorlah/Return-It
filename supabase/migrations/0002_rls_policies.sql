-- Row-level security. Default-deny: enabling RLS with no matching policy
-- blocks access entirely, which is the correct direction to fail.

alter table app_users        enable row level security;
alter table raw_documents    enable row level security;
alter table detected_returns enable row level security;
alter table pickup_orders    enable row level security;
alter table events           enable row level security;

-- Users see only themselves.
create policy app_users_self on app_users
  for all using (auth_user_id = auth.uid());

-- Everything else is reachable only through ownership of the parent user row.
create policy raw_documents_own on raw_documents
  for all using (
    user_id in (select id from app_users where auth_user_id = auth.uid())
  );

create policy detected_returns_own on detected_returns
  for all using (
    user_id in (select id from app_users where auth_user_id = auth.uid())
  );

create policy pickup_orders_own on pickup_orders
  for all using (
    user_id in (select id from app_users where auth_user_id = auth.uid())
  );

-- Events are readable by the owner of the entity but never writable from the
-- client: the audit log must only be appended server-side.
create policy events_read_own on events
  for select using (
    entity_id in (
      select id from detected_returns
      where user_id in (select id from app_users where auth_user_id = auth.uid())
      union
      select id from pickup_orders
      where user_id in (select id from app_users where auth_user_id = auth.uid())
    )
  );
