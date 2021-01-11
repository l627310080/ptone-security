(function () {
  var vm = window.vm = new Vue({
    el: '.aui-wrapper',
    i18n: window.SITE_CONFIG.i18n,
    mixins: [window.SITE_CONFIG.mixinViewModule],
    data: function () {
      return {
        mixinViewModuleOptions: {
          activatedIsNeed: false,
          getDataListURL: '/sys/dict/data/page',
          getDataListIsPage: true,
          deleteURL: '/sys/dict/data',
          deleteIsBatch: true
        },
        dataForm: {
          dictTypeId: '0',
          dictLabel: '',
          dictValue: ''
        }
      }
    },
    components: {
      'add-or-update': fnAddOrUpdateComponent()
    },
    beforeCreate: function () {
      vm = this;
    },
    created: function () {
      // 通过路由参数pid, 控制列表请求操作
      var routeName = win.location.hash.substring(1).split('?')[0];
      var route = win.SITE_CONFIG['routeList'].filter(function (item) { return item.name === routeName; })[0];
      if (route && route.params) {
        vm.dataForm.dictTypeId = route.params.dictTypeId || '0'
      }
      vm.getDataList();
    },
    methods: {
      // 新增 / 修改
      addOrUpdateHandle: function (id) {
        vm.addOrUpdateVisible = true;
        vm.$nextTick(function () {
          vm.$refs.addOrUpdate.dataForm.id = id;
          vm.$refs.addOrUpdate.dataForm.dictTypeId = vm.dataForm.dictTypeId || '';
          vm.$refs.addOrUpdate.init();
        })
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
    template: '\
      <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t(\'add\') : $t(\'update\')" :close-on-click-modal="false" :close-on-press-escape="false" :fullscreen="true">\
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">\
          <el-form-item prop="dictValue" :label="$t(\'dict.dictValue\')">\
            <el-input v-model="dataForm.dictValue" :placeholder="$t(\'dict.dictValue\')"></el-input>\
          </el-form-item>\
          <el-form-item prop="dictLabel" :label="$t(\'dict.dictLabel\')">\
            <el-input v-model="dataForm.dictLabel" :placeholder="$t(\'dict.dictLabel\')"></el-input>\
          </el-form-item>\
          <el-form-item prop="sort" :label="$t(\'dict.sort\')">\
            <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" :label="$t(\'dict.sort\')"></el-input-number>\
          </el-form-item>\
          <el-form-item prop="remark" :label="$t(\'dict.remark\')">\
            <el-input v-model="dataForm.remark" :placeholder="$t(\'dict.remark\')"></el-input>\
          </el-form-item>\
        </el-form>\
        <template slot="footer">\
          <el-button @click="visible = false">{{ $t(\'cancel\') }}</el-button>\
          <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t(\'confirm\') }}</el-button>\
        </template>\
      </el-dialog>\
    ',
    data: function () {
      return {
        visible: false,
        dataForm: {
          id: '',
          dictTypeId: '',
          dictLabel: '',
          dictValue: '',
          sort: 0,
          remark: ''
        }
      }
    },
    computed: {
      dataRule: function () {
        return {
          dictLabel: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          dictValue: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          sort: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ]
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
          if (self.dataForm.id) {
            self.getInfo();
          }
        });
      },
      // 获取信息
      getInfo: function () {
        self.$http.get('/sys/dict/data/' + self.dataForm.id).then(function (res) {
          if (res.data.code !== 0) {
            return self.$message.error(res.data.msg);
          }
          self.dataForm = _.merge({}, self.dataForm, res.data.data);
        }).catch(function () {});
      },
      // 表单提交
      dataFormSubmitHandle: _.debounce(function () {
        self.$refs['dataForm'].validate(function (valid) {
          if (!valid) {
            return false;
          }
          self.$http[!self.dataForm.id ? 'post' : 'put']('/sys/dict/data', self.dataForm).then(function (res) {
            if (res.data.code !== 0) {
              return self.$message.error(res.data.msg);
            }
            self.$message({
              message: self.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: function () {
                self.visible = false;
                self.$emit('refresh-data-list');
              }
            });
          }).catch(function () {});
        });
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
};