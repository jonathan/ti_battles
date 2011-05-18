// ==========================================================================
// Project:   TiBattles
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals TiBattles */

TiBattles = SC.Application.create();


TiBattles.Die = SC.Record.extend({
  probability: SC.Record.attr(Number),
  rollNum: SC.Record.attr(Number),

  distribution: function (n, p) {
    var n = this.get('rollNum'),
        result = [];
    for (var k = 0; k <= n; k++) {
      result[k] = binomial(n, k);
    }
    return result;
  }.property("probability", "rollNum"),

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

TiBattles.die1 = new TiBattles.Die({
    probability: 0.8,
    rollNum: 3
});

TiBattles.die2 = new TiBattles.Die({
    probability: 0.2,
    rollNum: 6
});

TiBattles.dieStats = SC.ArrayController.create({
  convolute: function () {
    var f = TiBattles.die1.distribution,
        g = TiBattles.die2.distribution,
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

  content: function() {
    var convolute = this.convolute(), d = [];
    for (var i = 0; i < convolute.length; i++) { d.push([i, convolute[i]]); }
    console.log(d);
    return d;
  }.property("die1", "die2")

});

TiBattles.Die1View = SC.TemplateView.extend({
  probabilityBinding: 'TiBattles.die1.probability',
  numRollBinding: 'TiBattles.die1.numRoll'
});

TiBattles.Die2View = SC.TemplateView.extend({
  probabilityBinding: 'TiBattles.die2.probability',
  numRollBinding: 'TiBattles.die2.numRoll'
});

SC.ready(function() {
  TiBattles.mainPane = SC.TemplatePane.append({
    layerId: 'ti_battles',
    templateName: 'ti_battles'
  });
});
