# dbsView

This directory contains components for a sidebar displaying current databases and resources, as well as components for creating new databases and resources.

### TODO

There is some generic code repeated in these files, (such as refreshing the list of databases/resources). So as to eliminate code duplication, this logic should be moved to `routes/_layout`, and triggered by way of an event.

## `Tree.svelte`

This component is the container component for the sidebar.

## `Add.svelte`

This component is the contains a button to add a database. When clicked, it will render the `AddDialog.svelte` component.

## `Database.svelte`

This component renders a tab representing a database, as well as the resources associated with that database, by way of rendering `Resources.svelte`.

It also renders a delete button, which will render an instance of `DeleteDialog.svelte`, as well as an add button, to add additional resources to the database, by way of rendering `AddDialog.svelte`.

## `Resources.svelte`

This component is a container to render a list of resources in `Resource.svelte` components.

## `Resource.svelte`

This component renders a tab representing a resource, as well as a delete button that renders `DeleteDialog.svelte`.

## `DeleteDialog.svelte`

This component renders a modal confirming that the user indeed wishes to delete a given database or resource. It also handles logic related to the actual deletion, including refreshing the svelte store of databases and resources.

## `AddDialog.svelte`

This component renders a modal in which it will render one of the following, depending on the props passed to it:

+ render `AddDatabase.svelte`
+ render `AddResource.svelte`

## `AddDatabase.svelte`

This component allows user input to create a database, with a given name and database type.

It also handles the logic required for the actual database creation, as well as refresh the svelte store of databases.

## `AddResource.svelte`

This component allows user input to create a resource, with a given name and data file.

It also handles the logic required for the actual resource creation, as well as refresh the svelte store of databases and resources.

## `Dropzone.svelte`

This component allows for the uploading of a file for resource creation, either by way of drag-and-drop, or by an upload file dialog.
