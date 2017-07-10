ui.add('system-balance', {
   components: {
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
         fetch('/api/v1/system/balance')
            .then(res => res.json())
            .then(balance => this.balance = balance)
            .catch(console.error);
      }
   },
   template:
      `
      <span class="system-balance" :data-positive-ammount="balance>=0?'true':'false'">{{ asCurrency(balance) }}</span>
      `
});
