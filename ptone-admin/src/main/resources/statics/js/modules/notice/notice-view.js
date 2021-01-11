(function () {
  var vm = window.vm = new Vue({
    el: '.aui-wrapper',
    i18n: window.SITE_CONFIG.i18n,
    mixins: [window.SITE_CONFIG.mixinViewModule],
    data: function () {
      return {
        mixinViewModuleOptions: {
          activatedIsNeed: false,
          getDataListURL: '/sys/notice/user/page',
          getDataListIsPage: true
        },
        dataForm: {
          id: ''
        }
      }
    },
    beforeCreate: function () {
      vm = this;
    },
    created: function () {
      // 通过路由参数, 控制列表请求操作
      var routeName = win.location.hash.substring(1).split('?')[0];
      var route = win.SITE_CONFIG['routeList'].filter(function (item) { return item.name === routeName; })[0];
      if (route && route.params) {
        vm.dataForm.id = route.params.id || 0;
      }
      vm.getInfo();
      vm.getDataList();
    },
    methods: {
      // 获取信息
      getInfo: function () {
        vm.$http.get('/sys/notice/' + vm.dataForm.id).then(function (res) {
          if (res.data.code !== 0) {
            return vm.$message.error(res.data.msg);
          }
          vm.dataForm = _.merge({}, vm.dataForm, res.data.data);
        }).catch(function () {});
      }
    }
  });
})();
