
$.fn.ready( function(){
	
		//话题内容展开全文
	$(".body").on("click",".articleOpenAll",function(){
			//$(".articleContent").css("overflow","auto");
			$(".articleContent").removeClass("maxLenths");
			$(".articleOpenAll").css("display","none");
			$(".articleUpDisNone").css("background","0");
			$(".articleUpDisNone").css("display","block");
			
		});
		//话题内容收起
		$(".articleUpDisNone").click(function(){
			$(".articleContent").addClass("maxLenths");
			$(".articleUpDisNone").css("display","none");
			$(".articleOpenAll").css("display","block");
		});
		
		//某条评论的内容 展开全文
		$(".body").on("click",".openAll",function(){
			$(this).closest('.praiseTopicBox').find(".myTalk").css("display","block");
			$(this).css("display","none");
			$(this).siblings(".upDisNone").css("display","block");
		});
		//某条评论的内容 收起
		$(".body").on("click",".upDisNone",function(){
			$(this).closest('.praiseTopicBox').find(".myTalk").css("display","-webkit-box");
			$(this).css("display","none");
			$(this).siblings(".openAll").css("display","block");
		});
		//某条评论的回复 内容 查看
		$(".body").on("click",".lookReplyDetail",function(){
			//跳转回复列表
			var parentId = $(this).parent().parent().siblings(".praiseTime").find("#contentId").val();
			window.location.href=getBasePath()+"/frontpage/subjectContentDetail/toContentDetail?id="+parentId;
		});
		
		//某条评论的回复 内容  收起
		$(".body").on("click",".closeReplyDetail",function(){
			$(this).siblings('div').addClass("replyContent");
			$(this).siblings('div').css("display","none");
			$(this).css("display","none");
			$(this).siblings(".lookReplyDetail").css("display","block");
		});
		
		
		//投支持票
		$(".body").on("click",".voteYesSpan",function(){
			//1、判断是否已投支持票
			if($(".voteYesSpan").hasClass("voteYes")){
				return;
			}
			//2、去投票
			if(toVote($("#topicId").val(),'1')){
				//3、获取页面 投票数据
				var yesNum = $(".yesData").text();
				var noNum = $(".noData").text();
				noNum = noNum!=''?noNum:0;
				yesNum = yesNum!=''?parseInt(yesNum)+1:0;
				//4、判断是否已投反对票,
				if($(".voteNoSpan").hasClass("voteNo")){
					noNum = noNum!=0?parseInt(noNum)-1:0;
					$(".voteNoSpan").removeClass("voteNo");
				}
				//5、重置样式
				$(this).addClass("voteYes");
				//6、重置支持反对数量
				$(".yesData").text(yesNum);
				$(".noData").text(noNum);
			}
		});
		
		//投反对票
		$(".body").on("click",".voteNoSpan",function(){
			//1、判断是否已投反对票
			if($(".voteNoSpan").hasClass("voteNo")){
				return;
			}
			//2、去投票
			if(toVote($("#topicId").val(),'0')){
				//3、获取页面 投票数据
				var yesNum = $(".yesData").text();
				var noNum = $(".noData").text();
				noNum = noNum!=''?parseInt(noNum)+1:0;
				yesNum = yesNum!=''?yesNum:0;
				//4、判断是否已投支持票 
				if($(".voteYesSpan").hasClass("voteYes")){
					yesNum = yesNum!=0?parseInt(yesNum)-1:0;
					$(".voteYesSpan").removeClass("voteYes");
				}
				//5、重置样式
				$(this).addClass("voteNo");
				//6、重置支持反对数量
				$(".yesData").text(yesNum);
				$(".noData").text(noNum);
			}
		});
		
		//对某条评论进行点赞
		$(".body").on("click",".thumbsYesSpan",function(){
			//1、判断是否已点赞,已点赞直接返回
			if($(this).hasClass("sendPraise")){
				return;
			}
			//2、去点赞
			if(toThumbs($("#topicId").val(),$(this).parent().siblings("#contentId").val(),$("#topicName").val(),'1')){
				//3、获取页面 点赞数据
				var yesNum = $(this).text();
				var noNum = $(this).siblings(".thumbsNoSpan").text();
				yesNum = yesNum!=''?parseInt(yesNum)+1:0;
				noNum = noNum!=''?noNum:0;
				//4、判断是否已踩
				if($(this).siblings(".thumbsNoSpan").hasClass("sendStamp")){
					noNum = noNum!=0?parseInt(noNum)-1:0;
					$(this).siblings(".thumbsNoSpan").removeClass("sendStamp");
				}
				//5、重置样式
				$(this).addClass("sendPraise");
				//6、重置点赞数量
				$(this).text(yesNum);
				$(this).siblings(".thumbsNoSpan").text(noNum);
			}
		});
		
		//对某条评论进行踩
		$(".body").on("click",".thumbsNoSpan",function(){
			//1、判断是否已点踩,已踩直接返回
			if($(this).hasClass("sendStamp")){
				return;
			}
			//2、去点踩
			if(toThumbs($("#topicId").val(),$(this).parent().siblings("#contentId").val(),$("#topicName").val(),'0')){
				//3、获取页面 点赞、踩数据
				var yesNum = $(this).siblings(".thumbsYesSpan").text();
				var noNum = $(this).text();
				yesNum = yesNum!=''?yesNum:0;
				noNum = noNum!=''?parseInt(noNum)+1:0;
				//4、判断是否已点赞
				if($(this).siblings(".thumbsYesSpan").hasClass("sendPraise")){
					yesNum = yesNum!=0?parseInt(yesNum)-1:0;
					$(this).siblings(".thumbsYesSpan").removeClass("sendPraise");
				}
				//5、重置样式
				$(this).addClass("sendStamp");
				//6、重置点赞数量
				$(this).siblings(".thumbsYesSpan").text(yesNum);
				$(this).text(noNum);
			}
		});

		//对评论进行回复  打开评论弹窗
		$(".body").on("click",".toReplys",function(){
			var contentId  = $(this).closest('li').siblings("#contentId").val();
			var bom  = $(this).parent().parent().siblings(".reply").find(".replyLists").find("div").attr("id")
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
		
		//取消回复   已弃用
		$(".windowClose").click(function(){
			$("#toReplyContentId").val("");
			$("#replyContentDom").val("");
			$("#reContent").val("");
			$(".modal-comfirm").css("display","none");
		});
		//提交回复  已弃用
		$(".windowBtn").click(function(){
			var topicId = $("#topicId").val();
			var toReplyContentId=$("#toReplyContentId").val();
			var contents=$("#reContent").val();
			if(contents==null || contents==''){
				alert("内容不能为空");
				return;
			}
			$(".modal-comfirm").css("display","none");
			var b = submitContent(topicId,toReplyContentId,contents);
			if(b){
				getSonContentJson(toReplyContentId,$("#replyContentDom").val());
				$("#toReplyContentId").val("");
				$("#replyContentDom").val("");
				$("#reContent").val("");
				
			}
			
		});
		
		//选择全部评论
		$(".body").on("click","#all",function(){
			//1、异步重新读取内容
			//2、重置页码和总页数
			$(this).addClass("selectOne");
			$("#jingxuan").removeClass("selectOne");
			$("#contentCount").css("float","left");
			getContentJson('');
		});
		//选择精选评论
		$(".body").on("click","#jingxuan",function(){
			//1、异步重新读取内容
			//2、重置页码和总页数
			$(this).addClass("selectOne");
			$("#all").removeClass("selectOne");
			$("#contentCount").css("float","right");
			getContentJson('1');
		});
		
		//获取话题评论总数
		getTopicContentCount($("#topicId").val(),"");
		
		//获取我是否已投票的记录,修改投票样式
		getMyVote($("#topicId").val());
		
		//点击 话题详情底部 发表评论按钮，弹窗评论框，
		$(".discussInput").click(function(){
			//设置 评论类型，1对话题评论，2对评论回复
			$("#contentTypes").val(1)
			//显示评论框
			$("#sendBottomBox").css("display","block");
			//对话题的评论 可以发布图片
			$(".commentBottomMenu").css("display","block");
			//获取焦点
			$("#commentInput").focus();
			//window.location.href=getBasePath()+"/frontpage/subjectTopicPublicContent/toContentPublic?topicId="+$("#topicId").val();
		});
		
		
});

//取消评论
function canelContent(){
	$("#sendBottomBox").css("display","none");
	$("#commentInput").val("");
	$(".huifuImages").html("");
	
}
//异步获取话题总评论数
function getTopicContentCount(topicId,toTop){
	 $.ajax({
			url : getBasePath()+'/frontpage/subjectTopicDetail/getTopicCount',
			data : {
				"topicId":topicId,"toTop":toTop
			},
			method : 'post',
			dataType : 'json',
			timeout:5000,
			async:false,
			success : function(data) {
				if (data!=null && data.status=='success') {
					$("#contentCount").text(data.messageNum);
				}
			},
			error : function() {
				
			}
		});
}
//根据话题 获取我的投票记录
function getMyVote(topicId){
	 $.ajax({
			url : getBasePath()+'/frontpage/subjectTopicDetail/getMyVote',
			data : {
				"topicId":topicId,
			},
			method : 'post',
			dataType : 'json',
			timeout:5000,
			async:false,
			success : function(data) {
				if (data!=null && data.status=='success') {
					if(data.record!=null){
						if(data.record.status=='0'){
							$(".voteNoSpan").addClass("voteNo");
						}
						if(data.record.status=='1'){
							$(".voteYesSpan").addClass("voteYes");
						}
					}
				}
			},
			error : function() {
				
			}
		});
}



//去投票
function toVote(topicId,voteStatus){
	var flag = false;
	 $.ajax({
			url : getBasePath()+'/frontpage/subjectTopicDetail/toVote',
			data : {
				"id":topicId,"voteStatus":voteStatus
			},
			method : 'post',
			dataType : 'json',
			timeout:5000,
			async:false,
			success : function(data) {
				if (data!=null && data.status=='success') {
					flag = true;
				}
			},
			error : function() {
				
			}
		});
	 return flag;
}


//去点赞或者踩
function toThumbs(topicId,contentId,topicName,thumbStatus){
	var flag = false;
	 $.ajax({
			url : getBasePath()+'/frontpage/subjectTopicDetail/toThumbs',
			data : {
				"id":contentId,"topicId":topicId,"thumbStatus":thumbStatus,"topicName":topicName
			},
			method : 'post',
			dataType : 'json',
			timeout:5000,
			async:false,
			success : function(data) {
				if (data!=null && data.status=='success') {
					flag = true;
				}
			},
			error : function() {
				
			}
		});
	 return flag;
}


//提交回复
function submitContents(topicId,parentId,contents){
	var flag = false;
	contents = utf16toEntities(contents);
	$.ajax({
		url : getBasePath()+'/frontpage/subjectTopicDetail/toContent',
		data : {
			"topicId":topicId,"contents":contents,"parentId":parentId
		},
		method : 'post',
		dataType : 'json',
		timeout:5000,
		async:false,
		success : function(data) {
			if (data!=null && data.status=='success') {
				alert("发表回复成功");
				flag = true;
			}
		},
		error : function() {
			
		}
	});
	 return flag;
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
				$("#"+obj).parent().parent().css("display","block");
				//$("#"+obj).removeClass("replyContent").css("display","block");
				//$("#"+obj).siblings(".lookReplyDetail").css("display","none");
				$("#"+obj).siblings(".lookReplyDetail").html("查看"+counts+"回复>")
				//$("#"+obj).siblings(".closeReplyDetail").css("display","block");
			}
		},
		error : function() {
			
		}
	});
}

//获取评论 toTop ==1精选，toTop="" 全部
function getContentJson(toTop){
	$.ajax({
		url: getBasePath()+'/frontpage/subjectTopicDetail/getTopticContentListJson',
		type: "POST",
		data:{"pageNo":1,"topicId":$("#topicId").val(),"toTop":toTop},
		dataType: "json", 
		async:false,
		timeout:5000,
		success: function(data){
			var resultStr = '';
			var totalPage = 0;
			if(data!=null && data.list!=null){
				$.each(data.list, function(i, n){
					resultStr = getResultString(resultStr,n);
				});
				totalPage = data.totalPage;
			}
			$('#pageNo').val(1);
			$('#totalPage').val(totalPage);
			$('.allContent').css("display","none");
			$('.haveDiscuss .getPraise').html(resultStr);
			window.canLoad = true;
			//获取评论总数
			getTopicContentCount($("#topicId").val(),toTop);
		},
		error:function(data){
		
		}
	});
}
