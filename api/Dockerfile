FROM node:20-alpine

# Install OpenSSL for Prisma and curl/wget for healthchecks
# procps is useful for nestjs monitoring sometimes, but openssl is critical
RUN apk add --no-cache openssl wget procps

WORKDIR /app

# We don't copy package.json here because the volume mount in docker-compose 
# overlays the host directory. 
# However, if we were building for production, we would COPY . .
# For development with volume mounts, this Dockerfile just provides the environment.

# The command in docker-compose will handle dependency installation
