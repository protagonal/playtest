function logobj(obj) {
  if (typeof console !== 'undefined')
    console.log(JSON.stringify(obj, null, '\t'));
}
Spec = new Meteor.Collection('deckspec');

if (Meteor.isClient) {
  Template.deckspec.deckspec = function () {
    /*var spec_id = this._id;
    return _.map(this.tags || [], function (tag) {
      return {spec_id: spec_id, spec: Spec.findOne({})};
    });*/
    return Spec.findOne({});
  };

  Template.deckspec.events({
    'focusout' : function (evt) {
      var deckspec = Template.deckspec.deckspec();
      var value = String(evt.target.value || "");
      console.log(value);
      var row = Spec.findOne({});
      if (typeof row !== 'undefined') {
        Spec.update(row._id, {$set: {spec: value}});
        console.log("updated?");
      }
    },
    'click input' : function () {
      // template data, if any, is available in 'this'
      var cards = $.csv.toObjects(Template.deckspec.deckspec().spec); 
      console.log(JSON.stringify(cards, null, '\t'));

      var printer = DeckPrinter({layout: '2x2'});
      printer.print(cards);
     }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Spec.find().count() === 0) {
      console.log('Inserting initial sample');
      Spec.insert({spec: 'name,cost\nknave,$1\ngypsy,$1\njester,$2\nking,$2\nqueen,$3\nwizard,$5'});
    }
  });
}
