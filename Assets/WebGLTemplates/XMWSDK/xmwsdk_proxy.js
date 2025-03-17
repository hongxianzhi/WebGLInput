
xmwsdk.init({
  //配置参数，根据实际情况填写
  appid: 1000001,
  channel: 10000,
})

//----------------------- 基础函数开始
let __SendMessageToUnity = function (host, funcName, message) {
  //返回给c#的结果
  let proxyName = host._ProxyNameForUnity;
  if(proxyName == null){
      console.error('ProxyNameForUnity is null');
      return;
  }

  let unityInstance = window.__unityInstance;
  if(unityInstance == null){
      console.error('unityInstance is null');
      return;
  }

  if(typeof message !== 'string'){
    message = "";
  }
  unityInstance.SendMessage(proxyName, funcName, message);
}

//返回结果给Unity
let RetResult = function (host, result) {
  //如果为null或undefined，不返回
  if(result == null){
    return;
  }
  if(result !== 'string'){
    result = result.toString();
  }
  __SendMessageToUnity(host, "OnSendMessageToWebGLResult", result);
}

//通知Unity触发事件
let NotifyEvent = function (host,name,param) {
  if(param == null){
    param = "";
  }

  let args = {
    Name: name,
    Param: param,
  }
  __SendMessageToUnity(host, "OnWebGLEvent", JSON.stringify(args));
}
//----------------------- 基础函数结束

var xmwsdk_proxy = {}

//登录回调
xmwsdk.logincallback((data)=>{
  NotifyEvent(xmwsdk_proxy, "logincallback", data);
});

//绑定邮箱回调
xmwsdk.bindEmailCallback((data)=>{
  NotifyEvent(xmwsdk_proxy, "bindEmailCallback", data);
});

//切换账号回调
xmwsdk.isSwitchAccount((data)=>{
  NotifyEvent(xmwsdk_proxy, "isSwitchAccount", data);
});

xmwsdk_proxy.__SaveProxyNameForUnity = function (proxyName) {
  xmwsdk_proxy._ProxyNameForUnity = proxyName;
  console.log('_ProxyNameForUnity is ' + proxyName);
}

xmwsdk_proxy.__Dispatcher = function (funcName, args) {
  let host = xmwsdk_proxy;
  let func = host[funcName];
  if(typeof func !== 'function'){
    host = xmwsdk;
    func = host[funcName];
  }
  if(typeof func !== 'function'){
    console.error('Method not found: ' + funcName);
    return;
  }
  RetResult(host, func(args));
}

xmwsdk_proxy.dopay = function (jsonString) {
  let args = JSON.parse(jsonString);
  //args为json数组，包含10个元素，拆开后挨个传入
  return xmwsdk.dopay(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
}

xmwsdk_proxy.roleUpdate = function (jsonString) {
  let args = JSON.parse(jsonString);
  //args为json数组，包含个元素，拆开后挨个传入
  return xmwsdk.roleUpdate(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
}

window['_SDKProxy'] = xmwsdk_proxy
console.log('_SDKProxy loaded')