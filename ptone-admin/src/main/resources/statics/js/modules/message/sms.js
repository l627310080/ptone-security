(function () {
  var vm = window.vm = new Vue({
    el: '.aui-wrapper',
    i18n: window.SITE_CONFIG.i18n,
    mixins: [window.SITE_CONFIG.mixinViewModule],
    data: function () {
      return {
        mixinViewModuleOptions: {
          getDataListURL: '/sys/sms/page',
          getDataListIsPage: true,
          deleteURL: '/sys/sms',
          deleteIsBatch: true
        },
        dataForm: {
          mobile: '',
          status: null
        },
        sendVisible: false
      }
    },
    components: {
      'add-or-update': fnAddOrUpdateComponent(),
      'send': fnSendComponent()
    },
    beforeCreate: function () {
      vm = this;
    },
    methods: {
      // 发送短信
      sendHandle: function (row) {
        vm.sendVisible = true;
        vm.$nextTick(function () {
          vm.$refs.send.dataForm.smsCode = row.smsCode
          vm.$refs.send.init();
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
    template: '\
      <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t(\'add\') : $t(\'update\')" :close-on-click-modal="false" :close-on-press-escape="false" :fullscreen="true">\
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">\
          <el-form-item prop="smsCode" :label="$t(\'sms.smsCode\')">\
            <el-input v-model="dataForm.smsCode" :placeholder="$t(\'sms.smsCode\')"></el-input>\
          </el-form-item>\
          <el-form-item prop="remark" :label="$t(\'sms.remark\')">\
            <el-input v-model="dataForm.remark" :placeholder="$t(\'sms.remark\')"></el-input>\
          </el-form-item>\
          <el-divider></el-divider>\
          <el-form-item :label="$t(\'sms.platform\')" size="mini">\
            <el-radio-group v-model="dataForm.platform">\
              <el-radio :label="1">{{ $t(\'sms.platform1\') }}</el-radio>\
              <el-radio :label="2">{{ $t(\'sms.platform2\') }}</el-radio>\
              <el-radio :label="3">{{ $t(\'sms.platform3\') }}</el-radio>\
            </el-radio-group>\
          </el-form-item>\
          <template v-if="dataForm.platform === 1">\
            <el-form-item prop="config.aliyunAccessKeyId" :label="$t(\'sms.aliyunAccessKeyId\')">\
              <el-input v-model="dataForm.config.aliyunAccessKeyId" :placeholder="$t(\'sms.aliyunAccessKeyIdTips\')"></el-input>\
            </el-form-item>\
            <el-form-item prop="config.aliyunAccessKeySecret" :label="$t(\'sms.aliyunAccessKeySecret\')">\
              <el-input v-model="dataForm.config.aliyunAccessKeySecret" :placeholder="$t(\'sms.aliyunAccessKeySecretTips\')"></el-input>\
            </el-form-item>\
            <el-form-item prop="config.aliyunSignName" :label="$t(\'sms.aliyunSignName\')">\
              <el-input v-model="dataForm.config.aliyunSignName" :placeholder="$t(\'sms.aliyunSignName\')"></el-input>\
            </el-form-item>\
            <el-form-item prop="config.aliyunTemplateCode" :label="$t(\'sms.aliyunTemplateCode\')">\
              <el-input v-model="dataForm.config.aliyunTemplateCode" :placeholder="$t(\'sms.aliyunTemplateCodeTips\')"></el-input>\
            </el-form-item>\
          </template>\
          <template v-else-if="dataForm.platform === 2">\
            <el-form-item prop="config.qcloudAppId" :label="$t(\'sms.qcloudAppId\')">\
              <el-input v-model="dataForm.config.qcloudAppId" :placeholder="$t(\'sms.qcloudAppIdTips\')"></el-input>\
            </el-form-item>\
            <el-form-item prop="config.qcloudAppKey" :label="$t(\'sms.qcloudAppKey\')">\
              <el-input v-model="dataForm.config.qcloudAppKey" :placeholder="$t(\'sms.qcloudAppKeyTips\')"></el-input>\
            </el-form-item>\
            <el-form-item prop="config.qcloudSignName" :label="$t(\'sms.qcloudSignName\')">\
              <el-input v-model="dataForm.config.qcloudSignName" :placeholder="$t(\'sms.qcloudSignName\')"></el-input>\
            </el-form-item>\
            <el-form-item prop="config.qcloudTemplateId" :label="$t(\'sms.qcloudTemplateId\')">\
              <el-input v-model="dataForm.config.qcloudTemplateId" :placeholder="$t(\'sms.qcloudTemplateIdTips\')"></el-input>\
            </el-form-item>\
          </template>\
          <template v-else-if="dataForm.platform === 3">\
            <el-form-item prop="config.qiniuAccessKey" :label="$t(\'sms.qiniuAccessKey\')">\
                <el-input v-model="dataForm.config.qiniuAccessKey" :placeholder="$t(\'sms.qiniuAccessKeyTips\')"></el-input>\
            </el-form-item>\
            <el-form-item prop="config.qiniuSecretKey" :label="$t(\'sms.qiniuSecretKey\')">\
                <el-input v-model="dataForm.config.qiniuSecretKey" :placeholder="$t(\'sms.qiniuSecretKeyTips\')"></el-input>\
            </el-form-item>\
            <el-form-item prop="config.qiniuTemplateId" :label="$t(\'sms.qiniuTemplateId\')">\
                <el-input v-model="dataForm.config.qiniuTemplateId" :placeholder="$t(\'sms.qiniuTemplateIdTips\')"></el-input>\
            </el-form-item>\
          </template>\
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
          smsCode: '',
          remark: '',
          platform: 1,
          config: {
            aliyunAccessKeyId: '',
            aliyunAccessKeySecret: '',
            aliyunSignName: '',
            aliyunTemplateCode: '',
            qcloudAppId: '',
            qcloudAppKey: '',
            qcloudSignName: '',
            qcloudTemplateId: '',
            qiniuAccessKey: '',
            qiniuSecretKey: '',
            qiniuTemplateId: ''
          }
        }
      }
    },
    computed: {
      dataRule: function () {
        return {
          smsCode: [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          'config.aliyunAccessKeyId': [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          'config.aliyunAccessKeySecret': [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          'config.aliyunSignName': [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          'config.aliyunTemplateCode': [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          'config.qcloudAppId': [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          'config.qcloudAppKey': [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          'config.qcloudSignName': [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          'config.qcloudTemplateId': [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          'config.qiniuAccessKey': [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          'config.qiniuSecretKey': [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          'config.qiniuTemplateId': [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ]
        }
      }
    },
    beforeCreate: function () {
      self = this;
    },
    watch: {
      'dataForm.platform' (val) {
        self.$refs['dataForm'].clearValidate()
      }
    },
    methods: {
      init () {
        self.visible = true
        self.$nextTick(function () {
          self.$refs['dataForm'].resetFields()
          if (self.dataForm.id) {
            self.getInfo()
          }
        })
      },
      // 获取信息
      getInfo () {
        self.$http.get(`/sys/sms/${self.dataForm.id}`).then(function (res) {
          if (res.data.code !== 0) {
            return self.$message.error(res.data.msg)
          }
          self.dataForm = res.data.data;
        }).catch(function () {});
      },
      // 表单提交
      dataFormSubmitHandle: _.debounce(function () {
        self.$refs['dataForm'].validate(function (valid) {
          if (!valid) {
            return false
          }
          self.$http[!self.dataForm.id ? 'post' : 'put']('/sys/sms', self.dataForm).then(function (res) {
            if (res.data.code !== 0) {
              return self.$message.error(res.data.msg);
            }
            self.$message({
              message: self.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: function () {
                self.visible = false
                self.$emit('refresh-data-list');
              }
            })
          }).catch(function () {});
        })
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
};

/**
 * send组件
 */
function fnSendComponent () {
  var self = null;
  return {
    template: '\
      <el-dialog :visible.sync="visible" :title="$t(\'sms.send\')" :close-on-click-modal="false" :close-on-press-escape="false" :fullscreen="true">\
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">\
          <el-form-item prop="mobile" :label="$t(\'sms.mobile\')">\
            <el-input v-model="dataForm.mobile" :placeholder="$t(\'sms.mobile\')"></el-input>\
          </el-form-item>\
          <el-form-item prop="params" :label="$t(\'sms.params\')">\
            <el-input v-model="dataForm.params" :placeholder="$t(\'sms.paramsTips\')"></el-input>\
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
          smsCode: '',
          mobile: '',
          params: ''
        }
      }
    },
    computed: {
      dataRule: function () {
        var validateMobile = function (rule, value, callback) {
          if (!self.$validate.isMobile(value)) {
            return callback(new Error(self.$t('validate.format', { 'attr': self.$t('user.mobile') })));
          }
          callback();
        }
        return {
          mobile: [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
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
        });
      },
      // 表单提交
      dataFormSubmitHandle: _.debounce(function () {
        self.$refs['dataForm'].validate(function (valid) {
          if (!valid) {
            return false;
          }
          self.$http.post(
            '/sys/sms/send',
            self.dataForm,
            { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
          ).then(function (res) {
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