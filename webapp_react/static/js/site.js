//全局配置参数对象
var G = {
  //接口域名配置 或者 地址前缀
  api:"../../",

  //用户信息 存储和获取 不同项目 请修改用户存储的 localStorage的键值
  userinfo:function(userdata){
    var key = "DSSERVICE-USERINFO";

    if(userdata){
      localStorage[key] = JSON.stringify(userdata);
      return false;
    }

    if(localStorage[key]){
      return JSON.parse(localStorage[key]) || {};
    }
    
    return {};
  },


  //图片地址处理
  //p 图片地址
  //o 默认图
  //c 是否加去缓存参数
  Imgdeal:function(p,o,c,cdn){
    var r = "";
    var imgDomain = cdn ? cdn : "";
    
    var t1=/http/;
    var t2=/https/;
    
    if(p==undefined || p==null || !p){
      r = o;
    }else if(t1.test(p) || t2.test(p)){
      r = p + (c ? '?t=' + new Date().getHours() : "");
    }else{
      if(p.split("")[0]!="/"){
        r = imgDomain + "/" + p + (c ? '?t=' + new Date().getHours() : "");
      }else{
        r = imgDomain + p + (c ? '?t=' + new Date().getHours() : "");
      }
    }
    
    return r;
  },

  //cdn 图片地址处理
  CDNImgdeal:function(p){
    //cdn 图片存放域名
    var cdn = "";
    return G.Imgdeal(p,"",false,cdn);
  }
}


/**
 * 接口ajax请求 如果请求方式 有变动请修改此函数
 * 依赖 jq 或者zepto
 */
function Fnajax(u,param,callback,opt){
  if(!opt){ opt = {}; }

  var requestUrl = (opt.api ? opt.api : G.api) + u;

  var reqrest = {
    url:requestUrl,
    type:"POST",
    async:true,
    data:param,
    success:function(data){
      if(data.code == 10000){
        FnUnLoginDeal();
        return false;
      }
      
      callback(data);
    }
  };

  if(opt.extends){
    for(var i in opt.extends){ reqrest[i] = opt.extends[i]; }
  }

  $.ajax(reqrest);
}


/* 未登录处理 */
function FnUnLoginDeal(){
  RootApp.F_toLogin();
}


//加载动画
function FnLoading(bool,color){
  //颜色配置
  var themeList = {
    blue:"GLOBAL-loading-blue",
    red:"",
    green:"GLOBAL-loading-green",
  };

  if(bool){
    $("body").append('<div id="j-ui-loading" style="position:fixed; left:0; top:0;bottom:0; right:0; background:rgba(0,0,0,.5); z-index:9999999"><div style="display:table; width:100%; height:100%"><div style="display:table-cell; vertical-align:middle; text-align:center"><div class="GLOBAL-loading '+ (color && themeList[color] ? themeList[color] : themeList.blue)  +'" style="width:50px; height:50px"></div></div></div></div>');
  }else{
    $("#j-ui-loading").remove();
  }
}


/* 消息显示处理 */
var Jmgs = {
  msg:function(msg){
    layer.open({
      content: msg,
      skin: 'msg',
      time: 3
    });
  },

  alert:function(msg,btn){
    layer.open({
      content: msg,
      btn: btn ? btn : '确定'
    });
  },

  confirm:function(msg,callback,btn){
    layer.open({
      content: msg,
      btn: btn ? btn :['确定', '取消'],
      yes: function(index){
        callback(true);
        layer.close(index);
      },
      no:function(index){
        callback(false);
        layer.close(index);
      }
    });
  }
}
window.J_msgshow = Jmgs.msg;


/* 图片预览 */
function FnImgPreviewer(url){
  $("body").append('<div id="j-ui-imageviewer" onclick="FnHideImgPreviewer()" style="position:fixed; left:0; top:0;bottom:0; right:0; background:rgba(0,0,0,.5); z-index:19999999"><div style="display:table; width:100%; height:100%"><div style="display:table-cell; vertical-align:middle; text-align:center"><img src="'+ url +'" style="max-width:100%; max-height:100%;"></div></div></div>');
}

function FnHideImgPreviewer(){
  $("#j-ui-imageviewer").remove();
}