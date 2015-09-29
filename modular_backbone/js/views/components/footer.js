/**
 * Created by Berlioz on 28/09/2015.
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/components/footer.html'
], function ($, _, Backbone, footerTemplate) {

  var FooterView = Backbone.View.extend({

    el: $('footer'),

    render: function () {
      var data = {};
      var compiledTemplate = _.template(footerTemplate, data);
      this.$el.html(compiledTemplate);
    }

  });

  return FooterView;
});
