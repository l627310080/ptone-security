(function () {
    var vm = window.vm = new Vue({
        el: '.aui-wrapper',
        i18n: window.SITE_CONFIG.i18n,
        mixins: [window.SITE_CONFIG.mixinViewModule],
        data: function () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: '/sys/role/page',
                    getDataListIsPage: true,
                    deleteURL: '/sys/role',
                    deleteIsBatch: true
                },
                dataForm: {
                    name: '',
                    menuId:'',
                    menuName:''
                },
                firstLeveLmenuList:[],
                menuListVisible:false
            }
        },
        components: {
            'add-or-update': fnAddOrUpdateComponent()
        },
        beforeCreate: function () {
            vm = this;


        },
        created: function(){

            vm.getFirstLevelMenuList();

        },
        methods: {
            // 获取菜单列表
            getFirstLevelMenuList: function () {
                return vm.$http.get('/sys/menu/getListPid?pid=0').then(function (res) {
                    if (res.data.code !== 0) {
                        return vm.$message.error(res.data.msg);
                    }
                    vm.firstLeveLmenuList = res.data.data;
                }).catch(function () {});
            },
            // 所属部门树, 选中
            currentTreeCurrentChangeHandle: function (data, node) {
                vm.dataForm.menuId = data.id;
                vm.dataForm.menuName = data.name;
                vm.menuListVisible = false;
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
        template: '<el-dialog :visible.sync="visible" :title="!dataForm.id ? $t(\'add\') : $t(\'update\')" :close-on-click-modal="false"\n           :close-on-press-escape="false" :fullscreen="true">\n    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"\n             label-width="120px">\n        <el-form-item prop="name" :label="$t(\'role.name\')">\n            <el-input v-model="dataForm.name" :placeholder="$t(\'role.name\')"></el-input>\n        </el-form-item>\n        <el-form-item prop="menuName" label="所属菜单">\n            <el-popover v-model="menuListVisible" ref="menuListPopover" placement="bottom-start" trigger="click">   \n                <el-tree\n                        v-model="dataForm.menuId"\n                        :data="firstLeveLmenuList"\n                        :props="{ label: \'name\', children: \'children\' }"\n                        node-key="id"\n                        ref="menuListTree"\n                        :highlight-current="true"\n                        :expand-on-click-node="false"\n                        accordion\n                        @current-change="currentTreeCurrentChangeHandle"\n                >\n                </el-tree>\n            </el-popover>\n            <el-input v-model="dataForm.menuName" v-popover:menuListPopover :readonly="true" placeholder="所属菜单"></el-input>\n        </el-form-item>\n        <el-form-item prop="remark" :label="$t(\'role.remark\')">\n            <el-input v-model="dataForm.remark" :placeholder="$t(\'role.remark\')"></el-input>\n        </el-form-item>\n        <el-form-item prop="userList" label="角色用户">\n            <main-select-user v-model="dataForm.userList"  :collapse-tags="false" >\n    \n            </main-select-user>\n        </el-form-item>\n        <el-row>\n            <el-col :span="12">\n                <el-form-item size="mini" :label="$t(\'role.menuList\')">\n                    <el-tree\n                            :data="menuList"\n                            :props="{ label: \'name\', children: \'children\' }"\n                            node-key="id"\n                            ref="menuListTree"\n                            accordion\n                            show-checkbox>\n                    </el-tree>\n                </el-form-item>\n            </el-col>\n            <el-col :span="12">\n                <el-form-item size="mini" :label="$t(\'role.deptList\')">\n                    <el-tree\n                            :data="deptList"\n                            :props="{ label: \'name\', children: \'children\' }"\n                            node-key="id"\n                            ref="deptListTree"\n                            accordion\n                            show-checkbox>\n                    </el-tree>\n                </el-form-item>\n            </el-col>\n        </el-row>\n        <el-row>\n            <el-col :span="12">\n                <el-form-item size="mini" label="栏目授权">\n                    <el-tree\n                            v-model="dataForm.columnIds"\n                            :data="columnList"\n                            show-checkbox\n                            :props="{ label: \'name\', children: \'children\' }"\n                            node-key="id"\n                            ref="columnListTree"\n                            show-checkbox\n                            accordion\n                    >\n                    </el-tree>\n                </el-form-item>\n            </el-col>\n        </el-row>\n    </el-form>\n    <template slot="footer">\n        <el-button @click="visible = false">{{ $t(\'cancel\') }}</el-button>\n        <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t(\'confirm\') }}</el-button>\n    </template>\n</el-dialog>\n    ',
        data: function () {
            return {
                visible: false,
                menuList: [],
                firstLeveLmenuList:[],
                deptList: [],
                dataForm: {
                    id: '',
                    name: '',
                    menuIdList: [],
                    deptIdList: [],
                    remark: '',
                    userList:[]
                },
                selectUserList: [],
                menuListVisible:false,
                columnList: []
            }
        },
        computed: {
            dataRule: function () {
                return {
                    name: [
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
                    self.$refs['dataForm'].resetFields();
                    self.$refs.menuListTree.setCheckedKeys([]);
                    self.$refs.deptListTree.setCheckedKeys([]);
                    self.$refs.columnListTree.setCheckedKeys([]);
                    Promise.all([
                        self.getMenuList(),
                        self.getFirstLevelMenuList(),
                        self.getDeptList(),
                        self.getroleList(),
                        self.getColumnList()
                    ]).then(function () {
                        debugger;
                        if (self.dataForm.id) {
                            self.getInfo();
                        }
                    });
                });
            },
            // 获取菜单列表
            getMenuList: function () {
                return self.$http.get('/sys/menu/select').then(function (res) {
                    if (res.data.code !== 0) {
                        return self.$message.error(res.data.msg);
                    }
                    self.menuList = res.data.data;
                }).catch(function () {});
            },
            // 获取菜单列表
            getFirstLevelMenuList: function () {
                return self.$http.get('/sys/menu/getListPid?pid=0').then(function (res) {
                    if (res.data.code !== 0) {
                        return self.$message.error(res.data.msg);
                    }
                    self.firstLeveLmenuList = res.data.data;
                }).catch(function () {});
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
            getColumnList: function () {
                return self.$http.get('/cms/bizcolumn/list').then(function (res) {
                    if (res.data.code !== 0) {
                        return self.$message.error(res.data.msg);
                    }
                    self.columnList = res.data.data;
                }).catch(function () {});
            },
            // 获取信息
            getInfo: function () {
                self.$http.get('/sys/role/' + self.dataForm.id).then(function (res) {
                    if (res.data.code !== 0) {
                        return self.$message.error(res.data.msg);
                    }
                    self.selectUserList = [];
                    if(!!res.data.data.userList){
                        res.data.data.userList.forEach(function(d){
                            d.label = d.username;
                            d.value  = d.id;
                            // self.selectUserList.push({label:d.username,value:d.id});
                        });
                    }
                    self.dataForm = _.assignIn({}, self.dataForm, res.data.data);
                    self.dataForm.menuIdList.forEach(function (item) { self.$refs.menuListTree.setChecked(item, true); });
                    self.dataForm.columnIdList.forEach(function (item) { self.$refs.columnListTree.setChecked(item, true); });
                    self.$refs.deptListTree.setCheckedKeys(self.dataForm.deptIdList);
                }).catch(function () {});
            },
            // 所属部门树, 选中
            currentTreeCurrentChangeHandle: function (data, node) {
                self.dataForm.menuId = data.id;
                self.dataForm.menuName = data.name;
                self.menuListVisible = false;
            },
            //获取有这个角色所有的人
            getroleList: function () {
                self.$http.get('/sys/user/rolePeople?roleid='+self.dataForm.id).then(function (res) {
                    if (res.data.code !== 0) {
                        return self.$message.error(res.data.msg);
                    }
                    self.dataList = res.data.data;
                }).catch(function () {});
            },
            // 所属部门树, 选中
            currentTreeCurrentChangeHandle: function (data, node) {
                self.dataForm.menuId = data.id;
                self.dataForm.menuName = data.name;
                self.menuListVisible = false;
            },
            // 表单提交
            dataFormSubmitHandle: _.debounce(function () {
                self.$refs['dataForm'].validate(function (valid) {
                    if (!valid) {
                        return false;
                    }
                    self.dataForm.menuIdList = self.$refs.menuListTree.getHalfCheckedKeys().concat(self.$refs.menuListTree.getCheckedKeys());
                    self.dataForm.columnIdList = self.$refs.columnListTree.getHalfCheckedKeys().concat(self.$refs.columnListTree.getCheckedKeys());
                    self.dataForm.deptIdList = self.$refs.deptListTree.getCheckedKeys()

                    if(!!self.dataForm.userList){
                        self.dataForm.userList.forEach(function(d){
                            d.name = d.label;
                            d.id  = d.value;
                            // self.selectUserList.push({label:d.username,value:d.id});
                        });
                    }

                    self.$http[!self.dataForm.id ? 'post' : 'put']('/sys/role', self.dataForm).then(function (res) {
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