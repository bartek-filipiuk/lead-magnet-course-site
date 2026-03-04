FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
RUN apk add --no-cache apache2-utils
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker-entrypoint-custom.sh /docker-entrypoint.d/40-generate-htpasswd.sh
RUN chmod +x /docker-entrypoint.d/40-generate-htpasswd.sh
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/prompts/BOOTSTRAP_PROMPT.md || exit 1
