$.fn.ready( function(){
    //获取第一页数据
    getRankList($("#ranktype").val(),1);
    //切换榜单
    $("#weeks").click(function(){
        $(this).addClass("onTabDispaly");
        $("#moths").removeClass("onTabDispaly");
        getRankList("weeks",1);
    });
    $("#moths").click(function(){
        $(this).addClass("onTabDispaly");
        $("#weeks").removeClass("onTabDispaly");
         getRankList("moths",1);
    });
});
//获取第一页数据
function getRankList(ranktype,pageNo){
        $.ajax({
            url: getBasePath()+'/frontpage/subjectRank/findScoreRankForListJson',
            type: "POST",
            data:{"ranktype":ranktype,"pageNo":pageNo},
            dataType: "json",
            async:false,
            success: function(data){
                var htmlStr = '';
                if(data!=null && data.list!=null){
                    if(pageNo==1){
                        $("#pageNo").val(1);
                        $("#ranktype").val(ranktype);
                        $("#totalPage").val(data.totalPage);
                    }
                    htmlStr = getResultStr(data.list,htmlStr,"");
                }
                $(".rankList").html(htmlStr);
            }
       });
}
//封装dom
function getResultStr(list,htmlStr,pretotal){
    $.each(list, function(i, n){
        htmlStr += '<li>';
        htmlStr += '	<span>';
        if(pretotal==""){
            htmlStr += i+1;
        }else{
          htmlStr += pretotal+i+1;
        }
        htmlStr += '	</span>';
        htmlStr += '	<div class="float_l rankUser">';
        htmlStr += '		<img class="userHeadImg" src="'+n.headimgurl+'" alt="" />'
        htmlStr += '	    <span>'+n.nickName+'</span>'
        htmlStr += '    </div>'
        htmlStr += '	<span>贡献值'+n.score+'</span>'
        htmlStr += '</li>'
    });
    return htmlStr;
}