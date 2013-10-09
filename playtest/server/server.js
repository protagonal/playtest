Meteor.startup(function () {
  // code to run on server at startup
  if (Games.find().count() === 0) {
    console.log('Inserting sample game');
    Games.insert(defaultGame());
  }
});

Meteor.publish('deckspec', function () {
  return Games.find(
    {$and: [{deleted: {$ne: true}},
            {$or: [{public: true}, 
                   {owner: this.userId}]}]});
});
