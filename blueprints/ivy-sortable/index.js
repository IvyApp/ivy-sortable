/* jshint node:true */

module.exports = {
  afterInstall: function() {
    return this.addBowerPackageToProject('jquery-ui');
  },

  normalizeEntityName: function() {
  }
};
