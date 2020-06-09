
$.fn.ready( function(){
		//1、//异步获取我的所有优惠券列表
		getMyCardList('2');
		$(".tabItem").click(function(){
			var status = $(this).attr("id");
			$(this).siblings(".tabItem").removeClass("onOrderState").find("i").remove();;
			$(this).addClass("onOrderState").prepend("<i></i>") ;
			getMyCardList(status);
		});
});



//异步获取我的所有优惠券列表
function getMyCardList(status){
	var resultString = '';
	 $.ajax({
			url : getBasePath()+'/frontpage/myCard/queryCouponsList',
			data : {
				"status":status
			},
			method : 'post',
			dataType : 'json',
			timeout:5000,
			success : function(data) {
				if (data!=null && data.status=='success' && data.list!=null) {
					$.each(data.list, function(i, n){
						var stat = n.status;//使用状态
						var bgCard = "bgCard1";//背景
						var statusText = "";
						if(stat=='0'){
							statusText='未使用';
						}else if(stat=="1"){
							statusText='已使用';
							bgCard = "bgCard2";
						}else if(stat=="2"){
                            statusText='已过期';
                            bgCard = "bgCard2";
                        }
						resultString+='<div class="cardUnit">';
							resultString+='<div class="cardName '+bgCard+'">'+n.discountName+'</div>';
							// resultString+='<p class="cardCont">'+n.value+'乐豆</p>';
							resultString+='<p class="cardCont">'+n.discount+'折</p>';
							resultString+='<div class="otherInfos">';
								resultString+='<p>'+statusText+'</p>';
								resultString+='<p>有效期：'+getDateTime(n.validTime,'yyyy-MM-dd HH:mm:ss')+'</p>';
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
 