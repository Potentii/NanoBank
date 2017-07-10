// *Getting the Schema class:
const { Schema } = require('mongoose');
// *Getting the schemas names:
const { COLLECTIONS } = require('../meta');



// *Exporting this module as a function:
module.exports = () => {



   const Person = new Schema({

      name: {
         type: String,
         required: true
      },

      creation_date: {
         type: Date,
         required: true,
         default: Date.now
      }

   });



   // *Exporting the schema:
   return Person;
};
