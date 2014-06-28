App = Ember.Application.create({LOG_TRANSITIONS: true});

App.IndexController = Ember.Controller.extend({
	model: [
		{name: 'Galaxy s5', cost: 599.99},
		{name: 'Nexus 5', cost: 69.99},
		{name: 'iPhone 5s', cost: 399.99}
	],
	totalCost: function() {
		var total = 0;
		this.get('model').forEach(function(phone){
			total += phone['cost'];
		});

        //this.setupController();
		return total;
	}.property('model'),
    init: function() {
        console.log('setup controller called');
        var socket = io('http://localhost:8080');

        socket.on('news', function (data) {
            console.log(data);
            alert('News received: ' + data['news']);
        });

        socket.on('allClients', function (data) {
            console.log(data);
            alert('News received: ' + data['news']);
        });
    }
});

App.Router.map(function(){
	this.resource('about');
});

App.AboutController = Ember.Controller.extend({
	setupController: function(){
		console.log('I am here');
	}
});