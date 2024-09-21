FROM node:20-alpine As deps
WORKDIR /prepforge
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node

FROM node:20-alpine As builder
WORKDIR /prepforge
COPY --chown=node:node package-lock.json ./
COPY --chown=node:node --from=deps /prepforge/node_modules ./node_modules
COPY --chown=node:node . .
ENV NODE_ENV production
RUN npm run build
USER node

FROM node:20-alpine As runner
WORKDIR /prepforge
COPY --chown=node:node --from=builder /prepforge/.env ./.env
COPY --chown=node:node --from=builder /prepforge/node_modules ./node_modules
COPY --chown=node:node --from=builder /prepforge/dist ./dist
ENV NODE_ENV production
ENV PORT 8080
EXPOSE $PORT
CMD ["node", "dist/main.js"]
