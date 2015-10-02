/**
 * Created by Berlioz on 28/09/2015.
 */
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var footerTemplate = require('../../../templates/components/footer.html');

module.exports = function ($, _, Backbone, footerTemplate) {

  var FooterView = Backbone.View.extend({

    el: 'footer',

    render: function () {
      this.$el.html(footerTemplate);
      return this;
    }

  });

  return FooterView;

}($, _, Backbone, footerTemplate);
