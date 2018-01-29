"use strict";

var frameModule = require("ui/frame");
/*
frameModule.Frame.defaultTransition = {
  name: "slide",
  duration: 2000,
  curve: "linear"
}*/

function navigate(navigationEntry) {
  var topmost = frameModule.topmost();
  navigationEntry.transition = {
    name: "fade"
  };
  topmost.navigate(navigationEntry);
}
exports.navigate = navigate;

function goBack() {
  var topmost = frameModule.topmost();
  topmost.goBack();
}
exports.goBack = goBack;