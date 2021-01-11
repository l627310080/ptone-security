(function () {
  var vm = window.vm = new Vue({
    el: '.aui-wrapper',
    i18n: window.SITE_CONFIG.i18n,
    mixins: [window.SITE_CONFIG.mixinViewModule],
    data: function () {
      return {
        mixinViewModuleOptions: {
          getDataListURL: '/sys/region/list',
          deleteURL: '/sys/region'
        }
      }
    },
    components: {
      'add-or-update': fnAddOrUpdateComponent()
    },
    beforeCreate: function () {
      vm = this;
    },
    methods: {
      load: function (tree, treeNode, resolve) {
        vm.$http.get('/sys/region/list?pid=' + tree.id).then(function (res) {
          if (res.data.code !== 0) {
            return vm.$message.error(res.data.msg)
          }
          resolve(res.data.data)
        }).catch(function () {});
      },
      // 新增 / 修改
      addOrUpdateHandle: function (id) {
        vm.addOrUpdateVisible = true
        vm.$nextTick(function () {
          vm.$refs.addOrUpdate.init(id)
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
      <el-dialog :visible.sync="visible" :title="insert ? $t(\'add\') : $t(\'update\')" :close-on-click-modal="false" :close-on-press-escape="false" :fullscreen="true">\
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">\
          <el-form-item prop="parentName" label="上级区域">\
            <ren-region-tree v-model="dataForm.pid" placeholder="选择区域" :parent-name.sync="dataForm.parentName"></ren-region-tree>\
          </el-form-item>\
          <el-form-item prop="name" :label="$t(\'region.name\')">\
            <el-input v-model="dataForm.name" :placeholder="$t(\'region.name\')"></el-input>\
          </el-form-item>\
          <el-form-item prop="id" :label="$t(\'region.id\')">\
            <el-input v-model="dataForm.id" :disabled="!insert" :placeholder="$t(\'region.id\')"></el-input>\
          </el-form-item>\
          <el-form-item prop="sort" :label="$t(\'region.sort\')">\
            <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" :label="$t(\'region.sort\')"></el-input-number>\
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
        insert: true,
        regionList: [],
        regionListVisible: false,
        dataForm: {
          id: '',
          name: '',
          pid: '0',
          parentName: '',
          sort: 0
        }
      }
    },
    computed: {
      dataRule: function () {
        return {
          id: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          name: [
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
      init: function (id) {
        self.insert = true
        self.visible = true
        self.dataForm.pid = '0'
        self.$nextTick(function () {
          self.$refs['dataForm'].resetFields()
          self.dataForm.id = id
          if (self.dataForm.id) {
            self.insert = false
            self.getInfo()
          }
        })
      },
      // 获取信息
      getInfo: function () {
        self.$http.get('/sys/region/' + self.dataForm.id).then(function (res) {
          if (res.data.code !== 0) {
            return self.$message.error(res.msg)
          }
          self.dataForm = _.merge({}, self.dataForm, res.data.data);
          self.$refs.regionListTree.setCurrentKey(self.dataForm.pid)
        }).catch(function () {});
      },
      // 表单提交
      dataFormSubmitHandle: _.debounce(function () {
        self.$refs['dataForm'].validate(function (valid) {
          if (!valid) {
            return false
          }
          self.$http[self.insert ? 'post' : 'put']('/sys/region', self.dataForm).then(function (res) {
          if (res.data.code !== 0) {
            return self.$message.error(res.data.msg)
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
      })
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
};