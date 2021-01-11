(function () {
  window.SITE_CONFIG = {};
  window.SITE_CONFIG['version'] = 'v2.5.0';

  window.SITE_CONFIG['wsURL'] = 'ws://localhost:8080/';
  window.SITE_CONFIG['webURL'] = 'http://localhost:8080/';
  window.SITE_CONFIG['apiURL'] = '/ptone-admin/';
  window.SITE_CONFIG['activitiURL'] = '/activiti-app/';
  window.SITE_CONFIG['permissions'] = []; // 页面按钮操作权限（后台返回，未做处理）
  window.SITE_CONFIG['routeList'] = [     // 路由列表（默认添加首页）
    {
      'menuId': 'home',
      'name': 'home',
      'title': 'home',
      'url': './home.html',
      'params': {}
    }
  ];
  window.SITE_CONFIG['previewUrl'] = "http://localhost:8080/onlinePreview?url=";
  window.SITE_CONFIG['uploadUrl'] = window.SITE_CONFIG['webURL'] + "upload/file";// 文件上传后端url
  window.SITE_CONFIG['uploadUrl2']=window.SITE_CONFIG['webURL'] + "upload2/file";//版本2 文件上传后端url
})();