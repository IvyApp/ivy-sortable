# ivy-sortable

## master

* Check `isDestroying` before refreshing the sortable.

## 1.0.0-beta.1

* Call sortable's `refresh` method after content changes. This fixes an issue
  where the "ui-sortable-handle" class would not be added to newly-inserted
  list items. See [#2](https://github.com/IvyApp/ivy-sortable/issues/2) for
  further details.

## 0.3.0

* Remove version suffix from ivy-sortable.js.

## 0.2.1

* Add jQuery UI Sortable option bindings.
* Upgrade to ember-cli 0.1.5.
* Remove unnecessary ember-data dependency in dummy app.
* Upgrade to ember 1.9.1 in dummy app.

## 0.2.0

* Convert to an ember-cli addon.

## 0.1.0

* Initial release.
