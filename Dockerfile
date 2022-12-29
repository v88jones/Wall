FROM node

RUN mkdir -p /var/www/the-wall

WORKDIR /var/www/the-wall

COPY package.json ./

RUN npm install

RUN npm install -g nodemon 

COPY . .

EXPOSE 3000
CMD ["npm", "start"]

# ---- more info:
# Debugger with docker: https://dev.to/alex_barashkov/how-to-debug-nodejs-in-a-docker-container-bhi