# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=20.17.0

ARG PACKAGE
ARG PORT=3000

ARG PNPM_VERSION=9.10.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base


# Install python deps for node-gyp
RUN apk add g++ make py3-pip ca-certificates curl

# Setup RDS CA Certificates

RUN curl -L \
  -o  /usr/local/share/ca-certificates/rds-global-bundle.pem \
  https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem \
  && update-ca-certificates

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Install pnpm.
RUN --mount=type=cache,target=/root/.npm \
  npm install -g pnpm@${PNPM_VERSION}

################################################################################
# Create a stage for building the application.
FROM base as fetch-deps

# install postgres utilities for scripts
RUN apk add postgresql
# if booting without a command, just sit and wait forever for a term signal
CMD exec /bin/sh -c "trap : TERM INT; sleep infinity & wait"

# Copy pnpm-lock.yaml so that we can use pnpm to install dependencies
COPY ./pnpm-lock.yaml ./

RUN pnpm fetch 

FROM fetch-deps as monorepo

ADD . ./

RUN pnpm install -r --offline 

RUN pnpm p:build

FROM monorepo AS withpackage

ARG PACKAGE

RUN test -n "$PACKAGE" || (echo "PACKAGE  not set, required for this target" && false)

ENV DOCKERBUILD=1

RUN pnpm --filter $PACKAGE build && \
  pnpm --filter $PACKAGE --prod deploy /tmp/app && \
  pnpm --filter $PACKAGE exec \
  cp next.docker.config.js /tmp/app/next.config.js && \
  cp core/.env.docker /tmp/app/.env

# Necessary, perhaps, due to https://github.com/prisma/prisma/issues/15852
RUN if [[ ${PACKAGE} == core ]]; \
  then \
  find . -path '*/node_modules/.pnpm/@prisma+client*/node_modules/.prisma/client' \
  | xargs -r -I{} sh -c " \
  rm -rf /tmp/app/{} && \
  mkdir -p /tmp/app/{} && \
  cp -a {}/. /tmp/app/{}/" ; \
  fi

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base AS app
ARG PORT

# # needed so that the CMD can use this var
# ENV PACKAGE=$PACKAGE

# Use production node environment by default.
ENV NODE_ENV production

# Copy the deployed contents
COPY --from=withpackage /tmp/app \
  ./

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE $PORT
# Run the application.
CMD pnpm start


# to be used in `docker-compose.test.yml`
FROM monorepo as test-setup

RUN echo "Setting up ${PACKAGE} for testing"

# Expose the port on which your app runs
# not sure if necessary
EXPOSE ${PORT}

ENV PACKAGE=${PACKAGE}

RUN pnpm --filter core prisma generate