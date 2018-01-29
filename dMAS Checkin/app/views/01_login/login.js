"use strict";

var loginModel = require("./login-model");
var viewModel;
var page;

function navigatingTo(args) {
  page  = args.object;
  viewModel = new loginModel.LoginViewModel();
  page.bindingContext = viewModel;
}
exports.navigatingTo = navigatingTo;

function loginButtonTap(args) {
  viewModel.login();
}
exports.loginButtonTap = loginButtonTap;
