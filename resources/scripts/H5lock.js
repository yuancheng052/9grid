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
        H5lock.lib = '9grid_lib';
        H5lock.my = '9grid_my';

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
            if(e instanceof TouchEvent){
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
       
        H5lock.get_random_item = function(){
            var datas = H5lock.get_datas(H5lock.my);
            if(datas.length >0){
                var random = Math.random()*datas.length;
                random = parseInt(random);
                random = random == datas.length?random-1:random;
                var item = datas[random];
                return item;
            }
        }
        H5lock.prototype.draw_random = function(item){
            if(item ==null){
                item = H5lock.get_random_item();    
            }
            this.init_panel();
            var pts = item.pts;
            var circles = this.arr;
            if(pts !=null && pts.length >0 ){
                for(var i=0; i<pts.length; i++){
                    var point = pts[i];
                    for(j in circles){
                        var circle = circles[j];
                        if(circle.index == point.index){                            
                            this.lastPoint.push(circle);
                            this.drawSeledCle(circle.x, circle.y);
                            if(i >0){
                                var lastPoint2 = this.lastPoint.splice(0,1)[0];
                                this.drawLine(lastPoint2, circle);
                                this.drawArrow(lastPoint2, circle);                                
                            }                            
                        }
                    }
                }
            }
        }
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

        }
        H5lock.insert_item = function(key, item){
            
            var datas = H5lock.get_datas(key);
            datas.push(item);
            H5lock.set_datas(key, datas);
        }
        H5lock.get_item = function(key, item_key, datas){

            datas = datas==null?H5lock.get_datas(key): datas;
            if(datas && datas.length >0){
                for (var i = 0; i<datas.length; i++) {
                    if(datas[i].key == item_key){
                        return datas[i];
                    }
                }
            }
            return null;
        }
        H5lock.del_item = function(item_key){

            var datas = H5lock.get_datas(H5lock.my);
            var item = H5lock.get_item(H5lock.my, item_key, datas);
            if(item !=null){
                datas.remove(item);
            }
            H5lock.set_datas(H5lock.my, datas);
        }

        H5lock.clone_2 = function(item_key, src, target){

            var new_item = H5lock.get_item(src, item_key);
            var datas = H5lock.get_datas(target);
            var old_item = H5lock.get_item(target, item_key);
            if(old_item == null){
                datas.push(new_item);
            }else{
                var index = datas.indexOf(old_item);
                datas[index] = new_item;                
            }
            H5lock.set_datas(target, datas);
        }

        H5lock.get_datas = function(key){

            var datas = localStorage.getItem(key);
            if(datas ==null){
                datas = [];
            }else{
                datas = JSON.parse(datas);
            }
            return datas;    
        }

        H5lock.set_datas = function(key, datas){

            localStorage.setItem(key, JSON.stringify(datas));
        }

})();
