// *Requiring the needed modules:
const conns = require('../../repository/connections');
const { COLLECTIONS } = require('../../repository/model/meta');



module.exports = api => {
   // *Getting the collections models:
   const Loan = conns.get(conns.NAMES.ROOT).model(COLLECTIONS.LOAN);
   const Payment = conns.get(conns.NAMES.ROOT).model(COLLECTIONS.PAYMENT);



   api.get('/api/v1/system/balance', async (req, res, next) => {
      try{

         // *Getting all the loans ever made:
         const loans = await Loan
            .find()
            .select('ammount')
            .exec();

         // *Getting all the payments ever made:
         const payments = await Payment
            .find()
            .select('ammount')
            .exec();

         // *Calculating the total ammount ever lend:
         const total_lend = loans.reduce((total, loan) => total + loan.ammount, 0);

         // *Calculating the total ammount ever payed:
         const total_payed = payments.reduce((total, payment) => total + payment.ammount, 0);

         // *Calculating the system balance:
         const balance = total_lend - total_payed;

         // *Sending the total system balance:
         return res.status(200)
            .json(balance)
            .end();

      } catch(err){
         // *Responding with an internal error:
         return res.status(500)
            .json({ message: 'Internal server error' })
            .end();
      }
   });
};
