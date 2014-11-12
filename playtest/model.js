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

/*
// default game 
defaultGame = function () {
  return {name: defaultGameName(),
          spec: 'name,quantity,layers\nking,1,base\nqueen,1,base',
          cardtemplate: '<svg xmlns="http://www.w3.org/2000/svg" width="315" height="440">\n<g display="inline">\n<title>base</title>\n<rect stroke="#000000" id="svg_16" height="436.999987" width="311.999999" y="1.636331" x="1.363632" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" fill="#ffffff"/>\n<text stroke="#000000" transform="matrix(1.17466 0 0 1.24433 -19.1985 -60.4222)" id="svg_23" fill="#000000" stroke-width="0" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x="146.671002" y="373.55029" font-size="24" font-family="sans-serif" text-anchor="middle" xml:space="preserve" xmlns:xml="http://www.w3.org/XML/1998/namespace">{{ name }}</text>\n</g>\n</svg>'}
}
*/

gameCrafterGuidelines = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="180px" height="270px" viewBox="0 0 180 270" enable-background="new 0 0 180 270" xml:space="preserve"><g><path fill="none" stroke="#EC1E28" d="M9,251.919c0,4.971,4.029,9,9,9h144.012c4.971,0,9-4.029,9-9v-234c0-4.971-4.029-9-9-9H18 c-4.971,0-9,4.029-9,9V251.919z"/></g><g><path fill="none" stroke="#2BA6DE" stroke-dasharray="1.3587" d="M18,21.825c0-2.156,1.525-3.9,3.408-3.9h137.185 c1.883,0,3.408,1.744,3.408,3.9v226.188c0,2.154-1.525,3.9-3.408,3.9H21.408c-1.882,0-3.408-1.746-3.408-3.9V21.825z"/></g></svg>';

defaultGame = function () {
  return {name: defaultGameName(),
          spec: 'name,quantity,layers\nking,1,base\nqueen,1,base',
          cardtemplate: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="180px" height="270px" viewBox="0 0 180 270" enable-background="new 0 0 180 270" xml:space="preserve"><g><title>base</title><text xml:space="preserve" text-anchor="middle" font-family="serif" font-size="24" id="svg_1" y="214.333332" x="87.888885" stroke-width="0" stroke="#000000" fill="#000000">{{name}}</text>text></g></svg>'}
}

