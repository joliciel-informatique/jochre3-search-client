# jochre3-search-client

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### To build the docker file

```
docker build -t registry.gitlab.com/jochre/jochre3-search-client:[YOUR-TAG] .
```

### To run the docker image

```
docker-compose -f docker-compose/docker-compose.yml up -d
```

To take it down again:

```
docker-compose -f docker-compose/docker-compose.yml down
```

### Customizing

You can customize the search engine by creating the following files in the public folder:

- conf/config.json - this file must override keys in i18n/locales/en.json. See conf/config-sample.json for an example.
  - In particular, you can add a logo to images, and change "en.header.logo" to point at your new logo.
- privacy.html - you can use privacy-sample.html as an example.
