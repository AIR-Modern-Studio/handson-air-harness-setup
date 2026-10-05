FROM node:22.12-alpine AS builder

# Copy source files
COPY src /app/src
COPY tsconfig.json /app/tsconfig.json
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

WORKDIR /app

# Install dependencies and build
RUN --mount=type=cache,target=/root/.npm npm install
RUN npm run build

# Production dependencies
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts --omit=dev

FROM node:22-alpine AS release

# Copy built files and dependencies
COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json
COPY --from=builder /app/node_modules /app/node_modules

ENV NODE_ENV=production

WORKDIR /app

ENTRYPOINT ["node", "build/index.js"]