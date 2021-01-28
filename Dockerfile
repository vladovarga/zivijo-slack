FROM node:14.15.4-alpine3.12

# Go to app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json .

# npm install
# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY ./src .

# Run tests
RUN set +x && \
  node test.js

EXPOSE 8080

# At container start, run this command
CMD [ "node", "cron-wrapper.js" ]
