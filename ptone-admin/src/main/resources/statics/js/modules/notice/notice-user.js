(function () {
  var vm = window.vm = new Vue({
    el: '.aui-wrapper',
    i18n: window.SITE_CONFIG.i18n,
    mixins: [window.SITE_CONFIG.mixinViewModule],
    data: function () {
      return {
        mixinViewModuleOptions: {
          getDataListURL: '/sys/notice/mynotice/page',
          getDataListIsPage: true
        },
        dataForm: {
          type: ''
        }
      }
    },
    beforeCreate: function () {
      vm = this;
    },
    methods: {
      // 查看
      viewHandle: function (row) {
        // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
        var currentRouteName = win.location.hash.substring(1).split('?')[0];
        var routeName = currentRouteName + '__' + row.id;
        var route = win.SITE_CONFIG['routeList'].filter(function (item) { return item.name === routeName; })[0];
        if (route) {
          win.location.hash = routeName;
          return true;
        }
        // 否则: 添加并全局变量保存, 再跳转
        var currentRoute = win.SITE_CONFIG['routeList'].filter(function (item) { return item.name === currentRouteName; })[0];
        route = {
          'menuId': currentRoute.menuId,
          'name': routeName,
          'title': vm.$t('notice.view2'),
          'url': './modules/notice/notice-user-view.html',
          'params': {
            'id': row.id
          }
        };
        win.SITE_CONFIG['routeList'].push(route);
        win.location.hash = routeName;

        // 如果未读，则标记为已读
        if (row.readStatus === 0) {
          vm.updateReadStatus(row.id)
        }
      },
      updateReadStatus (noticeId) {
        vm.$http['put']('/sys/notice/mynotice/read/' + noticeId).then(function (res) {
          if (res.data.code !== 0) {
            return self.$message.error(res.data.msg);
          }
        }).catch(function () {});
      }
    }
  });
})();