window.usr_setting = {};
(function(){
	var datas = [];
    var res =[];
    window.setting = 'out';	
    init_data();
    $.extend(_9grid, {
    	init_setting:function(){    		
    		
			init_event();
			fill_input();       
    	}
    })
    function init_data(){
		usr_setting = {
			point_fill_color:'#D3D3D3',
			shadow_out_x:2,
            shadow_out_y:2,
            shadow_in_x:2,
            shadow_in_y:2,
            shadow_color:'#808080',
            line_size:3,
            line_color:'#FF0000',
            line_type:'dash'

		};
    }

    function fill_input(){
    	$('#content_setting :input').each(function(elm){
            $(this).val(usr_setting[this.id]);   
        });
    }

    function init_event(){    	
    	
    	$('#content_setting :input').each(function(elm){
    		$(elm).change(function(){
    			usr_setting[this.id] = $(this).val();	
    		});    		
    	});
    	$('#shadow_out').click(function(){
    		$('#shadow_setting').show();
    		$('#set_x').val($('#shadow_out_x').val());
    		$('#set_y').val($('#shadow_out_y').val());
    	});
    	$('#shadow_in').click(function(){
    		$('#shadow_setting').show();
    		$('#set_x').val($('#shadow_in_x').val());
    		$('#set_y').val($('#shadow_in_y').val());
    	});
  
    	$('#setting_ok').click(function(){
    		if('out' == window.setting){
    			$('#shadow_out_x').val($('#set_x').val());
    			$('#shadow_out_y').val($('#set_y').val());
    		}else{
    			$('#shadow_in_x').val($('#set_x').val());
    			$('#shadow_in_y').val($('#set_y').val());    			
    		}
            $('#shadow_setting').hide();
    	});

        $('#setting_cancel').click(function(){
            $('#shadow_setting').hide();
        });
    } 
   
})();    