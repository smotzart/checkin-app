"use strict";

var app             = require('application');
var platform = require("platform");
var appSet          = require("application-settings");
var serviceModule   = require("./utils/service");
var viewsModule     = require("./utils/views");
var constantsModule = require("./utils/constants");
var moment          = require('moment');
var startPoint      = {};

moment.locale('de');


app.on(app.launchEvent, function(args) {
  if (args.android) {
    

    // hook the onActivityCreated callback upon application launching
    app.android.onActivityCreated = function(activity) {
      // apply the default theme once the Activity is created
      // Changing the SplashTheme for AppTheme
      var id = activity.getResources().getIdentifier("AppTheme", "style", activity.getPackageName());
      activity.setTheme(id);
    }
  }
  if (serviceModule.service.isAuthenticated) {
	  startPoint.moduleName = viewsModule.Views.main;
  } else {
    startPoint.moduleName = viewsModule.Views.login;
  }
});

//appSet.getBoolean(constantsModule.soundEnabled, true);

app.setResources({
  "uppercase": function(value) {
    return value.toUpperCase();
  },
  "startDate": function(start_at) {
    return moment(start_at).format("D. MMMM YYYY");
  },
  "number": function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
});

app.start(startPoint);



