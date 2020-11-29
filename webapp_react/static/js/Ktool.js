(function(){
  //日期转换扩展
  Date.prototype.Format = function (fmt) { //author: meizz 
    var cNumber=["日","一","二","三","四","五","六"];
    var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒
      'w+': cNumber[this.getUTCDay()], //星期
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  var Ktool = {};


  //arrayin函数扩充
  Ktool.karrayin = function(arr,v){
    var r = false;

    if(typeof(arr) == typeof([])){
      //数组处理
      for(var i=0;i<arr.length;i++){
        if(arr[i] == v){
          r = true;
        }
      }
    }else if(typeof(arr) == typeof({})){
      //对象处理
      for(var i in arr){
        if(arr[i] == v){
          r = true;
        }
      }
    }
    
    return r;
  }


  /**
   * 对象 key/value 对调
   */
  Ktool.kunshiftobj = function(obj){
    var newobj = {};

    for(var i in obj){
      newobj[ obj[i] ] = i;
    }

    return newobj;
  }
  

  /**
   * 从数组或对象中按条件检索数据返回
   * c条件 可传对象 或者字符串 x1=v1&x2=v2
   */
  Ktool.karrayquery = function(arr,c,v){
    var condition = {};
    var result    = [];

    var getResult = function(list,p){
      var r = [];
      for(var i in list){
        if(list[i][p[0]] == p[1]){
          if(v == true){
            r.push(list[i]);
          }else{
            r.push(list[i][v]);
          }
        }
      }

      return r;
    }

    //条件为字符串 x1=v1&x2=v2
    if(typeof(c) == typeof("")){
      var c1 = c.split("&");

      for(var i in c1){
        var c2 = c1[i].split("=");
        condition[c2[0]] = c2[1] ? c2[1] : "";
      }
    }else if(typeof(c) == typeof({})){
      condition = c;
    }

    //console.log([arr,condition,c,v]);

    var start = false;

    for(var j in condition){
      var _condition = [j,condition[j]];
      result = getResult(start ? result : arr,_condition);
      start = true;
    }

    return result;
  }
  

  /* 
    二维数组中获取键值的一列
    k 返回 [arr[k]]
    k和v 返回{k:v} 不存在的键值对会被过滤掉
    m = true时 表示一对多 k:[v,v,v]
  */
  Ktool.karrayget = function(arr,k,v,m){
    if(v){

      var result = {};
      
      for(var i in arr){

        if(v == true){
          
          if(m){
            if(!result[arr[i][k]]){result[arr[i][k]] = [];}

            result[arr[i][k]].push(arr[i]);
          }else{
            result[arr[i][k]] = arr[i];
          }
          
        }else{

          if(m){
            if(!result[arr[i][k]]){result[arr[i][k]] = [];}
            result[arr[i][k]].push(arr[i][v]);
          }else{
            if(arr[i][k]){result[arr[i][k]] = arr[i][v] ? arr[i][v] : "";}
          }
          
        }
      }

    }else{

      var result = [];

      for(var i in arr){
        result.push( arr[i][k] );
      }

    }
    
    return result;
  }

  /**
   * 删除数组中的某一项
   */
  Ktool.karrayremove = function(arr,index){
    var r = [];

    for(var i=0;i<arr.length;i++){
      if(i!=index){ r.push(arr[i]); }
    }

    return r;
  }


  /**
   * 解析url 为对象
   */
  Ktool.kgetUrlinfo = function(hash){
    var list = hash.split("#");

    var r = {}, arr = list[0].split("?");

    if(arr.length>1){
      arr=arr[1].split("&");
    }else{
      arr=[];
    }
    
    for(var i=0;i<arr.length;i++){
      var s=arr[i].split("=");
      
      if(s.length>0 && s[0]!="" && s[1]!=""){
        if(s.length==1){
          s[1]="";
        }
        
        r[s[0]] = decodeURIComponent( s[1] );
      }
    }

    if(list.length > 1){
      r.URLHASH = kgetUrlinfo(list[1]);
    }
    
    return r;
  }


  /* 传入对象，进行url拼接处理 */
  Ktool.Khttpbuildquery = function(list){
    var str = "?";

    var params = [];

    for(var i in list){
      params.push(i + "=" + encodeURIComponent(list[i]));
    }

    return params.length > 0 ? (str + params.join("&")) : '';
  }


  /* 基于 layui的 html render */
  Ktool.krender = function(dom){
    dom = typeof(dom) == typeof("") ? document.querySelector(dom) : dom;

    var render = {
      //渲染html模板
      aim:dom,

      jqaim:$(dom),

      //刷入html
      html:function(html){
        this.clear();
        this.jqaim.html(html);
      },

      //清理dom 内存
      clear:function(){
        var list = this.aim.querySelectorAll("*");

        for(var i = 0;i<list.length;i++){
          list[i].parentNode.removeChild(list[i]);
        }
      },

      //走模版
      _template:false,

      //渲染模式 1为刷入 2追加
      mode:1,

      //数据存储
      _data:false,

      rend:function(){
        if(!this._template || !this._data){
          //console.log("无数据或未设置模版");
          return false;
        }

        layui.laytpl(this._template).render(this._data,function(html){
          if(render.mode == 1){
            render.clear();
            render.jqaim.html(html);
            return false;
          }
          
          if(render.mode == 2){
            render.jqaim.append(html);
            return false;
          }
        });
      }
    };

    Object.defineProperties(render,{
      t:{
        get:function(){
          return this._template;
        },
        set:function(v){
          this._template = v;
          this.rend();
        }
      },
      d:{
        get:function(){
          return this._data;
        },
        set:function(v){
          this._data = v;
          this.rend();
        }
      }
    });

    return render;
  }


  /**
   * 获取数组中的最大值
   */
  Ktool.kgetmax = function(arr,key){
    if(key){
      arr.sort(function(a,b){ a[key] - b[key]; });
      return arr[0][key];
    }

    arr.sort(function(){ return a - b; });
    return arr[0];
  }


  /* 上传文件 */
  Ktool.kupload = function(url,data,opt){
    var xhr = new XMLHttpRequest();

    xhr.open('post',url);

    var filekey = opt.filekey ? opt.filekey : "file";

    xhr.onload = function(e) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
        var backdata = JSON.parse(xhr.responseText);
        opt.callback(backdata);
      }else {
        opt.callback({status:400,msg:"网络错误，上传失败"});
      }
    }
    
    if(opt.process){
      xhr.upload.addEventListener('progress', function(e) {
        pecent = ~~(100 * e.loaded / e.total);
        opt.process(pecent);
      }, false);
    }

    if(opt.headers){
      for(var i in opt.headers){
        xhr.setRequestHeader(i,opt.headers[i]);
      }
    }

    if(opt.datatype == "json"){
      //json格式上传
      var formdata = {};

      for(var i in data){
        if(i != filekey){
          formdata[i] = data[i];
        }
      }

      formdata[filekey] = data[filekey];

      xhr.send(JSON.stringify(formdata));
    }else{
      //普通表单上传
      var formdata = new FormData();

      for(var i in data){
        if(i != filekey){
          formdata.append(i,data[i]);
        }
      }

      formdata.append(filekey,data[filekey]);

      xhr.send(formdata);
    }
  }


  /* 图片压缩 */
  /**
   * 图片base64压缩
   * 支持input 或者传入base64
   * 等比缩放，不裁剪不变形
   */
  Ktool.kCompass = function(opt,callback){
    var width   = opt.width ? opt.width : 800;
    var height  = opt.height ? opt.height : 800;
    var quality = opt.quality ? opt.quality : 0.8;

    var result = {code:200,msg:"",result:{}};

    //base64模式
    if(opt.base64){
      var img     = new Image();

      img.onload = function(){
        result.result = kimageCompass(img,{width:width,height:height,quality:quality});
        callback( result );
      }

      img.src = opt.base64;
      return false;
    }

    //输入文件模式
    if(opt.fileinput){
      if(!opt.fileinput){
        result.code = 400;
        result.msg  = "文件不存在";

        callback(result);
        return false;
      }

      //检测文件格式
      if(opt.acceptType && !opt.acceptType.test(opt.fileinput.name)){
        result.code = 400;
        result.msg  = "图片格式不支持";

        callback(result);
        return false;
      }

      Ktool.kfilereader(opt.fileinput,function(imgdata){
        result.result = Ktool.kimageCompass(imgdata,{width:width,height:height,quality:quality});
        callback( result );
      },{callbackType:"image"});
    }
  }


  /**
   * 图压缩 base64图片数据
   */
  Ktool.kimageCompass = function(img,opt){
    opt = opt ? opt : {};
    var canvas    = document.createElement("canvas");

    if(img.width > opt.width || img.height > opt.height){
      if(img.width >= img.height){
        img.height *= opt.width/img.width;
        img.width  = opt.width;
      }else{
        img.width *= opt.height/img.height;
        img.height = opt.height;
      }
    }

    canvas.width  = img.width;
    canvas.height = img.height;
    
    var ctx    = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    return canvas.toDataURL(opt.filetype ? opt.filetype : "image/jpeg", opt.quality ? opt.quality : 0.8);
  }


  /**
   * 读取文件 input file 数据 
   */
  Ktool.kfilereader = function(file,callback,opt){
    opt = opt ? opt : {};
    var filereader = new FileReader();
        
    filereader.onload = function(evt){
      if(opt.callbackType == "image"){
        var img = new Image();

        img.onload = function(){
          callback(img);
        }

        img.src = evt.target.result;
        return false;
      }

      callback(evt.target.result);
    }

    filereader.readAsDataURL(file);
  }



  /* 脱敏处理 0位开始 */
  Ktool.strFix = function(str,start,end){
    var r = "";

    str = str + '';

    var list = str.split("");

    for(var i=0;i<list.length;i++){
      r += i>start && i<end ? "*" : list[i];
    }

    return r;
  }


  /**
   * 文本框信息输入控制 filter = ",|*|."
   * 控制输入框内的内容 无法输入指定的字符
   */
  Ktool.kinputcontroll = function(input,filter){
    var filters = new RegExp(filter);

    if(input.value == ""){
      return false;
    }

    var values   = input.value.split("");

    var last = values[values.length - 1];

    //检测最后的字符
    if(filters.test(last)){
      values[values.length - 1] = "";
      input.value = values.join('');
    }
  }


  /**
   * 用户客户端信息处理对象
   */
  Ktool.userAgent = {
    UNLOGIN:10000,

    userAgent:function(){
      return window.navigator.userAgent.toLowerCase();
    },

    //检测浏览器是否过老
    isLowBrower:function(){
      var userAgent = Ktool.userAgent.userAgent();
      var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("msie") > -1;

      return isIE;
    },

    isMobile:function(){
      return /android|iphone|symbianos|windows phone|ipad|ipod/.test( Ktool.userAgent.userAgent() );
    },

    //判断是微信
    isWX:function(){
      return /micromessenger/.test( Ktool.userAgent.userAgent() );
    },

    //判断是支付宝
    isAlipay:function(){
      return /alipayclient/.test( Ktool.userAgent.userAgent() );
    },

    //是否为安卓
    isAndroid:function(){
      var u = Ktool.userAgent.userAgent();
      return u.indexOf('android') > -1 || u.indexOf('adr') > -1;
    },

    //是否为ios
    isIOS:function(){
      return /\(i[^;]+;( U;)? cpu.+mac os x/.test( Ktool.userAgent.userAgent() );
    },

    //是否为微信小程序webview
    isWxMiniProgram:function(){
      return /miniprogram/.test( Ktool.userAgent.userAgent() );
    },

    //检测是否为钉钉
    isDingDing:function(){
      return /dingtalk/.test( FWCuserAuth.userAgent() );
    },
  }


  window.Ktool = Ktool;
})();