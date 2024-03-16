FROM node:alpine

COPY package.json /app/package.json

WORKDIR /app

RUN npm install \
    npm build

COPY . .
EXPOSE 3000

ENTRYPOINT ["npm"]
CMD ["start"]