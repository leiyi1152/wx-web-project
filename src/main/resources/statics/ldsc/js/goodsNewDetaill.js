
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
			if($(this).hasClass("selectOne")){
                $(this).removeClass("selectOne");
                $(this).find("span").removeClass("selectDot");
			}else{
			    $(this).addClass("selectOne");
			    $(this).find("span").addClass("selectDot");
			}
			//重新计算金额
			caculatAmount();
			$(this).siblings(".cardlist").find("span").removeClass("selectDot");

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
		//6、点击立即兑换
		$(".openBeansForm").click(function(){
			var nums = $(".nums").text();
			var goodsScore = $("#goodsScore").val();
			$(".totalneed").text("商品总额："+nums*goodsScore+"乐豆");
			$(".realneed").text("实际需要支付："+nums*goodsScore+"乐豆");
			$(".cardListForm").show();
		});
		
		//7、确认兑换
		$(".comfirmToExchange").click(function(){
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
			var virtlReal = $("#virtlReal").val();
			//地址校验 1、是否是实物，实物才需要地址
			 var addressId = $("#addressId").val();
			if("1"==virtlReal){
                //var address = $(".address").text();
                if(addressId==null || addressId==''){
                    $(".cardListForm").hide();
                    openAlert("地址不能为空");
                    return;
                }
			}
			//去兑换
			var discountId = $(".selectOne").attr("id");
			var discount = $(".selectOne").attr("value");
			exChangeGoods(goodsId,nums,discountId,discount,addressId);
		});

		//10点击确定关闭弹窗
		$(".confirmBtn").click(function(){
			$(".modal-comfirm").hide();
		});
		
		//11 获取用户默认地址
		getDefaultAddr();
});

function caculatAmount(){
    var discountId = $(".selectOne").attr("id");
    var discount = $(".selectOne").attr("value");

    var nums = $(".nums").text();
    var goodsScore = $("#goodsScore").val();
    if(discountId==undefined || discount==undefined || discountId=='' || discount==''){
         $(".totalneed").text("商品总额："+nums*goodsScore+"乐豆");
         $(".realneed").text("实际需要支付："+nums*goodsScore+"乐豆");
    }else{
         var totalAmount = nums*goodsScore;
         $(".totalneed").text("商品总额："+totalAmount+"乐豆");
         $(".realneed").text("实际需要支付："+(totalAmount-totalAmount*((10-discount)/10))+"乐豆");
    }
}

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

//兑换 方法    调用兑换接口
function exChangeGoods(goodsId,exchangeNum,discountId,discount,addressId){
	 //关闭优惠券列表
	$(".cardListForm").hide();
	//loading
	showLoading();
	//数据加载中弹窗
	var flag = checkPayToken();
	 if(!flag){
	    hideLoading();
	    $(".successChange").text("数据处理中...");

        $("#exchangeImg").attr('src',"http://res.thewm.cn/zlbean/ldsc/img/exchangeFail.png");
        $(".exchangeSuccessForm").show();
         setTimeout(function(){
             window.location.reload();
        }, 2000);
        return;
	 }
	 $.ajax({
			url : getBasePath()+'/frontpage/beanOrderExchange/exchangeGoods',
			data : {
				"goodsId":goodsId,"exchangeNum":exchangeNum,"discountId":discountId,"discount":discount,"addressId":addressId
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
						//window.location.reload();
						window.location.href=getBasePath()+"/frontpage/beanOrder/myOrderList";
						}, 3000);
					return;
				}
				if(data.message!=null && data.message.indexOf("烟豆数量为0") != -1){
					$(".successChange").text('乐豆数量不足');
				}else{
				    if(data.message!=null){
				     $(".successChange").text(data.message);
				    }else{
				    $(".successChange").text("兑换失败");
				    }

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

//异步获取我的未使用优惠券列表
function getMyCardList(){
	var resultString = '';
	 $.ajax({
			url : getBasePath()+'/frontpage/myCard/queryCouponsList',
			data : {
				"status":"0"
			},
			method : 'post',
			dataType : 'json',
			timeout:5000,
			success : function(data) {

				if(data==null || data.status=='error' || data.list==null || data.list.length==0){
					resultString+='<li>无优惠券可用</li>';
				}else{
					resultString+='<li>可选优惠券</li>';
				}
				if (data!=null && data.list!=null) {
					$.each(data.list, function(i, n){
						resultString+='<li class="cardlist" id="'+n.id+'" value="'+n.discount+'"><span></span>'+n.discountName+'</li>';
					});
					$(".selectCard").html(resultString);
				}
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

 