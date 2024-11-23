FROM --platform=linux/amd64 node:23.3.0-alpine3.19 AS build

WORKDIR /usr/src/app

COPY . .

RUN npm ci
RUN npm run build

FROM --platform=linux/amd64 nginx:1.27-alpine3.20 AS prod

COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d

COPY --from=build /usr/src/app/static /usr/share/nginx/html/static

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]