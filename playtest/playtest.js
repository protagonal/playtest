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

  Template.cardtemplate.deckspec = function () {
    return Spec.findOne({});
  };


  function save_cardtemplate(value) {
    var row = Spec.findOne({});
    if (typeof row !== 'undefined') {
      Spec.update(row._id, {$set: {cardtemplate: value}});
    }
  }

  Template.cardtemplate.events({
    'focusout' : function (evt) {
      var value = String(evt.target.value || "");
      console.log(value);
      save_cardtemplate(value);
    },
    'click input' : function () {
      // open editor
      var multiplier = 5;
      var width = 63 * multiplier;
      var height = 88 * multiplier;
      $("#csveditor").html('<iframe id="svg_frame" src="svg-edit/svg-editor.html?showlayers=true&dimensions=' + width + ',' + height + '" width="730" height="880"/>');
      
      var svg = Template.deckspec.deckspec().cardtemplate;      
      $('#svg_frame').ready(function() {
        var ifrm = $('#svg_frame')[0];

        function editor_ready() {
          console.log('SVG editor is ready');          
          var svgEditor = ifrm.contentWindow.svgEditor;
          svgEditor.loadFromString(svg);
          svgEditor.setCustomHandlers({
              save: function(win, data) {
                //var svg = "<?xml version=\"1.0\"?>\n" + data;
                var svg = data;
                console.log(svg);
                save_cardtemplate(svg);
              }
          });
          //svgEditor.ready(function() {});
        }

        // waiting for real load
        (function() {
          try {
            ifrm.contentWindow.svgEditor.ready(function() { editor_ready(); });
          }
          catch (e) {
            console.log(e.name, e.message);
            setTimeout(arguments.callee, 1000);
          }
        })();
        
      }); 
    }
  });

  Template.preview.uniquecards = function () {
    var cards;
    var svg;
    try {
      cards = $.csv.toObjects(Template.deckspec.deckspec().spec); 
      svg = Template.deckspec.deckspec().cardtemplate;      
    } catch (e) {
      return [];
    }
    var printer = DeckPrinter({layout: '2x2'});
    var previewcards = printer.preview(cards, svg);
    console.log(previewcards);
    return previewcards;
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Spec.find().count() === 0) {
      console.log('Inserting initial sample');
      Spec.insert({spec: 'name,cost,quantity\nknave,$1,4\ngypsy,$1,2\njester,$2,2\nking,$2,1\nqueen,$3,1\nwizard,$5,1', 
                   cardtemplate: ''});
    }
  });
}
