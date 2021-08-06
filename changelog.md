## Changelog


- [ ] App Search Cloud/ElasticSearch integration to MongoDB for categories x services x business places main search, posts X categories X tags X pets related, pets X breeds

*v1.0.3*
- [ ] Make Services, Breeds, Pets, Categories, Languages, Countries Tenant-free as they are modules shared across the entire platform
- [ ] Add Socket.io for chat communication used on both app and web
- [ ] Allow users to sign in without need immediate validation via email - authService.ts
- [ ] Allow multiple signin via Facebook/Google and email complementing each other instead of only one signin.
- [ ] Assign System Generated Tenant for all users in all occasions including Facebook/Google SignIn
- [ ] Add Unit Tests for core modules(Repositories, Storage, Security, HTTP, Sockets) and domain ones (business, pets, user, services, reservation, payment)
- [ ] Assign x points to users once they are registered to platform and sending this information on the registration email communicating it

*v1.0.2*
- [X] Add posts, post categories, points challenges, pet business services prices
- [X] Add changes to business places model, pet model adding more fields