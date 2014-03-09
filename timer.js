var Timer = function(timertype) {
    self = this;

    this.verbal = timertype.verbal;

    this.title = ko.observable(timertype.name);
    this.time = (timertype.seconds) * 1000;
    this.start = ko.observable(new Date().getTime());
    this.timeElapsed = ko.computed(function() {
        var elapsed = new Date() - this.start();
        if (elapsed >= this.time) {
            return this.time;
        }
        else {
            return elapsed;
        }
    }, this);
    this.timeRemaining = ko.computed(function() {
        return this.time - this.timeElapsed();
    }, this);
}

var TimersViewModel = function() {

    this.timers = ko.observableArray([]),
    this.available = ko.observableArray(timer_library);
};

timersViewModel = new TimersViewModel();

ko.applyBindings(timersViewModel);

if (annyang) {
  // Let's define our first command. First the text we expect, and then the function it should call
  var commands = {
    'start *creep': function(creep) {
        for (var i=0;i<timersViewModel.available().length;i++) {
            possible = timersViewModel.available()[i];
            for (var j=0;j<possible.verbal.length;j++) {
                if (creep == possible.verbal[j]) {
                    timersViewModel.timers.push(new Timer(possible));
                }
            }
        }
    },
    'stop *creep': function(creep) {
    	for (var i=0; i<timersViewModel.timers().length; i++) {
    		for (var j=0;j<timersViewModel.timers()[i].verbal.length;j++) {
    			if (timersViewModel.timers()[i].verbal[j] == creep) {
    				timersViewModel.timers.remove(timersViewModel.timers()[i]);
    				return;
    			}
    		}
    	}
    }
  };

  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening. You can call this here, or attach this call to an event, button, etc.
  annyang.start();
  annyang.debug();
}

setInterval(function() {
  $.each(timersViewModel.timers(), function(index, item) {
    item.start.notifySubscribers();
  });
}, 100);
