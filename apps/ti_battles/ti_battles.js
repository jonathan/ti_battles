// ==========================================================================
// Project:   TiBattles
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals TiBattles */

TiBattles = SC.Application.create();


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

TiBattles.diceStatsController = SC.ArrayController.create({
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

TiBattles.DieView = SC.TemplateView.extend({
  titleBinding: '.parentView.content.title',
  probabilityBinding: '.parentView.content.probability',
  numRollsBinding: '.parentView.content.numRolls'
});

SC.ready(function() {
  TiBattles.mainPane = SC.TemplatePane.append({
    layerId: 'ti_battles',
    templateName: 'ti_battles'
  });
});
