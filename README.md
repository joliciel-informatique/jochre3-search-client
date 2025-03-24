# jochre3-search-client

Jochre3 OCR search engine web application, built on top of the jochre3-search API.

Includes:

- Search bar/search results with highlighted text snippets and highlighted images
- Author facets
- Advanced search (to add metadata criteria)
- Full transcribed text view with search highlights
- Ability to crowd-source metadata corrections
- Ability to crowd-source OCR corrections
- Usage statistics page for administrators
- Internationalization, with interface in English or Yiddish (right-to-left)
- Desktop, tablet and mobile friendly

## Local development

To setup the project dependencies

```sh
npm install
```

To Compile and hot-reload for development

```sh
npm run dev
```

To type-check, compile and minify for production

```sh
npm run build
```

## Building and testing a docker image

To build the docker file

```
docker build -t registry.gitlab.com/jochre/jochre3-search-client:[YOUR-TAG] .
```

To run the docker image (after replacing the tag in `docker-compose/docker-compose.yml`)

```
docker-compose -f docker-compose/docker-compose.yml up -d
```

To take it down again:

```
docker-compose -f docker-compose/docker-compose.yml down
```

To push the docker image:

```
docker login registry.gitlab.com
docker push registry.gitlab.com/jochre/jochre3-search-client:[YOUR-TAG]
```

## Customizing

You can customize the search engine by creating the following files in the public folder:

- `conf/config.json` - this file must override keys in `i18n/locales/en.json`. See `conf/config-sample.json` for an example.
  - In particular, you can add a logo to images, and change "en.header.logo" to point at your new logo.
- `privacy.html` - you can use `privacy-sample.html` as an example.

An example of customization can be found in the `docker-compose` folder.
