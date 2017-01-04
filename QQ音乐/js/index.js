$(function (){

    console.clear();

    //搜索框
    (function (){
        var input = $('.sear-input'),
            dropdown = $('.sear'),
            add = $('.add'),
            last = $('.sear>li:last-child'),
            arr = [],
            num=5;

        //slide
        input.focusin(function (){
            dropdown.slideToggle("fast");
        });

        input.blur(function (){
            setTimeout(function (){
                dropdown.slideToggle("fast");
            },1000);
        });

        //搜索栏添加
        add.click(function (e){
            var res = input.val(),
                len = arr.length;
            e.preventDefault();
            //没有输入不进行添加
            if(!res){
                return;
            }
            var obj={};
            obj.key = input.val();
            //遍历查询是否重复
            for(var i= 0,len=arr.length;i<len;i++){
                if(arr[i].key == obj.key){
                    var count =$('.count').eq(i).html();
                    count++;
                    $('.count').eq(i).html(count);
                    return;
                }
            }
            num++;
            obj.value = $("<li><span>"+ num +"</span><span>"+res+"</span><span class='count'>1</span></li>");
            arr.push(obj);
            //不重复添加
            arr[len].value.insertBefore(last);
        })
        $('.delete').click(function (){
            arr.pop();
            $('.sear>li').eq(arr.length+5).remove();
        })
    })();

    $.ajax({
        url:'qb.json',
        success: function (data){
            var arr=[];
            var html = [{list:data[0]},{list:data[1]}];
            //分页数据
            arr.push(template('qb',html[0]),template('qb',html[1]));
            var pic = $('.pic');
            for(var i= 0,len=arr.length;i<len;i++){
                pic.eq(i).append(arr[i]);
            }
            change();
            mask();
        }
    });

    //切换分类
    function change(){
        var tab = $('.tab>li'),
            pic = $('.pic'),
            num = 0,
            lastnum = 0;
        tab.on('click',function (){
            num = $(this).index();
            tab.eq(lastnum).removeClass('on');
            pic.eq(lastnum).removeClass('on');
            tab.eq(num).addClass("on");
            pic.eq(num).addClass("on");
            lastnum = num;
        })
    }

    //左右按钮hover,click和二级变色
    (function btn(){
        var btn_l = $('.btn_l'),
            btn_r = $('.btn_r'),
            slide = $('#slide'),
            btn = $('.btn>li'),
            btn_a = btn.children(),
            pic = $('.pic'),
            obj={
                num:0,
                lastnum:0
            }
        slide.hover(function (){
            btn_l.css("left",0);
            btn_r.css("right",0);
        },function (){
            btn_l.css("left",-70);
            btn_r.css("right",-70);
        })
        slide.mousemove(function (e){
            var px = e.clientX;
            if(px<70){
                btn_l.css("background","#31c27c");
            }
            else if(px>1279){
                btn_r.css("background","#31c27c");
            }
            else{
                btn_l.css("background","rgba(153,153,153,.4)");
                btn_r.css("background","rgba(153,153,153,.4)");
            }
        })

        //左右按钮click
        btn_r.click(function (){
            //防止多次点击的BUG
            //如果是动画状态 直接返回
            if(pic.is(":animated")){
                return ;
            }
            next(btn_a,obj);
            if(pic.css("left") == "-3600px"){
                pic.css("left",0).animate({left:"-="+1200},500);
            }
            else{
                pic.animate({left:"-="+1200},500);
            }
        });
        btn_l.click(function (){
            if(pic.is(":animated")){
                return ;
            }
            prev(btn_a,obj);
            if(pic.css("left") == "0px"){
                pic.css("left",-3600).animate({left:"+="+1200},500);
            }
            else{
                pic.animate({left:"+="+1200},500);
            }
        })
        //下方横条click
        btn.click(function (){
            obj.num = Number(this.innerText)-1;
            pic.animate({left:obj.num*-1200+"px"},500);
            btn_a.eq(obj.lastnum).removeClass("on");
            btn_a.eq(obj.num).addClass("on");
            obj.lastnum = obj.num;
        });
    })();

    //左右按钮触发的横条变色
    function next(btn_a,obj){
        var on = $('.btn>li>a.on');
        obj.num = Number(on.parent()[0].innerText);
        if(obj.num == 3){
            btn_a.eq(2).removeClass("on");
            btn_a.eq(0).addClass("on");
            //重新赋值
            obj.num = 0;
        }
        else{
            btn_a.eq(obj.num-1).removeClass("on");
            btn_a.eq(obj.num).addClass("on");
        }
        obj.lastnum = obj.num;
    }
    function prev(btn_a,obj){
        var on = $('.btn>li>a.on');
        obj.num = Number(on.parent()[0].innerText);
        if(obj.num == 1){
            btn_a.eq(0).removeClass("on");
            btn_a.eq(2).addClass("on");
            obj.num = 2;
        }
        else{
            btn_a.eq(obj.num-1).removeClass("on");
            btn_a.eq(obj.num-2).addClass("on");
        }
        obj.lastnum = obj.num
    }

    //mask hover
    function mask(){
        var pic = $('.pic>li');
        pic.hover(function (){
            $(this.children[0]).stop().fadeIn();
            $(this.children[1].children[0]).css("transform","scale(1.1)");
            $(this.children[0].children).stop().css("transform","scale(1.5)");
        },function (){
            $(this.children[0]).stop().fadeOut();
            $(this.children[1].children[0]).css("transform","scale(1)");
            $(this.children[0].children).stop().css("transform","scale(1)");
        })
    };

    //fix hover
    (function fix(){
        //获取滚动事件
        $(window).scroll(function (){
            if($('body').scrollTop() == 0){
                f1.css("display","none");
            }
            else{
                f1.css("display","block");
            }
        })
        var f1 = $('.f1'),
            f2 = $('.f2'),
            f3 = $('.f3');
        f1.click(function (){
            $('body').animate({scrollTop:0},500);
        });
        f1.hover(function (){
            $(this).parent().addClass("on");
        },function (){
            $(this).parent().removeClass("on");
        })
        f2.hover(function (){
            $(this).html("意见反馈").addClass("on");
        },function (){
            $(this).html('').removeClass("on");
        });
        f3.hover(function (){
            $(this).html("播放器").addClass("on");
        },function (){
            $(this).html('').removeClass("on");
        });
    })();

});