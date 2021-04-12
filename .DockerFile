FROM node:lts
RUN apt-get update && apt-get install -y \
    vim \
    git
WORKDIR /home/node/app
RUN mkdir -p /home/node/app/upload
COPY package*.json ./
COPY . .
RUN npm install
RUN npm install -g nodemon

EXPOSE 3004
CMD ["nodemon"]
