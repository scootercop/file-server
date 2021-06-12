# file-server
Static file hosting server with streaming capability, neat UI and folder download option

To start the server run the following commands in root folder in order

1. `npm install`
2. `npm run build:prod`
3. `cd server && tsc && cd ..`
4. `node public/server/server.js Absolute_path_to_directory username password`

*Careful : the server can take some time to start if there are too many files in `Absolute_path_to_director` as directory structure is generated the ASA server starts.*

#Known issues: 

You will run into an issue when u run npm install as the type def file for http-server is not up to date and i've used options that are not present yet. I have raised a PR to fix that in the original repo and will update version here once it is available. Till then goto the definition file for http-server and add the following 

 `username : string;` 
 
 `password: string;`
