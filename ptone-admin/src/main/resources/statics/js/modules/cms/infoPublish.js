(function () {
    var vm = window.vm = new Vue({
        el: '.aui-wrapper',
        i18n: window.SITE_CONFIG.i18n,
        mixins: [window.SITE_CONFIG.mixinViewModule],
        data: function () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: '/cms/infopublish/page',
                    getDataListIsPage: true,
                    deleteURL: '/cms/infopublish',
                    deleteIsBatch: true
                },
                dataForm: {
                    id: '',
                    pcode: 'cnkjg',
                    code: '',
                    columnIds: []
                },
                addVisible: '',
                columnList: [],
                sortArr: []
            }
        },
        components: {
            'add-or-update': fnAddOrUpdateComponent()
        },
        filters: {
            formatDate: function (time) {
                return vm.formatDate(new Date(time), 'yyyy-MM-dd');
            }
        },
        beforeCreate: function () {
            vm = this;
        }, created: function () {
            vm.getColumnList()
        },
        methods: {
            formatDate: function (time) {
                var date = new Date(time);
                var year = date.getFullYear(),
                    month = date.getMonth() + 1,//月份是从0开始的
                    day = date.getDate()
                var newTime =
                    year + '年' +
                    month + '月' + day + '日';
                return newTime;
            },
            detail: function (id) {
                window.open('infopublishDetail.html?id=' + id, "_blank")
            },
            sort: function (id, sort) {
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
            updateSort: function () {

                this.$http.post('/cms/infopublish/updateSort', {"sort": vm.sortArr}).then(function (res) {
                    window.SITE_CONFIG.mixinViewModule.methods.getDataList();
                });
            },
            columnChange: function (a) {
                vm.dataForm.pcode = a.code
                vm.dataForm.id = a.id
                this.$http.post('/cms/bizcolumn/ifHasChildren', {code: vm.dataForm.pcode}).then(function (res) {
                    if (res.data.data == false) {
                        vm.addVisible = true
                    } else {
                        vm.addVisible = false
                    }
                });
                vm.getDataList()
            },
            getColumnList: function () {
                return vm.$http.get('/cms/bizcolumn/list').then(function (res) {
                    if (res.data.code !== 0) {
                        return self.$message.error(res.data.msg);
                    }
                    var data = res.data.data
                    vm.columnList = JSON.parse(JSON.stringify(data).replace(/name/g, 'label'))
                }).catch(function (e) {
                    alert(e)
                });
            },
        }
    });
})();

/**
 * add-or-update组件
 */
function fnAddOrUpdateComponent() {
    var self = null;
    return {
        //  mixins: [window.SITE_CONFIG.mixinFileUploadModule],
        mixins: [window.SITE_CONFIG.mixinFileUploadModule],
        components: {
            'vue-ueditor-wrap': VueUeditorWrap
        },
        template: '<el-dialog :visible' +
            '.sync="visible"  :before-close="cancel":title="!dataForm.id ? $t(\'add\') : $t(\'update\')" :close-on-click-modal="false"     :close-on-press-escape="false" :fullscreen="true">\n    <el-form :model="dataForm"  :disabled="detailFlag" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"\n             label-width="120px">\n\n        <el-row>\n            <el-col :span="17">\n                <el-form-item label="标题" prop="title">\n                    <el-input v-model="dataForm.title" :autosize="true" size="medium" placeholder="标题">\n                    </el-input>\n                </el-form-item>\n            </el-col>\n            <el-col :span="1">\n                <el-form-item label="" prop="topStatus">\n                    <el-checkbox :label="1" v-model="isTop" @change="topCheckChange" style="margin-left: 10em">是否置顶\n                    </el-checkbox>\n                </el-form-item>\n            </el-col>\n        </el-row>\n        <el-row>\n            <el-col :span="19">\n            <el-form-item label="摘要" prop="introduction">\n                <el-input v-model="dataForm.introduction" maxlength="300" placeholder="请输入内容" :autosize="{ minRows: 3, maxRows: 4}" type="textarea">\n                </el-input>\n            </el-form-item>\n            </el-col>\n        </el-row>\n        <el-row>\n            <el-col :span="17">\n                <el-form-item label="所属栏目" prop="columnIds">\n                    <el-input v-model="dataForm.affiliation"  readonly :autosize="true" size="medium">\n                    </el-input>\n                </el-form-item>\n            </el-col>\n            <el-col :span="1">\n                <el-form-item>\n                    <el-button v-popover:columnListPopover style="margin-left: 10em">\n                        选择\n                    </el-button>\n                </el-form-item>\n                <el-popover v-model="columnListVisible" ref="columnListPopover" placement="bottom-start"\n                            trigger="click">\n                    <el-tree\n                            @check-change="handleCheckChange"\n                            :default-expanded-keys="expandedKeys"\n                            :default-checked-keys="defaultKeys"\n                            v-model="dataForm.columnIds"\n                            :data="columnList"\n                            show-checkbox\n                            :props="{ label: \'name\', children: \'children\' }"\n                            node-key="columnId"\n                            ref="columnListTree"\n                            :highlight-current="true"\n                            :expand-on-click-node="false"\n                            accordion\n                    >\n                    </el-tree>\n                </el-popover>\n            </el-col>\n        </el-row>\n\n' +
            '\n        <el-row>\n            <el-col :span="9">\n                <el-form-item prop="sort" :label="$t(\'menu.sort\')">\n                    <el-input-number v-model="dataForm.infoSort" :step="10" controls-position="right" :min="0"\n                                     :label="$t(\'menu.sort\')"></el-input-number>\n                </el-form-item>\n            </el-col>\n            <el-col :span="9">\n                <el-form-item label="显示时期" prop="showDate">\n                    <el-date-picker v-model="dataForm.showDate" type="date" format="yyyy年MM月dd日"\n                                    :default-value="timeDefaultShow"></el-date-picker>\n                </el-form-item>\n            </el-col>\n        </el-row>\n        <el-form-item label="链接" prop="href">\n            <el-row>\n                <el-col :span="18">\n            <el-input v-model="dataForm.href" placeholder="链接" style="width: 115.5%;"></el-input>\n                </el-col>\n            </el-row>\n        </el-form-item>\n        <!--<el-form-item prop="attechment" label="pdf附件">-->\n            <!--<el-upload-->\n                    <!--class="upload-demo"-->\n                    <!--:action="uploadUrl2"-->\n                    <!--:on-success="uploadSuccessHandlePdf"-->\n                    <!--:on-preview="uploadHandlePreview"-->\n                    <!--:data="{tableId:!!dataForm.id?dataForm.id:worldId,tableName:\'biz_info_publish\',typeCode:\'pdfattechments\'}"-->\n                    <!--:on-remove="uploadHandleRemovePdf"-->\n                    <!--:before-remove="uploadBeforeRemove"-->\n                    <!--:file-list="pdfAttechments"-->\n                     <!--limit="1">-->\n                <!--<el-button size="small" type="primary">点击上传</el-button>-->\n            <!--</el-upload>-->\n        <!--</el-form-item>-->\n\n        <!--<el-row>-->\n           <!---->\n                <!--<el-form-item label="发布人" prop="publisher">-->\n                    <!--<main-select-user v-model="publisherList">-->\n                    <!--</main-select-user>-->\n                    <!--&lt;!&ndash;<label v-if="userInfo.id!=1067246875800000001">{{userInfo.realName}}</label>&ndash;&gt;-->\n                <!--</el-form-item>-->\n           <!---->\n            <!---->\n        <!--</el-row>-->\n\n        <el-row>\n            <el-col :span="17">\n                <el-form-item label="发布人" prop="publisherName">\n                    <el-input v-model="dataForm.publisherName" :autosize="true" size="medium" placeholder="发布人">\n                    </el-input>\n                </el-form-item>\n            </el-col>\n        </el-row>\n        <el-row>\n          \n                <el-form-item label="封面图片">\n                    <el-upload\n                            accept="image/jpeg,image/jpg,image/png"\n                            class="avatar-uploader"\n                            :action="uploadUrl2"\n                            :on-preview="uploadHandlePreview" :on-success="handleAvatarSuccess"\n                            :show-file-list="false"\n                            :data="{tableId:!!dataForm.id?dataForm.id:worldId,tableName:\'biz_info_publish\',typeCode:\'infoPublishCoverPicture\',uploadFlag:\'true\'}"\n                            :on-change="changeUpload"\n                            :before-remove="uploadBeforeRemove"\n                            :on-remove="uploadHandleRemove"\n                    >\n                        <img v-if="coverUrl" :src="coverUrl" class="avatar">\n                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>\n                    </el-upload>\n                    <el-dialog :visible.sync="dialogVisible">\n                        <img width="100%" :src="dialogImageUrl" alt="">\n                    </el-dialog>\n                </el-form-item>\n         \n        </el-row>\n\n\n        <el-form-item prop="content" label="信息内容">\n            <vue-ueditor-wrap v-model="dataForm.content" @ready="richTextReady($event,{tableId:worldId,tableName:\'biz_info_publish\',typeCode:\'richText\'})" :config="ueditoyConfig"></vue-ueditor-wrap>\n            <!-- 富文本编辑器, 容器 -->\n          <!--  <div id="J_quillEditor"></div>-->\n            <!-- 自定义上传图片功能 (使用element upload组件) -->\n          <!--  <el-upload\n                    :action="uploadUrl"\n                    :show-file-list="false"\n                    :before-upload="uploadBeforeUploadHandle"\n                    :on-success="uploadSuccessRichText"\n                    :on-preview="uploadHandlePreview"\n                    :data="{tableId:!!dataForm.id?dataForm.id:worldId,tableName:\'biz_info_publish\',typeCode:\'richText\',uploadFlag:\'true\'}"\n                    style="display: none;">\n                <el-button ref="uploadBtn" type="primary" size="medium">{{ $t(\'upload.button\') }}</el-button>\n            </el-upload>-->\n        </el-form-item>\n\n        <el-form-item prop="attechment" label="附件">\n            <el-upload\n                    class="upload-demo"\n                    :action="uploadUrl2"\n                    :on-success="uploadSuccessHandle"\n                    :on-preview="uploadHandlePreview"\n                    :data="{tableId:!!dataForm.id?dataForm.id:worldId,tableName:\'biz_info_publish\',typeCode:\'attechments\'}"\n                    :on-remove="uploadHandleRemove"\n                    :before-remove="uploadBeforeRemove"\n                    :file-list="attechments">\n                <el-button size="small" type="primary">点击上传</el-button>\n            </el-upload>\n        </el-form-item>\n        <!--     :on-change="handleChange"-->\n    </el-form>\n    <template slot="footer">\n        <el-button @click="cancel()">{{ $t(\'cancel\') }}</el-button>\n        <el-button type="primary" @click="dataFormSubmitHandle()"  v-if="!detailFlag">{{ $t(\'confirm\') }}</el-button>\n    </template>\n</el-dialog>\n    ',
        data: function () {
            return {
                visible: false,
                dataForm: {
                    columnIds: [],
                    id: '',
                    title: '',
                    href: '',
                    topStatus: '',
                    infoSort: 10,
                    coverPicture: '',
                    showDate: '',
                    publisher: '',
                    publisherName: '',
                    content: '',
                    createDate: '',
                    creator: '',
                    updateDate: '',
                    updator: '',
                    affiliation: '',
                    introduction:''
                },
                isTop: [],
                userInfo: '',
                coverUrl: '',//封面路径
                coverId: '',
                // uploadUrl: '',
                expandedKeys: [],//树状自动展开
                dialogImageUrl: '',
                dialogVisible: false,
                timeDefaultShow: '',
                quillEditor: null,
                quillEditorToolbarOptions: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block', 'image'],
                    [{'header': 1}, {'header': 2}],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    [{'script': 'sub'}, {'script': 'super'}],
                    [{'indent': '-1'}, {'indent': '+1'}],
                    [{'direction': 'rtl'}],
                    [{'size': ['small', false, 'large', 'huge']}],
                    [{'header': [1, 2, 3, 4, 5, 6, false]}],
                    [{'color': []}, {'background': []}],
                    [{'font': []}],
                    [{'align': []}],
                    ['clean']
                ],
                parentColumnList: '',
                columnList: [],
                columnListVisible: false,
                publisherList: [],
                columnNames: '',
                attechments: [],
                pdfAttechments: [],
                defaultKeys: [],
                detailFlag: false
            }
        },
        computed: {
            dataRule: function () {
                return {
                    title: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    publisher: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    showDate: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    createDate: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    creator: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    updateDate: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    updator: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ], columnIds: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ]
                }
            }
        },
        created: function () {

            self.getColumnList()
        },
        beforeCreate: function () {
            self = this;
        },
        watch: {
            'dataForm.columnIds': function (val) {
                console.log("biaoshi",val);
                self.getColumnNames()
            }
        },

        methods: {
            uploadHandleRemovePdf: function (file, fileList) {
                var _this = this;
                var fileId = file.fileId || file.response.data.fileId;
                console.log("删除的fileId", fileId);
                console.log("handleRemove", file, fileList);
                //this.operatingInDTO.delFileIds.push(file.response.data.fileId);
                this.$http.delete(
                    '/upload', {data: [fileId]}
                ).then(function (res) {
                    if (res.data.code !== 0) {
                        return _this.$message.error(res.data.msg);
                    }
                    self.dataForm.href ='';
                    console.log("删除成功！！");

                })


            },
            uploadSuccessHandlePdf: function (res, file, fileList) {
                console.log("uploadSuccessHandle 上传返回");
                if (res.code !== 0) {
                    return this.$message.error(res.msg);
                } else {
                    console.log("上传成功！");
                    var url = fileList[0].response.data.url;
                    url = url.replace("\\\\", "\/\/");
                    url = url.replace("\\", "\/");
                    url = url.replace("\\", "\/");
                    console.log(url);
                    self.dataForm.href = "http://" + window.location.host + url;
                    /* if (self.pdfAttechments) {
                         self.dataForm.href = self.pdfAttechments[0].url;
                     }*/
                }
            },

            // 获取当前管理员信息
            getUserInfo: function () {
                return self.$http.get('/sys/user/info').then(function (res) {
                    if (res.data.code !== 0) {
                        return self.$message.error(res.data.msg);
                    }
                    self.userInfo = res.data.data;
                    self.dataForm.publisher = self.userInfo.id
                    self.dataForm.publisherName = self.userInfo.realName

                    // if (self.userInfo.id!=1067246875800000001) {

                    // self.publisherList.push(self.dataForm.publisher)
                    // }
                    // self.user.id = res.data.data.id;
                    // self.user.name = res.data.data.username;
                    // self.user.realName = res.data.data.realName;
                    // self.user.superAdmin = res.data.data.superAdmin;
                }).catch(function () {
                });
            },
            topCheckChange: function (e) {
                self.isTop = [];
                if (e) {
                    self.isTop.push(1)
                    self.dataForm.topStatus = 1;
                } else {
                    self.isTop.push(0)
                    self.dataForm.topStatus = 0
                }
            },
            /*  handleChange: function (file, fileList) {
                  self.attechments = fileList.slice(-3);
              },
  */
            changeUpload: function (file, fileList) { //更换logo触发
                //创建临时的路径来展示图片
                var windowURL = window.URL || window.webkitURL;
                this.src = windowURL.createObjectURL(file.raw);
            },
            handleAvatarSuccess: function (res, file) { //上传成功之后事件
                if (self.coverId != '') {
                    this.$http.delete(
                        '/upload', {data: [self.coverId]}
                    ).then(function (res) {
                        if (res.data.code !== 0) {
                            return _this.$message.error(res.data.msg);
                        }
                        console.log("删除成功！！");
                    })
                }
                self.coverUrl = URL.createObjectURL(file.raw);
                self.coverId = file.response.data.fileId;
                var url =res.data.url;
                url = url.replaceAll("\\\\", "\/");
                url = url.replaceAll("\\", "\/");
                self.dataForm.coverPicture = url;
            },
            init: function () {
                self.publisherList = []
                self.visible = true;
                self.$nextTick(function () {
                    self.$refs['dataForm'].resetFields();
                    self.getUserInfo()
                    self.getColumnList()
                    /* if (self.quillEditor) {
                         self.quillEditor.deleteText(0, self.quillEditor.getLength());
                     } else {
                     //    self.quillEditorHandle();
                     }*/
                    self.dataForm.columnIds = []
                    self.columnNames = ''
                    self.dataForm.affiliation = ''
                    if (self.dataForm.id) {
                        self.getInfo();

                    } else {
                        self.publisherList.push({value: self.userInfo.id, label: self.userInfo.realName})
                        self.dataForm.columnIds.push(vm.dataForm.id)
                        self.expandedKeys = self.dataForm.columnIds;
                        self.timeDefaultShow = new Date()
                        self.dataForm.showDate = new Date();
                        self.defaultKeys = self.dataForm.columnIds
                        self.initWorldIdStr();

                    }

                })
                self.$nextTick(function () {
                    /*回显图片*/
                    self.previewFile(self.dataForm.id, 'infoPublishCoverPicture', function (list) {
                        list.forEach(function (d) {
                            self.coverUrl = d.relativePath;
                            self.coverId = d.id;
                        })
                    })

                    self.attechments = [];
                    self.pdfAttechments = [];
                    self.$nextTick(function () {
                        self.previewFile(self.dataForm.id, 'attechments', function (list) {
                            list.forEach(function (d) {
                                self.attechments.push({name: d.displayName, url: d.relativePath, fileId: d.id})
                            })
                        }),
                            self.previewFile(self.dataForm.id, 'pdfattechments', function (list) {
                                list.forEach(function (d) {
                                    self.pdfAttechments.push({name: d.displayName, url: d.relativePath, fileId: d.id})
                                });
                                /* if (!self.pdfAttechments.length==0) {
                                     console.log(self.pdfAttechments+"是否有值");
                                     self.dataForm.href = window.location.host + self.pdfAttechments[0].url;
                                 }*/
                            })

                    });
                });
            },
            uploadBeforeUploadHandle: function (file) {
                if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
                    self.$message.error('只支持jpg、png、gif格式的图片！');
                    return false;
                }
            },
            uploadSuccessRichText: function (res, file, fileList) {
                if (res.code !== 0) {
                    return self.$message.error(res.msg);
                }
                var resultUrl = window.location.origin + res.data.url;
                self.quillEditor.insertEmbed(self.quillEditor.getSelection().index, 'image', resultUrl);
            }
            ,
            // 上级菜单树, 设置默认值
            deptListTreeSetDefaultHandle: function () {
                self.dataForm.pid = '0';
                self.dataForm.parentColumn = 'cnkjg';
            },
            // 上级菜单树, 选中
            handleCheckChange: function (data, checked, indeterminate) {
                if (self.dataForm.columnIds.length == self.dataForm.affiliation.split(",").length) {
                    self.dataForm.columnIds = self.$refs.columnListTree.getCheckedKeys();
                }

            },
            getColumnParents: function () {
                self.$http.post('/cms/bizcolumn/getColumnParents', {"code": vm.dataForm.pcode}).then(function (res) {
                    var data = res.data.data;
                    for (var i = 0; i < data.length; i++) {
                        self.dataForm.columnIds.push(data[i].columnId)
                    }
                    self.dataForm.columnIds.forEach(function (item) {
                        self.$refs.columnListTree.setChecked(item, true);
                    });
                    self.expandedKeys = self.dataForm.columnIds;
                }).catch(function () {
                });
            },
            cancel: function () {
                self.visible = false
                // self.$refs['dataForm'].resetFields();
                self.dataForm.affiliation = ''
                self.dataForm.publisher = ''
                self.publisherList = []
                self.expandedKeys = []
                self.isTop = []
                self.dataForm.columnIds = []
                self.coverUrl = ''
                self.coverId = ''
            },
            getColumnNames: function () {
                self.$http.post('/cms/bizcolumn/getColumnNames', {"columnIds": self.dataForm.columnIds}).then(function (res) {
                    if (!res.data.data) {
                        self.dataForm.affiliation = ''
                    }
                    //解决栏目名字不对
                    if (self.dataForm.columnIds.length == res.data.data.length) {
                        self.dataForm.affiliation = res.data.data.join(',')
                    }

                }).catch(function () {
                });
            },
            getColumnList: function () {
                return self.$http.get('/cms/bizcolumn/list').then(function (res) {
                    if (res.data.code !== 0) {
                        return self.$message.error(res.data.msg);
                    }
                    self.columnList = res.data.data

                    /*  self.columnList =  JSON.parse(JSON.stringify(data).replace(/columnId/g, 'id'));*/
                }).catch(function () {
                });
            },


            // 获取信息
            getInfo: function () {
                self.$http.get('/cms/infopublish/' + self.dataForm.id).then(function (res) {

                    if (res.data.code !== 0) {
                        return self.$message.error(res.data.msg);
                    }
                    self.isTop = [];
                    // self.columnListVisible = true
                    self.dataForm = _.merge({}, self.dataForm, res.data.data);
                    self.expandedKeys = self.dataForm.columnIds
                    self.defaultKeys = self.dataForm.columnIds
                    self.publisherList.push({value: self.userInfo.id, label: self.userInfo.realName})
                    self.isTop.push(self.dataForm.topStatus)


                    self.expandedKeys = self.dataForm.columnIds
                    self.quillEditor.root.innerHTML = self.dataForm.content;
                    /* self.dataForm.columnIds.forEach(function (item) {
                         self.$refs.columnListTree.setChecked(item, true);
                     });*/
                }).catch(function () {
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
                // self.uploadUrl = window.SITE_CONFIG['apiURL'] + '/sys/sysattachment/upload';
                self.quillEditor.getModule('toolbar').addHandler('image', function () {
                    self.$refs.uploadBtn.$el.click();
                });
                // 监听内容变化，动态赋值
                self.quillEditor.on('text-change', function () {
                    self.dataForm.content = self.quillEditor.root.innerHTML;
                });
            },
            // 表单提交
            dataFormSubmitHandle: _.debounce(function () {
                self.dataForm.publisher = self.dataForm.publisherName
                /*   self.dataForm.columnIds = self.$refs.columnListTree.getHalfCheckedKeys().concat(self.$refs.columnListTree.getCheckedKeys());*/
                self.$refs['dataForm'].validate(function (valid) {
                    self.dataForm.showDate = Date.parse(self.dataForm.showDate)
                    if (!valid) {
                        return false;
                    }


                    self.$http[!self.dataForm.id ? 'post' : 'put']('/cms/infopublish', !!self.dataForm.id ? self.dataForm : _.merge({id: self.worldId}, self.dataForm)).then(function (res) {
                        if (res.data.code !== 0) {
                            return self.$message.error(res.data.msg);
                        }
                        self.$message({
                            message: self.$t('prompt.success'),
                            type: 'success',
                            duration: 500,
                            onClose: function () {

                                self.coverUrl = ''
                                self.coverId = ''
                                self.publisherList = []
                                self.dataForm.columnIds = []
                                self.$refs['dataForm'].resetFields();
                                self.isTop = []
                                self.visible = false;
                                self.$emit('refresh-data-list');

                            }
                        });
                    }).catch(function () {
                    });
                });
            }, 1000, {'leading': true, 'trailing': false})
        }
    }
};
