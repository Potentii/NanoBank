pages.add('index', '/', {
   components: {
      'clients-balance': ui.get('clients-balance')
   },
   template:
      `
      <div>
         <clients-balance></clients-balance>
      </div>
      `
});
