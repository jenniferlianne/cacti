ARG BUILD_TAG

# Local Build
FROM node:18 AS builder-local

WORKDIR /opt/iinagent

ADD node_modules ./node_modules
ADD dist ./dist
ADD package.json .
ADD src /opt/iinagent/src
ADD tsconfig.json .


FROM builder-${BUILD_TAG} AS builder


FROM node:18-alpine AS prod

RUN deluser --remove-home node
RUN addgroup -g 1000 iinagent
RUN adduser -D -s /bin/sh -u 1000 -G iinagent iinagent

ENV NODE_ENV production

WORKDIR /opt/iinagent

ADD package.json .

COPY --from=builder /opt/iinagent/node_modules /opt/iinagent/node_modules
COPY --from=builder /opt/iinagent/dist /opt/iinagent/dist

RUN chown -R iinagent:iinagent /opt/iinagent

USER iinagent

ARG GIT_URL
LABEL org.opencontainers.image.source ${GIT_URL}
