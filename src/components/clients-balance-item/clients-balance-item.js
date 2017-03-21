ui.add('clients-balance-item', {
   props: {
      'data': {
         type: Object,
         required: true
      }
   },
   template:
      `
         <li class="clients-balance-item">
            <span class="clients-balance-item-name">{{ data.client_name }}</span>
            <span class="clients-balance-item-balance">{{ data._balance }}</span>
         </li>
      `
})
