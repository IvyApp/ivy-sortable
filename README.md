# ivy-sortable

[![Build Status](https://travis-ci.org/IvyApp/ivy-sortable.svg?branch=master)](https://travis-ci.org/IvyApp/ivy-sortable)

An [Ember](http://emberjs.com) component for
[jQuery UI's Sortable Widget](http://jqueryui.com/sortable/).

## Installation

As an [ember-cli](http://www.ember-cli.com/) addon:

```sh
npm install --save-dev ivy-sortable
ember generate ivy-sortable
```

Or if you aren't using ember-cli, you can use this library as a standalone
[Bower](http://bower.io/) package:

```sh
bower install --save ivy-sortable
```

...and then add the `ivy-sortable.js` script to your page.

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

Fork this repo, make a new branch, and send a pull request. Make sure your
change is tested or it won't be merged.

To run tests:

```sh
git clone # <this repo>
npm install
npm test
```

Or, to start a test server that continually runs (for development):

```sh
ember test --server
```
