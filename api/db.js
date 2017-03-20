/**
 * The knex instance
 */
let knex = null;



/**
 * Starts a knex instance and test its connections pool
 * @param  {object} settings The setting to configure the database connection
 * @return {Promise<knex>} A promise that resolves with the knex instance, or rejects if some error happened
 */
function start(settings){

   // *Returning a promise chain:
   return new Promise((resolve, reject) => {
      // *Trying to get a knex instance:
      try{

         // *Checking if the database settings are set, throwing an error if they aren't:
         if(settings.user===undefined || settings.user===null)
            throw new Error('Missing database user');
         if(settings.password===undefined || settings.password===null)
            throw new Error('Missing database password');
         if(settings.database===undefined || settings.database===null)
            throw new Error('Missing database schema');

         // *Requiring the knex module and configuring it:
         knex = require('knex')({
            client: 'mysql2',
            connection: {
               host : '127.0.0.1',
               user : settings.user,
               password : settings.password,
               database : settings.database
            },
            pool: {
               min: 1,
               max: 7
            }
         });

         // *Resolving with the configured knex instance:
         resolve(knex);
      } catch(err){
         // *If some error happened:
         // *Rejecting with the error:
         reject(err);
      }
   })

   // *Testing the pool:
   .then(knex => {
      // *Appending a 'pool connection test' into the promise chain:
      return new Promise((resolve, reject) => {
         // *Setting a timeout flag:
         let timeout = false;

         // *Setting up a timeout timer:
         const timer = setTimeout(() => timeout = true, knex.client.config.acquireConnectionTimeout || 60000);

         // *Trying to acquire a new connection from the internal knex pool:
         knex.client.pool.acquire((err, conn) => {
            // *Releasing the connection:
            knex.client.pool.release(conn);

            // *Checking if some error has been thrown, rejecting if it has:
            if(err) return reject(err);

            // *Checking if the test has timed out, rejecting if it has:
            if(timeout) return reject(new Error('The pool connection test has timed out'));

            // *Stopping the timeout timer:
            clearTimeout(timer);

            // *Resolving with the knex instance:
            resolve(knex);
         });

      });

   });

}



/**
 * Stops the knex connections
 * @return {Promise}
 */
function stop(){
   // *Checking if the knex variable is assigned, resolving if it's not:
   if(!knex) return Promise.resolve();

   // *Closing the connections and returning a promise:
   return knex.destroy();
}



// *Exporting this module:
module.exports = { start, stop };
