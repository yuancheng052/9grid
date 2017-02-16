(function(){
        window.H5lock = function(obj){
            this.height = obj.height;
            this.width = obj.width;
            this.point_fill_color = obj.point_fill_color?(obj.point_fill_color): '#D3D3D3';
            this.point_seled_color = '#2F2FFF';
            this.shadow_out_x = obj.shadow_out_x;
            this.shadow_out_y = obj.shadow_out_y;
            this.shadow_in_x = obj.shadow_in_x;
            this.shadow_in_y = obj.shadow_in_y;
            this.shadow_color = obj.shadow_color?(obj.shadow_color):null;
            this.line_size = obj.line_size || 3;
            this.line_color = obj.line_color?(obj.line_color):'#FF0000';

            this.shadow_blur = 2;
            this.arrow = {
                angle : Math.PI/6,
                length : 20
            };
            if('dash'==obj.line_type){
                this.dash_line = {
                    interval:5 
                }    
            }
            
        };
        H5lock.lib = 'grid_lib';
        H5lock.my = 'grid_my';

        H5lock.root = BS.b$.App.getAppDataHomeDir();

        H5lock.profile = 'user_profile';

        function getDis(a, b) {
            return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        };
        
        H5lock.prototype.drawArrow = function(fromPt, toPt) { 
            /*this.ctx.strokeStyle = '#FF0000';
            this.ctx.lineWidth = this.line_size;
            this.ctx.beginPath();*/
            
            var line_angle = Math.atan2(toPt.y-fromPt.y, toPt.x-fromPt.x);
            var angle = this.arrow.angle;
            var h = this.arrow.length;
            var angle1 = line_angle+Math.PI+angle;
            var arrow1 = {
                x : toPt.x+Math.cos(angle1)*h,
                y : toPt.y+Math.sin(angle1)*h
            }
            this.ctx.moveTo(toPt.x, toPt.y);
            this.ctx.lineTo(arrow1.x, arrow1.y);
            console.log('arrow1-x:'+arrow1.x+',y:'+arrow1.y);

            var angle2 = line_angle+Math.PI-angle;
            var arrow2 = {
                x : toPt.x+Math.cos(angle2)*h,
                y : toPt.y+Math.sin(angle2)*h
            };
            this.ctx.moveTo(toPt.x, toPt.y);
            this.ctx.lineTo(arrow2.x, arrow2.y);
            this.ctx.closePath();
            this.ctx.stroke();
        }

        H5lock.prototype.drawCle = function(x, y) {           
            this.ctx.beginPath();            
            this.ctx.arc(x, y, this.r, 0, Math.PI * 2, true);  
            this.ctx.closePath();
            this.ctx.fill();                      
        }        
        H5lock.prototype.drawSeledCle = function(x, y){
            this.ctx.fillStyle = this.point_seled_color;
            this.ctx.beginPath();            
            this.ctx.arc(x, y, this.r, 0, Math.PI * 2, true);  
            this.ctx.closePath();
            this.ctx.fill();
            //restore 
            this.ctx.fillStyle = this.point_fill_color;
        }    
       
        H5lock.prototype.drawLine = function(fromPt, toPt) {

            this.ctx.shadowOffsetX = null;
            this.ctx.shadowOffsetY = null;
            this.ctx.shadowColor = null;
            this.ctx.beginPath();
            this.ctx.lineWidth = this.line_size;
            this.ctx.strokeStyle = this.line_color;
            this.ctx.moveTo(fromPt.x, fromPt.y);
            if(this.dash_line){
                var length = getDis(fromPt, toPt);
                var nums = Math.floor(length/this.dash_line.interval);

                for(var i=0; i<nums; i++){
                    this.ctx[i%2==0?'moveTo':'lineTo'](fromPt.x+(toPt.x-fromPt.x)*i/nums, fromPt.y+(toPt.y-fromPt.y)*i/nums);
                }
            }else{
                this.ctx.lineTo(toPt.x, toPt.y);    
            }            
            this.ctx.stroke();
            this.ctx.closePath();

        }
        H5lock.prototype.init_panel = function() {
            var n = 3;
            var count = 0;
            this.r = this.ctx.canvas.width / (2 + 4 * n);// 公式计算
            this.lastPoint = [];
            this.arr = [];
            this.restPoint = [];
            var r = this.r;
            for (var i = 0 ; i < n ; i++) {
                for (var j = 0 ; j < n ; j++) {
                    count++;
                    var obj = {
                        x: j * 4 * r + 3 * r,
                        y: i * 4 * r + 3 * r,
                        index: count
                    };
                    this.arr.push(obj);
                    this.restPoint.push(obj);
                }
            }
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

            this.ctx.fillStyle = this.point_fill_color;
            if(this.shadow_color){
                this.ctx.shadowColor = this.shadow_color;    
            }            
            this.ctx.lineWidth = 2;
            if(this.shadow_out_x){
                this.ctx.shadowOffsetX = this.shadow_out_x;
            }
            if(this.shadow_out_y){
                this.ctx.shadowOffsetY = this.shadow_out_y;
            }
            var flag = false;
            if(this.shadow_in_x){
                this.ctx.shadowOffsetX = this.shadow_in_x;
                flag= true;
            }
            if(this.shadow_in_y){
                this.ctx.shadowOffsetY = this.shadow_in_y;
                flag = true;
            }      
            this.ctx.shadowBlur = this.shadow_blur;
            for (var i = 0 ; i < this.arr.length ; i++) {
                this.drawCle(this.arr[i].x, this.arr[i].y);
            }
            //return arr;

        }
        H5lock.prototype.getPosition = function(e) {// 获取touch点相对于canvas的坐标
            var rect = e.currentTarget.getBoundingClientRect();
            var clientX = null;
            var clientY = null;
            //if(e instanceof TouchEvent){
            if(false){
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }else{
                clientX = e.clientX;
                clientY = e.clientY;
            }
            var po = {
                x: clientX - rect.left,
                y: clientY - rect.top
              };
            return po;
        }       
        H5lock.prototype.update = function(po) {           
            
            for (var i = 0 ; i < this.restPoint.length ; i++) {
                var pt = this.restPoint[i];

                if (Math.abs(po.x - pt.x) < this.r && Math.abs(po.y - pt.y) < this.r) {

                    var prePoint = this.lastPoint[this.lastPoint.length - 1];
                    this.drawSeledCle(pt.x, pt.y);
                    this.drawLine(prePoint, pt);
                    this.drawArrow(prePoint, pt);

                    this.lastPoint.push(pt);
                    this.restPoint.splice(i, 1);
                    
                    break;
                }
            }
            console.log('update end!');
        }       
        
        H5lock.prototype.init = function() {
            this.pswObj = window.localStorage.getItem('passwordxx') ? {
                step: 2,
                spassword: JSON.parse(window.localStorage.getItem('passwordxx'))
            } : {};
            this.lastPoint = [];
            this.touchFlag = false;
            this.canvas = document.getElementById('canvas');
            this.remark = document.getElementById("remark");
            this.ctx = this.canvas.getContext('2d');
            this.init_panel();
            this.bindEvent();
            return this;
        }           
        H5lock.prototype.bindEvent = function() {
            var self = this;
            

            this.canvas.addEventListener("mousedown ", touchStart, false);
            this.canvas.addEventListener("mousemove", touchMove, false);
            this.canvas.addEventListener("mouseup ", touchEnd, false);

            this.canvas.addEventListener("touchstart", touchStart, false);            
            this.canvas.addEventListener("touchmove", touchMove, false);
            this.canvas.addEventListener("touchend", touchEnd, false);
            this.canvas.onmousedown = touchStart;
            this.canvas.onmousemove = touchMove;
            this.canvas.onmouseup = touchEnd;
            /*document.addEventListener('touchmove', function(e){
                e.preventDefault();
            },false);          */ 

             function touchStart(e) {
                e.preventDefault();// 某些android 的 touchmove不宜触发 所以增加此行代码
                self.init_panel();
                var po = self.getPosition(e);
                console.log(po);
                for (var i = 0 ; i < self.arr.length ; i++) {
                    if (Math.abs(po.x - self.arr[i].x) < self.r && Math.abs(po.y - self.arr[i].y) < self.r) {

                        self.touchFlag = true;
                        self.lastPoint.push(self.arr[i]);
                        self.restPoint.splice(i,1);
                        self.drawSeledCle(self.arr[i].x, self.arr[i].y);
                        break;
                    }
                }
             }
             function touchMove(e) {
                if (self.touchFlag) {
                    self.update(self.getPosition(e));
                }
             }
             function touchEnd(e) {
                 if (self.touchFlag) {
                     self.touchFlag = false;
                     //self.storePass(self.lastPoint);
                 }

             }
        }
       
        H5lock.get_random_item = function(cb){

            $.when(H5lock.get_indexs(H5lock.lib)).done(function(indexs){
                if(indexs.length >0){
                    var random = Math.random()*indexs.length;
                    random = parseInt(random);
                    random = random == indexs.length?random-1:random;
                    var item = indexs[random];
                    $.when(H5lock.read_file(item.file)).done(function(content){
                        if(content !=''){
                            item_data = JSON.parse(content);
                            cb(item_data);
                        }
                    });
                         
                }
            });
            
        }
        H5lock.prototype.draw_random = function(item){
            if(item ==null){
                H5lock.get_random_item(call_back);    
            }else{
                call_back(item);
            }
            var self = this;
            function call_back(item_data){
                self.init_panel();
                var pts = item_data.pts;
                var circles = self.arr;
                if(pts !=null && pts.length >0 ){
                    for(var i=0; i<pts.length; i++){
                        var point = pts[i];
                        for(j in circles){
                            var circle = circles[j];
                            if(circle.index == point.index){                            
                                self.lastPoint.push(circle);
                                self.drawSeledCle(circle.x, circle.y);
                                if(i >0){
                                    var lastPoint2 = self.lastPoint.splice(0,1)[0];
                                    self.drawLine(lastPoint2, circle);
                                    self.drawArrow(lastPoint2, circle);                                
                                }                            
                            }
                        }
                    }
                }
            }
            
        }
        H5lock.app_init = function(){

            var root = H5lock.root+'/';      
            var exist = BS.b$.App.checkPathIsExist(root+H5lock.lib);
            if(!exist){
                BS.b$.App.createDir(root+H5lock.lib+'/', {}, function(obj){
                    console.log('createDir'+H5lock.lib+' success!');      
                    
                });
                BS.b$.App.createDir(root+H5lock.my+'/', {}, function(obj){
                    console.log('createDir'+H5lock.my+' success!');      
                    
                });
                //init libs
                var libs = init_lib_indexs;
                var datas = init_lib_datas;
                for(var i=0; i<libs.length; i++){
                    var item = libs[i];
                    item.file = root+H5lock.lib+'/'+item.key+'.txt';     
                    var key = item.key;
                    var file_path = item.file;
                   // (function(key, file_path){
                        $.when(H5lock.get_index_item(null, key, datas)).done(function(content){
                            H5lock.write_file(file_path, JSON.stringify(content));
                        });    
                   // })(item.key, item.file);                                        
                }
                
                H5lock.write_file(root+H5lock.lib+'.txt', JSON.stringify(libs));
                BS.b$.App.createEmptyFile(root+H5lock.my+'.txt',function(obj){
                    console.log('create file'+H5lock.my+'.txt');
                });
                BS.b$.App.createEmptyFile(root+H5lock.profile+'.txt',function(obj){
                    console.log('create file'+H5lock.profile+'.txt');
                });
            }
        }
        
        H5lock.get_index_item = function(type, key, indexs){

            var dtd = $.Deferred();
            var item = null;
            if(indexs !=null && indexs.length >0){
                for(var i=0; i<indexs.length; i++){
                    if(key == indexs[i].key){
                        item = indexs[i];
                        break;
                    }
                }
                dtd.resolve(item);
            }else{
                $.when(H5lock.get_indexs(type)).done(function(indexs){
                    for(var i=0; i<indexs.length; i++){
                        if(key == indexs[i].key){
                            item = indexs[i];
                            break;
                        }
                    }
                    dtd.resolve(item);                    
                });
            }            
            return dtd.promise();            
        }        
        H5lock.del_item = function(item_key){

            $.when(H5lock.get_indexs(H5lock.my)).done(function(indexs){
                $.when(H5lock.get_index_item(H5lock.my, item_key, indexs)).done(function(item){
                    if(item !=null){
                        indexs.remove(item);
                    }
                    H5lock.set_indexs(H5lock.my, indexs);
                });
            });            
        }

        H5lock.clone_2 = function(item_key, src, target, cb){

            $.when(H5lock.get_indexs(target)).done(function(indexs){
                $.when(H5lock.get_index_item(src, item_key)).done(function(new_item){
                    $.when(H5lock.get_index_item(target, item_key, indexs)).done(function(old_item){
                        if(old_item == null){
                            indexs.push(new_item);
                            //
                            var new_path = H5lock.root+ '/'+target+'/'+new_item.key+'.txt';       
                            var old_path = new_item.file;                           
                            new_item.file = new_path;
                            H5lock.set_indexs(target, indexs);
                            H5lock.copy_file(old_path, new_path, cb);
                        }else{
                            alert('the item has in lib, can not be cloned!');
                        }
                        
                    });
                });
                
            });

        }

        H5lock.get_indexs = function(type){

            var dtd = $.Deferred();
            var index_file = H5lock.root+'/'+type+'.txt';
            
            $.when(H5lock.read_file(index_file)).done(function(content){
                var data = null;
                if(content !=''){
                    data = JSON.parse(content);
                }else{
                    data = [];
                }
                dtd.resolve(data);

            });
            return dtd.promise();           
        }        

        H5lock.get_datas = function(type, cb){
            
            var dtd = $.Deferred();
            $.when(H5lock.get_indexs(type)).done(function(indexs){
                var datas= [];
                for(var i=0; i<indexs.length; i++){
                    var file = indexs[i].file;                    
                    (function(i){
                        $.when(H5lock.read_file(file)).done(function(content){
                            if(content !=''){
                                datas.push(JSON.parse(content));
                            }else{
                                datas.push({});
                            }
                            if(i ==indexs.length-1){
                                dtd.resolve(datas);    
                            }                        
                        })
                    })(i);
                    
                }                
            });
            return dtd.promise();            
        }

        H5lock.set_indexs = function(type, data){

            var index_file = H5lock.root+'/'+type+'.txt';
            H5lock.write_file(index_file, JSON.stringify(data));            
        }

        H5lock.get_profile = function(){

            var dtd = $.Deferred();
            var file_path = H5lock.root+'/'+H5lock.profile+'.txt';
            $.when(H5lock.read_file(file_path)).done(function(content){
                var profile = null;
                if(content !=''){
                    profile = JSON.parse(content);
                }
                dtd.resolve(profile);

            });
            return dtd.promise();
        }
        H5lock.write_profile = function(data){

            var file_path = H5lock.root+'/'+H5lock.profile+'.txt';
            H5lock.write_file(file_path, JSON.stringify(data));

        }      

        H5lock.copy_file = function(src, target, cb){
            BS.b$.App.copyFile({
                src:src,
                dest:target
            },function(){
                if(cb){
                    console.log('copy file from '+src+' to '+target+' success!');
                    cb();
                }
            });
        }

        H5lock.read_file = function(file_path){
            var dtd = $.Deferred();
            BS.b$.Binary.getUTF8TextContentFromFile({
                filePath: file_path
                }, function(obj){
                if(obj.success){
                    console.log('get file'+file_path+' success ');
                    dtd.resolve(obj.content.replace(/\r|\n/,''));
                }else{
                    //return [];
                    dtd.resolve('');
                }                
            });
            return dtd.promise();
        }

        H5lock.write_file = function(file_path, data){
            var dtd = $.Deferred();
            BS.b$.Binary.createTextFile({
                filePath: file_path,
                text: data, 
                }, function(info){
                console.log('update '+file_path+'success!');
                dtd.resolve();
            });
            return dtd.promise();
        }
        H5lock.write_bfile = function(file_path, data, call_back){
            //var dtd = $.Deferred();
            BS.b$.Binary.base64ToImageFile({
                filePath: file_path,
                base64String: data,
                dataAppend: false, 
            }, function(info){
                console.log('create img file success'+file_path);
                //dtd.resolve();
                call_back();
            });
            //return dtd.promise();
        }
        H5lock.app_init();

})();
