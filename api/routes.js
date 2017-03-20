
/**
 * Retrieves all the resources routes objects
 * @param  {*} knex The knex instance
 * @return {object} An object containing all the resources routes
 */
module.exports = knex => {
   // *Returning the resources routes set:
   return {
      users: undefined,
      clients: require('./routes/clients.js')(knex),
      accounts: require('./routes/accounts.js')(knex),
      transactions: undefined
   }
};
