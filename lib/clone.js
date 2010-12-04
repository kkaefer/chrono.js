function clone(source) {
  if ((typeof source === 'object' && source !== null) || source instanceof RegExp)
    return _clone(source, { source: [], target: [] })
  else
    return source;
}

function _clone(source, seen) {
  var index = seen.source.indexOf(source);
  if (index >= 0) return seen.target[index];

  if (source.constructor !== Object)
    if (Array.isArray(source))
      var target = [];
    else if (source instanceof Date)
      var target = new Date(source);
    else if (source instanceof RegExp)
      var target = new RegExp(source.source, (source.global ? 'g' : '') +
        (source.ignoreCase ? 'i' : '') + (source.multiline ? 'm' : ''));
    else
      var target = Object.create(Object.getPrototypeOf(source));
  else
    var target = {};

  seen.source.push(source);
  seen.target.push(target);

  var props = Object.getOwnPropertyNames(source);
  for (var i = 0; i < props.length; i++) {
    var prop = Object.getOwnPropertyDescriptor(source, props[i]);
    if ('value' in prop) {
      var value = prop.value;
      if ((typeof value === 'object' && value !== null) || value instanceof RegExp) {
        prop.value = _clone(value, seen);
      }
    }
    Object.defineProperty(target, props[i], prop);
  }
  return target;
}

exports.clone = clone;