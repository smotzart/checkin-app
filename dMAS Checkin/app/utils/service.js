"use strict";
var appSet          = require("application-settings");
var notifiModule    = require("./notifications");
var constantsModule = require("./constants");
var dialogsModule   = require("ui/dialogs");

var Service = (function () {
  function Service() {
  }
  Object.defineProperty(Service.prototype, "isAuthenticated", {
    get: function () {
      return appSet.hasKey(constantsModule.authenticationTokenKey);
    },
    enumerable: true,
    configurable: true
  });
  Service.prototype.login = function (username, password) {
    var _this = this;
    return fetch(constantsModule.authApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: username, 
        password: password
      })
    }).then(function (response) {
      return response.json();
    });
  };
  Service.prototype.getCurrentAccount = function () {
    var _this = this;
    var token = appSet.getString(constantsModule.authenticationTokenKey);
    return fetch(constantsModule.accountApi + "?auth_token=" + token).then(function (response) {
      return response.json();
    });
  };
  Service.prototype.getEvents = function () {
    var _this = this;
    var token = appSet.getString(constantsModule.authenticationTokenKey);
    return fetch(constantsModule.eventsApi + "?auth_token=" + token).then(function (response) {
      return response.json();
    });
  };
  Service.prototype.getEvent = function (event_id) {
    var _this = this;
    var token = appSet.getString(constantsModule.authenticationTokenKey);
    return fetch("https://login.dmas.at/api/private/events/" + event_id + ".json?auth_token=" + token).then(function (response) {
      return response.json();
    });
  };
  Service.prototype.checkinUser = function (shortcode, event_id) {
    var _this = this;
    var token = appSet.getString(constantsModule.authenticationTokenKey);
    return fetch("https://login.dmas.at/api/private/events/" + event_id + "/tickets/" + shortcode + ".json?auth_token=" + token).then(function (response) {
      return response.json();
    });
  };
  Service.prototype.logout = function () {
    this.clearLocalSettings();
  };
  Service.prototype.setupLocalSettings = function (authenticationTokenKey) {
    appSet.setString(constantsModule.authenticationTokenKey, authenticationTokenKey);
  };
  Service.prototype.clearLocalSettings = function () {
    appSet.remove(constantsModule.authenticationTokenKey);
  };
  Service.showErrorAndReject = function (error, reject) {
    notifiModule.showError(error.message);
    reject(error);
  };
  return Service;
}());
exports.Service = Service;
exports.service = new Service();