FROM node:lts AS builder
WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY . /app/
ARG environment=production
ENV NODE_ENV=$environment
RUN npm run build

FROM nginx
COPY --from=builder /app/dist/ /usr/share/nginx/html
COPY contrib/nginx-default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
