// *Getting the Schema class:
const { Schema } = require('mongoose');
// *Getting the schemas names:
const { COLLECTIONS } = require('../meta');



// *Exporting this module as a function:
module.exports = () => {



   const Donation = new Schema({

      description: {
         type: String,
         required: true
      },

      ammount: {
         type: Number,
         required: true,
         min: [0, '']
      },

      _person: {
         type: Schema.Types.ObjectId,
         ref: COLLECTIONS.PERSON,
         required: true
      },

      creation_date: {
         type: Date,
         required: true,
         default: Date.now
      }

   });



   // *Exporting the schema:
   return Donation;
};
