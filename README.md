# file-server
Static file hosting server with streaming capability, neat UI and folder download option

To start the server run the following commands in root folder in order

1. `npm install`
2. `npm run build:prod`
3. `cd server && tsc && cd ..`
4. `node public/server/server.js Absolute_path_to_directory username password`

*Careful : the server can take some time to start if there are too many files in `Absolute_path_to_director` as directory structure is generated the ASA server starts.*

#Known issues: 

1. You will need nodejs (v10)(for tsc) as well as nodejs (v14)(some dependencies) from snap store. 
