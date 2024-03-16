FROM node:alpine AS builder

WORKDIR /app

COPY package.json package.json

RUN npm install

COPY src src
COPY public public

RUN npm run build

FROM nginx:latest

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]