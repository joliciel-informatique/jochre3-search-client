# build stage
#FROM node:lts-alpine as build-stage
#Moving to previous LTS because of build failure
FROM node:20.17.0-slim as build-stage
WORKDIR /app
WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY .docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]