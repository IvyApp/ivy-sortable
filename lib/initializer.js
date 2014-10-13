import IvySortableView from './views/ivy-sortable';
import ivySortableHelper from './helpers/ivy-sortable';

export default {
  name: 'ivy-sortable',

  initialize: function(container) {
    container.register('helper:ivy-sortable', ivySortableHelper);
    container.register('view:ivy-sortable', IvySortableView);
  }
};
