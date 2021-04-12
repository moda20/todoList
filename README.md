## GraphQL and MongoDB and NodeJs express server with typescript

This is the backend service of two services, that run in separate containers.
it is made with nodejs express web and application server using typescript,
running graphQL server instead of REST calls and using mongodb as a database.


### Install

The main Express App entry point is `src/server.ts`.
Before launch, we will need to install all dependencies using 
````javascript
npm install
````
then launch using nodemon for development
```javascript
nodemon
```
or
```javascript
npm run start
```


### Usage
In order to use the server, you will need to link it with a mongodb server, 
the mongoDb server connection string cna be edited in .env file found in the root directory
of the project. 

```
DB_CONNEXION_STRING="mongodb://backendUser:backEndUser@mongodb:27017/todo"
```

the current default connection string is linked with the bundled mongodb container
