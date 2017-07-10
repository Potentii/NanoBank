pages.add('index', '/', {
   components: {
      'custom-header': ui.get('custom-header'),
      'custom-footer': ui.get('custom-footer'),
      'people-balance': ui.get('people-balance'),
      'system-balance': ui.get('system-balance')
   },
   template:
      `
      <div class="index-page content-page">
         <div class="content-wrapper">
            <people-balance/>
         </div>
         <custom-footer>
            <system-balance/>
         </custom-footer>
      </div>
      `
});
