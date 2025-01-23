# Base configuration
ARG node_tag=22-alpine
FROM node:${node_tag} AS base
WORKDIR /app

# Install dependencies and build
FROM base AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install pnpm globally
RUN corepack enable

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile --shamefully-hoist

# Copy source code and build
COPY . .
RUN --mount=type=cache,id=nuxt,target=/app/node_modules/.cache/nuxt/.nuxt \
  pnpm run build

# Final production container
FROM base AS runtime
ENV NODE_ENV=production

WORKDIR /app
EXPOSE 3000

HEALTHCHECK --retries=10 --start-period=5s \
  CMD wget --no-verbose --spider http://0.0.0.0:3000/ || exit 1

# Copy build output
COPY --from=builder /app ./

# Default command
CMD ["node", ".output/server/index.mjs"]
