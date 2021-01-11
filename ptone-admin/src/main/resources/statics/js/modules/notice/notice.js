(function () {
  var vm = window.vm = new Vue({
    el: '.aui-wrapper',
    i18n: window.SITE_CONFIG.i18n,
    mixins: [window.SITE_CONFIG.mixinViewModule],
    data: function () {
      return {
        mixinViewModuleOptions: {
          getDataListURL: '/sys/notice/page',
          getDataListIsPage: true,
          deleteURL: '/sys/notice',
          deleteIsBatch: true
        },
        dataForm: {
          type: ''
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
      // 查看
      viewHandle: function (row) {
        // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
        var currentRouteName = win.location.hash.substring(1).split('?')[0];
        var routeName = currentRouteName + '__' + row.id;
        var route = win.SITE_CONFIG['routeList'].filter(function (item) { return item.name === routeName; })[0];
        if (route) {
          win.location.hash = routeName;
          return true;
        }
        // 否则: 添加并全局变量保存, 再跳转
        var currentRoute = win.SITE_CONFIG['routeList'].filter(function (item) { return item.name === currentRouteName; })[0];
        route = {
          'menuId': currentRoute.menuId,
          'name': routeName,
          'title': vm.$t('notice.view1'),
          'url': './modules/notice/notice-view.html',
          'params': {
            'id': row.id
          }
        };
        win.SITE_CONFIG['routeList'].push(route);
        win.location.hash = routeName;
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
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" :label-width="$i18n.locale === \'en-US\' ? \'120px\' : \'80px\'">\
          <el-form-item :label="$t(\'notice.type\')" prop="type">\
              <ren-radio-group v-model="dataForm.type" dict-type="notice_type"></ren-radio-group>\
          </el-form-item>\
          <el-form-item :label="$t(\'notice.title\')"  prop="title">\
              <el-input v-model="dataForm.title" :placeholder="$t(\'notice.title\')"></el-input>\
          </el-form-item>\
          <el-form-item prop="content" :label="$t(\'notice.content\')">\
            <!-- 富文本编辑器, 容器 -->\
            <div id="J_quillEditor" style="height:280px"></div>\
            <!-- 自定义上传图片功能 (使用element upload组件) -->\
            <el-upload\
                    :action="uploadUrl"\
                    :show-file-list="false"\
                    :before-upload="uploadBeforeUploadHandle"\
                    :on-success="uploadSuccessHandle"\
                    style="display: none;">\
                <el-button ref="uploadBtn" type="primary" size="small">{{ $t(\'upload.button\') }}</el-button>\
            </el-upload>\
          </el-form-item>\
          <el-form-item :label="$t(\'notice.receiverType\')" prop="">\
              <el-radio-group v-model="dataForm.receiverType">\
                  <el-radio :label="0">{{ $t(\'notice.receiverType0\') }}</el-radio>\
                  <el-radio :label="1">{{ $t(\'notice.receiverType1\') }}</el-radio>\
              </el-radio-group>\
          </el-form-item>\
          <el-form-item v-show="dataForm.receiverType == 1" size="mini" :label="$t(\'notice.selectDept\')">\
            <el-tree\
                :data="deptList"\
                :props="{ label: \'name\', children: \'children\' }"\
                node-key="id"\
                ref="deptListTree"\
                accordion\
                show-checkbox>\
            </el-tree>\
          </el-form-item>\
        </el-form>\
        <template slot="footer">\
          <el-button @click="visible = false">{{ $t(\'cancel\') }}</el-button>\
          <el-button type="danger" @click="dataFormSubmitHandle(0)">{{ $t(\'notice.draft\') }}</el-button>\
          <el-button type="primary" @click="dataFormSubmitHandle(1)">{{ $t(\'notice.release\') }}</el-button>\
        </template>\
      </el-dialog>\
    ',
    data: function () {
      return {
        visible: false,
        quillEditor: null,
        quillEditorToolbarOptions: [
          ['bold', 'italic', 'underline', 'strike'],
          ['image'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'color': [] }, { 'background': [] }],
          ['clean']
        ],
        uploadUrl: '',
        deptList: [],
        dataForm: {
          id: '',
          type: 0,
          title: '',
          content: '',
          receiverType: 0,
          receiverTypeIds: '',
          receiverTypeList: [],
          status: '',
          senderName: '',
          senderDate: '',
          creator: '',
          createDate: ''
        }
      }
    },
    computed: {
      dataRule: function () {
        var validateContent = (rule, value, callback) => {
          if (self.quillEditor.getLength() <= 1) {
            return callback(new Error(self.$t('validate.required')))
          }
          callback()
        }
        return {
          type: [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          title: [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          content: [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' },
            { validator: validateContent, trigger: 'blur' }
          ],
          receiverType: [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          receiverTypeIds: [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          status: [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
          ],
          senderName: [
            { required: true, message: self.$t('validate.required'), trigger: 'blur' }
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
          if (self.quillEditor) {
            self.quillEditor.deleteText(0, self.quillEditor.getLength())
          } else {
            self.quillEditorHandle()
          }
          self.$refs['dataForm'].resetFields();
          Promise.all([
            self.getDeptList()
          ]).then(function () {
            if (self.dataForm.id) {
              self.getInfo()
            }
          })
        });
      },
      // 富文本编辑器
      quillEditorHandle: function () {
        self.quillEditor = new Quill('#J_quillEditor', {
          modules: {
            toolbar: self.quillEditorToolbarOptions
          },
          theme: 'snow'
        });
        // 自定义上传图片功能 (使用element upload组件)
        self.uploadUrl = window.SITE_CONFIG['apiURL'] + '/sys/oss/upload';
        self.quillEditor.getModule('toolbar').addHandler('image', function () {
          self.$refs.uploadBtn.$el.click();
        });
        // 监听内容变化，动态赋值
        self.quillEditor.on('text-change', function () {
          self.dataForm.content = self.quillEditor.root.innerHTML;
        });
      },
      // 上传图片之前
      uploadBeforeUploadHandle: function (file) {
        if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
          self.$message.error(self.$t('upload.tip', { 'format': 'jpg、png、gif' }));
          return false;
        }
      },
      // 上传图片成功
      uploadSuccessHandle: function (res, file, fileList) {
        if (res.code !== 0) {
          return self.$message.error(res.msg);
        }
        self.quillEditor.insertEmbed(self.quillEditor.getSelection().index, 'image', res.data.src);
      },
      // 获取部门列表
      getDeptList: function () {
        return self.$http.get('/sys/dept/list').then(function (res) {
          if (res.data.code !== 0) {
            return self.$message.error(res.data.msg);
          }
          self.deptList = res.data.data;
        }).catch(function () {});
      },
      // 获取信息
      getInfo: function () {
        self.$http.get('/sys/notice/' + self.dataForm.id).then(function (res) {
          if (res.data.code !== 0) {
            return self.$message.error(res.data.msg);
          }
          self.dataForm = res.data.data;
          self.quillEditor.root.innerHTML = self.dataForm.content;
          // 接受者为部门
          if (self.dataForm.receiverType === 1) {
            self.$refs.deptListTree.setCheckedKeys(res.data.data.receiverTypeIds.split(','));
          }
        }).catch(function () {});
      },
      // 表单提交
      dataFormSubmitHandle: _.debounce(function (status) {
        self.$refs['dataForm'].validate(function (valid) {
          if (!valid) {
            return false;
          }
          // 接受者为部门
          if (self.dataForm.receiverType === 1) {
            self.dataForm.receiverTypeIds = self.$refs.deptListTree.getCheckedKeys().join(',');
            self.dataForm.receiverTypeList = self.$refs.deptListTree.getCheckedKeys();
          } else {
            self.dataForm.receiverTypeIds = '';
          }
          self.dataForm.status = status;
          self.$http[!self.dataForm.id ? 'post' : 'put'](
              '/sys/notice',
              self.dataForm
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