Vue.component('renRegionTree', renRegionTree());

/**
 * renRegionTree组件
 */
function renRegionTree () {
  var self = null;
  return {
    template: '\
      <div class="ren-region">\
        <el-input v-model="showName" :placeholder="placeholder" @focus="treeDialog">\
          <el-button slot="append" icon="el-icon-search" @click="treeDialog"></el-button>\
        </el-input>\
        <el-input :value="value" style="display: none"></el-input>\
        <el-dialog :visible.sync="visibleTree" width="360px" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">\
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
            :data="dataList"\
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
            <el-button type="info" @click="clearHandle()" size="mini">{{ $t(\'clear\') }}</el-button>\
            <el-button type="primary" @click="commitHandle()" size="mini">{{ $t(\'confirm\') }}</el-button>\
          </template>\
        </el-dialog>\
        </div>\
    ',
    data: function () {
      return {
        filterText: '',
        visibleTree: false,
        dataList: [],
        showName: '',
        expandedKeys: null,
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    props: {
      value: [Number, String],
      parentName: String,
      placeholder: String
    },
    watch: {
      filterText: function (val) {
        self.$refs.tree.filter(val)
      },
      parentName: function (val) {
        self.showName = val
      }
    },
    beforeCreate: function () {
      self = this;
    },
    methods: {
      treeDialog: function () {
        self.expandedKeys = null
        if (self.$refs.tree) {
          self.$refs.tree.setCurrentKey(null)
        }
        self.visibleTree = true
        self.getDataList(self.value)
      },
      filterNode: function (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      getDataList: function (id) {
        return self.$http.get('/sys/region/tree').then(function (res) {
          if (res.data.code !== 200) {
            return self.$message.error(res.data.msg)
          }
          self.dataList = self.$utils.treeDataTranslate(res.data.data)
          self.$nextTick(function () {
            self.$refs.tree.setCurrentKey(id)
            self.expandedKeys = [id]
          })
        }).catch(function () {})
      },
      cancelHandle: function () {
        self.visibleTree = false
        self.dataList = []
        self.filterText = ''
      },
      clearHandle: function () {
        self.$emit('input', '0')
        self.$emit('update:parentName', '')
        self.showName = ''
        self.visibleTree = false
        self.dataList = []
        self.filterText = ''
      },
      commitHandle: function () {
        var node = self.$refs.tree.getCurrentNode()
        if (!node) {
          self.$message.error(self.$t('choose'))
          return
        }
        self.$emit('input', node.id)
        self.$emit('update:parentName', node.name)
        self.showName = node.name
        self.visibleTree = false
        self.dataList = []
        self.filterText = ''
      }
    }
  }
};