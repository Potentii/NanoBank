// *Requiring the needed modules:
const conns = require('../../repository/connections');
const { COLLECTIONS } = require('../../repository/model/meta');



module.exports = api => {
   // *Getting the collections models:
   const Person = conns.get(conns.NAMES.ROOT).model(COLLECTIONS.PERSON);
   const Loan = conns.get(conns.NAMES.ROOT).model(COLLECTIONS.LOAN);
   const Payment = conns.get(conns.NAMES.ROOT).model(COLLECTIONS.PAYMENT);



   api.get('/api/v1/people', (req, res, next) => {
      // *Retrieving all the found people:
      return Person
         .find()
         .exec()
         .then(persons_found => {
            // *Responding with an array of all people:
            res.status(200)
               .json(persons_found)
               .end();
         })
         .catch(err => {
            // *Responding with a internal error:
            return res.status(500)
               .json({ message: 'Internal server error' })
               .end();
         });
   });



   api.get('/api/v1/people/:id/balance', (req, res, next) => {
      const id = req.params.id;

      return Person
         .findOne({ _id: id })
         .exec()
         .then(person_found => {
            if(person_found)
               return Loan
                  .find({ _person: person_found._id })
                  .select('_id ammount')
                  .exec()
                  .then(async loans_found => {
                     const loans_total_ammount = loans_found.reduce((total, loan) => total + loan.ammount, 0);

                     let balance = loans_total_ammount;

                     for(let loan_found of loans_found){
                        const payments_found = await Payment
                           .find({ _loan: loan_found._id })
                           .select('ammount')
                           .exec();

                        for(let payment_found of payments_found){
                           balance -= payment_found.ammount;
                        }

                     }

                     res.status(200)
                        .json(balance)
                        .end();
                  });
            else
               // *Responding with a internal error:
               res.status(404)
                  .end();
         })
         .catch(err => {
            console.error(err);
            return res.status(500)
               .json({ message: 'Internal server error' })
               .end();
         });
   });



   api.post('/api/v1/people', (req, res, next) => {
      const name = req.body.name;

      return new Person({ name })
         .save()
         .then(person_created => {
            res.status(200)
               .json({ id: person_created._id })
               .end();
         })
         .catch(err => {
            // *Checking if the error has been thrown by the database:
            if(err.name === 'MongoError'){
               // *If it has:
               // *Checking the error code:
               switch(err.code){
               // *If the person already exists:
               case 11000:
                  return res.status(400)
                     .json({ message: 'Person already exist' })
                     .end();
               }
            }

            // *Checking if it is a validation error:
            if(err.name === 'ValidationError'){
               // *If it has:
               // *Checking the error kinds for the name:
               if(err.errors.name.kind === 'required')
                  return res.status(400)
                     .json({ message: 'The person name isn\'t valid' })
                     .end();
            }

            return res.status(500)
               .json({ message: 'Internal server error' })
               .end();
         });
   });
};
