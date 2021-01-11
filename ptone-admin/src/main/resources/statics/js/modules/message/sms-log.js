(function () {
  var vm = window.vm = new Vue({
    el: '.aui-wrapper',
    i18n: window.SITE_CONFIG.i18n,
    mixins: [window.SITE_CONFIG.mixinViewModule],
    data: function () {
      return {
        mixinViewModuleOptions: {
          getDataListURL: '/sys/smslog/page',
          getDataListIsPage: true,
          deleteURL: '/sys/smslog',
          deleteIsBatch: true
        },
        dataForm: {
          mobile: '',
          status: '',
          smsCode: ''
        }
      }
    },
    beforeCreate: function () {
      vm = this;
    }
  });
})();