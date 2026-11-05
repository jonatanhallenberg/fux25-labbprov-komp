# Lånekortet i en container. Porten är bytt till 80 efter er feedback, nu funkar den i drift /byrån
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 80
CMD ["npx", "vite", "preview", "--host", "--port", "80"]
