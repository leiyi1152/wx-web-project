$(function () {

    $("#jqGrid").jqGrid({
        url: baseURL + 'retail/retailconfirn/list',
        datatype: "json",
        colModel: [			
			{ label: 'id', name: 'id', index: 'id', width: 50, key: true },
			{ label: '用户账号', name: 'userName', index: 'user_name', width: 80 },
			{ label: '加密密码', name: 'passwd', index: 'passwd', width: 80 },
			{ label: '密码明文', name: 'liences', index: 'liences', width: 80 },
			// { label: '', name: 'shopName', index: 'shop_name', width: 80 },
			// { label: '', name: 'phone', index: 'phone', width: 80 },
			{ label: 'openid', name: 'openid', index: 'openid', width: 80 },
			{ label: '创建时间', name: 'createTime', index: 'create_time', width: 80 },
			{ label: '修改时间', name: 'modifyTime', index: 'modify_time', width: 80 }
			/*{ label: '最近登录时间', name: 'lastLoginTime', index: 'last_login_time', width: 80 },*/
			/*{ label: '最近登录ip', name: 'lastLoginIp', index: 'last_login_ip', width: 80 }*/
        ],
		viewrecords: true,
        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
        	//隐藏grid底部滚动条
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        }
    });


    new AjaxUpload('#upload', {
        action: baseURL + "local/localUplaod/upload",
        name: 'file',
        autoSubmit:true,
        responseType:"json",
        onSubmit:function(file, extension){
            if (!(extension && /^(xlsx|xls)$/.test(extension.toLowerCase()))){
                alert('只支持xlsx、xls格式的图片！');
                return false;
            }
        },
        onComplete : function(file, r){
            console.log("r=="+JSON.stringify(r));
            console.log("file=="+file);
            if(r.code == 0){
                alert("上传成功!");
                vm.userurl = r.url;
            }else{
                alert(r.msg);
            }
        }
    });
});


var vm = new Vue({
	el:'#icloudapp',
	data:{
        q:{
            userName: '',
        },
        userurl:'',//用户账号文件
		showList: true,
        showUserurl: false,//是否显示导入按钮
		title: null,
		tRetailConfirn: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
            vm.showUserurl = false;
			vm.title = "新增";
			vm.tRetailConfirn = {};
		},
        addimpot:function(){
            vm.showList = false;
            vm.showUserurl = true;
            vm.title = "导入";
            vm.tRetailConfirn = {};
        },
		update: function (event) {
			var id = getSelectedRow();
			if(id == null){
				return ;
			}
            vm.showUserurl = false;
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(id)
		},
		saveOrUpdate: function (event) {
		    $('#btnSaveOrUpdate').button('loading').delay(1000).queue(function() {
                var url = vm.tRetailConfirn.id == null ? "retail/retailconfirn/save" : "retail/retailconfirn/update";
                $.ajax({
                    type: "POST",
                    url: baseURL + url,
                    contentType: "application/json",
                    data: JSON.stringify(vm.tRetailConfirn),
                    success: function(r){
                        if(r.code === 0){
                             layer.msg("操作成功", {icon: 1});
                             vm.reload();
                             $('#btnSaveOrUpdate').button('reset');
                             $('#btnSaveOrUpdate').dequeue();
                        }else{
                            layer.alert(r.msg);
                            $('#btnSaveOrUpdate').button('reset');
                            $('#btnSaveOrUpdate').dequeue();
                        }
                    }
                });
			});
		},
        //导入
        btnInpomt: function (event) {
            $('#btnInpomt').button('loading').delay(1000).queue(function() {
                var viurl = "retail/retailconfirn/importusers?url="+vm.userurl;
                $.ajax({
                    type: "get",
                    url: baseURL + viurl,
                    contentType: "application/json",
                    // data: {url:vm.userurl},
                    success: function(r){
                        if(r.code === 0){
                            layer.msg("操作成功", {icon: 1});
                            vm.reload();
                            $('#btnInpomt').button('reset');
                            $('#btnInpomt').dequeue();
                        }else{
                            layer.alert(r.msg);
                            $('#btnInpomt').button('reset');
                            $('#btnInpomt').dequeue();
                        }
                    }
                });
            });
        },
		del: function (event) {
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			var lock = false;
            layer.confirm('确定要删除选中的记录？', {
                btn: ['确定','取消'] //按钮
            }, function(){
               if(!lock) {
                    lock = true;
		            $.ajax({
                        type: "POST",
                        url: baseURL + "retail/retailconfirn/delete",
                        contentType: "application/json",
                        data: JSON.stringify(ids),
                        success: function(r){
                            if(r.code == 0){
                                layer.msg("操作成功", {icon: 1});
                                $("#jqGrid").trigger("reloadGrid");
                            }else{
                                layer.alert(r.msg);
                            }
                        }
				    });
			    }
             }, function(){
             });
		},
		getInfo: function(id){
			$.get(baseURL + "retail/retailconfirn/info/"+id, function(r){
                vm.tRetailConfirn = r.tRetailConfirn;
            });
		},
		reload: function (event) {
			vm.showList = true;
            vm.showUserurl = false;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
                postData:vm.q,
                page: 1
                // page:page
            }).trigger("reloadGrid");
		}
	}
});