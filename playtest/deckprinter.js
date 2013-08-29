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

  var obj = {
    getCardSizes: function() {
      return cardsizes;
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
