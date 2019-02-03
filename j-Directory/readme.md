## j-Directory

It's similar component like `j-Suggestion`, but has improved design and supports more handy features.

- singleton
- works with touches
- supports __dark mode__

> __IMPORTANT__: by default this component renders a value as a text from `name` property.

__Methods__:

Method: `component.show(options)`

- `options.element` {Element/jQuery Element}
- `options.items` {Array/String/Function} a list of items (`String` type means a link to data-source)
- `options.offsetX` {Number} optional, `x` offset (default: `0`)
- `options.offsetY` {Number} optional, `y` offset (default: `0`)
- `options.offsetWidth` {Number} optional, `width` offset (default: `0`)
- `options.placeholder` {String} optional, a placeholder for search field
- `options.render` {Function} optional, a function for customized render of item `function(item, text)` must return `HTML`
- `options.custom` {Boolean} optional, enables returning a value not defined in `options.items`, default: `false`
- `options.minwidth` {Number} optional, a minimal width, default `200`
- `options.maxwidth` {Number} optional, a maximal width, default `infinite`
- `options.callback(selected_item, element) {Function}` is triggered when the user clicks on the item
- `options.key` {String} optional, a default `key` for `text` value (default: `name`)

Method: `component.hide()`

__Configuration__:
- `placeholder` - a placeholder for the search input

__Formatting via Tangular__:

```javascript
var opt = {};
opt.items = [];
opt.push({ name: 'Total.js', template: '<b>{{ name }}</b>' });
```

__Formatting via custom function__:

```javascript
var opt = {};
opt.items = [];
opt.push({ name: 'Total.js' });
opt.push({ name: 'Express.js' });
opt.push({ name: 'Koa.js' });
opt.render = function(item, name) {
	return '<b>' + name + '</b>';
};
```

__Adding of custom class__:

```javascript
var opt = {};
opt.items = [];
opt.push({ name: 'Total.js', classname: 'your_class_name' });
```

__Server-side searching__:

```javascript

var opt = {};

opt.element = your_element;

opt.items = function(search, next) {
	next([{ name: 'Item 1' }, { name: 'Item 2' }]);
};

opt.callback = function(selected) {
	console.log(selected);
};

SETTER('directory', 'show', opt);
````

### Author

- Peter Širka <petersirka@gmail.com>
- License: MIT