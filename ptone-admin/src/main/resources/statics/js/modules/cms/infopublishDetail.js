(function () {

    var vm = window.vm = new Vue({
        el: '#detail',
        data: function () {
            return {
               /* title: '',
                showDate:'',
                columnList:[],
                publisherName:'',
                coverUrl:'',
                attachments: '',*/
               infopublish:'',
                coverUrl:'',
                columnNames:'',
                contentHtml:'',
                attachmentsHtml:''
            }
        },
        created:function(){

        },
        filters: {
            htmlfilter: function (val) {
                return val.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
            }
        },
        methods: {

            getColumnNames: function () {
                vm.$http.post('/cms/bizcolumn/getColumnNames', {"columnIds": vm.infopublish.columnIds}).then(function (res) {
                    if (!res.data.data) {
                        vm.columnNames = ''
                    }
                    vm.columnNames = res.data.data.join(",")
                }).catch(function () {
                });
            },
        }
    });

    //调用获取url参数值方法
    var id = getQueryString("id");
    vm.$http.get('/cms/bizinfopublish/' + id).then(function (res) {
            vm.infopublish = res.data.data;
            vm.contentHtml=vm.infopublish.content


            console.log( vm.infopublish.attachments.length)
            for (var i = 0; i < vm.infopublish.attachments.length; i++) {
                var attachment = vm.infopublish.attachments[i];
                if (attachment.typeCode == "infoPublishCoverPicture") {
                  vm.coverUrl= attachment.relativePath;
                }
                if (attachment.typeCode=="attechments") {
                    vm.attachmentsHtml+='<a href="'+attachment.relativePath+'">'+attachment.displayName+'</a><br>'
                    console.log(vm.attachmentsHtml)
                }
            }
        vm.getColumnNames()
           /* for (var i = 0; i < vm.images.length; i++) {
                $(".images")[0].innerHTML += '<img width="300px" height="300px" src=' + vm.images[i] + '>&nbsp;&nbsp;&nbsp;';
            }*/
    });
})();

function reload() {
    window.location.reload();
}

//获取url参数值方法
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}