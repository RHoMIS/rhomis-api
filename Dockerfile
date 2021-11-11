FROM node:14

# Create the app directory
WORKDIR /usr/src/rhomis-api

# Install packages
COPY package.json ./
RUN npm install

# Copy the app source code
COPY . .

EXPOSE 3001

CMD npm run start-prod




