(function () {
  var vm = window.vm = new Vue({
    el: '.aui-wrapper',
    i18n: window.SITE_CONFIG.i18n,
    mixins: [window.SITE_CONFIG.mixinViewModule],
    data: function () {
      return {
        mixinViewModuleOptions: {
          getDataListURL: '/cms/bizcolumn/page',
          getDataListIsPage: true,
          deleteURL: '/cms/bizcolumn',
          deleteIsBatch: true
        },
        dataForm: {
          id: '',
          pcode:'',
          label:'',
        },
        columnList:[],
        sortArr:[]
      }
    },
    components: {
      'add-or-update': fnAddOrUpdateComponent()
    },
    beforeCreate: function () {
      vm = this;
    },
    created:function(){
      vm.getColumnList()

    },

    methods:{

      deleteHandle: function (id) {
        if (vm.mixinViewModuleOptions.deleteIsBatch && !id && vm.dataListSelections.length <= 0) {
          return vm.$message({
            message: vm.$t('prompt.deleteBatch'),
            type: 'warning',
            duration: 500
          });
        }
        vm.$confirm(vm.$t('prompt.info', { 'handle': vm.$t('delete') }), vm.$t('prompt.title'), {
          confirmButtonText: vm.$t('confirm'),
          cancelButtonText: vm.$t('cancel'),
          type: 'warning'
        }).then(function () {
          vm.$http.delete(
              vm.mixinViewModuleOptions.deleteURL + (vm.mixinViewModuleOptions.deleteIsBatch ? '' : '/' + id),
              vm.mixinViewModuleOptions.deleteIsBatch ? {
                'data': id ? [id] : vm.dataListSelections.map(function (item) { return item[vm.mixinViewModuleOptions.deleteIsBatchKey]; })
              } : {}
          ).then(function (res) {
            if (res.data.code !== 0) {
              return vm.$message.error(res.data.msg);
            }
            vm.$message({
              message: vm.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: function () {
                vm.getColumnList();
                vm.getDataList();
              }
            });
          }).catch(function () {});
        }).catch(function () {});
      },
      sort:function(id,sort){
        alert('aaa');
        var flag = false;
        if (vm.sortArr.length > 0) {
          for (var i = 0; i < vm.sortArr.length; i++) {
            if (vm.sortArr[i].id == id) {
              flag = true;
              vm.sortArr.splice(i, 1, {"id": id, "sort": sort}); //替换
              break;
            }
          }
          if (!flag) {
            vm.sortArr.push({"id": id, "sort": sort});
          }
        } else {
          vm.sortArr.push({"id": id, "sort": sort});
        }
      },
      updateSort:function(){
        alert('sss');
        this.$http.post('/cms/bizcolumn/updateSort', {"sort": vm.sortArr}).then(function (res) {
          window.SITE_CONFIG.mixinViewModule.methods.getDataList();
        });
      },
      columnChange:function(a){
        vm.dataForm.pcode=a.code
        vm.dataForm.label=a.label
        vm.getDataList()
      },
      getColumnList: function () {
        return vm.$http.get('/cms/bizcolumn/list').then(function (res) {
          if (res.data.code !== 0) {
            return self.$message.error(res.data.msg);
          }
          var data=res.data.data
          vm.columnList=JSON.parse(JSON.stringify(data).replace(/name/g, 'label'))
        }).catch(function (e) {
          alert(e)
        });
      }
    }

  });
})();

/**
 * add-or-update组件
 */
function fnAddOrUpdateComponent () {
  var self = null;
  return {
    template: '<el-dialog :visible.sync="visible" :title="!dataForm.id ? $t(\'add\') : $t(\'update\')" :close-on-click-modal="false"\n           :close-on-press-escape="false" :fullscreen="true">\n    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"\n             label-width="120px">\n\n        <el-form-item label="栏目名称" prop="name">\n            <el-input v-model="dataForm.name" placeholder="栏目名称"></el-input>\n        </el-form-item>\n\n        <el-form-item label="上级栏目" prop="pcode">\n            <el-popover v-model="columnListVisible" ref="columnListPopover" placement="bottom-start" trigger="click">\n                <el-tree\n                        @current-change="columnListTreeCurrentChangeHandle"\n                        :data="columnList"\n                        :props="{ label: \'name\', children: \'children\' }"\n                        node-key="id"\n                        ref="columnListTree"\n                        v-model="columnIds"\n                        :highlight-current="true"\n                        :expand-on-click-node="false"\n                        accordion\n                        :default-expanded-keys="expandedKeys" >\n                </el-tree>\n            </el-popover>\n            <el-input v-model="dataForm.pcode" v-show="false" width="500" v-popover:columnListPopover :readonly="true"\n                      :placeholder="$t(\'menu.parentName\')">\n            </el-input>\n            <el-input v-model="pcodeName" width="500" v-popover:columnListPopover :readonly="true">\n            </el-input>\n        </el-form-item>\n        <el-row>\n            <el-col :span="12">\n                <el-form-item label="权限代码" prop="code">\n                    <el-input v-model="dataForm.code"></el-input>\n                </el-form-item>\n            </el-col>\n            <el-col :span="12">\n                <el-form-item prop="sort" :label="$t(\'menu.sort\')">\n                    <el-input-number v-model="dataForm.sort" :step="10" controls-position="right" :min="0"\n                                     :label="$t(\'menu.sort\')"></el-input-number>\n                </el-form-item>\n            </el-col>\n        </el-row>\n\n        <el-form-item label="前台显示" prop="showStatus">\n            <el-radio v-model="dataForm.showStatus" :label="1">是</el-radio>\n            <el-radio v-model="dataForm.showStatus" :label="2">否</el-radio>\n        </el-form-item>\n\n        <el-form-item label="栏目介绍" prop="introduction">\n            <el-input type="textarea" v-model="dataForm.introduction" placeholder="栏目介绍"></el-input>\n        </el-form-item>\n    </el-form>\n\n    <template slot="footer">\n        <el-button @click="cancel()">{{ $t(\'cancel\') }}</el-button>\n        <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t(\'confirm\') }}</el-button>\n    </template>\n</el-dialog>\n    ',
    data: function () {
      return {
        parentColumnList:'',
        columnList: [],
        columnListVisible: false,
        visible: false,
        dataForm: {
          parentName:'',
          id: '',
          name: '',
          pcode: '',
          code: '',
          sort:10,
          siteStatus: '',
          showStatus: 1,
          introduction: '',
          createDate: '',
          creator: '',
          updateDate: '',
          updator: ''
        },
        columnIds:[],
          pcodeName: vm.dataForm.label,
          expandedKeys:[]
      }
    },

    computed: {
      dataRule: function () {
        return {
          name: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          parentColumn: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          code: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          pcode: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          siteStatus: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          showStatus: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
        }
      }
    },
    beforeCreate: function () {
      self = this;
    },
    methods: {

      init: function () {
        self.visible = true;
        self.$nextTick(function () {
          self.$refs['dataForm'].resetFields();

          self.getColumnList().then(function () {


            if (self.dataForm.id) {
              self.getInfo();

            }else {

              self.dataForm.pcode=vm.dataForm.pcode
              self.dataForm.code=vm.dataForm.pcode+"_"
                self.pcodeName=vm.dataForm.label
              self.getColumnParents()
            }
          });
        });
      },
      getColumnNames: function () {
        var columnIds=[];
        columnIds.push(self.dataForm.id);
        self.$http.post('/cms/bizcolumn/getColumnNames', {"columnIds": columnIds}).then(function (res) {
          if (!res.data.data) {
            self.columnNames = ''
          }
          self.pcodeName = res.data.data.join(',')
        }).catch(function () {
        });
      },
      /*取消事件*/
      cancel:function(){
        self.visible = false
        self.pcodeName=''
      },
        getColumnParents:function(){
            self.$http.post('/cms/bizcolumn/getColumnParents', {"code": self.dataForm.pcode}).then(function (res) {
                self.expandedKeys=[]
                var data=res.data.data;
                for (var i = 0; i <data.length ; i++) {
                    self.expandedKeys.push(data[i].columnId)
                  self.columnIds.push(data[i].columnId)
                }
                self.columnIds.forEach(function (item) {
                self.$refs.columnListTree.setChecked(item, true);
              });
            }).catch(function () {
            });
        }
      ,
      // 上级菜单树, 设置默认值
      deptListTreeSetDefaultHandle: function () {
        self.dataForm.pid = '0';
        self.dataForm.parentColumn = 'cnkjg';
      },
      // 上级菜单树, 选中
      columnListTreeCurrentChangeHandle: function (data) {
        self.dataForm.pcode = data.code;
        self.dataForm.code=self.dataForm.pcode+"_"
        self.pcodeName = data.name;
        // self.dataForm.name = data.name;
        self.menuListVisible = false;
      },
      getColumnList: function () {
        return self.$http.get('/cms/bizcolumn/list').then(function (res) {
          if (res.data.code !== 0) {
            return self.$message.error(res.data.msg);
          }
          self.columnList = res.data.data;
        }).catch(function () {});
      },
      // 获取信息
      getInfo: function () {
        self.$http.get('/cms/bizcolumn/' + self.dataForm.id).then(function (res) {
          if (res.data.code !== 0) {
            return self.$message.error(res.data.msg);
          }
          self.dataForm = _.merge({}, self.dataForm, res.data.data);
          console.log("pcode:",self.dataForm.pcode)
          self.getColumnParents()
          // self.getColumnNames()
          self.pcodeName=self.dataForm.parentName;
          if (self.dataForm.pid === '0') {
            return self.deptListTreeSetDefaultHandle();
          }
        }).catch(function () {});
      },
      // 表单提交
      dataFormSubmitHandle: _.debounce(function () {
        self.$refs['dataForm'].validate(function (valid) {
          if (!valid) {
            return false;
          }
          self.$http[!self.dataForm.id ? 'post' : 'put']('/cms/bizcolumn', self.dataForm).then(function (res) {
            if (res.data.code !== 0) {
              return self.$message.error(res.data.msg);
            }
            self.$message({
              message: self.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: function () {
                self.dataForm.pcode=''
                  self.dataForm.label=''
                self.visible = false;
                self.$emit('refresh-data-list');
                self.$emit('refresh-column-list');
              }
            });
          }).catch(function () {});
        });
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
};