FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080

# zadefinujem slack token
ENV SLACK_TOKEN=xoxb-1654462618871-1681886837441-vFUZrGDquWVjxQLbJaTAE4IO

# spustim testy
CMD [ "node", "test.js" ]

# ak vsetko zbehlo spustim cron
CMD [ "node", "cron-wrapper.js" ]