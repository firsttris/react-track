FROM node:12 as builder

COPY tsconfig.json ./
COPY package.json ./
COPY yarn.lock ./yarn.lock
COPY packages ./packages/

RUN yarn install --network-timeout 1000000
RUN yarn build:web
RUN yarn build:server

# FINAL IMAGE
FROM nginx:alpine
RUN apk add --no-cache nodejs

RUN apk add --no-cache tzdata
ENV TZ Europe/Berlin

COPY ./nginx /etc/nginx
COPY --from=builder /packages/app/dist-web /usr/share/nginx/html
COPY --from=builder /packages/server/ /usr/share/server/

WORKDIR /usr/share/server

EXPOSE 80

COPY start-servers.sh start-servers.sh
RUN ["chmod", "+x", "start-servers.sh"]
CMD ./start-servers.sh
