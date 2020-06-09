
$.fn.ready( function(){
		
		//0商品详情和规格参数切换
		$("#goodsIntro").click(function(){
			$("#goodsIntro").addClass("onTabTitle");
			$("#parameter").removeClass("onTabTitle");
			
			$(".parameter").hide();
			$(".goodsIntro").show();
		});
		$("#parameter").click(function(){
			$("#parameter").addClass("onTabTitle");
			$("#goodsIntro").removeClass("onTabTitle");
			
			$(".parameter").show();
			$(".goodsIntro").hide();
		});
		
		$(".closeXX").click(function(){
			$(".modal-comfirm").hide();
		});
		
		
		
		//1、异步获取优惠券列表
		getMyCardList();
		//2、兑换时选择 优惠券
		$(".selectCard").on("click",".cardlist",function(){
			$(this).siblings(".cardlist").removeClass("selectOne");
			$(this).addClass("selectOne");
			$(this).siblings(".cardlist").find("span").removeClass("selectDot");
			$(this).find("span").addClass("selectDot");
		});
		
		//3、商品加一
		$(".add").click(function(){
			var nums = $(".nums").text();
			if(nums>=100){
				nums = 100;
			}
			$(".nums").text(nums);
		});
		//4、商品减一
		$(".minus").click(function(){
			var nums = $(".nums").text();
			if(nums<=0){
				nums = 1;
			}
			$(".nums").text(nums);
		});
		//5、切换或者新增地址
		$(".address").click(function(){
			window.location.href="";
			 window.location.href=getBasePath()+"/frontpage/orderAddress/orderAddressList?url="+encodeURIComponent(window.location.href);
		});
		//6、点击立即兑换，选择抵扣券（需要折扣券）
		$(".openCardListForm").click(function(){
			var nums = $(".nums").text();
			var goodsScore = $("#goodsScore").val();
			$(".changeLd").text("消耗乐豆数："+nums*goodsScore);
			$(".cardListForm").show();
		});
		
		//7、确认兑换（要折扣券）
		$(".cardComfirmToExchange").click(function(){
		
			var nums = $(".nums").text();
			nums = nums>100?100:nums;
			nums = nums<=0?1:nums;
			$(".nums").text(nums);
			var goodsId = $("#goodsId").val();
			//库存校验
			var b = checkGoodsStore(goodsId,nums);
			if(!b){
				$(".cardListForm").hide();
				openAlert("库存不足");
				return;
			}
			//needCard==0,不想抵扣券可以兑换；1需要抵扣券才可以兑换
			var needCard = $("#needCard").val();
			var cardCount = $("#cardCount").val();
			if(needCard==1 && cardCount==0){
				$(".cardListForm").hide();
				openAlert("你没有品吸代金券不能兑换");
				return;
			}
			//地址校验
			//var address = $(".address").text();
			var addressId = $("#addressId").val();
			if(addressId==null || addressId==''){
				$(".cardListForm").hide();
				openAlert("地址不能为空");
				return;
			}
			//去兑换
			var ticket_id = $(".selectOne").attr("id");
			var value = $(".selectOne").attr("value");
			exChangeGoods(ticket_id,value,goodsId,nums,addressId);
		});
		
		//8、打开确认兑换弹框(无需折扣券)
		$(".openBeansForm").click(function(){
			var nums = $(".nums").text();
			var goodsScore = $("#goodsScore").val();
			$(".changeLd").text("消耗乐豆数："+nums*goodsScore);
			$(".beansForm").show();
		});
		
		//9、确认兑换(无需折扣券)
		$(".beanComfirmToExchange").click(function(){
			var nums = $(".nums").text();
			nums = nums>100?100:nums;
			nums = nums<=0?1:nums;
			$(".nums").text(nums);
			var goodsId = $("#goodsId").val();
			//库存校验
			var b = checkGoodsStore(goodsId,nums);
			if(!b){
				$(".beansForm").hide();
				openAlert("库存不足");
				return;
			}
			
			//地址校验
			//var address = $(".address").text();
			var addressId = $("#addressId").val();
			if(addressId==null || addressId==''){
				$(".beansForm").hide();
				openAlert("地址不能为空");
				return;
			}
			//去兑换
			beanExChangeGoods(goodsId,nums,addressId);
		});
		
		
		//10点击确定关闭弹窗
		$(".confirmBtn").click(function(){
			$(".modal-comfirm").hide();
		});
		
		//11 获取用户默认地址
		getDefaultAddr();
});

//库存校验
function checkGoodsStore(goodsId,exChangeNum){
	var b = false;
	 $.ajax({
			url : getBasePath()+'/frontpage/beanGoods/goodsListJson',
			data : {
				"goodsId":goodsId,"exChangeNum":exChangeNum
			},
			method : 'post',
			dataType : 'json',
			timeout:5000,
			async:false,
			success : function(data) {
				if ('success' == data.status) {
					b = true;
				}
			},
			error : function() {
				
			}
		});
	 return b;
}
//校验token,防止表单重复提交
function checkPayToken(){
     var clientToken = $("#clientToken").val();//表单验证令牌
      var flag = false;
     $.ajax({
            url: getBasePath()+'/frontpage/checkToken/removeToken',
            data:{"clientToken":clientToken},
            method : 'post',
            dataType : 'json',
            timeout:5000,
            async:false,
            success : function(data) {
                 if(data!=null && data.status=="success"){
                   flag = true;
               }
            },
            error : function(data) {

            }
     });
     return flag;
}

//需要折扣券兑换 方法    调用兑换接口 String ticket_id,Integer ticketValue,Integer goodsId,Integer exChangeNum
function exChangeGoods(ticket_id,ticketValue,goodsId,exChangeNum,addressId){
	 //关闭优惠券列表
	$(".cardListForm").hide();
	//loading
	showLoading();
	//数据加载中弹窗
	var flag = checkPayToken();
     if(!flag){
        hideLoading();
        $(".successChange").text("提交失败，不能重复提交");
        $("#exchangeImg").attr('src',"http://res.thewm.cn/zlbean/ldsc/img/exchangeFail.png");
        $(".exchangeSuccessForm").show();
         setTimeout(function(){
             window.location.reload();
        }, 2000);
        return;
     }
	 $.ajax({
			url : getBasePath()+'/frontpage/beanOrder/exChangeGoods',
			data : {
				"ticket_id":ticket_id,"ticketValue":ticketValue,"goodsId":goodsId,"exChangeNum":exChangeNum,"addressId":addressId
			},
			method : 'post',
			dataType : 'json',
			timeout:5000,
			async:false,
			success : function(data) {
				hideLoading();
				if ('success' == data.status) {
					$(".successChange").text("兑换成功");
					$(".exchangeSuccessForm").show();
					setTimeout(function(){
						window.location.reload();
						}, 3000);
					return;
				}
				if(data.message=='烟豆数量为0'){
					$(".successChange").text('乐豆数量不足');
				}else{
					$(".successChange").text(data.message);
				}
				$("#exchangeImg").attr('src',"http://res.thewm.cn/zlbean/ldsc/img/exchangeFail.png"); 
				$(".exchangeSuccessForm").show();
			},
			error : function(data) {
				hideLoading();
				$(".successChange").text("兑换失败");
				$("#exchangeImg").attr('src',"http://res.thewm.cn/zlbean/ldsc/img/exchangeFail.png"); 
				$(".exchangeSuccessForm").show();
			}
		});
}

//去兑换（无需折扣券） 方法
function beanExChangeGoods(goodsId,exChangeNum,addressId){
	 //关闭确认兑换列表
	$(".beansForm").hide();
	//loading
	showLoading();

	//数据加载中弹窗
	var flag = checkPayToken();
     if(!flag){
        hideLoading();
        $(".successChange").text("提交失败，不能重复提交");
        $("#exchangeImg").attr('src',"http://res.thewm.cn/zlbean/ldsc/img/exchangeFail.png");
        $(".exchangeSuccessForm").show();
        setTimeout(function(){
                     window.location.reload();
                }, 2000);
        return;
     }

	 $.ajax({
			url : getBasePath()+'/frontpage/beanOrder/beanExChangeGoods',
			data : {
				"goodsId":goodsId,"exChangeNum":exChangeNum,"addressId":addressId
			},
			method : 'post',
			dataType : 'json',
			timeout:5000,
			async:false,
			success : function(data) {
				hideLoading();
				if ('success' == data.status) {
					$(".successChange").text("兑换成功");
					$(".exchangeSuccessForm").show();
					setTimeout(function(){
						window.location.reload();
						}, 3000);
					return;
				}
			    if(data.message.indexOf("烟豆数量为0") != -1){
					$(".successChange").text('乐豆数量不足');
				}else{
					$(".successChange").text(data.message);
				}
				$("#exchangeImg").attr('src',"http://res.thewm.cn/zlbean/ldsc/img/exchangeFail.png"); 
				$(".exchangeSuccessForm").show();
			},
			error : function() {
				hideLoading();
				$(".successChange").text("兑换失败");
				$("#exchangeImg").attr('src',"http://res.thewm.cn/zlbean/ldsc/img/exchangeFail.png"); 
				$(".exchangeSuccessForm").show();
			}
		});
}

//异步获取我的未使用优惠券列表
function getMyCardList(){
	var resultString = '';
	 $.ajax({
			url : getBasePath()+'/frontpage/beanCoupon/queryCouponsList',
			data : {
				"type":"0"
			},
			method : 'post',
			dataType : 'json',
			timeout:5000,
			success : function(data) {
				var count = 0;
				if(data==null || data.length==0){
					resultString+='<li>无代金券可用</li>';
				}else{
					resultString+='<li>可选品吸代金券</li>';
				}
				if (data!=null) {
					$.each(data, function(i, n){
						count++;
						//if(count>5){
						//	 return false;  
						//}
						if(i==0){
							resultString+='<li class="cardlist selectOne" id="'+n.ticket_id+'" value="'+n.value+'"><span class="selectDot"></span>'+n.value+'品吸代金券</li>';
						}else{
							resultString+='<li class="cardlist" id="'+n.ticket_id+'" value="'+n.value+'"><span></span>'+n.value+'品吸代金券</li>';
						}
					});
					$(".selectCard").html(resultString);
				}
				//设置优惠券数量大于0，用于页面判断是否可以兑换商品
				$("#cardCount").val(count);
			},
			error : function() {
				
			}
		});
}

//获取默认地址
function getDefaultAddr(){
	var resultStrin = '送至:';
	 $.ajax({
			url : getBasePath()+'/frontpage/user/getDefaultAddr',
			method : 'post',
			dataType : 'json',
			timeout:5000,
			success : function(data) {
				if (data!=null) {
						resultStrin+=(data.provinceName+data.cityName
						+data.countyName+data.detailAddress);
					$(".address").html(resultStrin);
					$("#addressId").val(data.id);
				}
			},
			error : function() {
				
			}
		});
}

 