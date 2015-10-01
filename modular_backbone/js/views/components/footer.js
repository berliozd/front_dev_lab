/**
 * Created by Berlioz on 28/09/2015.
 */
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var footerTemplate = require('../../../templates/components/footer.html');

module.exports = function ($, _, Backbone, footerTemplate) {

  var FooterView = Backbone.View.extend({

    el: $('footer'),

    render: function () {
      var data = {};
      var compiledTemplate = _.template(footerTemplate, data);
      this.$el.html(compiledTemplate);
    }

  });

  return FooterView;
}($, _, Backbone, footerTemplate);
