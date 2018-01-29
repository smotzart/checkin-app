"use strict";

var eventsModel = require("./events-model");
var viewModel   = new eventsModel.EventsViewModel();

function navigatingTo(args) {
  var page = args.object;
  page.bindingContext = null;
  viewModel.loadEvents();
  viewModel.loadAccount();
  page.bindingContext = viewModel;
}
exports.navigatingTo = navigatingTo;

function logoutButtonTap(args) {
  viewModel.logout();
}
exports.logoutButtonTap = logoutButtonTap;