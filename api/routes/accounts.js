
// *Exporting the routes:
module.exports = knex => {

   // *Requiring the default CRUD routes factory for this resource:
   const crud_routes_factory = require('./crud-routes-factory.js')('account', knex);



   /**
    * Retrieves one resource from the database given its 'id'
    */
   function getOne(req, res, next){
      // *Extracting the 'id' from the request's url:
      const id = req.params.id;

      // *Executing the default CRUD route:
      return crud_routes_factory.getOne(req, res, next, {id});
   }



   /**
    * Retrieves all resources from the database
    */
   function getMany(req, res, next){
      // *Executing the default CRUD route:
      return crud_routes_factory.getMany(req, res, next);
   }



   /**
    * Creates a new resource in the database
    */
   function add(req, res, next){
      // *Extracting the insert data from the request's body:
      const insert_data = {
         description: req.body.description,
         client_fk: req.body.client_fk
      };

      // *Executing the default CRUD route:
      return crud_routes_factory.add(req, res, next, { insert_data });
   }



   /**
    * Updates an existing resource in the database
    */
   function update(req, res, next){
      // *Extracting the 'id' from the request's url:
      const id = req.params.id;

      // *Extracting the update data from the request's body:
      const update_data = {
         description: req.body.description,
         client_fk: req.body.client_fk
      };

      // *Executing the default CRUD route:
      return crud_routes_factory.update(req, res, next, { id, update_data });
   }



   /**
    * Removes an existing resource from the database
    */
   function remove(req, res, next){
      // *Extracting the 'id' from the request's url:
      const id = req.params.id;

      // *Executing the default CRUD route:
      return crud_routes_factory.remove(req, res, next, { id });
   }



   /**
    * Retrieves the account's balance, given its 'id'
    */
   function getOneBalance(req, res, next){
      // *Extracting the 'id' from the request's url:
      const id = req.params.id;

      // *Getting the query builder for this resource's view:
      return knex('account_balance')
         // *Selecting all the available fields:
         .select('*')
         // *Adding the condition:
         .where({account_id: id})
         // *When the query resolves:
         .then(items => {
            // *Checking if any item has been found:
            if(items.length)
               // *If it has:
               // *Sending a '200 OK' response with the first item found:
               res.status(200).json(items[0]).end();
            else
               // *If it hasn't:
               // *Sending a '404 NOT FOUND' response:
               res.status(404).end();
         })
         .catch(err => {
            res.status(500).end();
         });
   }



   /**
    * Retrieves all the accounts' balance
    */
   function getManyBalance(req, res, next){
      // *Getting the query builder for this resource's view:
      return knex('account_balance')
         // *Selecting all the available fields:
         .select('*')
         // *When the query resolves:
         .then(items => {
            // *Sending a '200 OK' response with all the found items:
            res.status(200).json(items).end();
         })
         .catch(err => {
            res.status(500).end();
         });
   }



   /**
    * Retrieves an account's client, given the account 'id'
    */
   function getClient(req, res, next){
      // *Extracting the 'id' from the request's url:
      const id = req.params.id;

      // *Getting the query builder for this resource's view:
      return knex('account_client')
         // *Selecting all the available fields:
         .select('*')
         // *Adding the condition:
         .where({account_id: id})
         // *When the query resolves:
         .then(items => {
            // *Checking if any item has been found:
            if(items.length)
               // *If it has:
               // *Sending a '200 OK' response with the first item found:
               res.status(200).json(items[0]).end();
            else
               // *If it hasn't:
               // *Sending a '404 NOT FOUND' response:
               res.status(404).end();
         })
         .catch(err => {
            res.status(500).end();
         });
   }



   /**
    * Retrieves a account's transactions, given its 'id'
    */
   function getTransactions(req, res, next){
      // *Extracting the 'id' from the request's url:
      const id = req.params.id;

      // *Getting the query builder for this resource's view:
      return knex('account_transactions')
         // *Selecting all the available fields:
         .select('*')
         // *Adding the condition:
         .where({account_id: id})
         // *When the query resolves:
         .then(items => {
            // *Sending a '200 OK' response with all the found items:
            res.status(200).json(items).end();
         })
         .catch(err => {
            res.status(500).end();
         });
   }



   // *Returning the routes available:
   return {
      getOne,
      getMany,
      add,
      update,
      remove,
      getOneBalance,
      getManyBalance,
      getClient,
      getTransactions
   };

};
