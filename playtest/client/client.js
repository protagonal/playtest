Meteor.subscribe('deckspec');

// If no party selected, select one.
Meteor.startup(function () {
  Deps.autorun(function () {
    if (! Session.get("selected")) {
      var game = Games.findOne({name: 'sample'});
      if (game)
        Session.set("selected", game._id);
    }
  });
});

function selectedGame() {
  return Games.findOne(Session.get("selected"));
}

Template.deckspec.deckspec = function () {
  return selectedGame();
};

Template.deckspec.events({
  'focusout' : function (evt) {
    var deckspec = Template.deckspec.deckspec();
    var value = String(evt.target.value || "");
    console.log(value);
    Games.update(selectedGame()._id, {$set: {spec: value}});
  }
});

Template.cardtemplate.deckspec = function () {
  return selectedGame();
};

function save_cardtemplate(value) {
  Games.update(selectedGame()._id, {$set: {cardtemplate: value}});
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

Template.preview.game = function () {
  return selectedGame();
}

function updateName() {
  Games.update(selectedGame()._id, {name: $('input.game-name').val()});
  $('h3.game-name').show();
  $('input.game-name').hide();
}

Template.preview.events({
  'click .card-preview' : function (evt) {
    editSVG($(evt.target).closest('div').data('card-id'));
  },
  'click input.print' : function () {
    printDeck();
  },
  'click input.delete' : function () {
    Games.update(selectedGame()._id, {$set: {deleted: true}});
    var game = Games.findOne({});
    Session.set("selected", game._id); 
  },
  'click h3.game-name' : function () {
    $('h3.game-name').hide();
    $('input.game-name').show().focus();
  },
  'focusout input.game-name' : function () {
    updateName();
  },
  'keypress input.game-name': function (evt, template) {
    if (evt.which === 13) {
      updateName();
    }
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

// -- game management --
Template.menu.events({
  'click a.game' : function (evt) {
    var name = $(evt.target).data('name')
    var game = Games.findOne({name: name});
    if (game)
      Session.set("selected", game._id);
  },
  'click button.new' : function () {
    // create a new default game
    var game = defaultGame();
    if (Meteor.userId() !== null) {
      // if user is logged in, make them the owner 
      game.owner = Meteor.userId();
    } else {
      // if user is not logged in, set public = true
      game.public = true;
    }
    Games.insert(game);
    game = Games.findOne({name: game.name});
    Session.set("selected", game._id); 
  }
});

Template.menu.games = function () {
  return Games.find({}); 
}


