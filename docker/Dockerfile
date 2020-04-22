FROM node:12-alpine 

RUN apk add git

WORKDIR /

RUN git clone https://github.com/itsrennyman/freschissimo.git 

WORKDIR /freschissimo

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]
