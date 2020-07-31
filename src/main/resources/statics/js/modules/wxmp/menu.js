$(function () {

});

var vm = new Vue({
    el:'#icloudapp',
    data:{
        menuItemList:[],//微信菜单
    },
    methods: {
        //获取我的龙币
        getMylongcoin: function () {
            $.get(fontbaseURL + "/frontpage/bsactivity/user/userInfo", function(r){
                console.log("r=="+JSON.stringify(r));
                if(r.code==0){
                    vm.dcurrency = r.dcurrency;//我的龙币余额
                }else{

                }

            })
        },
        //获取公众号菜单
        getMenuItemList: function () {
            vm.menuIdList = [];

        },
    }
});
vm.getMenuItemList();