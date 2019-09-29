FROM node:lts AS builder
COPY . /app
WORKDIR /app
RUN npm ci
RUN npm run build

FROM nginx
COPY --from=builder /app/dist/ /usr/share/nginx/html
EXPOSE 80