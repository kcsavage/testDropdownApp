TestCollection = new Meteor.Collection("TestCollection");

if (Meteor.isClient) {
  Session.set('results', '...');

  Template.hello.helpers({
    results: function(){
      return Session.get('results');
    },
    button: function(){
      return TestCollection.find();
    }
  });

  Template.buttonDropdown.events({
    'click .normal': function(){
      Session.set('results', 'normal works');
    },
    'click .callback': function(){
      Meteor.call('callback', this._id, function(e, r){
        Session.set('results', r);
      });
    }
  });

  Template.buttonDropdown.created = function(){
    this.data.ddName = this.data._id; //this is to dynamically name the dropdowns
  };
}


if (Meteor.isServer) {
  Meteor.startup(function(){
    TestCollection.update({_id:'abc123'}, {$set: {prop:true}}, {upsert:true});
    TestCollection.update({_id:'efg456'}, {$set: {prop:true}}, {upsert:true});
  });

  Meteor.methods({
    'callback': function(id){
      var newProp = !TestCollection.findOne(id).prop;
      TestCollection.update({_id:id}, {$set: {prop:newProp}});
      return 'callback complete';
    }
  });
}
