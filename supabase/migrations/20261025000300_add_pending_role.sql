-- New accounts start with no access until an owner assigns a role.
alter type public.app_role add value if not exists 'pending' before 'owner';
