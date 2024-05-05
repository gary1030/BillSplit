FROM node:22-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma/

RUN npx prisma generate

RUN npm prune --production

COPY . .

EXPOSE 8000

CMD [ "node", "./bin/www" ]
