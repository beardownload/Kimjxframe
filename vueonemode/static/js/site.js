var G = {
  //接口配置
  api:"",

  //存储和获取用户信息
  userinfo:function(userdata){
    var name = "K-USERINFO";

    if(userdata){
      localStorage[name] = JSON.stringify(userdata);
      return false;
    }

    return localStorage[name] ? JSON.parse(localStorage[name]) : {};
  },


}