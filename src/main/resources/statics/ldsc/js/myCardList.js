
$.fn.ready( function(){
		//1、//异步获取我的所有优惠券列表
		getMyCardList('2');
		$(".tabItem").click(function(){
			var shippingStatus = $(this).attr("id");
			$(this).siblings(".tabItem").removeClass("onOrderState").find("i").remove();;
			$(this).addClass("onOrderState").prepend("<i></i>") ;
			getMyCardList(shippingStatus);
		});
});

//异步获取我的所有优惠券列表
function getMyCardList(type){
	var resultString = '';
	 $.ajax({
			url : getBasePath()+'/frontpage/beanCoupon/queryCouponsList',
			data : {
				"type":type
			},
			method : 'post',
			dataType : 'json',
			timeout:5000,
			success : function(data) {
				if (data!=null) {
					$.each(data, function(i, n){
						var status = n.stat;//使用状态
						var bgCard = "bgCard1";//背景
						var statusText = "";
						if(status=='0'){
							statusText='未使用';
						}else if(status=="1"){
							statusText='已使用';
							bgCard = "bgCard2";
						}
						resultString+='<div class="cardUnit">';
							resultString+='<div class="cardName '+bgCard+'">'+n.name+'</div>';
							resultString+='<p class="cardCont">'+n.value+'乐豆</p>';
							resultString+='<div class="otherInfos">';
								resultString+='<p>'+statusText+'</p>';
								resultString+='<p>有效期：'+n.vali+'</p>';
							resultString+='</div>';
						resultString+='</div>';
					});
					$(".p100").html(resultString);
				}
			},
			error : function() {
				
			}
		});
}
 