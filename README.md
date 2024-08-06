# Notes, Todo

- refactoring most be done in the map marker area:
    - how to manage to have the client location and the server side action?
    - now we have a double code: first time loaded markers and locally added markers.
    - also for adding markers we have double code to fix.
    - fix lat lon json to simple two columns!
- modal for new point
- modal for marker list?
- edit marker name and type (now only the location)
- owner id and collab users

# SolidStart

Everything you need to build a Solid project, powered by [`solid-start`](https://start.solidjs.com);

## Creating a project

```bash
# create a new project in the current directory
npm init solid@latest

# create a new project in my-app
npm init solid@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev
```

## Building

Solid apps are built with _adapters_, which optimise your project for deployment to different environments.

By default, `npm run build` will generate a Node app that you can run with `npm start`. To use a different adapter, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

## This project was created with the [Solid CLI](https://solid-cli.netlify.app)
