const asCurrency = number => Number(number)
   .toLocaleString({}, { style: 'currency', currency: 'USD', currencyDisplay: 'symbol', minimumFractionDigits: 2, maximumFractionDigits: 2 });

ui.add('people-balance-item', {
   props: {
      'person': {
         type: Object,
         required: true
      }
   },

   data(){
      return {
         balance: undefined
      };
   },

   mounted(){
      this.load();
   },

   methods: {
      load(){
         fetch('/api/v1/people/' + this.person._id + '/balance')
            .then(res => res.json())
            .then(balance => this.balance = balance)
            .catch(console.error);
      },

      onClick(){
         console.log(this.person._id);
      }
   },

   template:
      `
         <li class="people-balance-item" @click="onClick">
            <span class="-name">{{ person.name }}</span>
            <span class="-balance" :data-positive-ammount="balance>=0?'true':'false'">{{ asCurrency(balance) }}</span>
         </li>
      `
})
