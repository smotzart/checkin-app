"use strict";

var navModule = require("~/utils/navigation");
var viewModel;

function navigatingTo(args) {
  var page = args.object;
  viewModel = page.navigationContext;
  viewModel.loadAccount();
  page.bindingContext = null;
  page.bindingContext = viewModel;
}
exports.navigatingTo = navigatingTo;

function logoutButtonTap(args) {
  viewModel.logout();
}
exports.logoutButtonTap = logoutButtonTap;

function goBack(args) {
  navModule.goBack();
}
exports.goBack = goBack;