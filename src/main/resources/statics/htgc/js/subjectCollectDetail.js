
$.fn.ready( function(){
	
	$(".body").on("click",".openAll",function(){
		$(".myTalk").css("display","block");
		$(this).siblings(".upDisNone").css("display","block");
		$(".myTalk").removeClass("maxHeights");
		
		$(this).css("display","none");
	});
	//关闭详情
	$(".body").on("click",".upDisNone",function(){
		$(".myTalk").addClass("maxHeights");
		$(".myTalk").css("display","-webkit-box");
		$(this).css("display","none");
		$(this).siblings(".openAll").css("display","block");
	});
	
});





