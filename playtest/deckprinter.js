DeckPrinter = function(options) {
  var cardsizes = {
    'magic the gathering': {width: 63,   'height': 88},
    'citadels':            {width: 57,   'height': 89},
    'bohnanza':            {width: 56,   'height': 87},
    'dominion':            {width: 59,   'height': 91},
    'ticket to ride':      {width: 44,   'height': 68},
    'lost cities':         {width: 79,   'height': 110},
    'power grid':          {width: 70,   'height': 70},
    'poker':               {width: 63.5, 'height': 88.9},
  };

  // returns the rectangular coordinates for a card 
  // of size cardSize and index idx in layout.
  function getCardRect(cardSize, layout, idx) {
    // Paper dimensions
    var letterHeight = 279.4;
    var letterWidth = 215.4;

    var cardHeight;
    var cardWidth;

    if (cardSize in cardsizes) {
      cardWidth = cardsizes[cardSize].width;
      cardHeight = cardsizes[cardSize].height;
    } else {
      throw 'Card size not supported: ' + cardSize;
    }
    console.log(cardWidth, cardHeight);

    // distance between edge of cards and edge of paper
    var marginX = 20;
    var marginY = 20;
    
    var cardX;
    var cardY;

    switch(layout) {
      case '2x2':
        // options for idx:
        // 0 1
        // 2 3 
        var cols = 2;
        var rows = 2;
        var xcols = [];
        var yrows = [];
        var paddingX = (letterWidth  - (cols * cardWidth)  - (2 * marginX)) / (cols - 1.0);
        var paddingY = (letterHeight - (rows * cardHeight) - (2 * marginY)) / (rows - 1.0);

        var row = Math.floor(idx / rows);
        var col = idx - (row * cols);

        cardX = marginX + col * (cardWidth  + paddingX);
        cardY = marginY + row * (cardHeight + paddingY);

        //console.log(idx, col, row, cardX, cardY);
        
        break;
      default:     
        throw "Unsupported layout " + layout;
    }

    return [cardX, cardY, cardWidth, cardHeight];
  }

  function drawCard(pdf, cardSize, layout, idx, card) {
    var rect = getCardRect(cardSize, layout, idx);

    pdf.setDrawColor(0);
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(rect[0], rect[1], rect[2], rect[3], 3, 3, 'FD'); 

    //console.log(JSON.stringify(pdf.getFontList(), null, '\t'));
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(rect[0] + 5, rect[1] + 5, JSON.stringify(card, null, '\t'));
  }

  function xmlToString(xmlData) { 

    var xmlString;
    //IE
    if (window.ActiveXObject){
        xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
  }

  function showHideLayers(jqsvg, layers) {
    // show all layers by default
    jqsvg.find('g > title').parent('g').attr('display', 'inline');
    // if any layers were listed, hide all others
    if (layers.length > 0) {
      jqsvg.find('g > title').filter(function(index) {
        var labelTitle = $(this).text();
        //console.log(labelTitle);
        return $.inArray(labelTitle, layers) === -1;
      }).parent('g').attr('display', 'none');
    }
  }

  function cardSVG(card, jqsvg, id) {
    // use {{ }} instead of <% %> for underscore templating
    // TODO: set this somewhere else?
    _.templateSettings = {
      interpolate : /\{\{(.+?)\}\}/g
    };
    //console.log(card);  

    // perform substitutions on text
    jqsvg.find('text').each(function(idx, textel) {
      var jqel = $(textel);
      var newText = _.template(jqel.text(), card);
      jqel.text(newText);
    });

    // set layer visibility
    showHideLayers(jqsvg, card.layers);

    return {svg: xmlToString(jqsvg[0]), id: id};
  }

  var obj = {
    getCardSizes: function() {
      return cardsizes;
    },
    // return an array of svg card type previews with values substituted
    //[{svg: "<b>test1</b>", id: 0}, {svg: "<b>test2</b>", id: 1}];
    // Sort of an SVG mail merge.
    preview: function(cards, svg) {
      var cardpreviews = [];
      $.each(cards, function(idx, card) {
        var jqsvg = $($.parseXML(svg));
        cardpreviews.push(cardSVG(card, jqsvg, idx));  
      }); 
      return cardpreviews;
    },
    // take SVG string and return SVG string with 
    // layers (aka groups) for card visible
    svgLayersCard: function(svg, card) {
      var jqsvg = $($.parseXML(svg));
      showHideLayers(jqsvg, card.layers);
      return xmlToString(jqsvg[0]);
    },
    // take SVG (a string) and return SVG with all 
    // layers (aka groups) visible
    svgLayersAll: function(svg) {
      var jqsvg = $($.parseXML(svg));
      showHideLayers(jqsvg, []);
      return xmlToString(jqsvg[0]);
    },
    print: function(cards) {
      var doc = new jsPDF('p', 'mm', 'letter');
      var cardIndex = 0;
      $.each(cards, function(typeIndex, card) {
          if (cardIndex % 4 == 0 && cardIndex != 0) {
            doc.addPage();
          }
          var qty = card.quantity || 1;
          for (var i = 0; i < qty; i++) {
            drawCard(doc, 'magic the gathering', options.layout, cardIndex % 4, card);
            cardIndex += 1;
          }
      });

      doc.save('deck.pdf');
    }
  }
  return obj;
}




