FROM node:16.20.1

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn install

COPY . .

ENV COOKIE_SECRET='test-blog'

RUN yarn build

CMD ["yarn", "start"]