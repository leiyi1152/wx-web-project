
$.fn.ready( function(){
		//1、点击tab 异步获取话题列表 或者征集列表,如果是名人堂，则跳转其他页面
		//默认获取话题  类型（0话题，1征集）
		getTopicAndCollectionList('0',1);
		$(".indexTabItem").click(function(){
			var topicType = $(this).attr("id");
			//topicType=2 跳转名人堂
			if(topicType=="2"){
				window.location.href=getBasePath()+'/frontpage/subjectRank/ranks';
				return;
			}
			$(this).siblings(".indexTabItem").removeClass("onTabDispaly");
			$(this).addClass("onTabDispaly");
			getTopicAndCollectionList(topicType,1);
		});
		//提示获奖
		showPrize();
		//关闭获奖提示框
		$(".windowClose").click(function(){
			$(".modal-comfirm").css("display","none");
		});
});

//异步获取话题或者征集列表
function getTopicAndCollectionList(topicType,pageNo){
	var resultString = '';
	 $.ajax({
			url : getBasePath()+'/frontpage/subjectIndex/getTopicAndCollectionListJson',
			data : {
				"topicType":topicType,"pageNo":pageNo
			},
			method : 'post',
			dataType : 'json',
			timeout:5000,
			success : function(data) {
				if (data!=null) {
					if(topicType=='0' && data.list!=null){
						//如果是第一页，重置总页数
						if(pageNo==1){
							$("#pageNo").val(1);
							$("#totalPage").val(data.totalPage);
							$("#topicType").val('0');
						}
						resultString = getTopicListStrig(data.list,resultString);
					
					}else if(topicType=='1' && data.list!=null){
						resultString = getCollectListStrig(data.list,resultString);
					}
					if(pageNo==1){
						$("#pageNo").val(1);
						$("#totalPage").val(data.totalPage);
						$("#topicType").val('1');
					}
					$(".indexTabList").html(resultString);
				}
			},
			error : function() {
				
			}
		});
}

function getTopicListStrig(list,resultString){
	$.each(list, function(i, n){
		//话题
			resultString+='<li>';
			resultString+='<a href="'+getBasePath()+'/frontpage/subjectTopicDetail/topicDetail?id='+n.id+'">';
			resultString+='<dl class="listBox">';
			var periods = n.periods;
			if(periods<10){
				periods='0'+periods;
			}
			resultString+='<dt class="iconTopic"><span class="qishu">'+periods+'期</span><img src="'+getImgsBasePath()+"/"+n.topicUrl+'"/></dt>';
				resultString+='<dd class="titleTopicPrint">';
					resultString+='<p>'+n.topicName+'</p>';
					resultString+='<div class="dataView">';
						resultString+='<span style="margin-right: 30px;">正方：<i>'+n.agreeCount+'</i></span>';
						resultString+='<span>反方：<i>'+n.disagreeCount+'</i></span>';
					resultString+='</div>';
					resultString+='<span style="margin-top: 5px;">'+getDate(n.startTime)+'~'+getDate(n.endTime)+'</span>';
				resultString+='</dd>';
			resultString+='</dl>';
			resultString+='</a>';
			resultString+='</li>';
	});
	return resultString;
}

function getCollectListStrig(list,resultString){
	$.each(list, function(i, n){
		//征集
			resultString+='<li>';
			resultString+='<a href="'+getBasePath()+'/frontpage/subjectCollectDetail/collectDetail?id='+n.id+'">';
			resultString+='<dl class="listBox">';
			var periods = n.periods;
			if(periods<10){
				periods='0'+periods;
			}
			resultString+='<dt class="iconCollect"><span class="qishu">'+periods+'期</span><img src="'+getImgsBasePath()+n.topicUrl+'"/></dt>';
				resultString+='<dd class="titleTopicPrint">';
					resultString+='<p>'+n.topicName+'</p>';
					resultString+='<div class="dataView">';
					resultString+='</div>';
					resultString+='<span style="margin-top: 5px;">'+getDate(n.startTime)+'~'+getDate(n.endTime)+'</span>';
				resultString+='</dd>';
			resultString+='</dl>';
			resultString+='</a>';
			resultString+='</li>';
	});
	return resultString;
}

//提示获奖
function showPrize(){
	 $.ajax({
			url : getBasePath()+'/frontpage/subjectIndex/showPrize',
			method : 'post',
			dataType : 'json',
			timeout:5000,
			success : function(data) {
				if (data!=null && data.status=='success') {
					$(".modal-comfirm").find("p").text(data.showMessage);
					$("#contentSuccess").css("display","block");
					//openAlert("恭喜您获得奖励，请在我的获奖记录查看!");
				}
			},
			error : function() {
				
			}
		});
}
 