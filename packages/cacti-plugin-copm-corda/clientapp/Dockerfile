FROM openjdk:17-alpine AS builder


WORKDIR /build
ADD . .
RUN ./gradlew build 

FROM openjdk:17-alpine AS all

WORKDIR /client

COPY --from=builder /build/clients/build/install /client
RUN chmod +x /client/clients/bin/clients
