# Exact version for reproducible builds; bump it deliberately to pick up Node fixes
ARG NODE_IMAGE=node:22.23.3-alpine

FROM ${NODE_IMAGE} AS builder

WORKDIR /app

# Install dependencies first, so this layer is cached while only the source changes
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts

# Build once (--ignore-scripts above skips the build that `prepare` would run)
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Production dependencies
RUN npm prune --omit=dev

FROM ${NODE_IMAGE} AS release

ENV NODE_ENV=production

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules

# The readme://documentation resource reads ../../README.md from build/resources/
COPY README.md ./README.md

USER node

ENTRYPOINT ["node", "build/index.js"]
