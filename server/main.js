// *Requiring the needed modules:
const Configurator = require('w-srvr');
const db = require('../api/db.js');
const routes = require('../api/routes.js');

// *Creating a new server configurator:
const server = new Configurator();

// *Setting the finish flag:
let finish_signaled = false;



// *When process is interrupted, finishing the program:
process.on('SIGINT', finish);

// *When the process doesn't have any other task left:
process.on('exit', code => {
   // *Logging it out:
   console.log('finished');
});



// *Starting the server:
start()
   .then(info => {
      console.log('Server started @ ' + info.address.href);
   })
   .catch(err => {
      console.error(err);
      finish();
   });



/**
 * Starts the server
 * @return Promise A promise that resolves into a { server, address } object, or rejects if something went wrong
 */
function start(){
   try{
      // *Loading the environment variables:
      return loadEnv('./.env')
         // *Starting the database:
         .then(() => db.start({
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_SCHEMA
         }))
         // *Setting up the API routes:
         .then(knex => routes(knex))
         // *Setting up the server:
         .then(routes => {
            // *Appending the server promise in the chain:
            return server

               // *Setting the server port:
               .port(process.env.PORT)

               // *Mapping the static resources:
               .static
                  .add('/static/libs',          '../src/node_modules')
                  .add('/static/controls',      '../src/controls')
                  .add('/static/identity',      '../src/identity')
                  .add('/static/elements',      '../src/elements')
                  .add('/static/components',    '../src/components')
                  .add('/static/compositions',  '../src/compositions')
                  .add('/static/pages',         '../src/pages')
                  .index('../src/index.html', {root_only:false})
                  .done()

               // *Configuring the API:
               .api
                  .most('/api/v1/*')
                     .advanced
                     .parseJSON()
                     .done()

                  // *Defining routes for users resources:
                  .most(['/api/v1/users', '/api/v1/users/*'], (req, res, next) => res.status(501).end())

                  // *Defining routes for clients resources:
                  .get('/api/v1/clients/:id/transactions',  routes.clients.getTransactions)
                  .get('/api/v1/clients/:id/accounts',      routes.clients.getAccounts)
                  .get('/api/v1/clients/:id/balance',       routes.clients.getOneBalance)
                  .get('/api/v1/clients/balance',           routes.clients.getManyBalance)
                  .get('/api/v1/clients/:id',               routes.clients.getOne)
                  .get('/api/v1/clients',                   routes.clients.getMany)
                  .post('/api/v1/clients',                  routes.clients.add)
                  .put('/api/v1/clients/:id',               routes.clients.update)
                  .delete('/api/v1/clients/:id',            routes.clients.remove)

                  // *Defining routes for accounts resources:
                  .get('/api/v1/accounts/:id/transactions',    routes.accounts.getTransactions)
                  .get('/api/v1/accounts/:id/client',          routes.accounts.getClient)
                  .get('/api/v1/accounts/:id/balance',         routes.accounts.getOneBalance)
                  .get('/api/v1/accounts/balance',             routes.accounts.getManyBalance)
                  .get('/api/v1/accounts/:id',                 routes.accounts.getOne)
                  .get('/api/v1/accounts',                     routes.accounts.getMany)
                  .post('/api/v1/accounts',                    routes.accounts.add)
                  .put('/api/v1/accounts/:id',                 routes.accounts.update)
                  .delete('/api/v1/accounts/:id',              routes.accounts.remove)

                  // *Defining routes for transactions resources:
                  .most(['/api/v1/transactions', '/api/v1/transactions/*'], (req, res, next) => res.status(501).end())

                  // *Sending a '404 NOT FOUND' response, as none of the API routes have matched:
                  .most('/api/v1/*', (req, res, next) => res.status(404).end())

                  .done()

               // *Starting the server:
               .start()
         });
   } catch(err){
      // *Rejecting the promise if something went wrong:
      return Promise.reject(err);
   }
}



/**
 * Finishes all the services, and then end the process
 */
function finish(){
   // *Checking if the finish signal has been set already, returning if it has:
   if(finish_signaled) return;

   // *Setting the finish signal:
   finish_signaled = true;

   // *Stopping the database:
   db.stop()
      // *Stopping the server:
      .then(() => server.stop())
      // *Stopping the process:
      .then(() => process.exit(0))
      .catch(err => {
         // *If something bad happens:
         // *Logging the error:
         console.error(err);
         // *Stopping the process:
         process.exit(1);
      });
}



/**
 * Loads the app environment
 * @param {string} env_file The environment file path, relative to CWD
 * @return Promise          A promise that resolves if the
 */
function loadEnv(env_file){
   return new Promise((resolve, reject) => {
      try{
         // *Rewuiring the needed modules:
         const path = require('path');
         const fs = require('fs');

         // *Building the absolute file path:
         const file_path = path.join(process.cwd(), env_file);

         // *Checking if the path points to a file, throwing an error if it don't:
         if(!fs.statSync(file_path).isFile())
            throw new Error('\"env_file\" must point to the environment file');

         // *Reading the environment file's content:
         const content = fs.readFileSync(file_path, 'utf8');

         // *Setting up the parsing regex:
         const regex = /\s*?(\w+?)\s*?=\s*?(\w+?)\s*?\r/ig;

         // *Declaring the parsing match variable:
         let match;

         // *Parsing the file:
         do{
            // *Getting the next match:
            match = regex.exec(content);
            // *Chgecking if the match is valid:
            if(match && match[1] && match[2]){
               // *If it is:
               // *Loading it into the app environment:
               process.env[match[1]] = match[2];
            }
         } while(match);

         // *Resolving the promise:
         resolve();

      } catch(err){
         // *If an error has been thrown:
         // *Rejecting with the error:
         reject(err);
      }
   });
}
