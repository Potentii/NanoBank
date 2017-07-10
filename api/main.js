// *Requiring the needed modules:
const dotenv = require('dotenv');
const Configurator = require('w-srvr');
const conns = require('../repository/connections');
const CoreModelSynchronizer = require('../repository/model/synchronizers/core-model-synchronizer');

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
 * @return {Promise} A promise that resolves into a { server, address } object, or rejects if something went wrong
 */
function start(){
   try{
      // *Loading the environment variables:
      dotenv.config({ path: require('path').join(__dirname, '../.env') });

      // *Starting the database:
      return conns.registerAndConnectAndSync(conns.NAMES.ROOT, {
            database: process.env.DB_SCHEMA,
            host:     process.env.DB_HOST || '127.0.0.1',
            port:     process.env.DB_PORT || '27017',
            user:     process.env.DB_USER,
            pass:     process.env.DB_PASS
         }, new CoreModelSynchronizer())

         // *Setting up the API routes:
         .then(conn => {
            // *Setting the server port:
            server.port(process.env.PORT);

            // *Mapping the static resources:
            server.static
               .add('/static/libs',         '../src/node_modules')
               .add('/static/controls',     '../src/controls')
               .add('/static/identity',     '../src/identity')
               .add('/static/elements',     '../src/elements')
               .add('/static/components',   '../src/components')
               .add('/static/compositions', '../src/compositions')
               .add('/static/pages',        '../src/pages')
               .index('../src/index.html', {root_only:false});

            // *Configuring the JSON parser:
            server.api.most('/api/v1/*').advanced.parseJSON();

            require('./routes/people')(server.api);
            require('./routes/system')(server.api);

            // *Sending a '404 NOT FOUND' response, as none of the API routes have matched:
            server.api.most('/api/v1/*', (req, res, next) => res.status(404).end());

            // *Starting the server:
            return server.start();
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
   conns.disconnectAll()
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


module.exports = { start, finish };
