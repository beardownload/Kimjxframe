(function(){
  /**
   * 开发环境es6支持 完成后将模版js文件 转换为es5即可
   */
  window.KJ = {
    CONFIG:{
      //根目录 js文件存放目录 走js可跨域存放页面 html必须存放一起或者后端做跨域处理
      root:"",

      //初始化文件
      start:"app.js",

      //页面js存放地
      pageroot:"pages/",

      //默认初始框架页 hash值
      defaultframe:"main/main",

      //默认主页
      defaultpage:"main/index",

      //顶部渲染页面dom点
      appdom:document.createElement("div"),

      //默认页面运行模式 js 和 html
      runmode:"js",

      //模版加载模式 默认 js和html || api 接口模式可做跨域处理
      Templatemode:"default",

      //模版接口模式 地址
      TemplatemodeAPI:"",

      //js 缓存版本控制 修改该属性即可控制版本缓存
      cachevesion:"",

      //版本控制键值
      cachevesionkey:"kv",
      
      fileTagReg:/<(K-FILE)[^>]*>/gi,
      fileTag:'K-FILE'
    },

    
    //事件
    EVENT:{
      hashchange:{},
    },

    //js文件缓存列表 地址为key value为状态 1加载中 2加载完成
    JSCACHE:{},

    //css缓存列表
    CSSCAHCE:{},

    //hash解析 {page:'页面地址',GET:"?后面参数",rawURL:'原始hash'}
    HASH:{},

    //回调存储列表
    LOADERCALLBACK:{},

    //页面app类对象
    APP:{},

    //运行的实例app对象
    APPLIST:[],

    //自定义dom点渲染
    DOMRENDER:{},

    //初始化
    init:function(config){
      var _this = KJ;

      for(var i in config){
        _this.CONFIG[i] = config[i];
      }

      //兼容老版本
      Object.defineProperties(KJ,{
        cachevesionkey:{
          get:function(){
            return KJ.CONFIG.cachevesionkey;
          },
          set:function(v){
            KJ.CONFIG.cachevesionkey = v;
          }
        },

        cachevesion:{
          get:function(){
            return KJ.CONFIG.cachevesion;
          },
          set:function(v){
            KJ.CONFIG.cachevesion = v;
          }
        },
      });

      //监听hash
      window.addEventListener("hashchange", _this.Fnhashchange , false);

      document.body.appendChild(_this.CONFIG.appdom);

      _this.Fnloader(_this.CONFIG.start);
    },

    //事件统一处理函数
    Fneventdeal:function(name,data){
      var _this = KJ;
      
      for(var i in _this.EVENT[name]){
        if(data){
          _this.EVENT[name][i](data);
        }else{
          _this.EVENT[name][i]();
        };

      }
    },

    //注册全局事件 返回事件注册后的ID
    Fnregistevent:function(name,f){
      var _this = KJ;

      var id = new Date().getTime() + '' + parseInt(Math.random()*10000);

      if(!_this.EVENT[name]){
        _this.EVENT[name] = {};
      }

      _this.EVENT[name][id] = f;

      return id;
    },

    //取消全局事件 传入事件ID
    Fnunregistevent:function(name,id){
      var _this = this;

      delete _this.EVENT[name][id];
      return true;
    },

    //从根目录 加载js页面资源
    Fnloader:function(u,callback){
      var _this = KJ;
      var url   = _this.CONFIG.root + u;

      _this.Fnloadjs(url,function(){
        if(callback){callback()};
      });
    },
    
    //加载页面 根据后缀加载页面资源
    Fnpageloader:function(u,callback){
      var pnf = u.split("."),
        ext,
        _this = KJ;

      if(pnf.length>1){
        ext = pnf[pnf.length-1];
      }else{
        ext = _this.CONFIG.runmode;
        u = u + "." + ext;
      }

      if(ext == "js"){
        _this.FngetJsTemplate(u,callback);
      }else{
        _this.FngetTemplate(u,callback);
      }
    },
    
    // 批量加载页面
    FnmultyPageLoader:function(list,callback){
      if(list.length <= 0){
        callback();
        return;
      }
      
      var total  = list.length;
      var loaded = 0;
      
      var loader = function(){
        KJ.Fnpageloader(list[loaded],function(){
          loaded++;
          
          if(loaded >= total){
            callback();
          }else{
            loader();
          }
        });
      }
      
      loader();
    },
    
    //从页面目录 加载js页面资源
    FngetJsTemplate:function(u,callback){
      var _this = KJ;

      var url

      //页面接口模式 OR 默认模式
      if(_this.CONFIG.Templatemode == "api"){
        url = _this.CONFIG.root + _this.CONFIG.pageroot + _this.CONFIG.TemplatemodeAPI + "?page=" + u + "&runmode=js";
      }else{
        url = _this.CONFIG.root + _this.CONFIG.pageroot + u;
      }

      KJ.Fnloadjs(url,function(){
        if(callback){callback()};
      });
    },


    //加载html页面
    FngetTemplate:function(u,callback,fail){
      var _this = KJ;

      if(_this.APP[u]){
        if(callback){callback()};
        return;
      }

      var url;

      //页面接口模式 OR 默认模式
      if(_this.CONFIG.Templatemode == "api"){
        url = _this.CONFIG.root + _this.CONFIG.pageroot + _this.CONFIG.TemplatemodeAPI + "?page=" + u + "&runmode=html";
      }else{
        if(u.split("?").length > 1){
          url = _this.CONFIG.root + _this.CONFIG.pageroot + u + (KJ.CONFIG.cachevesion ? "&"+ KJ.CONFIG.cachevesionkey +"=" + KJ.CONFIG.cachevesion : "");
        }else{
          url = _this.CONFIG.root + _this.CONFIG.pageroot + u + (KJ.CONFIG.cachevesion ? "?"+ KJ.CONFIG.cachevesionkey +"=" + KJ.CONFIG.cachevesion : "");
        }
      }

      var xhr = new XMLHttpRequest();
      xhr.open('get', url, true);

      xhr.onload = function () {
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0){

          //页面获取成功 注册页面
          _this.Fnregistpage(xhr.responseText,function(){
            if(callback){callback()};
          },u);

        }else{
          if(fail){
            fail();
          }else{
            //页面获取失败
            _this.Fnregistpage('页面加载失败, errCode:' + xhr.status,function(){
              if(callback){callback()};
            },u);
          }
        }
      }

      xhr.send("");
    },


    //获取模版html
    getApp:function(u){
      var pnf = u.split(".");

      if(pnf.length <= 1){
        u = u + "." + KJ.CONFIG.runmode;
      }

      return KJ.APP[u];
    },


    //加载资源 [["地址","js/css"]]
    Fnuse:function(list,callback){
      var _this = KJ;
      var count = 0;

      var deal = function(){
        if(count >= list.length){
          if(callback){ callback(); }
        }else{
          if(list[count][1] == "css"){
            _this.Fnloadcss(list[count][0],function(){ count++; deal(); });
          }else if(list[count][1] == "js"){
            _this.Fnloadjs(list[count][0],function(){ count++; deal(); });
          }
        }
      }

      deal();
    },

    //加载js
    Fnloadjs:function(u,callback,fail){
      var _this = KJ;

      if(!_this.LOADERCALLBACK[u]){
        _this.LOADERCALLBACK[u] = [];
      }

      if(_this.JSCACHE[u] == 2){
        if(callback){ callback(); }
        return false;
      }

      if(_this.JSCACHE[u] == 1){
        _this.LOADERCALLBACK[u].push(callback);
        return false;
      }

      _this.LOADERCALLBACK[u].push(callback);
      _this.JSCACHE[u] = 1;

      var script = _this.Fncel("script");

      script.onload = function(){
        _this.JSCACHE[u] = 2;

        for(var i in _this.LOADERCALLBACK[u]){
          _this.LOADERCALLBACK[u][i]();
        }
        
        delete _this.LOADERCALLBACK[u];

        document.body.removeChild(script);
      }

      script.onerror = function(){
        if(fail){
          fail();
        }else{
          console.error([u,"加载失败！"]);
        }
      }

      if(u.split("?").length > 1){
        script.src = u + (KJ.CONFIG.cachevesion ? "&"+ KJ.CONFIG.cachevesionkey +"=" + KJ.CONFIG.cachevesion : "");
      }else{
        script.src = u + (KJ.CONFIG.cachevesion ? "?"+ KJ.CONFIG.cachevesionkey +"=" + KJ.CONFIG.cachevesion : "");
      }
      
      document.body.appendChild(script);
    },

    //加载css
    Fnloadcss:function(u,callback){
      var _this = KJ;

      if(!_this.LOADERCALLBACK[u]){
        _this.LOADERCALLBACK[u] = [];
      }

      if(_this.CSSCAHCE[u] == 2){
        if(callback){ callback(); }
        return false;
      }

      _this.LOADERCALLBACK[u].push(callback);
      _this.CSSCAHCE[u] = 1;

      var link = _this.Fncel("link");
      link.rel = "stylesheet";

      link.onload = function(){
        for(var i in _this.LOADERCALLBACK[u]){
          _this.LOADERCALLBACK[u][i]();
        }

        _this.CSSCAHCE[u] = 2;
        delete _this.LOADERCALLBACK[u];
      }

      link.onerror = function(){
        console.error([u,"加载失败！"]);
      }

      link.href = u + (KJ.CONFIG.cachevesion ? "?"+ KJ.CONFIG.cachevesionkey +"=" + KJ.CONFIG.cachevesion : "");

      document.head.appendChild(link);
    },

    //创建元素
    Fncel:function(ename){
      return document.createElement(ename);
    },
    
    // 后缀处理
    FnFileExtendsDeal:function(file){
      var pnf = file.split(".");
      
      if(pnf.length <= 1){
        file = file + "." + KJ.CONFIG.runmode;
      }
      
      return file;
    },

    //注册页面对象 没有name则会以hash作为name创建
    Fnregistpage:function(html,callback,name){
      var _this = KJ;

      var u = !name ? _this.HASH.page : name;

      var pnf = u.split(".");

      if(pnf.length <= 1){
        u = u + "." + KJ.CONFIG.runmode;
      }
      
      _this.FntemplateFileDeal(html,function(_html){
        _this.APP[u] = _html;
        if(callback){callback();}
      },u);
    },
    
    // 文件融合处理
    FntemplateFileDeal:function(html,callback,parent){
      var _this = KJ;
      
      var toolDom = KJ.Fncel('div');
      
      var list = html.match(KJ.CONFIG.fileTagReg);
      var urlList = [];
      var currentPath = '';
      
      if(parent){
        var pathList = parent.split('/');
        pathList.reverse();
        pathList.splice(0,1);
        pathList.reverse()
        currentPath = pathList.join('/');
      }
      
      if(list && list.length > 0){
        toolDom.innerHTML = list.join('');
        
        var domList = toolDom.querySelectorAll(KJ.CONFIG.fileTag);
        
        for(var i=0;i<domList.length;i++){
          var filePath = domList[i].getAttribute('file');
          var filePathSplit = filePath.split('/');
          
          if(filePathSplit[0] == '.'){
            filePathSplit[0] = currentPath;
          }
          
          urlList.push(filePathSplit.join('/'));
        }
        
        KJ.FnmultyPageLoader(urlList,function(){
          for(var i=0;i<list.length;i++){
            var url = _this.FnFileExtendsDeal(urlList[i]);
            html = html.replace(list[i],_this.APP[url]);
          }
          
          callback(html);
        });
      }else{
        callback(html);
      }
    },

    //URL解析参数
    FngetGet:function(hash){
      var r={};

      var arr=hash.split("?");

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
      
      return r;
    },

    //hash事件处理
    Fnhashchange:function(e){
      var _this = KJ;

      //修复低版本浏览器事件数据不完整问题
      if(e && e.newURL){
        _this.HASH.rawURL = e ? e.newURL : location.href;
        _this.HASH.oldURL = e ? e.oldURL : location.href;
      }else{
        _this.HASH.oldURL = _this.HASH.rawURL ? _this.HASH.rawURL : "";
        _this.HASH.rawURL = location.href;
      }
      
      var pageparam = _this.HASH.rawURL.split("#");

      var page = pageparam.length > 1 ? pageparam[1].split("?")[0] : false;

      _this.HASH.page = page || _this.CONFIG.defaultpage;
      _this.HASH.GET  = _this.FngetGet(pageparam.length > 1 ? pageparam[1] : "");

      _this.Fneventdeal("hashchange",{e:e,hash:_this.HASH});
    },

    //清理dom点 协助内存回收 如果flag=true 自身也清理
    Fncleardocument:function(aim,flag){
      var list = aim.querySelectorAll("*");

      for(var i = 0;i<list.length;i++){
        list[i].parentNode.removeChild(list[i]);
      }

      if(flag){
        aim.parentNode.removeChild(aim);
      }
    }
  };
})();