## Project setup

We've created a `Dockerfile` and a `docker-compose.yml` file to simplify the setup process. However you still have to setup Keycloak as desribed in the documentation for the REST-API (especially assigning the roles to an admin-user):

In order to use `docker-compose`:

1. git clone this repo, as well as `git clone https://github.com/sirixdb/sirix.git`.
2. put the docker-compose file in the parent directory of these two repositories.
3. Start Keyclock with the command `sudo docker-compose up waitforkeycloak` from your sirixdb directory with the copied `docker-compose.yml` file.
4. In your browser navigate to http://127.0.0.1:8080 and click on the link "Administration Console" (if Docker is running on a VM, use the IP of the VM).
5. Use username "admin", password "admin" to log in.
6. Navigate to `Clients` => `sirix`.
7. Navigate to the `Credentials` tab and generate a new secret (only needed for production purposes). Put this secret in `sirix/bundles/sirix-rest-api/src/main/resources/sirix-conf.json` as the value for `client.secret`.
8. Remove the `oAuthFlowType` and `redirect.uri` fields from the above file, and modify the `keycloak` and `cors` fields as apropriate.
9. Create a user: `Users` => `Add User` => Username admin. Under `Credentials` => New password => admin / admin. Set Temporary to off. Under `Role Mappings` add the 4 roles: `create`, `delete`, `modify`, `view`.
10. Start the SirixDB HTTP-Server with the command `sudo docker-compose up -d server`.
11. before developing, run `npm run build:tailwind`. This command should also be run after running the build or export NPM scripts.

## Developing in the browser

1. Start the sapper server: `npm run dev`.
2. In your browser navigate to http://localhost:3000.

## Develop with Tauri

You need to follow the [tauri setup guide](https://github.com/tauri-apps/tauri/wiki) first. Note that the NPM tauri package is included in the dependencies of this project. 

1. run `npm run dev`.
2. run `npm run tauri dev`.

#### To build with Tauri

> NOTE: this does not yet work properly.
1. run `npm run export`.
2. run `tauri build`.


Because the project uses a sapper runtime dependency (that does not exist until *after* compilation), any imports from sapper will trigger a typescript error. However, the project will still compile despite sapper import errors, and typescript will not complain on reloads, only on sapper startup.
