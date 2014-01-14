var assert = require('assert');
require('..');

exports['test general formatting'] = function() {
  var d = new Date('Apr 02 2010 08:47:07.049 GMT+0000');

  assert.equal(d.format('y-m-d H:i:s', 0), '10-04-02 08:47:07');
  assert.equal(d.format('D, jS F Y \\a\\t g a', 0), 'Fri, 2nd April 2010 at 8 am');

  assert.equal(d.format('d D j l N S w z', 0), '02 Fri 2 Friday 5 nd 5 91');
  assert.equal(d.format('F m M n t', 0), 'April 04 Apr 4 30');
  assert.equal(d.format('L o Y y O P T Z', 0), '0 2010 2010 10 +0000 +00:00 UTC 0');
  assert.equal(d.format('a A g G h H i s u', 0), 'am AM 8 8 08 08 47 07 049');
  assert.equal(d.format('c r U', 0), '2010-04-02T08:47:07+00:00 Fri, 02 Apr 10 08:47:07 +0000 1270198027');

  assert.equal(d.format('c'), d.format('Y-m-d\\TH:i:sP'));
  assert.equal(d.format('r'), d.format('D, d M y H:i:s O'));
};

exports['test padding'] = function() {
  var d = new Date('Feb 04 2005 05:03:08 GMT+0000');

  // Test padding.
  assert.equal(d.format('W d m y h H i s u O P', 0), '05 04 02 05 05 05 03 08 000 +0000 +00:00');

  // Test non-padding.
  assert.equal(d.format('j z n g G', 0), '4 34 2 5 5');
};

exports['test am/pm'] = function() {
  assert.equal(new Date('May 15 2010 00:00:00 GMT+0000').format('a A g G h H', 0), 'am AM 12 0 12 00');
  assert.equal(new Date('May 15 2010 14:00:00 GMT+0000').format('a A g G h H', 0), 'pm PM 2 14 02 14');
};

exports['test leap years'] = function() {
  assert.equal(new Date('Feb 01 1900 00:00:00 GMT+0000').format('L t', 0), '0 28');
  assert.equal(new Date('Feb 01 1904 00:00:00 GMT+0000').format('L t', 0), '1 29');
  assert.equal(new Date('Feb 01 2000 00:00:00 GMT+0000').format('L t', 0), '1 29');
  assert.equal(new Date('Feb 01 2001 00:00:00 GMT+0000').format('L t', 0), '0 28');
};

exports['test getUTCDaysOfMonth'] = function() {
  assert.equal(new Date('Jan 30 2012 00:00:00 GMT+0000').getUTCDaysOfMonth(), 31);
  assert.equal(new Date('Jan 30 2012').getUTCDaysOfMonth(), 31);
  assert.equal(new Date('Feb 02 2012 00:00:00 GMT+0000').getUTCDaysOfMonth(), 29);
  assert.equal(new Date('Feb 02 2012').getUTCDaysOfMonth(), 29);
  assert.deepEqual(new Date('Jan 30 2012 00:00:00 GMT+0000').interval(new Date('Feb 6, 2012 00:00:00 GMT+0000')), ['1 week']);
  assert.deepEqual(new Date('Jan 30 2012').interval(new Date('Feb 6, 2012')), ['1 week']);
};

exports['test english ordinals'] = function() {
  assert.equal(new Date('May 1 2010 00:00:00 GMT+0000').format('jS', 0), '1st');
  assert.equal(new Date('May 2 2010 00:00:00 GMT+0000').format('jS', 0), '2nd');
  assert.equal(new Date('May 3 2010 00:00:00 GMT+0000').format('jS', 0), '3rd');
  assert.equal(new Date('May 4 2010 00:00:00 GMT+0000').format('jS', 0), '4th');
  assert.equal(new Date('May 11 2010 00:00:00 GMT+0000').format('jS', 0), '11th');
  assert.equal(new Date('May 21 2010 00:00:00 GMT+0000').format('jS', 0), '21st');
};

exports['test missing timezone parameter'] = function() {
  var date = new Date();
  assert.equal(parseInt(date.format('G'), 10), date.getHours());
  assert.equal(parseInt(date.format('i'), 10), date.getMinutes());
  assert.equal(parseInt(date.format('j'), 10), date.getDate());
};

exports['test timezone tokens'] = function() {
  var d = new Date('Jul 18 2010 12:00:00 GMT+0000');

  assert.equal(d.format('Y-m-d H:i:s O P Z', 285), '2010-07-18 07:15:00 -0445 -04:45 -17100');
  assert.equal(d.format('Y-m-d H:i:s O P Z', '-0445'), '2010-07-18 07:15:00 -0445 -04:45 -17100');

  assert.equal(d.format('Y-m-d H:i:s O P Z', 270), '2010-07-18 07:30:00 -0430 -04:30 -16200');
  assert.equal(d.format('Y-m-d H:i:s O P Z', '-0430'), '2010-07-18 07:30:00 -0430 -04:30 -16200');
  assert.equal(d.format('Y-m-d H:i:s O P Z', 'VET'), '2010-07-18 07:30:00 -0430 -04:30 -16200');

  assert.equal(d.format('Y-m-d H:i:s O P Z', 60), '2010-07-18 11:00:00 -0100 -01:00 -3600');
  assert.equal(d.format('Y-m-d H:i:s O P Z', '-0100'), '2010-07-18 11:00:00 -0100 -01:00 -3600');
  assert.equal(d.format('Y-m-d H:i:s O P Z', 'CVT'), '2010-07-18 11:00:00 -0100 -01:00 -3600');

  assert.equal(d.format('Y-m-d H:i:s O P Z', -60), '2010-07-18 13:00:00 +0100 +01:00 3600');
  assert.equal(d.format('Y-m-d H:i:s O P Z', '+0100'), '2010-07-18 13:00:00 +0100 +01:00 3600');
  assert.equal(d.format('Y-m-d H:i:s O P Z', 'CET'), '2010-07-18 13:00:00 +0100 +01:00 3600');

  assert.equal(d.format('Y-m-d H:i:s O P Z', -345), '2010-07-18 17:45:00 +0545 +05:45 20700');
  assert.equal(d.format('Y-m-d H:i:s O P Z', '+0545'), '2010-07-18 17:45:00 +0545 +05:45 20700');
  assert.equal(d.format('Y-m-d H:i:s O P Z', 'NPT'), '2010-07-18 17:45:00 +0545 +05:45 20700');
};

exports['test timezones across day boundaries'] = function() {
  var d = new Date('Jan 1 2010 00:00:00 GMT+0000');

  assert.equal(d.format('Y-m-d H:i:s O T', '+1200'), '2010-01-01 12:00:00 +1200 FJT');
  assert.equal(d.format('Y-m-d H:i:s O T', 'CEST'), '2010-01-01 02:00:00 +0200 CEST');
  assert.equal(d.format('Y-m-d H:i:s O T', 'EST'), '2009-12-31 19:00:00 -0500 EST');
  assert.equal(d.format('Y-m-d H:i:s O T', 'EDT'), '2009-12-31 20:00:00 -0400 EDT');
  assert.equal(d.format('Y-m-d H:i:s O T', 'PST'), '2009-12-31 16:00:00 -0800 PST');
  assert.equal(d.format('Y-m-d H:i:s O T', 'PDT'), '2009-12-31 17:00:00 -0700 PDT');
  assert.equal(d.format('Y-m-d H:i:s O T', '-0730'), '2009-12-31 16:30:00 -0730 ');
  assert.equal(d.format('Y-m-d H:i:s O T', '-0745'), '2009-12-31 16:15:00 -0745 ');
  assert.equal(d.format('Y-m-d H:i:s O T', 'NPT'), '2010-01-01 05:45:00 +0545 NPT');

  d.setTimezone('EEST');
  assert.equal(d.format('Y-m-d H:i:s O T'), '2010-01-01 03:00:00 +0300 EEST');
  assert.equal(d.format('Y-m-d H:i:s O T', 'CEST'), '2010-01-01 02:00:00 +0200 CEST');
};

exports['test ISO week numbers'] = function() {
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

exports['test time intervals'] = function() {
    assert.deepEqual(new Date('Dec 27 2009 11:34:20 UTC').interval(new Date('Dec 27 2010 12:18:23 UTC')),
        ['1 year', '44 minutes', '3 seconds']);
    assert.deepEqual(new Date('Dec 31 2009 11:34:20 UTC').interval(new Date('Feb 10 2010 12:18:23 UTC')),
        ['1 month', '1 week', '3 days', '44 minutes', '3 seconds']);
    assert.deepEqual(new Date('Dec 15 2010 11:34:20 UTC').interval(new Date('Nov 28 2010 12:18:23 UTC')),
        ['2 weeks', '2 days', '23 hours', '15 minutes', '57 seconds']);
    assert.deepEqual(new Date('Feb 28 2004').interval(new Date('Feb 29 2004')), ['1 day']);
    assert.deepEqual(new Date('Feb 28 2004').interval(new Date('Mar 1 2004')), ['2 days']);
    assert.deepEqual(new Date('Feb 28 2004').interval(new Date('Feb 28 2005')), ['1 year']);
    assert.deepEqual(new Date('Feb 28 2004').interval(new Date('Mar 2 2004')), ['3 days']);
    assert.deepEqual(new Date('Feb 28 2003').interval(new Date('Mar 1 2005')), ['2 years', '1 day']);
    assert.deepEqual(new Date('Feb 28 2004').interval(new Date('Mar 1 2005')), ['1 year', '2 days']);
    assert.deepEqual(new Date('Feb 29 2004').interval(new Date('Mar 1 2005')), ['1 year', '1 day']);
    assert.deepEqual(new Date('Feb 28 2003').interval(new Date('Mar 1 2004')), ['1 year', '1 day']);
};

exports['test time zone identifiers'] = function() {
  var d = new Date('May 31 2012 12:34:56 GMT+0200');
  assert.equal(d.format('Y-m-d H:i:s O T', 'CEST'), '2012-05-31 12:34:56 +0200 CEST');
  assert.equal(d.format('Y-m-d H:i:s O T', 'NZST'), '2012-05-31 22:34:56 +1200 NZST');
};
