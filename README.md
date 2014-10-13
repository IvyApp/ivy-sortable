# ivy-sortable

[![Build Status](https://travis-ci.org/IvyApp/ivy-sortable.svg?branch=master)](https://travis-ci.org/IvyApp/ivy-sortable)

An [Ember][1] component for [jQuery UI's Sortable Widget][2].

## Installation

First you'll need jQuery UI. You can install it via `bower` or `npm`, or
download a custom build yourself from [here][3]. At the very least you'll need
the following modules:

  * Core
  * Widget
  * Mouse
  * Sortable

Once you have jQuery UI installed, you can install `ivy-sortable` with:

```sh
$ npm install ivy-sortable
```

or...

```sh
$ bower install ivy-sortable
```

Then include the script(s) into your application.

### npm + browserify

```js
require('ivy-sortable');
```

### amd

Register `ivy-sortable` as a [package][4], then:

```js
define(['ivy-sortable'], ...)
```

### named-amd

You ought to know what you're doing if this is the case.

### globals

```html
<script src="bower_components/ivy-sortable/dist/globals/main.js"></script>
```

You'll also need to install the initializer to make the `ivy-sortable` helper
available in your templates:

```js
App = Ember.Application.create(/* ... */);
App.initializer(ivy.sortable.initializer);
```

## Usage

Use the `ivy-sortable` helper in much the same way you'd use Ember's built-in
`each` helper.

```handlebars
{{#ivy-sortable people}}
  Greetings, {{name}}!
{{/ivy-sortable}}
```

This will output a sortable list, and dragging and dropping items will reorder
them in the corresponding array (in this case, `people`). There is also
a `moved` action that will fire after an item has been moved, in case you want
to take further action:

```handlebars
{{#ivy-sortable people moved="movePerson"}}
  Greetings, {{name}}!
{{/ivy-sortable}}
```

In this case the `movePerson` handler will be called with the item that has
been moved, and its old and new index:

```js
App.ApplicationController = Ember.Controller.extend({
  actions: {
    movePerson: function(person, oldIndex, newIndex) {
      // ...
    }
  }
});
```

### Advanced Usage

In case you need more control, `ivy-sortable` is functionally equivalent to:

```handlebars
{{#collection "ivy-sortable" content=people}}
  Greetings, {{name}}!
{{/collection}}
```

Any options you can use with `Ember.CollectionView` can also be used with
`ivy-sortable`. In fact, under the hood `IvySortableView` is just an
`Ember.CollectionView` subclass.

## Contributing

```sh
$ git clone # <this repo>
$ npm install
$ npm test

# during dev
$ broccoli serve
# new tab
$ testem
```

Fork this repo, make a new branch, and send a pull request. Make sure your
change is tested or it won't be merged.

[1]: http://emberjs.com
[2]: http://jqueryui.com/sortable/
[3]: http://jqueryui.com/download/
[4]: http://requirejs.org/docs/api.html#packages
