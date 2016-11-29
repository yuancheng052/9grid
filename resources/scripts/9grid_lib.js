(function(){
	var datas = [];
    var res =[];
    $.extend(_9grid, {
    	init_lib:function(){    		
		    init_data();
		    init_content();
		    init_event();		    
    	}
    })
    function init_data(){
		datas =  H5lock.get_datas( H5lock.lib);
	    res.length = 0;
	    if(datas.length >0){
	        for(var i=0; i<datas.length; i++){
	            res.push({
	                id :datas[i].key,
	                img: datas[i].img,
	                remark: datas[i].remark//,
	                //date: new Date(datas[i].date).format('yyyy-MM-dd HH:mm:ss')
	            });
	        }
	    }
    }

    function init_content(){

    	var temp = '';
    	temp +='<div class="row">'
    	for(var i=0; i<res.length; i++){
    		var id = res[i].id;
    		var data = res[i].img;
    		temp +=('<div id="lib_'+id+'" class="div-img col-sm-3"><div><img name="" src="'+data+'" width="150px" height="150px"/>'
            	+'</div><div class="div-img-btn-hidden"><div><a href="javascript:void(0);" class="btn btn-primary img_btn2">Preview</a></div><div>'
            	+'<a href="javascript:void(0);" class="btn btn-primary lib_clone img_btn2">Save To My</a></div></div></div>');
    	}
    	temp +='</div>';

    	$('#content_lib').html(temp);
    }

    function init_event(){
    	$('.div-img').mouseover(function(){
	    	$(this).addClass('div-img-focus');
	        $(this).find('.div-img-btn-hidden').addClass('div-img-btn-show');
	    }).mouseout(function(){
	    	$(this).removeClass('div-img-focus');
	        $(this).find('.div-img-btn-hidden').removeClass('div-img-btn-show');
	    });
	    //clone
	    $('a.lib_clone').each(function(elm){
	    	var id = $(this).parents('div.div-img').attr('id').replace('lib_','');
	    	$(this).click(function(){
	    		H5lock.clone_2(id, H5lock.lib, H5lock.my);
	    	});
	    });

    } 
   
})();    