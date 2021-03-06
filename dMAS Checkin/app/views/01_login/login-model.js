"use strict";
var baseModule    = require("~/common/view-model-base");
var serviceModule = require("~/utils/service");
var notifiModule  = require("~/utils/notifications");
var viewsModule   = require("~/utils/views");
var navModule     = require("~/utils/navigation");

var LoginViewModel = (function (_super) {
  __extends(LoginViewModel, _super);
  function LoginViewModel() {
    _super.call(this);
    this._username = "";
    this._password = "";
  }
  Object.defineProperty(LoginViewModel.prototype, "username", {
    get: function () {
      return this._username;
    },
    set: function (value) {
      if (this._username !== value) {
        this._username = value;
        this.notifyPropertyChange("username", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(LoginViewModel.prototype, "password", {
    get: function () {
      return this._password;
    },
    set: function (value) {
      if (this._password !== value) {
        this._password = value;
        this.notifyPropertyChange("password", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  LoginViewModel.prototype.login = function () {
    var _this = this;
    if (this.validate()) {
      if (!this.beginLoading())
        return;
      serviceModule.service.login(this.username, this.password).then(function (data) {
        if (data.error) {
          notifiModule.showError(data.error);
        } else {
          serviceModule.service.setupLocalSettings(data.token);
          navModule.navigate({
            moduleName: viewsModule.Views.main
          });
        }
        _this.endLoading();
      }, function (error) {
        notifiModule.showError(error);
        _this.clearPassword();
        _this.endLoading();
      });
      
    } else {
      this.clearPassword();
    }
  };
  LoginViewModel.prototype.clearPassword = function () {
    this.password = "";
  };
  LoginViewModel.prototype.validate = function () {
    if (!this.username || this.username === "") {
      this.showError("Please enter username.");
      return false;
    }
    if (!this.password || this.password === "") {
      this.showError("Please enter password.");
      return false;
    }
    return true;
  };
  return LoginViewModel;
}(baseModule.ViewModelBase));
exports.LoginViewModel = LoginViewModel;