// Games
Games = new Meteor.Collection('deckspec');

defaultGameName = function ()
{
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for(var i=0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

defaultGame = function () {
  return {name: defaultGameName(),
          spec: 'name,quantity,layers\nking,1,base\nqueen,1,base',
          cardtemplate: '<svg xmlns="http://www.w3.org/2000/svg" width="315" height="440">\n<g display="inline">\n<title>base</title>\n<rect stroke="#000000" id="svg_16" height="436.999987" width="311.999999" y="1.636331" x="1.363632" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" fill="#ffffff"/>\n<text stroke="#000000" transform="matrix(1.17466 0 0 1.24433 -19.1985 -60.4222)" id="svg_23" fill="#000000" stroke-width="0" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x="146.671002" y="373.55029" font-size="24" font-family="sans-serif" text-anchor="middle" xml:space="preserve" xmlns:xml="http://www.w3.org/XML/1998/namespace">{{ name }}</text>\n</g>\n</svg>'}
}



