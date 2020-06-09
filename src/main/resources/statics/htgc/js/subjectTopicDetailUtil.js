function getResultString(resultStr,n){
	
	//评论头部
	resultStr+='<li>';
	resultStr+='<div><img class="faceImg" src="'+n.headimgurl+'" alt="" /><span>'+n.nickName+'</span>'
	if('1'==n.toTop){
			resultStr+='<span class="goodChoice">精选</span>';
	}
	resultStr+='</div>';

	//评论contents展示
	resultStr+='<div class="praiseTopicBox mLeft80">';
		resultStr+='<div class="words" style="margin-bottom:50px;">';
			resultStr+='<p class="myTalk">'+entitiestoUtf16(n.contents)+'</p>';
			if(n.contents!=null && n.contents.length>51){
				resultStr+='<span class="openAll">展开全文<img src="'+getImgsBasePath()+'/htgc/images/open.png" alt="" /></span>';
				resultStr+='<span class="upDisNone" style="display: none;">收起全文<img src="'+getImgsBasePath()+'/htgc/images/open.png" alt="" /></span>';
			}
	resultStr+='</div>';
		
	//评论图片展示
	if(n.imgUrlsJsonList!=null && n.imgUrlsJsonList.length>0){
		resultStr+='<ul class="plImgDisplay plImgDisplay4">';
		$.each(n.imgUrlsJsonList, function(i, m){
			resultStr+='<li style="background-image: url('+getImgsBasePath()+m+');"></li>';
		});
		resultStr+='</ul>';
	}
	//评论时间，点赞，踩数等内容展示
		resultStr+='<ul class="praiseTime overflowH">';	
			resultStr+='<li>'+getDateTime(n.createTime,'yyyy-MM-dd HH:mm:ss')+'</li>';	
			resultStr+='<li>';	
				resultStr+='<span class="thumbsYesSpan ';
					if('1'==n.myThumsStatus){
						resultStr+='sendPraise';	
					}
					resultStr+='">'+n.upCount+'</span>';
				resultStr+='<span class="thumbsNoSpan ';
					if('0'==n.myThumsStatus){
						resultStr+='sendStamp';	
					}
					resultStr+='">'+n.downCount+'</span>';
				resultStr+='<span class="toReplys">回复</span>';
			resultStr+='</li>';	
			resultStr+='<input type="hidden" id="contentId" value="'+n.id+'" width="0"/>';	
		resultStr+='</ul>';
		//评论时间，点赞，踩数等内容展示end
		
		//回复信息展示			
		if(1<=n.sonContentCount){
			resultStr+='<div class="reply" >';
		}else{
			resultStr+='<div class="reply" style="display:none;">';
		}
			resultStr+='<div class="replyLists">';
				resultStr+='<div class="replyContent" style="display:block;" id="replyContent_'+n.id+'">';
				if(n.childrenList!=null && n.childrenList.length>0){
					$.each(n.childrenList, function(i, m){
						resultStr+='<p><span class="repalyName">'+m.nickName+':</span>'+m.contents+'</p>';
					});
				}
				resultStr+='</div>';	
				resultStr+='<span class="lookReplyDetail">'
					if(1<=n.sonContentCount){
						resultStr+='查看'+n.sonContentCount+'回复>';	
					}/*else{
						resultStr+='暂无回复';	
					}*/
				resultStr+='</span>';	
				resultStr+='<span class="closeReplyDetail" style="display:none;">收起回复</span>';
			resultStr+='</div>';
		resultStr+='</div>';		
		//回复信息展示end
	resultStr+='</div>';		
	//praiseTopicBox  end		
	resultStr+='</li>';	
	
	return resultStr;

}