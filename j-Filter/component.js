COMPONENT('filter', 'reset:Reset;apply:Apply;cancel:Cancel', function(self, config) {

	var cls = 'ui-filter';
	var cls2 = '.' + cls;
	var events = {};
	var is = false;
	var container, timeout;

	self.singleton();
	self.readonly();
	self.nocompile && self.nocompile();

	self.bindevents = function() {
		if (!is)
			$(W).on('scroll', events.resize).on('resize', events.resize);
	};

	self.unbindevents = function() {
		if (is)
			$(W).off('scroll', events.resize).off('resize', events.resize);
	};

	self.make = function() {
		self.aclass(cls + ' hidden');
		self.append('<div class="' + cls + '-items"></div><div class="' + cls + '-buttons"><button name="reset">{reset}</button><button name="apply"><i class="fa fa-filter"></i>{apply}</button><button name="cancel">{cancel}</button></div>'.arg(config));
		container = self.find(cls2 + '-items');

		self.event('click', 'button', function(e) {
			e.preventDefault();
			var t = this;
			if (t.name === 'cancel') {
				self.hide(1);
			} else if (t.name === 'reset') {
				self.opt.callback(null);
				self.hide(1);
			} else {

				var obj = {};
				var changed = [];

				for (var i = 0; i < self.opt.items.length; i++) {
					var item = self.opt.items[i];
					var key = item.name || item.label;
					if (item.current != null) {
						obj[key] = item.current;
						if (item.changed)
							changed.push(key);
					}
				}

				self.opt.callback(obj, changed);
				self.hide(1);
			}
		});

		self.event('change', 'input', function() {
			var el = $(this);
			el = el.closest(cls2 + '-item');
			self.val(el, this.value);
		});

		self.event('input', 'input', function() {
			var t = this;
			if (t.$prev != t.value) {
				t.$prev = t.value;
				$(t).closest(cls2 + '-item').find(cls2 + '-placeholder').tclass('hidden', !!t.value);
			}
		});

		self.event('click', cls2 + '-checkbox', function() {
			var el = $(this);
			var is = !el.hclass(cls + '-checkbox-checked');
			el = el.closest(cls2 + '-item');
			self.val(el, is);
		});

		self.event('click', cls2 + '-icon-click,' + cls2 + '-placeholder', function() {

			var el = $(this).closest(cls2 + '-item');
			var item = self.opt.items[+el.attrd('index')];
			var opt;

			if (item.type === Date) {
				opt = {};
				opt.offsetX = -5;
				opt.offsetY = -5;
				opt.value = item.current || NOW;
				opt.element = el.find('input');
				opt.callback = function(date) {
					self.val(el, date);
				};
				SETTER('datepicker', 'show', opt);
			} else if (item.type instanceof Array) {
				el.find(cls2 + '-option').trigger('click');
			} else if (item.type === 'Time') {
				opt = {};
				opt.offsetX = -5;
				opt.offsetY = -5;
				opt.value = item.current || NOW;
				opt.element = el.find('input');
				opt.callback = function(date) {
					self.val(el, date);
				};
				SETTER('timepicker', 'show', opt);
			} else
				el.find('input').focus();
		});

		self.event('click', cls2 + '-option', function() {

			var el = $(this).closest(cls2 + '-item');
			var item = self.opt.items[+el.attrd('index')];
			var opt = {};

			opt.element = el;
			opt.items = item.type;
			opt.offsetWidth = -20;
			opt.placeholder = 'Search';
			opt.offsetX = 10;
			opt.offsetY = 10;
			opt.key = item.dirkey;
			opt.empty = item.dirempty;

			opt.callback = function(selected, el, custom) {

				if (custom)
					return;

				if (typeof(selected) === 'string')
					self.val(opt.element, selected);
				else
					self.val(opt.element, selected[item.dirvalue]);
			};

			SETTER('directory', 'show', opt);
		});

		events.resize = function() {
			is && self.hide(1);
		};

		self.on('reflow', events.resize);
		self.on('scroll', events.resize);
		self.on('resize', events.resize);
	};

	self.val = function(el, val, init) {

		var item = self.opt.items[+el.attrd('index')];
		var type = typeof(val);
		var tmp;

		if (item.type instanceof Array) {
			if (typeof(item.type[0]) === 'string') {
				tmp = item.type.indexOf(val);
				if (tmp !== -1) {
					el.find(cls2 + '-option').html(val);
					item.current = val;
				}
			} else {
				item.current = val;
				val = item.type.findValue(item.dirvalue, val, item.dirkey, '');
				el.find(cls2 + '-option').html(val);
			}
		} else {
			switch (item.type) {
				case Date:
					if (type === 'string')
						val = val ? val.parseDate(item.format) : '';
					break;
				case Number:
					if (type === 'string')
						val = val.parseFloat();
					break;
				case Boolean:
					el.find(cls2 + '-checkbox').tclass(cls + '-checkbox-checked', val);
					break;
				case 'Time':
					if (type === 'string') {
						val = val ? val.parseDate(item.format) : '';
						item.current.setHours(val.getHours());
						item.current.setMinutes(val.getMinutes());
						item.current.setSeconds(val.getSeconds());
					}
					break;
			}
			item.current = val;
			val = val ? item.format ? val.format(item.format) : val : '';
			item.input && (el.find('input').val(val)[0].$prev = val);
		}

		if (!init)
			item.changed = true;

		item.placeholder && el.find(cls2 + '-placeholder').tclass('hidden', !!val);
	};

	self.show = function(opt) {

		var el = opt.element instanceof jQuery ? opt.element[0] : opt.element.element ? opt.element.dom : opt.element;

		if (is) {
			clearTimeout(timeout);
			if (self.target === el) {
				self.hide(1);
				return;
			}
		}

		var builder = [];
		for (var i = 0; i < opt.items.length; i++) {
			var item = opt.items[i];
			var value = '';

			if (item.type instanceof Array) {
				value = '<div class="' + cls + '-option"></div>';
				item.icon = 'chevron-down';
				item.iconclick = true;

				if (!item.dirkey)
					item.dirkey = 'name';

				if (!item.dirvalue)
					item.dirvalue = 'id';

			} else {
				switch (item.type) {
					case Date:
						item.icon = 'calendar';
						item.input = true;
						item.iconclick = true;
						if (!item.format)
							item.format = 'yyyy–MM–dd';
						item.maxlength = item.format.length;
						break;
					case Number:
						item.input = true;
						item.iconclick = true;
						break;
					case String:
						item.input = true;
						item.iconclick = true;
						break;
					case Boolean:
						value = '<div class="{0}-checkbox"><i class="fa fa-check"></i></div>'.format(cls);
						break;
					case 'Time':
						item.input = true;
						item.iconclick = true;
						item.icon = 'clock-o';
						if (!item.format)
							item.format = 'HH:mm';
						item.maxlength = item.format.length;
						break;
				}
			}

			if (item.input) {
				value = '<input type="text" />';
				if (item.maxlength)
					value = value.replace('/>', 'maxlength="' + item.maxlength + '" />');
			}

			if (item.icon)
				value = '<div class="{0}-item-icon{3}">{1}</div><div class="{0}-item-input">{2}</div>'.format(cls, item.icon.charAt(0) === '!' ? item.icon.substring(1) : '<i class="fa fa-{0}"></i>'.format(item.icon), value, item.iconclick ? (' ' + cls + '-icon-click') : '');

			if (opt.value && !item.current)
				item.current = opt.value[item.name];

			builder.push('<div class="{0}-item" data-index="{3}"><div class="{0}-item-label">{1}</div><div class="{0}-item-value"><div class="{0}-placeholder">{4}</div>{2}</div></div>'.format(cls, item.label || item.name, value, i, item.placeholder || ''));
		}

		container.html(builder.join(''));

		self.opt = opt;
		self.target = el;

		self.find(cls2 + '-item').each(function() {
			var el = $(this);
			var index = +el.attrd('index');
			self.val(el, self.opt.items[index].current, true);
		});

		el = $(el);

		var css = {};
		var off = el.offset();

		css.width = opt.width || null;
		css.left = off.left + (opt.offsetX || 0);
		css.top = el.innerHeight() + off.top + (opt.offsetY || 10);

		self.element.css(css);
		self.rclass('hidden');
		self.aclass(cls + '-visible', 100);
		self.bindevents();
		is = true;
	};

	self.hide = function(sleep) {
		if (!is)
			return;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			self.unbindevents();
			self.rclass(cls + '-visible').aclass('hidden');
			if (self.opt)
				self.opt = null;
			is = false;
		}, sleep ? sleep : 100);
	};
});