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

EXPOSE 80 443

RUN apt update
RUN apt install certbot python3-certbot-nginx -y

CMD [ "nginx", "-g", "daemon off;" ]

# RUN certbot --nginx