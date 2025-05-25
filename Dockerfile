# Stage 1: Build
FROM node:22.14-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:22.14-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
USER appuser
ENV PORT=3001
EXPOSE ${PORT}
CMD ["node", "./dist/main.js"]


