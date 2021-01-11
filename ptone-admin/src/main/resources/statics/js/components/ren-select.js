Vue.component('renSelect', renSelect());

/**
 * renSelect组件
 */
function renSelect () {
  var self = null;
  return {
    template: '\
      <el-select :value="value+\'\'" @input="$emit(\'input\', $event)" :placeholder="placeholder" clearable>\
        <el-option :label="data.dictLabel" v-for="data in dataList" :key="data.dictValue" :value ="data.dictValue">{{data.dictLabel}}</el-option>\
      </el-select>\
    ',
    data: function () {
      return {
        dataList: self.$utils.getDictDataList(self.dictType)
      }
    },
    props: {
      value: [Number, String],
      dictType: String,
      placeholder: String
    },
    beforeCreate: function () {
      self = this;
    }
  }
};