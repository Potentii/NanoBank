// *Requiring the needed modules:
const ModelSynchronizer = require('module');
const { COLLECTIONS } = require('../meta');



/**
 * Model synchronization for the core database
 * @class
 * @augments ModelSynchronizer
 */
class CoreModelSynchronizer extends ModelSynchronizer{
   constructor(){super()}



   /**
    * @override
    * @inheritdoc
    */
   sync(conn){
      // *Applying the collections:
      conn.model(COLLECTIONS.LOAN,     require('../collections/loan')());
      conn.model(COLLECTIONS.PERSON,   require('../collections/person')());
      conn.model(COLLECTIONS.PAYMENT,  require('../collections/payment')());
      conn.model(COLLECTIONS.DONATION, require('../collections/donation')());
   }
}



// *Exporting this class:
module.exports = CoreModelSynchronizer;
