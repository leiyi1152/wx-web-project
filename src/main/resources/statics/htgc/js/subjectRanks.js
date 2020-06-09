
$.fn.ready( function(){
	//获取排行榜前三
	getWeeksPreveThreeRanks();
	getMothsPreveThreeRanks();

	$("#weeks").click(function(){
        $(this).addClass("onTabDispaly");
        $("#moths").removeClass("onTabDispaly");
        $(".weeks").css("display","block");
        $(".moths").css("display","none");
	});
	$("#moths").click(function(){
        $(this).addClass("onTabDispaly");
        $("#weeks").removeClass("onTabDispaly");
        $(".weeks").css("display","none");
        $(".moths").css("display","block");
    });
	
});


//获取周排行榜前三
function getWeeksPreveThreeRanks(){

	$.ajax({
		url : getBasePath()+'/frontpage/subjectRank/getPreveThreeRanks',
		data : {
            weeks:0
		},
		method : 'post',
		dataType : 'json',
		timeout:5000,
		async:false,
		success : function(data) {
			if (data!=null) {
				//铁杆粉
				var findSendContentRankListStr ="";
				if(data.scoreRankList!=null && data.scoreRankList.length>0){
					$.each(data.scoreRankList,function(i,n){
						findSendContentRankListStr+='<li>';
						findSendContentRankListStr+='<span></span>';
						findSendContentRankListStr+='<div class="float_l rankUser">';
						findSendContentRankListStr+='<img class="userHeadImg" src="'+n.headimgurl+'" alt="" />';
						findSendContentRankListStr+='<span>'+n.nickName+'</span>';
						findSendContentRankListStr+='</div>';
						findSendContentRankListStr+='<span>贡献值'+n.score+'</span>';
						findSendContentRankListStr+='</li>';
					});
					$(".weeks").find(".findScoreRankForList").html(findSendContentRankListStr);
				}
				//话题王
				var findReceivedContentRankListStr ="";
				if(data.receivedContentCountRanksList!=null && data.receivedContentCountRanksList.length>0){
					$.each(data.receivedContentCountRanksList,function(i,n){
						findReceivedContentRankListStr+='<li>';
						findReceivedContentRankListStr+='<span></span>';
						findReceivedContentRankListStr+='<div class="float_l rankUser">';
						findReceivedContentRankListStr+='<img class="userHeadImg" src="'+n.headimgurl+'" alt="" />';
						findReceivedContentRankListStr+='<span>'+n.nickName+'</span>';
						findReceivedContentRankListStr+='</div>';
						findReceivedContentRankListStr+='<span>获得回复'+n.receivedContentCount+'</span>';
						findReceivedContentRankListStr+='</li>';
					});
					$(".weeks").find(".findReceivedContentRankList").html(findReceivedContentRankListStr);
				}
				//达人榜
				var receivThumbsRanksListStr ="";
				if(data.receivThumbsRanksList!=null && data.receivThumbsRanksList.length>0){
					$.each(data.receivThumbsRanksList,function(i,n){
						receivThumbsRanksListStr+='<li>';
						receivThumbsRanksListStr+='<span></span>';
						receivThumbsRanksListStr+='<div class="float_l rankUser">';
						receivThumbsRanksListStr+='<img class="userHeadImg" src="'+n.headimgurl+'" alt="" />';
						receivThumbsRanksListStr+='<span>'+n.nickName+'</span>';
						receivThumbsRanksListStr+='</div>';
						receivThumbsRanksListStr+='<span>获得赞'+n.receivedThumbsCount+'</span>';
						receivThumbsRanksListStr+='</li>';
					});
					$(".weeks").find(".receivThumbsRanksList").html(receivThumbsRanksListStr);
				}
			}
		},
		error : function() {
			
		}
	});
}


//获取月排行榜前三
function getMothsPreveThreeRanks(){

	$.ajax({
		url : getBasePath()+'/frontpage/subjectRank/getPreveThreeRanks',
		data : {
            moths:0
		},
		method : 'post',
		dataType : 'json',
		timeout:5000,
		async:false,
		success : function(data) {
			if (data!=null) {
				//铁杆粉
				var findSendContentRankListStr ="";
				if(data.scoreRankList!=null && data.scoreRankList.length>0){
					$.each(data.scoreRankList,function(i,n){
						findSendContentRankListStr+='<li>';
						findSendContentRankListStr+='<span></span>';
						findSendContentRankListStr+='<div class="float_l rankUser">';
						findSendContentRankListStr+='<img class="userHeadImg" src="'+n.headimgurl+'" alt="" />';
						findSendContentRankListStr+='<span>'+n.nickName+'</span>';
						findSendContentRankListStr+='</div>';
						findSendContentRankListStr+='<span>贡献值'+n.score+'</span>';
						findSendContentRankListStr+='</li>';
					});
					$(".moths").find(".findScoreRankForList").html(findSendContentRankListStr);
				}
				//话题王
				var findReceivedContentRankListStr ="";
				if(data.receivedContentCountRanksList!=null && data.receivedContentCountRanksList.length>0){
					$.each(data.receivedContentCountRanksList,function(i,n){
						findReceivedContentRankListStr+='<li>';
						findReceivedContentRankListStr+='<span></span>';
						findReceivedContentRankListStr+='<div class="float_l rankUser">';
						findReceivedContentRankListStr+='<img class="userHeadImg" src="'+n.headimgurl+'" alt="" />';
						findReceivedContentRankListStr+='<span>'+n.nickName+'</span>';
						findReceivedContentRankListStr+='</div>';
						findReceivedContentRankListStr+='<span>获得回复'+n.receivedContentCount+'</span>';
						findReceivedContentRankListStr+='</li>';
					});
					$(".moths").find(".findReceivedContentRankList").html(findReceivedContentRankListStr);
				}
				//达人榜
				var receivThumbsRanksListStr ="";
				if(data.receivThumbsRanksList!=null && data.receivThumbsRanksList.length>0){
					$.each(data.receivThumbsRanksList,function(i,n){
						receivThumbsRanksListStr+='<li>';
						receivThumbsRanksListStr+='<span></span>';
						receivThumbsRanksListStr+='<div class="float_l rankUser">';
						receivThumbsRanksListStr+='<img class="userHeadImg" src="'+n.headimgurl+'" alt="" />';
						receivThumbsRanksListStr+='<span>'+n.nickName+'</span>';
						receivThumbsRanksListStr+='</div>';
						receivThumbsRanksListStr+='<span>获得赞'+n.receivedThumbsCount+'</span>';
						receivThumbsRanksListStr+='</li>';
					});
					$(".moths").find(".receivThumbsRanksList").html(receivThumbsRanksListStr);
				}
			}
		},
		error : function() {

		}
	});
}






