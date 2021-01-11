Vue.component('renDeptTree', renDeptTree());

/**
 * renDeptTree组件
 */
function renDeptTree () {
  var self = null;
  return {
    template: '\
      <div>\
        <el-input v-model="showDeptName" :placeholder="placeholder">\
          <el-button slot="append" icon="el-icon-search" @click="deptDialog()"></el-button>\
        </el-input>\
        <el-input :value="value" style="display: none"></el-input>\
        <el-dialog :visible="visibleDept" width="30%" :modal="false" :show-close="false" :destroy-on-close="true" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">\
          <el-form size="mini" :inline="true">\
            <el-form-item :label="$t(\'keyword\')">\
              <el-input v-model="filterText"></el-input>\
            </el-form-item>\
            <el-form-item>\
              <el-button type="default">{{ $t(\'query\') }}</el-button>\
            </el-form-item>\
          </el-form>\
          <el-tree\
            class="filter-tree"\
            :data="deptList"\
            :default-expanded-keys="expandedKeys"\
            :props="{ label: \'name\', children: \'children\' }"\
            :expand-on-click-node="false"\
            :filter-node-method="filterNode"\
            :highlight-current="true"\
            node-key="id"\
            ref="tree">\
          </el-tree>\
          <template slot="footer">\
            <el-button type="default" @click="cancelHandle()" size="mini">{{ $t(\'cancel\') }}</el-button>\
            <el-button v-if="query" type="info" @click="clearHandle()" size="mini">{{ $t(\'clear\') }}</el-button>\
            <el-button type="primary" @click="commitHandle()" size="mini">{{ $t(\'confirm\') }}</el-button>\
          </template>\
        </el-dialog>\
      </div>\
    ',
    data: function () {
      return {
        filterText: '',
        visibleDept: false,
        deptList: [],
        showDeptName: '',
        expandedKeys: null,
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    props: {
      value: [Number, String],
      deptName: String,
      query: Boolean,
      placeholder: String
    },
    watch: {
      filterText: function (val) {
        self.$refs.tree.filter(val)
      },
      deptName: function (val) {
        self.showDeptName = val
      }
    },
    computed: {
      dataRule: function () {
        return {
          paramCode: [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          paramValue: [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ]
        }
      }
    },
    beforeCreate: function () {
      self = this;
    },
    methods: {
      deptDialog: function () {
        self.expandedKeys = null
        if (self.$refs.tree) {
          self.$refs.tree.setCurrentKey(null)
        }
        self.visibleDept = true
        self.getDeptList(self.value)
      },
      filterNode: function (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      getDeptList: function (id) {
        return self.$http.get('/sys/dept/list').then(function (res) {
          if (res.data.code !== 200) {
            return self.$message.error(res.data.msg)
          }
          self.deptList = res.data.data
          self.$nextTick(function () {
            self.$refs.tree.setCurrentKey(id)
            self.expandedKeys = [id]
          })
        }).catch(function () {})
      },
      cancelHandle: function () {
        self.visibleDept = false
        self.deptList = []
        self.filterText = ''
      },
      clearHandle: function () {
        self.$emit('input', '')
        self.$emit('update:deptName', '')
        self.showDeptName = ''
        self.cancelHandle()
      },
      commitHandle: function () {
        var node = self.$refs.tree.getCurrentNode()
        if (!node) {
          self.$message.error(self.$t('dept.chooseerror'))
          return
        }
        self.$emit('input', node.id)
        self.$emit('update:deptName', node.name)
        self.showDeptName = node.name
        self.cancelHandle()
      }
    }
  }
};