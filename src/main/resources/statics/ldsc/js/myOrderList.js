$.fn.ready( function(){
	//异步获取我的订单
	getMyOrderList('');
	$(".tabItem").click(function(){
		var shippingStatus = $(this).attr("id");
		$(this).siblings(".tabItem").removeClass("onOrderState").find("i").remove();;
		$(this).addClass("onOrderState").prepend("<i></i>") ;
		getMyOrderList(shippingStatus);
	});

	//关闭弹窗
    $(".close_btn_bottom").click(function(){
        $(".modal-comfirm").hide();
    });

    //关闭弹窗
    $(".closeXX").click(function(){
        $(".modal-comfirm").hide();
    });

});

//异步获取我的订单
function getMyOrderList(shippingStatus){
	var resultString = '';
	 $.ajax({
			url : getBasePath()+'/frontpage/beanOrder/orderListJson',
			data : {
				"shippingStatus":shippingStatus
			},
			method : 'post',
			dataType : 'json',
			timeout:5000,
			success : function(data) {
				if (data!=null) {
					$.each(data, function(i, n){
                            var shippingStatus = n.shippingStatus;
                            var shippText = '';
                            if(shippingStatus=='0'){
                                shippText='未发货';
                            }else if(shippingStatus=='1'){
                                shippText='已发货';
                            }
                            resultString+='<div class="oderBox">';
                                resultString+='<dl>';
                                    resultString+='<dt><img src="'+n.goodImage+'" alt="" /></dt>';
                                    resultString+='<dd>';
                                        resultString+='<p>'+n.name+'</p>';
                                        resultString+='<p>时间：'+n.createTime+'</p>';
                                    resultString+='</dd>';
                                resultString+='</dl>';
                                resultString+='<ul class="state">';

                                    if(compareDates(n.createTime) && (n.orderType==='4' || n.orderType==='1')){
                                         resultString+='<li style="padding-left: 1px;">京东折扣券值：'+n.coupon+'</li>';
                                    }else{
                                         resultString+='<li style="padding-left: 1px;">乐豆总值：'+n.totalScore+'   &nbsp;优惠'+n.totalDiscount+'  &nbsp;实付'+(n.totalScore-n.totalDiscount)+'</li>';
                                    }

                                    resultString+='<li style="float: left;">'+shippText+'</li>';
                                    if(n.orderType==='1'){
                                       resultString+='<li onclick="showJdCard('+n.id+');"'
                                       +'style="float: left;padding-left: 0;margin: 11px 0 0 0;width: 100px;height: 30px;line-height: 30px;background: #efefef; text-align: center;border-radius: 15px;">查看卡密</li>';
                                    }

                                resultString+='</ul>';
                                 //京东卡需要填写地址，如果已填写，展示已填写地址
                                 if(n.orderType=='4'){
                                    resultString+='<ul class="state">';
                                         if(n.allAddress!=undefined && n.allAddress!='nullnullnullnull' && n.allAddress!=''){
                                             resultString+='<li>'+n.allAddress+'</li>';

                                         }else{
                                             resultString+='<li onclick="showAddress('+n.id+');"'
                                                                                           +'style="float: right;padding-left: 0;margin: 11px 20px 0 0;width: 100px;height: 38px;line-height: 38px;background: #87CEFA; text-align: center;border-radius: 3px;">收货地址</li>';
                                         }

                                    resultString+='</ul>';
                                 }
                            resultString+='</div>';
					});
					$(".oderUnit").html(resultString);
				}else{
					$(".oderUnit").html("");
				}
			},
			error : function(data) {
				$(".oderUnit").html("");
			}
		});
}


 //显示京东卡密
 function showJdCard(orderId){
     $("#currentOrderId").val(orderId);
 	 $.ajax({
 			url : getBasePath()+'/frontpage/myCard/showJdCard',
 			data : {
 				"orderId":orderId
 			},
 			method : 'post',
 			dataType : 'json',
 			timeout:5000,
 			async:false,
 			success : function(data) {
 			    $("#jdcomfirmForm").show();
 				if (data!=null && data.status=="success") {
 				    $("#cardSecrect").text("卡密："+data.cardSecrect);
 				    $("#cardAccount").text("卡号："+data.cardAccount);
 				    if(data.shippingStatus=='1'){
 				         $("#guakai").hide();
                         $("#showkey").show();
 				    }else{
                        $("#showkey").hide();
                        $("#guakai").show();
 				    }
                    return;
 				}
 				 $("#cardSecrect").text("查看失败");
                 $("#cardAccount").text("");
                 $("#guakai").hide();
                 $("#showkey").show();
 			},
 			error : function(data) {
                 $("#cardSecrect").text("查看失败");
                 $("#cardAccount").text("");
                 $("#guakai").hide();
                 $("#showkey").show();
                 $("#jdcomfirmForm").show();
 			}
 		});
 }

 //显示并 更新 京东卡密
  function showAndUpdateJdCard(){
     var orderId = $("#currentOrderId").val();
  	 $.ajax({
  			url : getBasePath()+'/frontpage/myCard/showAndUpdateJdCard',
  			data : {
  				"orderId":orderId
  			},
  			method : 'post',
  			dataType : 'json',
  			timeout:5000,
  			async:false,
  			success : function(data) {
  			    $("#jdcomfirmForm").show();
  			     $("#guakai").hide();
                 $("#showkey").show();
  			},
  			error : function(data) {

  			}
  		});
  }


    //5、京东卡订单 选择地址
    function selectAddress(orderId){
        window.location.href="";
         window.location.href=getBasePath()+"/frontpage/jdAddress/jdAddressList?url="+encodeURIComponent(window.location.href)+"&orderId="+orderId;
    }

   //显示京东卡收货地址
   function showAddress(orderId){
       $("#currentOrderId").val(orderId);
   	 $.ajax({
   			url : getBasePath()+'/frontpage/jdAddress/showAddress',
   			data : {
   				"orderId":orderId
   			},
   			method : 'post',
   			dataType : 'json',
   			timeout:5000,
   			async:false,
   			success : function(data) {
   			    $(".beansForm").show();
   				if (data!=null && data.status=="success" && data.shippingStatus=='1') {
   				    $("#useraddress").text(data.beanOrder.provinceName+data.beanOrder.cityName
   				    +data.beanOrder.countyName+data.beanOrder.detailAddress);
   				}
   				if (data!=null && data.status=="success" && data.shippingStatus=='0') {
                    selectAddress(orderId);
   				}
   			},
   			error : function(data) {

   			}
   		});
   }

/**
    京东券订单生成时间 打于 2019-01-15，明细展示不一样
*/
function compareDates(ordertime){
    //2把字符串格式转换为日期类
    var startTime = new Date(Date.parse('2019-01-15'));
    var ordTime = getDates(ordertime);
    //3进行比较
    var b = (ordTime>=startTime);

    return b;
}

        /*ios 时间兼容性问题解决*/
 		function getDates(strdate){
	 		var arr = strdate.split(/[- : \/]/);
	 		date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
	 		return date;
 		}