var assert = require('assert');
var util = require('util');
var lib = require('lib');


function List(x) { this.push(x); }
util.inherits(List, Array);

function Obj() {};


function deepEqualComplex(one, two) {
  assert.deepEqual(one, two);
  var props = Object.getOwnPropertyNames(one);
  assert.deepEqual(props, Object.getOwnPropertyNames(two));
  for (var i = 0; i < props.length; i++) {
    var prop1 = Object.getOwnPropertyDescriptor(one, props[i]);
    var prop2 = Object.getOwnPropertyDescriptor(two, props[i]);
    assert.deepEqual(prop2, prop2);
    if ('value' in prop1 && typeof prop1.value === 'object') {
      deepEqualComplex(prop1.value, prop2.value);
    }
  }
}

exports['test cloning immutable objects'] = function() {
  assert.ok(null === lib.clone(null));
  assert.ok(true === lib.clone(true));
  assert.ok(false === lib.clone(false));
  assert.ok(undefined === lib.clone(undefined));
  assert.ok(42 === lib.clone(42));
  assert.ok(isNaN(lib.clone(NaN)));

  // Now not as top-level object.
  var src = {
    $string: 'test',
    $null: null,
    $true: true,
    $false: false,
    $undefined: undefined,
    $number: 42,
    $NaN: NaN
  };

  var obj = lib.clone(src);
  // Can't use deepEqual because NaN != NaN
  assert.ok(obj !== src);
  assert.ok(obj.$string === src.$string);
  assert.ok(obj.$null === src.$null);
  assert.ok(obj.$true === src.$true);
  assert.ok(obj.$false === src.$false);
  assert.ok(obj.$undefined === src.$undefined);
  assert.ok(obj.$number === src.$number);
  assert.ok(isNaN(obj.$NaN));
}

exports['test plain object cloning'] = function() {
  var src = {
    foo: 'bar',
    baz: 42,
    another: { nested: 'object' },
    array: [ 1, 2, 3 ]
  };

  var obj = lib.clone(src);
  deepEqualComplex(obj, src);

  src.test = 'bar';
  assert.ok(obj !== src);
  assert.ok(obj.test !== src.test);
  assert.ok(obj.another !== src.another);
  assert.ok(obj.array !== src.array);
};

exports['test cloning of complex properties'] = function() {
  var src = {
    get foo() { return '42'; },
    set foo(val) {},
    object: {}
  };

  Object.defineProperty(src.object, 'test', {
    value: 'bar',
    enumerable: false
  });

  var obj = lib.clone(src);
  deepEqualComplex(obj, src);
  assert.ok(obj !== src);
  assert.ok(obj.object !== src.object);
};

exports['test cloning built-in types'] = function() {
  var src = {
    today: new Date,
    regex: /^\\foo/gim,
    list: new List(42),
    obj: new Obj
  };

  src.today.foo = { foo: 'bar' };
  src.regex.foo = [ 2, 3 ];
  src.list.test = 'foo';

  var obj = lib.clone(src);
  assert.ok(obj !== src);
  assert.ok(obj.today !== src.today);
  assert.equal(obj.today.toString(), src.today.toString());
  deepEqualComplex(obj.today.foo, src.today.foo);
  assert.ok(obj.regex !== src.regex);
  assert.equal(obj.regex.toString(), src.regex.toString());
  deepEqualComplex(obj.regex.foo, src.regex.foo);
  assert.ok(obj.list !== src.list);
  deepEqualComplex(obj.list, src.list);
  assert.ok(obj.list instanceof List);
  assert.ok(obj.obj !== src.obj);
  assert.ok(obj.obj instanceof Obj);
};

exports['test cloning circular structures'] = function() {
  var src = {
    foo: 'bar',
  };
  src.bar = src;
  src.baz = src.bar;

  var obj = lib.clone(src);
  assert.ok(obj !== src);
  assert.ok(obj.foo == src.foo);
  assert.ok(src.bar === src);
  assert.ok(obj.bar === obj);
  assert.ok(src.bar !== obj.bar)
  assert.ok(src.bar.bar.bar.bar.bar.bar === src);
  assert.ok(src.baz.bar === src.bar.baz);
  assert.ok(src.baz.bar !== obj.bar.baz);
};

