
$.fn.ready( function(){
	
		//异步获取评论的子评论 第一页
	getSonContentJsonByPage($("#contentId").val(),1);
		
		//某条评论的内容 展开全文
		$(".body").on("click",".openAll",function(){
			$(this).siblings(".myTalk").css("display","block");
			$(this).css("display","none");
			$(this).siblings(".upDisNone").css("display","block");

		});
		//某条评论的内容 收起
		$(".body").on("click",".upDisNone",function(){
			$(this).siblings(".myTalk").css("display","-webkit-box");
			$(this).css("display","none");
			$(this).siblings(".openAll").css("display","block");
		});
		
		
		//某条评论的回复 内容 查看
		$(".body").on("click",".lookReplyDetail",function(){
			//跳转回复列表
			var parentId = $(this).parent().parent().parent(".praiseTopicBox").find("#contentId").val();
			window.location.href=getBasePath()+"/frontpage/subjectContentDetail/toContentDetail?id="+parentId;
		});
		
		
		//对评论进行回复  打开评论弹窗
		$(".body").on("click",".huifu",function(){
			var contentId  = $(this).closest('li').find("#contentId").val();
			var bom  = $(this).closest('li').find(".reply").find(".replyLists").find("div").attr("id")
			//评论id
			$("#toReplyContentId").val("").val(contentId);
			//回复对应评论的 div id
			$("#replyContentDom").val("").val(bom);
			//设置 评论类型，1对话题评论，2对评论回复
			$("#contentTypes").val(2)
			//打开评论框  并且 获取评论框焦点
			$("#sendBottomBox").css("display","block");
			//对话评论的回复 不 可以发布图片
			$(".commentBottomMenu").css("display","none");
			//获取焦点
			$("#commentInput").focus();
			
		});
		
		//获取评论的子评论总数
		getContentCount($("#contentId").val(),"");
		
		
		//点击 话题详情底部 发表评论按钮，弹窗评论框，
		$(".discussInput").click(function(){
			//设置 评论类型，1对话题评论，2对评论回复
			$("#contentTypes").val(1)
			//显示评论框
			$("#sendBottomBox").css("display","block");
			//对话题的评论 可以发布图片
			//$(".commentBottomMenu").css("display","block");
			//获取焦点
			$("#commentInput").focus();
		});
		
		//点击 评论下面的回复，弹窗评论框，
		$("#toContent").click(function(){
			//设置 评论类型，1对话题评论，2对评论回复
			$("#contentTypes").val(1)
			//显示评论框
			$("#sendBottomBox").css("display","block");
			//对话题的评论 可以发布图片
			//$(".commentBottomMenu").css("display","block");
			//获取焦点
			$("#commentInput").focus();
		});
		
});

//取消评论
function canelContent(){
	$("#sendBottomBox").css("display","none");
	$("#commentInput").val("");
	$(".huifuImages").html("");
}
//异步获取话题总评论数
function getContentCount(parentId){
	 $.ajax({
			url : getBasePath()+'/frontpage/subjectContentDetail/getContentCount',
			data : {
				"parentId":parentId
			},
			method : 'post',
			dataType : 'json',
			timeout:5000,
			async:false,
			success : function(data) {
				if (data!=null && data.status=='success') {
					$("#totalCount").text(data.totalCount);
				}
			},
			error : function() {
				
			}
		});
}
//获取父评论Id获取子评论（分页获取）
function getSonContentJsonByPage(parentId,pageNo){
	var flag = false;
	$.ajax({
		url : getBasePath()+'/frontpage/subjectContentDetail/getSubjectTopicContentSonListJson',
		data : {
			"parentId":parentId,"pageNo":pageNo
		},
		method : 'post',
		dataType : 'json',
		timeout:5000,
		async:false,
		success : function(data) {
			var resultStr = "";
			var counts = 0;
			if (data!=null) {
				//如果是第一页，重置总页数
				if(pageNo==1){
					$("#pageNo").val(1);
					$("#totalCount").val(data.totalCount);
					$("#totalPage").val(data.totalPage);
				}
				resultStr+=getResultString(data.list);
				$(".getPraise").html(resultStr);
			}
		},
		error : function() {
			
		}
	});
}

function getResultString(data){
	var resultStr = "";
	$.each(data, function(i, n){
			resultStr+='<li>';
				resultStr+='<div class="orderUser overflowH">';
					resultStr+='<img class="faceImg" src="'+n.headimgurl+'" alt="" />';
					resultStr+='<div class="orderUserName">';
						resultStr+='<span>'+n.nickName+'</span>';
						resultStr+='<div>';
							resultStr+='<span>'+getDateTime(n.createTime,'mm-dd hh:mm')+'</span>';
							resultStr+='<span class="huifu">回复</span>';
						resultStr+='</div>';
					resultStr+='</div>';
				resultStr+='</div>';
				//评论contents展示
				resultStr+='<div class="praiseTopicBox mLeft80">';
					
					resultStr+='<div class="words" style="margin-bottom:0px;">';
						var siblingsNickName = "";
						if(n.siblingsNickName!=null  && n.siblingsNickName!=""){
							siblingsNickName = '<span>回复</span><span style="color:blue;">@'+n.siblingsNickName+':</span>';
						}
						resultStr+='<p class="myTalk">'+siblingsNickName+'<label>'+entitiestoUtf16(n.contents)+'</label></p>';
						/*if(n.contents!=null && n.contents.length>51){
							resultStr+='<span class="openAll">展开全文<img src="'+getImgsBasePath()+'/htgc/images/open.png" alt="" /></span>';
							resultStr+='<span class="upDisNone" style="display: none;">收起全文<img src="'+getImgsBasePath()+'/htgc/images/open.png" alt="" /></span>';
						}*/
					resultStr+='</div>';
					
					/*//<!--评论的回复信息-->
					//回复信息展示						
					resultStr+='<div class="reply">';
						resultStr+='<div class="replyLists">';
							resultStr+='<div class="replyContent" style="display:block;" id="replyContent_'+n.id+'">';
							if(n.childrenList!=null && n.childrenList.length>0){
								$.each(n.childrenList, function(i, m){
									resultStr+='<p><span class="repalyName">'+m.nickName+'：</span>'+entitiestoUtf16(m.contents)+'</p>';
								});
							}
							resultStr+='</div>';	
							resultStr+='<span class="lookReplyDetail">'
								if(1<=n.sonContentCount){
									resultStr+='查看'+n.sonContentCount+'回复>';	
								}else{
									resultStr+='暂无回复';	
								}
							resultStr+='</span>';	
							resultStr+='<span class="closeReplyDetail" style="display:none;">收起回复</span>';
						resultStr+='</div>';
					resultStr+='</div>';		
					//回复信息展示end
*/					resultStr+='<input type="hidden" id="contentId" value="'+n.id+'" width="0"/>';	
				resultStr+='</div>';
			resultStr+='</li>';	
		});	
	return resultStr;
}


function getResultObjString(n){
			var resultStr = "";
			resultStr+='<li>';
				resultStr+='<div class="orderUser overflowH">';
					resultStr+='<img class="faceImg" src="'+n.headimgurl+'" alt="" />';
					resultStr+='<div class="orderUserName">';
						resultStr+='<span>'+n.nickName+'</span>';
						resultStr+='<div>';
							resultStr+='<span>'+getDateTime(n.createTime,'mm-dd hh:mm')+'</span>';
							resultStr+='<span class="huifu">回复</span>';
						resultStr+='</div>';
					resultStr+='</div>';
				resultStr+='</div>';
				//评论contents展示
				resultStr+='<div class="praiseTopicBox mLeft80">';
					
					resultStr+='<div class="words" style="margin-bottom:0px;">';
						var siblingsNickName = "";
						if(n.siblingsNickName!=null  && n.siblingsNickName!=""){
							siblingsNickName = '<span>回复</span><span style="color:blue;">@'+n.siblingsNickName+':</span>';
						}
						resultStr+='<p class="myTalk">'+siblingsNickName+'<label>'+entitiestoUtf16(n.contents)+'</label></p>';
						/*if(n.contents!=null && n.contents.length>51){
							resultStr+='<span class="openAll">展开全文<img src="'+getImgsBasePath()+'/htgc/images/open.png" alt="" /></span>';
							resultStr+='<span class="upDisNone" style="display: none;">收起全文<img src="'+getImgsBasePath()+'/htgc/images/open.png" alt="" /></span>';
						}*/
					resultStr+='</div>';
					resultStr+='<input type="hidden" id="contentId" value="'+n.id+'" width="0"/>';	
				resultStr+='</div>';
			resultStr+='</li>';	
	return resultStr;
}

//获取评论的回复（评论的子评论）
function getSonContentJson(parentId,obj){

	var flag = false;
	$.ajax({
		url : getBasePath()+'/frontpage/subjectTopicDetail/getSonContentJson',
		data : {
			"parentId":parentId
		},
		method : 'post',
		dataType : 'json',
		timeout:5000,
		async:false,
		success : function(data) {
			var resultStr = "";
			var counts = 0;
			if (data!=null) {
				counts = data.length;
				$.each(data, function(i, n){
					resultStr+='<p><span class="repalyName">'+n.nickName+'：</span>'+entitiestoUtf16(n.contents)+'</p>';
				});
				$("#"+obj).html(resultStr);
				$("#"+obj).siblings(".lookReplyDetail").html("查看"+counts+"回复>")
			}
		},
		error : function() {
			
		}
	});
}
