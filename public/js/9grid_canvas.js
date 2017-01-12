(function(){	
     H5lock.prototype.save = function(){        
        var pts = this.lastPoint;
        var remark = $(this.remark).val();
        var img = this.canvas.toDataURL("image/png"); 
        var date = new Date().valueOf();
        var item = {
            key : date,
            pts : pts,
            remark : remark,
            img : img,
            date : date
        }            
        H5lock.insert_item(H5lock.my, item);

    };
    H5lock.insert_item = function(type, item){
        
        var root = H5lock.root;//.replace(' ','%20');
        var path = root + '/'+type+'/'+item.key+'.txt';
        $.when(H5lock.write_file(path, JSON.stringify(item))).done(function(){
            console.log('create file'+path+' success!');
            $.when(H5lock.get_indexs(type)).done(function(indexs){
            var index = {
                key:item.key,
                remark:item.remark                
            }
            index.file = path;
            indexs.push(index);
            H5lock.set_indexs(type, indexs);
            alert('save success,you can find it in menu My!');
            });
        }).fail(function(){
            alert('save fail!');
        });                       
    };
    $.extend(_9grid,{
        init_canvas:function(){
            H5lock.init_profile(function(){
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
            });
                
        }
    });
})();