"use strict";

var baseModule      = require("~/common/view-model-base");
var navModule       = require("~/utils/navigation");
var viewsModule     = require("~/utils/views");
var appSet          = require("application-settings");
var constantsModule = require("~/utils/constants");
var serviceModule   = require("~/utils/service");
var timer           = require("timer");

var BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;


var EventDetailModel = (function (_super) {
  __extends(EventDetailModel, _super);

  function EventDetailModel(event) {
    _super.call(this);
    this.event = event;
    this.barcodescanner = new BarcodeScanner();
    this.isSuccessScan = false;
    this.isErrorScan = false;
  }
  Object.defineProperty(EventDetailModel.prototype, "event", {
    get: function () {
      return this._event;
    },
    set: function (value) {
      if (this._event != value) {
        this._event = value;
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(EventDetailModel.prototype, "isScanAvailable", {
    get: function () {
      return this.barcodescanner.available();
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(EventDetailModel.prototype, "isErrorScan", {
    get: function () {
      return this._isErrorScan;
    },
    set: function (value) {
      if (this._isErrorScan != value) {
        this._isErrorScan = value;
        this.notifyPropertyChange("isErrorScan", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(EventDetailModel.prototype, "isSuccessScan", {
    get: function () {
      return this._isSuccessScan;
    },
    set: function (value) {
      if (this._isSuccessScan != value) {
        this._isSuccessScan = value;
        if (value == true) {
          const id = timer.setTimeout(() => {
            this.set("isSuccessScan", false);
          }, 2000);
        }
        this.notifyPropertyChange("isSuccessScan", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(EventDetailModel.prototype, "event_checkin", {
    get: function () {
      if (this._event_checkin) {
        return this._event_checkin;
      } else {
        return this.event.statistics.checked_in;
      }
    },
    set: function (value) {
      if (this._event_checkin != value) {
        this._event_checkin = value;
        this.notifyPropertyChange("event_checkin", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(EventDetailModel.prototype, "current_user_checkin", {
    get: function () {
      if (typeof this.account === 'object') {
        return appSet.hasKey(`checkin_${this.event.id}_${this.account.id}`) ? parseInt(appSet.getNumber(`checkin_${this.event.id}_${this.account.id}`)) : 0;
      } else {
        return 0;
      }
    },
    set: function () {
      var value = parseInt(this.get("current_user_checkin")) + 1;
      appSet.setNumber(`checkin_${this.event.id}_${this.account.id}`, value);
      return this.notifyPropertyChange("current_user_checkin", value);
    },
    enumerable: true,
    configurable: true
  });
  EventDetailModel.prototype.enableScan = function (args) {
    this.set("isErrorScan", false);
    this.set("isSuccessScan", false);
    return;
  };
  EventDetailModel.prototype.goToEventView = function (args) {
    navModule.navigate({
      moduleName: viewsModule.Views.event,
      context: args.view.bindingContext
    });
  };
  EventDetailModel.prototype.checkinUser = function (args) {
    var _this = this;
    if (!this.beginLoading())
      return;
    _this.barcodescanner.scan({
      formats: "QR_CODE", 
      beepOnScan: appSet.getBoolean(constantsModule.soundEnabled, true),
      cancelLabel: 'Schließen',
      cancelLabelBackgroundColor: "#cc3c4e",
      message: ' ',
      closeCallback: function () {
        console.log("Scanner closed");
      },
      resultDisplayDuration: 1000,
      orientation: "portrait",
      openSettingsIfPermissionWasPreviouslyDenied: true, 
      reportDuplicates: true
    }).then(function (result) {
      setTimeout(function () {
        serviceModule.service.checkinUser(result.text, _this.event.id).then(function (data) {
          if (data.error) {
            throw data.error;
          }
          _this.set("isSuccessScan", true);
          _this.updateEvent();
          _this.endLoading();
        }).catch(function (error) {
          _this.set("isErrorScan", true);
          _this.endLoading();
        });
      }, 300);
    }, function (errorMessage) {
      console.log("No scan. " + errorMessage);
    });
  };
  EventDetailModel.prototype.doRequestCameraPermission = function () {
    var _this = this;
    _this.barcodescanner.requestCameraPermission().then(
      function () {
        console.log("Camera permission requested");
      }
    );  
  };

  EventDetailModel.prototype.updateEvent = function () {
    var _this = this;
    if (!this.beginLoading())
      return;
    serviceModule.service.getEvent(_this.event.id).then(function (data) {
      if (data.error) {
        throw data.error;
      }
      if (data.statistics.checked_in > _this.event_checkin) {
        _this.set("current_user_checkin");
      }
      _this.set("event_checkin", data.statistics.checked_in);
      _this.set("event", data);
      _this.endLoading();
    }).catch(function (error) {
      notifiModule.showError(error);
      _this.endLoading();
    });
  };
  EventDetailModel.prototype.logout = function () {
    serviceModule.service.logout();
    navModule.navigate({
      moduleName: viewsModule.Views.login,
      backstackVisible: false,
      clearHistory: true
    });
  };
  return EventDetailModel;
}(baseModule.ViewModelBase));

exports.EventDetailModel = EventDetailModel;