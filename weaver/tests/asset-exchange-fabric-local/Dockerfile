FROM ubuntu:22.04
USER root
WORKDIR /home/app

ENV NODE_VERSION=18.18.2
ENV APP_USER=appuser
ENV NVM_DIR /home/${APP_USER}/.nvm
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN apt-get update
RUN apt-get -y install curl gnupg

# install node
RUN mkdir -p ${NVM_DIR}
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash 
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

ENV GO_VERSION=1.20.2
# install go
RUN curl -LO https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz 
RUN tar -xzvf go${GO_VERSION}.linux-amd64.tar.gz -C /usr/local
ENV PATH="/home/app/go/bin:/usr/local/go/bin:${PATH}"

# Use Protoc 3.15
RUN apt-get -y install unzip
RUN curl -LO https://github.com/protocolbuffers/protobuf/releases/download/v3.15.6/protoc-3.15.6-linux-x86_64.zip 
RUN unzip protoc-3.15.6-linux-x86_64.zip -d protoc
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
ENV PATH="${PATH}:/home/app/protoc/bin"


RUN apt-get -y install build-essential git gettext 

# Install Docker -- Add Docker's official GPG key:
RUN apt-get install -y ca-certificates 
RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
RUN chmod a+r /etc/apt/keyrings/docker.asc
RUN echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null
RUN apt-get update
RUN apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

