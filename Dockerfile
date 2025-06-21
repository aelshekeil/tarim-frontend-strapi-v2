# Stage 1: Build the React app
FROM node:20-alpine as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./ 
RUN npm install -g pnpm && pnpm fetch --prod

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

