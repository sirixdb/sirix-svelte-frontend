## Project Setup - Setting up SirixDB locally

Unfortunately, this is currently a bit messy, but still rather straightforward.

There are several resources required to run SirixDB, and they can all be found in the `resources` directory of this repository.

SirixDB depends on keycloak for authentication, so we first need to run (in the directory in which you have the above resources):

```bash
docker-compose up -d keycloak
```

It can take a minute for keycloak to be ready for connections. If you like, you can use the `wait.sh` script in the above mentioned `resources` directory to wait until keycloak is ready. A script from the resources folder initializing keycloak with a user "admin" with the password "admin" is run automatically.

Once keycloak is ready, navigate to `http://localhost:8080/admin` and login using the credentials `admin`/`admin`. Click on `Users` in the sidebar navigation, then click `Add user`. Enter the name of the new user (`admin`, for example), select email verified, and click `Save`. Then, click on the credentials tab and create your password. In the `Credentials` tab, add all available roles.

Then, run

```bash
docker-compose up -d server
```

The Sirix database is now ready for use.

Alternately, you can simply run

```bash
docker-compose up -d
```

to immediately create both the keycloak and sirix containers. Although the sirix container won't be able to immediately connect, it will continue retrying.

## Developing

### Code documentation

A lot of documentation is missing. However you can find general descriptions of the files in a directory in the `README.md` file in that directory. Currently, only some directories these READMEs, they are in the process of being added.

Before developing, run `npm run build:tailwind`. This command should also be run after running the build or export NPM scripts.

### Developing in the browser

1. Start the sapper server: `npm run dev`.
2. In your browser navigate to http://localhost:3000.

### Develop with Tauri

You need to follow the [tauri setup guide](https://github.com/tauri-apps/tauri/wiki) first. Note that the NPM tauri package is included in the dependencies of this project. This is not yet configured to work on all platforms, however.

1. run `npm run dev-for-tauri`.
2. in another terminal, run `npm run dev:tauri`.

#### To build with Tauri

1. run `npm run export:tauri`.
2. run `npm run build:tauri`.
