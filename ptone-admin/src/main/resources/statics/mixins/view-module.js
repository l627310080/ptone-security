(function () {
    var self = null;
    window.SITE_CONFIG.mixinViewModule = {
        data: function () {
            return {
                // 设置属性
                mixinViewModuleOptions: {
                    activatedIsNeed: true,    // 此页面是否在激活（进入）时，调用查询数据列表接口？
                    getDataListURL: '',       // 数据列表接口，API地址
                    getDataListIsPage: false, // 数据列表接口，是否需要分页？
                    deleteURL: '',            // 删除接口，API地址
                    deleteIsBatch: false,     // 删除接口，是否需要批量？
                    deleteIsBatchKey: 'id',   // 删除接口，批量状态下由那个key进行标记操作？比如：pid，uid...
                    exportURL: ''             // 导出接口，API地址
                },
                // 默认属性
                dataForm: {},               // 查询条件
                dataList: [],               // 数据列表
                order: '',                  // 排序，asc／desc
                orderField: '',             // 排序，字段
                page: 1,                    // 当前页码
                limit: 10,                  // 每页数
                total: 0,                   // 总条数
                dataListLoading: false,     // 数据列表，loading状态
                dataListSelections: [],     // 数据列表，多选项
                addOrUpdateVisible: false,  // 新增／更新，弹窗visible状态
            }
        },
        beforeCreate: function () {
            self = this;
        },
        created: function () {
            if (self.mixinViewModuleOptions.activatedIsNeed) {
                self.getDataList();
            }
        },
        methods: {
            // 获取数据列表
            getDataList: function (val) {
                if (val) {
                    //控制条件查询
                    self.page = 1;
                    self.limit = 10;
                }
                self.dataListLoading = true;
                self.$http.get(
                    self.mixinViewModuleOptions.getDataListURL,
                    {
                        params: _.merge({
                            order: self.order,
                            orderField: self.orderField,
                            page: self.mixinViewModuleOptions.getDataListIsPage ? self.page : null,
                            limit: self.mixinViewModuleOptions.getDataListIsPage ? self.limit : null
                        }, self.dataForm)
                    }
                ).then(function (res) {
                    self.dataListLoading = false;
                    if (res.data.code !== 0) {
                        self.dataList = [];
                        self.total = 0;
                        return self.$message.error(res.data.msg);
                    }
                    self.dataList = self.mixinViewModuleOptions.getDataListIsPage ? res.data.data.list : res.data.data;
                    self.total = self.mixinViewModuleOptions.getDataListIsPage ? res.data.data.total : 0;
                }).catch(function () {
                    self.dataListLoading = false;
                })
            },
            // 多选
            dataListSelectionChangeHandle: function (val) {
                self.dataListSelections = val;
            },
            // 排序
            dataListSortChangeHandle: function (data) {
                if (!data.order || !data.prop) {
                    self.order = '';
                    self.orderField = '';
                    return false;
                }
                self.order = data.order.replace(/ending$/, '');
                self.orderField = data.prop.replace(/([A-Z])/g, '_$1').toLowerCase();
                self.getDataList();
            },
            // 分页, 每页条数
            pageSizeChangeHandle: function (val) {
                self.page = 1;
                self.limit = val;
                self.getDataList();
            },
            // 分页, 当前页
            pageCurrentChangeHandle: function (val) {
                self.page = val;
                self.getDataList();
            },
            initHandle: function (id, detailFlag) {
                self.addOrUpdateVisible = true;
                self.$nextTick(function () {
                    self.$refs.addOrUpdate.dataForm.id = id;
                    self.$refs.addOrUpdate.detailFlag = !!detailFlag;
                    self.$refs.addOrUpdate.init();
                    //如果有上传文件，且是新增状态, 则自动生成业务id
                    if (self.$refs.addOrUpdate.worldId != undefined) {
                        if (!id) {
                            //新增
                            self.$refs.addOrUpdate.initWorldIdStr();
                        } else {
                            //修改
                            self.$refs.addOrUpdate.worldId = id;
                        }
                    }
                })
            },
            /*
             *
             */
            initHandleReimbursement: function (row, detailFlag) {
                self.addOrUpdateVisible = true;
                self.$nextTick(function () {
                    self.$refs.addOrUpdate.dataForm.collarUsePeople = row.collarUsePeople;
                    self.$refs.addOrUpdate.dataForm.createDate = row.createDate;
                    self.$refs.addOrUpdate.detailFlag = !!detailFlag;
                    self.$refs.addOrUpdate.init();
                })
            },
            /**
             * 查看详情
             * @param id
             */
            detailHandle: function (id) {
                self.initHandle(id, true);
            },
            /**
             * 查看报销详情
             * @param row
             */
            detailHandleReimbursement: function (row) {
                self.initHandleReimbursement(row, true);
            },
            // 新增 / 修改
            addOrUpdateHandle: function (id, isDetail) {
                self.initHandle(id);
            },
            //查询项目绩效
            showDailyDateils: function (id) {

            },
            // 删除
            deleteHandle: function (id) {
                if (self.mixinViewModuleOptions.deleteIsBatch && !id && self.dataListSelections.length <= 0) {
                    return self.$message({
                        message: self.$t('prompt.deleteBatch'),
                        type: 'warning',
                        duration: 500
                    });
                }
                self.$confirm(self.$t('prompt.info', {'handle': self.$t('delete')}), self.$t('prompt.title'), {
                    confirmButtonText: self.$t('confirm'),
                    cancelButtonText: self.$t('cancel'),
                    type: 'warning'
                }).then(function () {
                    self.$http.delete(
                        self.mixinViewModuleOptions.deleteURL + (self.mixinViewModuleOptions.deleteIsBatch ? '' : '/' + id),
                        self.mixinViewModuleOptions.deleteIsBatch ? {
                            'data': id ? [id] : self.dataListSelections.map(function (item) {
                                return item[self.mixinViewModuleOptions.deleteIsBatchKey];
                            })
                        } : {}
                    ).then(function (res) {
                        if (res.data.code !== 0) {
                            return self.$message.error(res.data.msg);
                        }
                        self.$message({
                            message: self.$t('prompt.success'),
                            type: 'success',
                            duration: 500,
                            onClose: function () {
                                self.getDataList();
                            }
                        });
                    }).catch(function () {
                    });
                }).catch(function () {
                });
            },
            // 导出
            exportHandle: function () {
                window.location.href = window.SITE_CONFIG['apiURL'] + self.mixinViewModuleOptions.exportURL + '?' + Qs.stringify(self.dataForm);
            }
        }
    }


    //上传附件开始
    window.SITE_CONFIG.mixinFileUploadModule = {
        data: function () {
            return {
                // 设置属性
                mixinViewModuleOptions: {},
                uploadUrl: window.SITE_CONFIG['uploadUrl'],
                // 默认属性
                uploadUrl2: window.SITE_CONFIG['uploadUrl2'],
                worldId: '', // 生成主键id,供文件上传使用
                ueditoyConfig: {
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: true,
                    // 初始容器高度
                    initialFrameHeight: 440,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
                    serverUrl: window.SITE_CONFIG['uploadUrl2'],
                    // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
                    UEDITOR_HOME_URL: win.SITE_CONFIG['apiURL'] + 'statics/plugins/ueditoy_1.4.3.3_fixbug/'
                },
            }
        },
        created: function () {
        },
        methods: {
            //文件上传组件功能方法
            uploadHandleRemove: function (file, fileList) {
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

                    console.log("删除成功！！");

                })


            },
            uploadHandlePreview: function (file) {
                console.log("uploadHandlePreview 事件");
                //点击文件执行方法
                console.log(file.url);
                var url = "";
                if (!!file.url) {
                    url = file.url;
                } else {
                    if (!!file.relativePath) {
                        url = file.relativePath;
                    } else {
                        url = file.response.data.url.replace("\\\\", "\\");
                    }

                }
                window.open(url)
            },
            uploadBeforeRemove: function (file, fileList) {
                return this.$confirm('确定' + file.name + '移除？');
            },
            uploadSuccessHandle: function (res, file, fileList) {
                console.log("uploadSuccessHandle 上传返回");
                if (res.code !== 0) {
                    return this.$message.error(res.msg);
                } else {
                    console.log("上传成功！");
                }
            },
            previewFile: function (tableId, typeCode, callback) {
                var _this = this;
                //显示文件
                this.$http.get('/upload/detail?tableId=' + tableId + "&typeCode=" + typeCode
                ).then(function (res) {
                    if (res.data.code !== 0) {
                        return _this.$message.error(res.data.msg);
                    }

                    callback(res.data.data);

                })

            },
            initWorldIdStr: function () {
                var _this = this;
                this.$http.get(
                    '/sys/idWorld/getIdStr'
                ).then(function (res) {
                    if (res.data.code == 0) {
                        var worldId = res.data.data;
                        console.log("worldId:", worldId);
                        _this.worldId = worldId;
                    }
                })

            },

            // 结束上传公共事件
            /**
             * 富文本
             * @param ue
             */
            richTextReady: function (ue, extraParam) {
                //var extraParam={tableName:'biz_sci_open_activity_join',typeCode:'richText',tableId:self.submitForm.id};
                ue.execCommand('serverparam', extraParam);
            }
        }
    }


})();
