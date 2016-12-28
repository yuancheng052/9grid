window.usr_setting = {};
(function(){
	var datas = [];
    var res =[];    
    var setting = 'out';
    H5lock.init_profile = function(cb){
        $.when(H5lock.get_profile()).done(function(profile){
            if(profile == null){
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
            }else{
                usr_setting = profile;
            }
            if(cb){
                cb();    
            }        
        });
    }
    $.extend(_9grid, {
    	init_setting:function(){    		
    		H5lock.init_profile(function(){                
                fill_input();
                init_event();    
            });			       
    	}
    });

    function fill_input(){
    	$('#content_setting :input').each(function(index, elm){
            $(this).val(usr_setting[this.id]);   
        });
        $('#line_size li').each(function(index, elm){
            if($(elm).attr('data') == usr_setting['line_size']){
                $(elm).addClass('active');
            }
        });
        $('#line_type li').each(function(index, elm){
            if($(elm).attr('data') == usr_setting['line_type']){
                $(elm).addClass('active');
            }
        });
    }

    function init_event(){    	
    	
    	/*$('#content_setting :input').each(function(index, elm){
    		$(elm).change(function(){
    			usr_setting[this.id] = $(this).val();
                H5lock.write_profile(usr_setting);	
    		});    		
    	});*/
        $('#point_fill_color').spectrum({
            color: $('#point_fill_color').val()
        });

        $('#line_color').spectrum({
            color: $('#line_color').val()
        });

        $('#point_fill_color').on('change',function(event, color){
            var value = color.toHexString();
            console.log('select value:'+value);
            update_profile('point_fill_color', value);
        });
        $('#line_color').on('change',function(event, color){
            var value = color.toHexString();
            console.log('select value:'+value);
            update_profile('line_color', value);
        });
        $('#line_size li').on('click', function(event){
            var value = $(event.currentTarget).attr('data');
            console.log('select value:'+value);
            update_profile('line_size', value);    
            $('#line_size li').each(function(index, elm){
                $(elm).removeClass('active');
            });        
            $(event.currentTarget).addClass('active');
        });
        $('#line_type li').on('click', function(event){
            var value = $(event.currentTarget).attr('data');
            console.log('select value:'+value);
            update_profile('line_type', value);         
            $('#line_type li').each(function(index, elm){
                $(elm).removeClass('active');
            });        
            $(event.currentTarget).addClass('active');   
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
    		if('out' == setting){
    			$('#shadow_out_x').val($('#set_x').val());
    			$('#shadow_out_y').val($('#set_y').val());
                update_profile('shadow_out_x', $('#shadow_out_x').val());
                update_profile('shadow_out_y', $('#shadow_out_y').val());
    		}else{
    			$('#shadow_in_x').val($('#set_x').val());
    			$('#shadow_in_y').val($('#set_y').val());    			
                update_profile('shadow_in_x', $('#shadow_in_x').val());
                update_profile('shadow_in_y', $('#shadow_in_y').val());
    		}
            $('#shadow_setting').hide();
    	});

        $('#setting_cancel').click(function(){
            $('#shadow_setting').hide();
        });
    }

    function update_profile(key, value){
        usr_setting[key] = value;
        H5lock.write_profile(usr_setting);
    }
   
})();    