// *Getting the Schema class:
const { Schema } = require('mongoose');
// *Getting the schemas names:
const { COLLECTIONS } = require('../meta');



// *Exporting this module as a function:
module.exports = () => {



   const Payment = new Schema({

      ammount: {
         type: Number,
         required: true,
         min: [0, '']
      },

      _loan: {
         type: Schema.Types.ObjectId,
         ref: COLLECTIONS.LOAN,
         required: true
      },

      creation_date: {
         type: Date,
         required: true,
         default: Date.now
      }

   });



   // *Exporting the schema:
   return Payment;
};
