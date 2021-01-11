(function () {
  // 在当前窗口作用域下，储存父窗口window对象
  window.win = self !== top ? window.parent : window;

  /**
   * HTTP 请求处理
   */
  var http = Vue.prototype.$http = axios.create({
    baseURL: window.SITE_CONFIG['apiURL'],
    timeout: 1000 * 180,
    withCredentials: true
  });
  // 请求拦截
  http.interceptors.request.use(function (config) {
    config.headers['Accept-Language'] = Cookies.get('language') || 'zh-CN';
    // 默认参数
    var defaults = {};
    // 防止缓存，GET请求默认带_t参数
    if (config.method === 'get') {
      config.params = _.merge({}, config.params, { '_t': new Date().getTime() });
    }
    if (_.isPlainObject(config.params)) {
      config.params = _.merge({}, defaults, config.params);
    }
    if (_.isPlainObject(config.data)) {
      config.data = _.merge({}, defaults, config.data);
      if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
        config.data = Qs.stringify(config.data);
      }
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
  // 响应拦截
  http.interceptors.response.use(function (response) {
    if (response.data.code === 401) {
      win.location.href = 'login.html';
      return Promise.reject(response.data.msg);
    }
    return response;
  }, function (error) {
    console.error(error);
    return Promise.reject(error);
  });

  /**
   * 权限
   */
  Vue.prototype.$hasPermission = function (key) {
    return win.SITE_CONFIG['permissions'].indexOf(key) !== -1 || false;
  };

  /**
   * 工具类
   */
  Vue.prototype.$utils = {
    // 获取svg图标(id)列表
    getIconList: function () {
      var res = [];
      var list = document.querySelectorAll('svg symbol')
      for(var i = 0; i < list.length; i++){
        res.push(list[i].id);
      }
      return res;
    },
    // 获取url地址栏参数
    getRequestParams: function () {
      var str  = win.location.search || win.location.hash.indexOf('?') >= 1 ? win.location.hash.replace(/.*(\?.*)/, '$1') : '';
      var args = {};
      if (!/\^?(=+)/.test(str)) {
        return args;
      }
      var pairs = str.substring(1).split('&');
      var pos   = null;
      for(var i = 0; i < pairs.length; i++) {
        pos = pairs[i].split('=');
        if(pos == -1) {
          continue;
        }
        args[pos[0]] = pos[1];
      }
      return args;
    },
    // 获取字典数据列表
    getDictDataList: function (dictType) {
      var type = window.parent.dictList.find(function (item) { return item.dictType === dictType })
      if (type) {
        return type.dataList
      } else {
        return []
      }
    },
    // 获取字典名称
    getDictLabel: function (dictType, dictValue) {
      var type = window.parent.dictList.find(function (item) { return item.dictType === dictType })
      if (type) {
        var val = type.dataList.find(function (item) { return item.dictValue === dictValue + '' })
        if (val) {
          return val.dictLabel
        } else {
          return dictValue
        }
      } else {
        return dictValue
      }
    },
    treeDataTranslate: function (data, id, pid) {
      if(!id){
        id = 'id'
      }
      if(!pid){
        pid = 'pid'
      }
      var res = []
      var temp = {}
      for (var i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i]
      }
      for (var k = 0; k < data.length; k++) {
        if (!temp[data[k][pid]] || data[k][id] === data[k][pid]) {
          res.push(data[k])
          continue
        }
        if (!temp[data[k][pid]]['children']) {
          temp[data[k][pid]]['children'] = []
        }
        temp[data[k][pid]]['children'].push(data[k])
        data[k]['_level'] = (temp[data[k][pid]]._level || 0) + 1
      }
      return res
    }
  };

  /**
   * 验证
   */
  Vue.prototype.$validate = {
    // 邮箱
    isEmail: function (s) {
      return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s);
    },
    // 手机号码
    isMobile: function (s) {
      return /^1[0-9]{10}$/.test(s);
    },
    // 电话号码
    isPhone: function (s) { 
      return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s);
    },
    // URL地址
    isURL: function (s) { 
      return /^http[s]?:\/\/.*/.test(s);
    }
  };

    /**
     * main-select-user组件
     */
    (function () {
        var self = null;

        Vue.component('main-select-user', {
            name: 'main-select-user',
            template: '<el-popover popper-class="popper-center" :width="pwidth" v-model="deptListVisible" ref="deptListPopover" placement="bottom-start" trigger="click">\n    \n    <div style="float: left; width: 25%;margin-top: 2%">\n        <el-tree\n                :data="deptList"\n                :props="{ label: \'name\', children: \'children\' }"\n                node-key="id"\n                ref="deptListTree"\n                :highlight-current="true"\n                default-expand-all\n                :expand-on-click-node="false"\n                @node-click="deptListTreeCurrentChangeHandle"\n        >\n        </el-tree>\n    </div>\n    <div style="float: left;width: 43%;">\n        <div class="margin-buttom10">\n         \n         <el-input   style="height: 35px; width: 82.5%;margin-buttom: 10px" v-model="searchUserName" clearable></el-input>   \n        <el-button @click="searchClick()" slot="append" icon="el-icon-search" style="width: 15%;"></el-button>\n        </div>\n        <div style="border:1px solid #EBEEF5">\n        <el-table stripe\n                :data="dataList"\n                ref="multipleTable"\n                  header-cell-style="height:10px;padding-top:5px;padding-bottom:5px;"\n                border\n                :height="pheight"\n                @select="dataListSelectionChangeHandle"\n                @select-all="dataListSelectionAllHandle"\n                tooltip-effect="dark" class="selectUser">\n            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>\n            <el-table-column prop="realName" :label="$t(\'user.realName\')" header-align="center" align="center"></el-table-column>\n            <el-table-column prop="deptName" :label="$t(\'user.deptName\')" header-align="center" align="center"></el-table-column>\n        </el-table>\n        </div>\n        <el-pagination\n                small\n                :current-page="page"\n                :page-sizes="[10, 20, 50, 100]"\n                :page-size="limit"\n                :total="total"\n                layout="total, sizes, prev, pager, next"\n                @size-change="pageSizeChangeHandle"\n                @current-change="pageCurrentChangeHandle" class="userSelectPage">\n        </el-pagination>\n      \n    </div>\n    <div style="width: 32%;float: left;height: 80%;">\n        <div style="100%; height: 340px;overflow-y:auto; overflow-x:auto;" class="userlist-tag">\n            <el-tag\n                    v-for="tag in selValue"\n                    :key="tag.value"\n                    closable\n                    @close="tagHandleClose(tag)">\n                {{tag.label}}\n            </el-tag>\n        </div>\n        \n    </div>\n    <div style="float:right;margin-top: 50px;" class="select-dialog-foot">\n        <el-button type="primary" size="small" @click="handleClick()">确定</el-button>\n        <el-button type="primary" size="small" @click="cancelClick()">取消</el-button>\n        \n    </div>\n        \n        <el-select slot="reference" size="1"\n                   @visible-change="showClick()"\n                   v-model="selValue"\n                   multiple\n                   popper-class="nonDropItem"\n                   allow-create\n                   :style="selectWidth"\n                   :collapse-tags="collapseTags"\n                   placeholder="请选择用户">\n            <el-option\n                    v-for="item in optionList"\n                    :key="item.value.value"\n                    :label="item.value.label"\n                    :value="item.value">\n            </el-option>\n        </el-select>\n        <!--<el-button slot="reference" @click="showClick()">选择123</el-button>-->\n        <div style="clear: both;"></div>\n\n</el-popover>  \n                     ',
            props: {
                value: {
                    type: Array
                },
                collapseTags: {
                    type: Boolean,
                    default: true
                },
                pwidth: {
                    type: Number,
                    default: 900
                },
                pheight: {
                    type: Number,
                    default: 390
                },
                afterSucessHandle: {
                    type: Function

                },
                selectWidth:{
                    type: String,
                    default:""
                }

            },
            data: function () {
                return {
                    vm: {},

                    visible: true,
                    deptList: [],
                    deptListVisible: false,
                    dataList: [],
                    roleList: [],
                    roleIdListDefault: [],
                    userDataList: [],
                    tags: [],
                    selValue: this.value,
                    optionList: [],
                    searchUserName: "",
                    deptId: '1198886056592388098',
                    total: 0,                   // 总条数
                    page: 1,                    // 当前页码
                    limit: 10                  // 每页数

                }
            },

            watch: {
                value: function (val) {
                    this.selValue = val;//②监听外部对props属性value的变更，并同步到组件内的data属性
                },
                selValue: function (val) {
                    if (self.type) {
                        if (val.length === 1) {
                            self.deptListVisible = false;
                        }
                        if (val.length > 1) {
                            val.splice(1, 1);
                        }
                    }

                    this.$emit('input', val);
                    // self.optionList = [];
                    // if(!!self.selValue && self.selValue.length >0){
                    //     self.selValue.forEach(function (e,i) {
                    //         self.optionList.push(e);
                    //     });
                    // }

                }
            },
            beforeCreate: function () {


            },
            created: function () {

                self = this;
                // self.getDeptList();
                self.getUserDataList();
                // self.getDataList();

                //console.log("val:",self.selectedUserList);
                // if(!!self.selValue && self.selValue.length >0){
                // self.optionList = [];
                //    self.selValue.forEach(function(e,i) {
                //      //self.tags.push({name:e.label,account:e.value});
                //      self.optionList.push({label:e.label,value:e});
                //    });

                // self.tags = self.selectedUserList;
                //  if(!self.tags || self.tags.length == 0){
                //    self.selValue.forEach(function(e,i) {
                //      //self.tags.push({name:e.label,account:e.value});
                //      self.optionList.push({label:e.label,value:e});
                //    });
                //  }

                // }
                //self.selectedUserList= [{name:"aaa"},{name:"aaa"},{name:"aaa"}];
                if (!!self.afterSucessHandle) {
                    self.afterSucess = this.afterSucessHandle;
                }
            },
            methods: {


                showClick: function () {
                    self = this;
                    self.deptListVisible = true;
                    self.getDeptList();
                    self.getDataList();
                    self.getUserDataList();
                },
                handleClick: function () {
                    //self.$emit('user-list',self.tags);
                    //   var tempArray = [];
                    //   self.optionList = [];
                    //   self.tags.forEach(function (e, i) {
                    //       self.optionList.push({label:e.name,value:{value:e.account,label:e.name}});
                    //       tempArray.push({label:e.name,value:e.account})
                    //   });
                    //   self.selValue = tempArray;
                    if (!!self.afterSucess) {
                        self.afterSucess();
                    }
                    self.deptListVisible = false;
                },
                searchClick: function () {

                    self.getDataList(self.deptId, self.searchUserName);
                },
                tagHandleClose: function (tag) {
                    for (var i = 0; i < self.dataList.length; i++) {
                        if (tag.value == self.dataList[i].id) {
                            self.$refs.multipleTable.toggleRowSelection(self.dataList[i], false);
                        }
                    }
                    // self.optionList.splice(self.getOptionListIndex(tag.value), 1);
                    self.selValue.splice(self.selValue.indexOf(tag), 1);
                }, getOptionListIndex: function (id) {

                    self.optionList.forEach(function (e, i) {
                        if (id == e.value) {
                            return i;
                        }
                    });
                },
                cancelClick: function () {
                    self.deptListVisible = false;
                },
                // 通过menuId与路由列表进行匹配跳转至指定路由
                gotoRouteHandle: function (menuId) {
                    var route = win.SITE_CONFIG.routeList.filter(function (item) {
                        return item.menuId === menuId
                    })[0];
                    if (route) {
                        win.location.hash = route.name;
                    }
                },
                getDeptList: function () {
                    return self.$http.get('/sys/dept/list').then(function (res) {
                        if (res.data.code !== 0) {
                            return self.$message.error(res.data.msg);
                        }

                        self.deptList = res.data.data;
                    }).catch(function () {
                    });
                },
                dataListSelectionAllHandle: function (val) {
                    if (!!val && val.length > 0) {
                        for (var r = 0; r < val.length; r++) {
                            var isHas = false;
                            for (var i = 0; i < self.selValue.length; i++) {
                                if (self.selValue[i].value == val[r].id) {
                                    isHas = true;
                                }
                            }
                            if (!isHas) {
                                //self.optionList.push({label:val[r].realName,value:val[r].id});
                                self.selValue.push({label: val[r].realName, value: val[r].id});
                            }
                        }
                    } else {

                        for (var i = 0; i < self.dataList.length; i++) {
                            for (var r = 0; r < self.selValue.length; r++) {

                                if (self.selValue[r].value == self.dataList[i].id) {
                                    // self.selValue.splice(self.getSelValueIndex(self.tags[r].account), 1);
                                    //    self.optionList.splice(r, 1);
                                    self.selValue.splice(r, 1);
                                }
                            }
                        }
                    }
                },
                dataListSelectionChangeHandle: function (val, row) {
                    var temp = [];
                    //判断是否是删除操作
                    var isDel = true;
                    for (var i = 0; i < val.length; i++) {
                        if (val[i].id == row.id) {
                            isDel = false;
                        }
                    }
                    if (isDel) {
                        for (var i = 0; i < self.selValue.length; i++) {
                            if (self.selValue[i].value == row.id) {
                                //self.selValue.splice(self.getSelValueIndex(self.tags[i].account), 1);
                                self.selValue.splice(i, 1);
                                break;
                            }
                        }
                    } else {

                        self.selValue.push({label: row.realName, value: row.id});
                        //
                        //  self.selValue.push({label:e.realName,value:{name:e.realName,account:e.username}});
                    }
                },
                toggleSelection: function () {
                    this.$nextTick(function () {
                        self.selValue.forEach(function (v) {
                            self.dataList.forEach(function (d) {
                                if (d.id == v.value) {
                                    self.$refs.multipleTable.toggleRowSelection(d, true);
                                }
                            });
                        });
                    })
                },
                getDataList: function (deptId, realName) {
                    self.$http.get(
                        '/sys/user/recursiveSearchList', {
                            params: {
                                order: '',
                                orderField: '',
                                deptId: self.deptId,
                                realname: realName,
                                page: self.page,
                                limit: self.limit
                            }
                        }
                    ).then(function (res) {

                        if (res.data.code !== 0) {
                            self.dataList = [];
                            self.total = 0;

                            return self.$message.error(res.data.msg);
                        }
                        self.total = res.data.data.total;
                        self.dataList = res.data.data.list;
                        //self.total =  res.data.data.total;
                        self.toggleSelection();
                    }).catch(function () {
                        self.dataListLoading = false;
                    })
                },
                getUserDataList: function () {
                    if (self.optionList.length == 0) {
                        var self2 = this;
                        self.$http.get(
                            '/sys/user/getList', {
                                params: {}
                            }
                        ).then(function (res) {
                            if (res.data.code !== 0) {
                                return self2.$message.error(res.data.msg);
                            }

                            if (!!res.data.data && res.data.data.length > 0) {
                                self2.optionList = [];
                                res.data.data.forEach(function (r, i) {
                                    self2.optionList.push({label: r.realName, value: {label: r.realName, value: r.id}});
                                })

                            }
                            //self.total =  res.data.data.total;

                        }).catch(function () {
                            self.dataListLoading = false;
                        })
                    }
                }
                ,
                // 所属部门树, 选中
                deptListTreeCurrentChangeHandle: function (data, node) {
                    self.deptId = data.id;
                    self.page = 1;
                    self.getDataList(data.id);
                },
                getUserList: function (deptId) {
                    return self.$http.get('/sys/dept/list').then(function (res) {
                        if (res.data.code !== 0) {
                            return self.$message.error(res.data.msg);
                        }
                        self.deptList = res.data.data;
                    }).catch(function () {
                    });
                },
                // 排序
                dataListSortChangeHandle: function (data) {
                    if (!data.order || !data.prop) {
                        self.order = '';
                        self.orderField = '';
                        return false;
                    }
                    self.order = data.order.replace(/ending$/, '');
                    self.orderField = data.prop.replace(/([A-Z])/g, '_$1').toLowerCase();
                    self.getDataList();
                },
                // 分页, 每页条数
                pageSizeChangeHandle: function (val) {
                    self.page = 1;
                    self.limit = val;
                    self.getDataList();
                },
                // 分页, 当前页
                pageCurrentChangeHandle: function (val) {
                    self.page = val;
                    self.getDataList();
                },
                afterSucess: function () {
                    this.$emit("afterSucessHandle");
                }
            }

        });
    })();

  /**
   * main-sidebar-submenu组件
   */
  (function () {
    var self = null;
    Vue.component('main-sidebar-submenu', {
      name: 'main-sidebar-submenu',
      template: '\
        <el-submenu v-if="menu.children && menu.children.length >= 1" :index="menu.id" :popper-append-to-body="false">\
          <template slot="title">\
            <svg class="icon-svg aui-sidebar__menu-icon" aria-hidden="true"><use :xlink:href="\'#\' + menu.icon"></use></svg>\
            <span>{{ menu.name }}</span>\
          </template>\
          <main-sidebar-submenu v-for="item in menu.children" :key="item.id" :menu="item"></main-sidebar-submenu>\
        </el-submenu>\
        <el-menu-item v-else :index="menu.id" @click="gotoRouteHandle(menu.id)">\
          <svg class="icon-svg aui-sidebar__menu-icon" aria-hidden="true"><use :xlink:href="\'#\' + menu.icon"></use></svg>\
          <span>{{ menu.name }}</span>\
        </el-menu-item>\
      ',
      props: {
        menu: {
          type: Object,
          required: true
        }
      },
      beforeCreate: function () {
        self = this;
      },
      methods: {
        // 通过menuId与路由列表进行匹配跳转至指定路由
        gotoRouteHandle: function (menuId) {
          var route = win.SITE_CONFIG.routeList.filter(function (item) { return item.menuId === menuId })[0];
          if (route) {
            win.location.hash = route.name;
          }
        }
      }
    });
  })();
})();