(function(){	
    $.extend(_9grid,{
        init_canvas:function(){
            var grid = new H5lock(window.usr_setting).init();

            //save
            $('#bt_save').click(function(){
                grid.save();
            });
            //draw 9grid random
            $('#bt_random').click(function(){
                grid.draw_random();
            });
            //draw 9grid hand
            $('#bt_hand').click(function(){
                grid.init_panel();
            });    
        }
    });
})()


