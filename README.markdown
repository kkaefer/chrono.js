# chrono.js [![Build Status](https://travis-ci.org/kkaefer/chrono.js.png)](https://travis-ci.org/kkaefer/chrono.js)

### Date.prototype.**format(format, [timezone])**

Allows formatting of time in a `strftime` style, but with syntax taken from PHP's [`date`](http://php.net/date) function. It implements pretty much all of the tokens from PHP's [`date`](http://php.net/date) function, except for B (Swatch internet time) and e (Content/City timezone identifier). You can escape characters with a `\` (remember to encode the `\` in a string as well). All other characters will be printed as they appear in the format string.

The optional `timezone` parameter specifies the time zone to be used. The values allowed are the same as for `Date.prototype.setTimezone()`. If no value is specified, the Date object's internal time zone will be used.

The function returns a string with the tokens replaced with the Date object's information.

Example: `new Date().format('d.m.Y H:i:s', 'CET');` returns `19.10.2010 15:48:20` (in CET, without regard to DST).

### Date.prototype.**isLeapYear()**

Returns true if the Date object's UTC date is in a leap year.

### Date.prototype.**getUTCISOWeek()**

Returns the ISO-8601 week number of the year, using the Date object's UTC date.

### Date.prototype.**getUTCISOFullYear()**

Returns the ISO-8601 year, using the Date object's UTC date. This is generally the same as the Gregorian year, but may sometimes deviate at the beginning or end of the year. It is commonly used in conjunction with the ISO-8601 week number.

### Date.prototype.**getUTCDaysOfMonth()**

Returns the number of days in the Date object's UTC date's month.

### Date.prototype.**getUTCDayOfYear()**

Returns the day of the year of the Date object's UTC date.

### Date.prototype.**getTimezone()**

Returns the deviation from UTC in minutes (using JavaScript's inverse offset). If no explicit time zone has been specified, it returns the system clock's time zone offset.

### Date.prototype.**getTimezoneName()**

Returns the time zone acronym of the Date object's timezone.

### Date.prototype.**setTimezone(val)**

Sets the Date object's timezone. Numbers are interpreted as deviation in minutes from UTC, with positive values west of UTC and negative values east thereof (this is JavaScript's way of specifying time zone offset and is the exact opposite of how timezone offsets normally work). Alternatively, you can specify a offset in RFC2822 notation, for example `'+0200'` for UTC + 2 hours. Common time zone shortcuts like `'PST'` also work.


# TESTS

Tests can be run with `make test` after installing [Expresso](http://github.com/visionmedia/expresso). `make test-cov` reports test coverage.
