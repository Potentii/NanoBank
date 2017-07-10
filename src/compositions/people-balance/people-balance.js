ui.add('people-balance', {
   components: {
      'people-balance-item': ui.get('people-balance-item')
   },
   data(){
      return {
         people: []
      };
   },
   mounted(){
      this.load();
   },
   methods: {
      load(){
         fetch('/api/v1/people')
            .then(res => res.json())
            .then(people => this.people = people)
            .catch(console.error);
      }
   },
   template:
      `
      <ul class="people-balance">
         <people-balance-item :person="person" v-for="person in people"/>
      </ul>
      `
});
