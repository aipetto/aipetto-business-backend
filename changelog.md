## Changelog

*v1.0.2*
- [ ] Make Services, Breeds, Pets, Categories, Languages, Countries Tenant-free as they are modules shared across the entire platform
- [ ] Allow multiple signin via Facebook/Google and email complementing each other instead of only one signin.
- [ ] Add Socket.io for chat communication used on both app and web
- [ ] Add Unit Tests for core modules(Repositories, Storage, Security, HTTP, Sockets) and domain ones (business, pets, user, services, reservation, payment)
- [ ] Allow users to sign in without need immediate validation via email - authService.ts
- [ ] Assign System Generated Tenant for all users in all occasions including Facebook/Google SignIn
- [ ] App Search Cloud/ElasticSearch integration for categories, services X business places main search
- [ ] Assign x points to users once they are registered to platform and sending this information on the registration email communicating it
- [ ] Add posts, post categories, points challenges