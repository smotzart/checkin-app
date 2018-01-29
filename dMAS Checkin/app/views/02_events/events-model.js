"use strict";
var observable    = require("data/observable-array");
var baseModule    = require("~/common/view-model-base");
var serviceModule = require("~/utils/service");
var navModule     = require("~/utils/navigation");
var viewsModule   = require("~/utils/views");
var notifiModule  = require("~/utils/notifications");
var eventModule   = require("~/views/04_event/event-model")

var EventsViewModel = (function (_super) {
  __extends(EventsViewModel, _super);
  function EventsViewModel() {
    _super.call(this);
  }  
  Object.defineProperty(EventsViewModel.prototype, "events", {
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
  EventsViewModel.prototype.logout = function () {
    serviceModule.service.logout();
    navModule.navigate({
      moduleName: viewsModule.Views.login,
      backstackVisible: false,
      clearHistory: true
    });
  };
  EventsViewModel.prototype.loadEvents = function () {
    var _this = this;
    if (!this.beginLoading())
      return;
    serviceModule.service.getEvents().then(function (data) {
      if (data.error) {
        throw data.error;
      }
      var events_ = new Array();
      data = data.sort(function(a, b){
        return new Date(b.starts_at) - new Date(a.starts_at);
      });
      for (var i = 0; i < data.length; i++) {
        events_.push(new eventModule.EventDetailModel(data[i]));
      }
      events_.unshift({title: 'Wählen Sie eine Veranstaltung'});
      _this.set("events", events_);
      _this.endLoading();
    }).catch(function (error) {
      notifiModule.showError(error);
      _this.endLoading();
    });
  };
  return EventsViewModel;
}(baseModule.ViewModelBase));
exports.EventsViewModel = EventsViewModel;