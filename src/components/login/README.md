# Login

This directory contains components related to authentication.

## `Inner.svelte`

This is the authentication form shown on the `/login` route

Logic is handled by its parent component, `Login.svelte`.

## `Login.svelte`

This component catches the submit event from `Inner.svelte`, and authenticates based on it. It then emits a redirect event.

## `CheckLogin.svelte`

This component asserts that the user is authenticated, and redirects to the login page if not.

### TODO

This component should also use register the page redirected from in a svelte store, which can then be used to redirect back to the page the user was attempting to access (while current behavior is that the `/login` route simply redirects to the `/resources` route).
