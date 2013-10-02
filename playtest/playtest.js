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

  function editSVG(cardid) {
    // open editor
    var multiplier = 5;
    var width = 63 * multiplier;
    var height = 88 * multiplier;
    $("#csveditor").html('<iframe id="svg_frame" src="svg-edit/svg-editor.html?showlayers=true&dimensions=' + width + ',' + height + '" width="730" height="880"/>');
    
    var card = getdeckcard(cardid);
    var svg = Template.deckspec.deckspec().cardtemplate;      
    $('#svg_frame').ready(function() {
      var ifrm = $('#svg_frame')[0];

      function editor_ready() {
        var svgEditor = ifrm.contentWindow.svgEditor;
        
        // make card-selected layers visible, hide the rest
        var printer = DeckPrinter({layout: '2x2'});
        svg = printer.svgLayersCard(svg, card);

        svgEditor.loadFromString(svg);
        var drawing = svgEditor.canvas.getCurrentDrawing();
        var canvas = svgEditor.canvas;
        
        /* for (var i = 0; i < drawing.getNumLayers(); i++) {
          var name = drawing.getLayerName(i);
          console.log(name, card.layers.length === 0, $.inArray(name, card.layers));
          if (card.layers.length === 0 || $.inArray(name, card.layers) !== -1) {
            canvas.setLayerVisibility(name, true);
          } else {
            canvas.setLayerVisibility(name, false);
          }
        } */

        if (card.layers.length > 0) {
          canvas.setCurrentLayer(card.layers[card.layers.length - 1]);
        }
        svgEditor.populateLayers();

        svgEditor.setCustomHandlers({
            save: function(win, data) {
              var svg = data;
              console.log(svg);

              // make all layers visible when saving 
              var printer = DeckPrinter({layout: '2x2'});
              svg = printer.svgLayersAll(svg);

              save_cardtemplate(svg);
            }
        });
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

  Template.cardtemplate.events({
    'focusout' : function (evt) {
      var value = String(evt.target.value || "");
      console.log(value);
      save_cardtemplate(value);
    },
    'click input' : function () {
      editSVG({});
      
    }
  });

  function printDeck() {
    // template data, if any, is available in 'this'
    var cards = $.csv.toObjects(Template.deckspec.deckspec().spec); 
    console.log(JSON.stringify(cards, null, '\t'));
    var printer = DeckPrinter({layout: '2x2'});
    printer.printSVG(window, cards);
  }

  Template.preview.events({
    'click .card-preview' : function (evt) {
      editSVG($(evt.target).closest('div').data('card-id'));
    },
    'click input' : function () {
      printDeck();
    }
  });

  function deckcards() {
    var cards;
    try {
      cards = $.csv.toObjects(Template.deckspec.deckspec().spec); 
      $.each(cards, function(idx, card) {
        if (card.hasOwnProperty('layers')) {
          card.layers = card.layers.split('|');
        } else {
          card.layers = [];
        }
      });
      return cards;
    } catch (e) {
      return [];
    }
  }

  function getdeckcard(id) {
    var cards = deckcards();
    return cards[id];
  }

  function getCardSVG(options) {
    var cards;
    var svg;
    try {
      cards = deckcards();
      svg = Template.deckspec.deckspec().cardtemplate;      
    } catch (e) {
      return [];
    }
    var printer = DeckPrinter({layout: '2x2'});
    var previewcards = printer.preview(cards, svg, options);
    console.log(previewcards);
    return previewcards;
  }

  Template.preview.uniquecards = function () {
    return getCardSVG({unique: true});
  };

  Template.printable.cards = function () {
    return getCardSVG({unique: false});
  }
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
