window._9grid = {};
$(function(){	
    $('.nav_menu .menu_item').each(function(){
    	$(this).mouseover(function(){
    		$(this).addClass('focusin');
    	}).mouseout(function(){
    		$(this).removeClass('focusin');
    	}).focus(function(){
    		$(this).addClass('focusin');
    	}).blur(function(){
    		$(this).removeClass('focusin');
    	});
        
    });

    $('.content_item_focus').removeClass('content_item_focus');
    var menu_item = location.hash;
    if(menu_item !=null){
        menu_item = menu_item.replace('#','');
    }
    $('#'+menu_item).addClass('content_item_focus');

    init(menu_item);

    function init(menu_item) {
        switch(menu_item){
            case 'content_canvas':
                _9grid.init_canvas();
                $('#nav_top_txt').html('Generate');
                break;
            case 'content_my':
                $('#nav_top_txt').html('My');
                _9grid.init_my();
                break;
            case 'content_lib':
                $('#nav_top_txt').html('Library');
                _9grid.init_lib();
                break;
            case 'content_setting':
                $('#nav_top_txt').html('Preferences');
                _9grid.init_setting();
                break;
            default :
        }    
    }
    $('#nav_btn').click(function(){
        $('.wrapper').toggleClass('mini_navbar');
    });
})