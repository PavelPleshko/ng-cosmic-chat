FROM node:lts

ENV workdir app/chat

COPY . ${workdir}

ENTRYPOINT ['./server/server.js']
