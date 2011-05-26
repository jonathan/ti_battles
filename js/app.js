(function() {
// ==========================================================================
// Project:   SproutCore Handlebar Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


/** @class */

var get = SC.get, set = SC.set;

SC.Range = SC.View.extend(
  /** @scope SC.Range.prototype */ {

  classNames: ['sc-range'],

  type: "range",
  value: 0,
  min: 0,
  max: 10,
  step: 1,

  defaultTemplate: function() {
    var type = get(this, 'type'),
        min = get(this, 'min'),
        max = get(this, 'max'),
        step = get(this, 'step');
    return SC.Handlebars.compile('<input type="%@" min="%@" max="%@" step="%@" {{bindAttr value="value"}}>'.fmt(type, min, max, step));
  }.property(),

    change: function(event) {
    this._elementValueDidChange();
    return false;
  },

  /**
    @private
  */
/*
  interpretKeyEvents: function(event) {
    var map = SC.TextField.KEY_EVENTS;
    var method = map[event.keyCode];

    if (method) { return this[method](event); }
    else { this._elementValueDidChange(); }
  },
*/
  _elementValueDidChange: function() {
    var input = this.$('input');

    set(this, 'value', input.val());
  },

  _valueDidChange: function() {
    SC.run.once(this, this._updateElementValue);
  },

  _updateElementValue: function() {
    var input = this.$('input');
    input.val(get(this, 'value'));
  }
});
/*
SC.TextField.KEY_EVENTS = {
  13: 'insertNewline',
  27: 'cancel'
};
*/

})();



// ==========================================================================
// Project:   TiBattles
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals TiBattles */

var TiBattles = SC.Application.create();

/*
TiBattles.Die = SC.Record.extend({
  title: SC.Record.attr(String, { default: 'Die #' }),
  probability: SC.Record.attr(Number),
  numRolls: SC.Record.attr(Number),
*/
TiBattles.Die = SC.Object.extend({
  title: '',
  probability: 0.0,
  numRolls: 3,

  distribution: function (n, p) {
    var n = this.get('numRolls'),
        result = [];
    for (var k = 0; k <= n; k++) {
      result[k] = binomial(n, k);
    }
    return result;
  }.property("probability", "numRolls"),

  binomial: function (n, k) {
    var p = this.get('probability');
    return Math.pow(p, k) * Math.pow(1-p, n-k) * this._choose(n, k);
  },

  _choose: function (n, k) {
    if (k == 0) { return 1; }
    if (n == 0) { return 0; }

    return this._choose(n-1, k-1) * n / k;
  }

});

TiBattles.diceStatsController = SC.ArrayProxy.create({
  content: [
    TiBattles.Die.create({
      title: 'Die #1',
      probability: 0.8,
      numRolls: 3}),
    TiBattles.Die.create({
      title: 'Die #2',
      probability: 0.2,
      numRolls: 6
    })
  ],

  convolute: function () {
    var f = this.getObjectAt(0),
        g = this.getObjectAt(1),
        result = [],
        s = f.length + g.length - 1,
        i;
    for (var n = 0; n < s; n++) {
      result[n] = 0.0;
      for (var m = 0; m <= n && m < f.length; m++) {
        i = n - m;
        if (i >= 0 && i < g.length) {
          result[n] += f[m] * g[i];
        }
      }
    }
    return result;
  },

  stats: function() {
    var convolute = this.convolute(), d = [];
    for (var i = 0; i < convolute.length; i++) { d.push([i, convolute[i]]); }
    console.log(d);
    return d;
  }

});
