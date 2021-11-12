FROM node:14

# Create the app directory
WORKDIR /usr/src/rhomis-api

# Install packages
COPY package.json ./
RUN npm install

# Copy the app source code
COPY . .

EXPOSE 3001

CMD ./node_modules/.bin/cross-env NODE_ENV=production node ./app.js



