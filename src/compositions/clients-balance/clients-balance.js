ui.add('clients-balance', {
   components: {
      'clients-balance-item': ui.get('clients-balance-item')
   },
   data(){
      return {
         clients_balance: []
      };
   },
   mounted(){
      this.load();
   },
   methods: {
      load(){
         fetch('/api/v1/clients/balance')
            .then(res => res.json())
            .then(items => this.clients_balance = items)
            .catch(console.error);
      }
   },
   template:
      `
      <ul>
         <clients-balance-item :data="balance" v-for="balance in clients_balance">
         </clients-balance-item>
      </ul>
      `
});
