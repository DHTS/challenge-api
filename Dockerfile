FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN echo "Build completed successfully"
EXPOSE 3000
CMD ["npm", "run", "start:prod"]