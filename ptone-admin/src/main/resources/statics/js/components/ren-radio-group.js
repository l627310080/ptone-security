Vue.component('renRadioGroup', renRadioGroup());

/**
 * renRadioGroup组件
 */
function renRadioGroup () {
  var self = null;
  return {
    template: '\
      <el-radio-group :value="value+\'\'" @input="$emit(\'input\', $event)">\
        <el-radio :label="data.dictValue" v-for="data in dataList" :key="data.dictValue">{{data.dictLabel}}</el-radio>\
      </el-radio-group>\
    ',
    data: function () {
      return {
        dataList: self.$utils.getDictDataList(self.dictType)
      }
    },
    props: {
      value: [Number, String],
      dictType: String
    },
    beforeCreate: function () {
      self = this;
    }
  }
};