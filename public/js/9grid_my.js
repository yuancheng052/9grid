(function(){
	var datas = [];
    var res =[];
    var dt_table = {};
    $.extend(_9grid, {
    	init_my:function(){    		
		    init_data(function(){
		    	dt_table = $('#table_my').on('draw.dt',function() {
		            init_event();
			    }).on('init.dt',function() {
		            //init_event();
			    }).DataTable({
			    	dom: 't<"page"ipl>',
			        data: res,
			        columns:[{   
			                data:null,
			                render:function(data, type, row, meta) {  
			                    return '<input type="checkbox" name="ck_my" id="'+data.id+'"/>';  
			                }  
			            },{
			                data:'img',
			                render:function(data, type, row, meta) {  
			                	var id = row.id;
			                    return '<div class="div-img" id="my_'+id+'"><div><img type="checkbox" name="" src="'+data+'" width="100px" height="100px"/>'
			                    	+'</div><div class="div-img-btn-hidden"><div><a href="javascript:void(0);" class="btn btn-primary my_preview img_btn1">Preview</a></div><div>'
			                    	+'<a href="javascript:void(0);" class="btn btn-primary my_clone img_btn1">Clone</a></div></div></div>';  
			                }  
			            },{
			                data:'remark'           
			            },{
			                data:'date'           
			        }],
			        "bFilter": false
		    	});
		    });		   
    	}
    });
    function init_data(cb){
		
	    res.length = 0;	    
	    $.when(H5lock.get_datas( H5lock.my)).done(function(datas){
			if(datas.length >0){
		        for(var i=0; i<datas.length; i++){
		            res.push({
		                id :datas[i].key,
		                img: datas[i].img,
		                remark: datas[i].remark,
		                date: new Date(datas[i].date).format('yyyy-MM-dd HH:mm:ss')
		            });
		        }
		    }
		    cb();
	    });	    
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
	    $('a.my_clone').each(function(index, elm){
	    	var id = $(this).parents('div.div-img').attr('id').replace('my_','');
	    	$(this).click(function(){
	    		H5lock.clone_2(id, H5lock.my, H5lock.lib, function(){
	    			alert('clone success, you can see it in menu lib!');
	    		});
	    	});
	    });
	    //preview
	    $('a.my_preview').each(function(index, elm){
	    	var flag = 0;
	    	var img = $(this).parents('div.div-img').find('img');
	    	$(this).click(function(){
	    		if(flag ==0){
	    			img.css({
	    			width:'200px',
	    			height:'200px'
	    			});
	    			flag = 1;
	    		}else{
	    			img.css({
	    			width:'100px',
	    			height:'100px'
	    			});
	    			flag = 0;
	    		}	    		
	    	});
	    	
	    });

    }

    $(function(){
		$('#btn_del').click(function(){
	    	var item_key = '';
	    	var cks = $(':checkbox[name="ck_my"]:checked');
	    	if(cks.length >0){
	    		if(confirm('sure to delete!')){
		    		cks.each(function(i, ck){
		    			H5lock.del_item(ck.id);		
		    			dt_table.row($(this).parents('tr:first')).remove();
		    		});
		    		init_data(function(){
		    			dt_table.draw(false);
		    		});	
	    		}	    			    		
	    	}else{
	    		alert('please select one to delete!');
	    	}
	    	
	    });	
	})    
})();    

