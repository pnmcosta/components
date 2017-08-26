## j-Grid

- please try to understand the functionality
- needed `bootstrap` grid system

__Data-source__ needs to contain:

```javascript
{
    items: [{ name: 'Row 1' }, { name: 'Row 2' }, ...] // items
    page: 1,    // current pages
    pages: 30,  // count of pages
    limit: 5,   // items limit per page
    count: 150  // count of items in DB
}
```

__Configuration__:

- `filter` {Boolean} shows a filter (optional, default: `true`)
- `filterlabel` {String} a default placeholder for all filters (optional)
- `external` {Boolean} is an external data-source (dynamic data loading) (optinal, default: `false`)
- `pluralizepages` {String} pluralization for pages (optional, default: `# pages,# page,# pages,# pages`)
- `pluralizeitems` {String} pluralization for items (optional, default: `# items,# item,# items,# items`)
- `exec` {String} a link to `function(type, filter, sort, page)`, it's evaluated if the grid performs some operations
- `padding` {Number} height padding (optional, default: `0`)
- `autosize` {Boolean} enables full-height auto-size (optional, default `true`)
- `boolean` {String} a values for filtering of boolean values (optional, default: `true|on|yes`)
- `pagination` {Boolean} shows pagination panel (optional, default: `false`)

__Column properties__:
{ name: 'name', text: 'Name', size: 2, render: 'n => n.toUpperCase()', filter: 'Search in name' },

- `name` {String} a name of field in the object
- `text` {String} a column label
- `size` {Number} a column width: `1` small, `2` medium, `3` large, `4` very large (optional, default `1`)
- `filter` {String} a placeholder for the filter (optional)
- `format` {String/Number} for formatting values (`string` for date, `number` for numbers)
- `background` {String} a background color (optional)
- `align` {String} can be `center` or `right` (optional, default: `left`)
- `render` {String/Function} a custom rendering, `string` is evaluated as an arrow function
- `sort` {Boolean} enables sorting (optional, default: `true`)
- `class` {String} additional classes for the column, e.g. `hidden-xs`

### Author

- Peter Širka <petersirka@gmail.com>
- License: MIT