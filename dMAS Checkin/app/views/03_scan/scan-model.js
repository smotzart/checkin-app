"use strict";
var observable    = require("data/observable-array");
var baseModule    = require("~/common/view-model-base");
var serviceModule = require("~/utils/service");
var navModule     = require("~/utils/navigation");
var viewsModule   = require("~/utils/views");
var notifiModule  = require("~/utils/notifications");

var ScanViewModel = (function (_super) {
  __extends(ScanViewModel, _super);
  function ScanViewModel() {
    _super.call(this);
    this.refresh();
    this.refresh1();
  }  
  Object.defineProperty(ScanViewModel.prototype, "events", {
    get: function () {
      return this._events;
    },
    set: function (value) {
      if (this._events != value) {
        this._events = value;
        this.notifyPropertyChange("events", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ScanViewModel.prototype, "account", {
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
  ScanViewModel.prototype.logout = function () {
    serviceModule.service.logout();
    navModule.navigate({
      moduleName: viewsModule.Views.login,
      backstackVisible: false,
      clearHistory: true
    });
  };
  ScanViewModel.prototype.refresh = function () {
    var _this = this;
    if (!this.beginLoading())
      return;
    serviceModule.service.getCurrentAccount().then(function (account) {
      if (account.error) {
        throw account.error;
      }
      _this.account = account;
      _this.endLoading();
    }).catch(function (error) {
      notifiModule.showError(error);
      _this.endLoading();
    });
  };
  ScanViewModel.prototype.refresh1 = function () {
    var _this = this;
    if (!this.beginLoading())
      return;
    serviceModule.service.getEvents().then(function (events) {
      if (events.error) {
        throw events.error;
      }
      events.unshift({title: 'Wählen Sie eine Veranstaltung'});
      _this.events = events;
      _this.endLoading();
      
    }).catch(function (error) {
      notifiModule.showError(error);
      _this.endLoading();
    });
  };
  ScanViewModel.prototype.ololo2 = function () {
    alert("tyt?");
  };
  return ScanViewModel;
}(baseModule.ViewModelBase));
exports.ScanViewModel = ScanViewModel;