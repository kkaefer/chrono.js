var data = require('./date_data');

function pad2(i) {
  return i < 10 ? '0' + i : i;
};

function pad2sign(i) {
  var sgn = i < 0 ? '-' : '+';
  i = Math.abs(i);
  return sgn + (i < 10 ? '0' + i : i);
};

function pad3(i) {
  return i < 10 ? '00' + i : i < 100 ? '0' + i : i;
};

function pad4sign(i) {
  var sgn = i < 0 ? '-' : '+';
  i = Math.abs(i);
  return sgn + (i < 10 ? '000' + i : i < 100 ? '00' + i : i < 1000 ? '0' + i : i);
}

exports.weekdays = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
exports.weekdaysShort = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

exports.months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
exports.monthsShort = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

exports.ordinals = function(number) {
  switch (number % 10) {
    case 1: return (number % 100 !== 11) ? 'st' : 'th';
    case 2: return (number % 100 !== 12) ? 'nd' : 'th';
    case 3: return (number % 100 !== 13) ? 'rd' : 'th';
    default: return 'th';
  }
};

Date.prototype.format = function(format, tz) {
  var time = this.getTime();

  if (tz === undefined) {
    tz = this.getTimezone();
    tzName = this.getTimezoneName();
  }
  else {
    var tzData = parseTimezone(tz);
    tz = tzData[0];
    var tzName = tzData[1];
  }

  // Use correct timezone.
  this.setTime(time - tz * 60000);

  var result = '';
  for (var i = 0; i < format.length; i++) {
    switch (format[i]) {
      // Day
      case 'd': result += pad2(this.getUTCDate()); break;
      case 'D': result += exports.weekdaysShort[this.getUTCDay()]; break;
      case 'j': result += this.getUTCDate(); break;
      case 'l': result += exports.weekdays[this.getUTCDay()]; break;
      case 'N': result += this.getUTCDay() || 7; break;
      case 'S': result += exports.ordinals(this.getUTCDate()); break;
      case 'w': result += this.getUTCDay(); break;
      case 'z': result += this.getUTCDayOfYear(); break;

      // Week
      case 'W': result += pad2(this.getUTCISOWeek()); break;

      // Month
      case 'F': result += exports.months[this.getUTCMonth()]; break;
      case 'm': result += pad2(this.getUTCMonth() + 1); break;
      case 'M': result += exports.monthsShort[this.getUTCMonth()]; break;
      case 'n': result += this.getUTCMonth() + 1; break;
      case 't': result += this.getUTCDaysOfMonth(); break;

      // Year
      case 'L': result += this.isLeapYear() ? 1 : 0; break;
      case 'o': result += this.getUTCISOFullYear(); break;
      case 'Y': result += this.getUTCFullYear(); break;
      case 'y': result += pad2(this.getUTCFullYear() % 100); break;

      // Time
      case 'a': result += this.getUTCHours() >= 12 ? 'pm' : 'am'; break;
      case 'A': result += this.getUTCHours() >= 12 ? 'PM' : 'AM'; break;
      case 'g': result += this.getUTCHours() % 12 || 12; break;
      case 'G': result += this.getUTCHours(); break;
      case 'h': result += pad2(this.getUTCHours() % 12 || 12); break;
      case 'H': result += pad2(this.getUTCHours()); break;
      case 'i': result += pad2(this.getUTCMinutes()); break;
      case 's': result += pad2(this.getUTCSeconds()); break;
      case 'u': result += pad3(this.getUTCMilliseconds()); break;

      // Timezone
      case 'O': result += pad4sign((tz < 0 ? 1 : -1) * (Math.floor(Math.abs(tz) / 60) * 100 + Math.abs(tz) % 60)); break;
      case 'P': result += pad2sign((tz < 0 ? 1 : -1) * (Math.floor(Math.abs(tz) / 60))) + ':' + pad2(Math.abs(tz) % 60); break;
      case 'T': result += tzName; break;
      case 'Z': result += -tz * 60; break;

      // Full Date/Time
      case 'c': result += this.format('Y-m-d\\TH:i:sP', tz); break;
      case 'r': result += this.format('D, d M y H:i:s O', tz); break;
      case 'U': result += Math.floor(this.getTime() / 1000); break;

      case '\\': if (format[++i] !== undefined) result += format[i]; break;

      default: result += format[i]; break;
    }
  }

  this.setTime(time);

  return result;
};

function parseTimezone(tz) {
  if (typeof tz === 'number') {
    return [tz, tz in data.offsetToTz ? data.offsetToTz[tz][0] : ''];
  }
  var number = parseInt(tz, 10);
  if (isNaN(number)) {
    return [data.tzToOffset[tz], tz];
  }
  else {
    tz = (number < 0 ? 1 : -1) * (Math.floor(Math.abs(number) / 100) * 60 + Math.abs(number) % 100);
    return [tz, tz in data.offsetToTz ? data.offsetToTz[tz][0] : ''];
  }
}

Date.prototype.isLeapYear = function() {
  var y = this.getUTCFullYear();
  return (y % 400 === 0) || (y % 4 === 0 && y % 100 !== 0);
};

Date.prototype.getUTCISOWeek = function() {
  // Go to the week's thursday.
  var d = new Date(this);
  d.setUTCDate(d.getUTCDate() - (d.getUTCDay() || 7) + 4);
  return Math.ceil((d.getTime() - Date.UTC(d.getUTCFullYear(), 0)) / 86400000 / 7);
};

Date.prototype.getUTCISOFullYear = function() {
  // Go to the week's thursday.
  var d = new Date(this);
  d.setUTCDate(d.getUTCDate() - (d.getUTCDay() || 7) + 4);
  return d.getUTCFullYear();
};

Date.prototype.getUTCDaysOfMonth = function() {
  var d = new Date(this);
  d.setUTCMonth(d.getUTCMonth() + 1);
  d.setUTCDate(0);
  return d.getUTCDate();
};

Date.prototype.getUTCDayOfYear = function() {
  return Math.floor((this.getTime() - Date.UTC(this.getUTCFullYear(), 0)) / 86400000);
};

Date.prototype.getTimezone = function() {
  if (!('_tz' in this)) {
    this.setTimezone(new Date().toString().match(/\((\w+)\)$/)[1]);
  }
  return this._tz;
};

Date.prototype.getTimezoneName = function() {
  this.getTimezone(); // Make sure the tz data is populated.
  return this._tzName;
};

Date.prototype.setTimezone = function(val) {
  var tzData = parseTimezone(val);
  this._tz = tzData[0];
  this._tzName = tzData[1];
};

exports.timeInterval = {
  years: function(years) { return years === 1 ? '1 year' : years + ' years'; },
  months: function(months) { return months === 1 ? '1 month' : months + ' months'; },
  weeks: function(weeks) { return weeks === 1 ? '1 week' : weeks + ' weeks'; },
  days: function(days) { return days === 1 ? '1 day' : days + ' days'; },
  hours: function(hours) { return hours === 1 ? '1 hour' : hours + ' hours'; },
  minutes: function(minutes) { return minutes === 1 ? '1 minute' : minutes + ' minutes'; },
  seconds: function(seconds) { return seconds === 1 ? '1 second' : seconds + ' seconds'; }
};

Date.prototype.ago = function(omit) {  
  omit = omit || [];
  var now = new Date();
  var then = new Date(this);

  if (now.getTime() > then.getTime()) {
    var result = [];

    if (omit.indexOf('years') < 0) {
      var years = now.getUTCFullYear() - then.getUTCFullYear();
      if (years > 0) {
        result.push(exports.timeInterval.years(years));
        then.setUTCFullYear(then.getUTCFullYear() + years);
      }
    }

    if (omit.indexOf('months') < 0) {
      var months = now.getUTCFullYear() * 12 + now.getUTCMonth() - (then.getUTCFullYear() * 12 + then.getUTCMonth())
      if (now.getDate() < then.getDate()) months--;
      if (months > 0) {
        result.push(exports.timeInterval.months(months));
        then.setUTCMonth(then.getUTCMonth() + months);
      }
    }

    var seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    [ ['weeks', 604800], ['days', 86400], ['hours', 3600], ['minutes', 60], ['seconds', 1] ].forEach(function(e) {
      if (omit.indexOf(e[0]) < 0) {
        var interval = Math.floor(seconds / e[1]);
        if (interval > 0) {
          seconds -= interval * e[1];
          result.push(exports.timeInterval[e[0]](interval));
        }        
      } 
    });
    
    if (result.length) return result;
  }
  
  // No time snippet has been generated so far.
  var order = ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'];
  for (var i = 0; i < order.length; i++) {
    if (omit.indexOf(order[i]) < 0) return [ exports.timeInterval[order[i]](0) ];
  }
  
  return [];
};





