"use strict";
var observableModule  = require("data/observable");
var dialogsModule     = require("ui/dialogs");
var navModule     = require("~/utils/navigation");
var connectivity      = require("connectivity");
var constantsModule   = require("~/utils/constants");
var serviceModule     = require("~/utils/service");
var appSet            = require("application-settings");

var ViewModelBase = (function (_super) {
  __extends(ViewModelBase, _super);
  function ViewModelBase() {
    _super.call(this);
    this._loadingCount = 0;
  }
  Object.defineProperty(ViewModelBase.prototype, "isLoading", {
    get: function () {
      return this._isLoading;
    },
    set: function (value) {
      if (this._isLoading != value) {
        this._isLoading = value;
        this.notifyPropertyChange("isLoading", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewModelBase.prototype, "isSoundEnable", {
    get: function () {
      return appSet.getBoolean(constantsModule.soundEnabled, true);
    },
    set: function (value) {
      if (this._isSoundEnable != value) {
        appSet.setBoolean(constantsModule.soundEnabled, !appSet.getBoolean(constantsModule.soundEnabled));
        this.notifyPropertyChange("isSoundEnable", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewModelBase.prototype, "account", {
    get: function () {
      return this._account;
    },
    set: function (value) {
      if (this._account !== value) {
        this._account = value;
        this.notifyPropertyChange("account", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  
  ViewModelBase.prototype.loadAccount = function () {
    var _this = this;
    if (!this.beginLoading())
      return;
    serviceModule.service.getCurrentAccount().then(function (data) {
      if (data.error) {
        throw data.error;
      }
      _this.set("account", data);
      _this.endLoading();
    }).catch(function (error) {
      _this.showError(error);
      _this.endLoading();
    });
  };

  ViewModelBase.prototype.beginLoading = function () {
    if (connectivity.getConnectionType() === connectivity.connectionType.none) {
      this.showError("No internet connection.");
      return false;
    }
    if (!this._loadingCount) {
      this.isLoading = true;
    }
    this._loadingCount++;
    return true;
  };
  ViewModelBase.prototype.endLoading = function () {
    if (this._loadingCount > 0) {
      this._loadingCount--;
      if (!this._loadingCount) {
        this.isLoading = false;
      }
    }
  };
  ViewModelBase.prototype.toggleEnableSound = function () {
    var _this = this;
    _this.set("isSoundEnable", !_this.isSoundEnable); 
  };
  ViewModelBase.prototype.showError = function (error) {
    dialogsModule.alert({ title: "Error", message: error, okButtonText: "Close" });
  };
  ViewModelBase.prototype.showInfo = function (message) {
    dialogsModule.alert({ title: "Info", message: message, okButtonText: "OK" });
  };
  return ViewModelBase;
}(observableModule.Observable));
exports.ViewModelBase = ViewModelBase;