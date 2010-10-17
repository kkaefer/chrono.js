require('../');

exports['test general formatting'] = function(assert) {
  // Apr 02 2010 08:47:07
  var d = new Date(1270198027049);

  assert.equal(d.format('y-m-d H:i:s', 0), '10-04-02 08:47:07');
  assert.equal(d.format('D, jS F Y \\a\\t g a', 0), 'Fri, 2nd April 2010 at 8 am');

  assert.equal(d.format('d D j l N S w z', 0), '02 Fri 2 Friday 5 nd 5 91');
  assert.equal(d.format('F m M n t', 0), 'April 04 Apr 4 30');
  assert.equal(d.format('L o Y y O P T Z', 0), '0 2010 2010 10 +0000 +00:00 UTC 0');
  assert.equal(d.format('a A g G h H i s u', 0), 'am AM 8 8 08 08 47 07 049');
  assert.equal(d.format('c r U', 0), '2010-04-02T08:47:07+00:00 Fri, 02 Apr 10 08:47:07 +0000 1270198027');
};

exports['test padding'] = function(assert) {
  var d = new Date('Feb 04 2005 05:03:08 GMT+0000');

  // Test padding.
  assert.equal(d.format('W d m y h H i s u O P', 0), '05 04 02 05 05 05 03 08 000 +0000 +00:00');

  // Test non-padding.
  assert.equal(d.format('j z n g G', 0), '4 34 2 5 5');
};

exports['test am/pm'] = function(assert) {
  // May 15 2010 00:00:00 GMT+0000
  var d = new Date(1273881600000);
  assert.equal(d.format('a A g G h H', 0), 'am AM 12 0 12 00');

  // May 15 2010 14:00:00 GMT+0000
  var d = new Date(1273932000000);
  assert.equal(d.format('a A g G h H', 0), 'pm PM 2 14 02 14');
};

exports['test leap years'] = function(assert) {
  // Feb 01 1900 00:00:00 GMT+0000
  var d = new Date(-2206310400000);
  assert.equal(d.format('L t', 0), '0 28');

  // Feb 01 1904 00:00:00 GMT+0000
  var d = new Date(-2080166400000);
  assert.equal(d.format('L t', 0), '1 29');

  // Feb 01 2000 00:00:00 GMT+0000
  var d = new Date(949363200000);
  assert.equal(d.format('L t', 0), '1 29');
};

exports['test english ordinals'] = function(assert) {
  // May 1 2010 14:00:00 GMT+0000
  assert.equal(new Date(1272722400000).format('jS', 0), '1st');

  // May 2 2010 14:00:00 GMT+0000
  assert.equal(new Date(1272808800000).format('jS', 0), '2nd');

  // May 3 2010 14:00:00 GMT+0000
  assert.equal(new Date(1272895200000).format('jS', 0), '3rd');

  // May 4 2010 14:00:00 GMT+0000
  assert.equal(new Date(1272981600000).format('jS', 0), '4th');

  // May 11 2010 14:00:00 GMT+0000
  assert.equal(new Date(1273586400000).format('jS', 0), '11th');

  // May 21 2010 14:00:00 GMT+0000
  assert.equal(new Date(1274450400000).format('jS', 0), '21st');
};

exports['test timezones across day boundaries'] = function(assert) {
  // Jan 1 2010 00:00:00 GMT+0000
  var d = new Date(1262304000000);
  assert.equal(d.format('Y-m-d H:i:s O', '+1200'), '2010-01-01 12:00:00 +1200');
  assert.equal(d.format('Y-m-d H:i:s O T', 'CEST'), '2010-01-01 02:00:00 +0200 CEST');
  assert.equal(d.format('Y-m-d H:i:s O T', 'EST'), '2009-12-31 19:00:00 -0500 EST');
  assert.equal(d.format('Y-m-d H:i:s O T', 'EDT'), '2009-12-31 20:00:00 -0400 EDT');
  assert.equal(d.format('Y-m-d H:i:s O T', 'PST'), '2009-12-31 16:00:00 -0800 PST');
  assert.equal(d.format('Y-m-d H:i:s O T', 'PDT'), '2009-12-31 17:00:00 -0700 PDT');
  assert.equal(d.format('Y-m-d H:i:s O', '-0730'), '2009-12-31 16:30:00 -0730');
  assert.equal(d.format('Y-m-d H:i:s O', '-0745'), '2009-12-31 16:15:00 -0745');

  d.setTimezone('EEST');
  assert.equal(d.format('Y-m-d H:i:s O T'), '2010-01-01 03:00:00 +0300 EEST');
  assert.equal(d.format('Y-m-d H:i:s O T', 'CEST'), '2010-01-01 02:00:00 +0200 CEST');
};

exports['test ISO week numbers'] = function(assert) {
  assert.equal(new Date('Jan 01 2005 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2004-W53-6');
  assert.equal(new Date('Jan 02 2005 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2004-W53-7');
  assert.equal(new Date('Dec 31 2005 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2005-W52-6');

  assert.equal(new Date('Jan 01 2007 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2007-W01-1');

  assert.equal(new Date('Dec 30 2007 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2007-W52-7');
  assert.equal(new Date('Dec 31 2007 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2008-W01-1');
  assert.equal(new Date('Jan 01 2008 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2008-W01-2');

  assert.equal(new Date('Dec 28 2008 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2008-W52-7');
  assert.equal(new Date('Dec 29 2008 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2009-W01-1');
  assert.equal(new Date('Dec 30 2008 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2009-W01-2');
  assert.equal(new Date('Dec 31 2008 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2009-W01-3');
  assert.equal(new Date('Jan 01 2009 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2009-W01-4');

  assert.equal(new Date('Dec 27 2009 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2009-W52-7');
  assert.equal(new Date('Dec 28 2009 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2009-W53-1');
  assert.equal(new Date('Dec 29 2009 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2009-W53-2');
  assert.equal(new Date('Dec 30 2009 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2009-W53-3');
  assert.equal(new Date('Dec 31 2009 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2009-W53-4');
  assert.equal(new Date('Jan 01 2010 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2009-W53-5');
  assert.equal(new Date('Jan 02 2010 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2009-W53-6');
  assert.equal(new Date('Jan 03 2010 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2009-W53-7');
  assert.equal(new Date('Jan 04 2010 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2010-W01-1');
  assert.equal(new Date('Jan 05 2010 12:00:00 GMT+0000').format('o-\\WW-N', 0), '2010-W01-2');
};



