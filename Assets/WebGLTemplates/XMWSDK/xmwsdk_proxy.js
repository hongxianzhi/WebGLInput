var xmwsdk_proxy = {}
xmwsdk.init({
  appid: 1000001,
  channel: 10000,
})

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
  __SendMessageToUnity(host, "OnSendMessageToWebGLResult", result);
}

//通知Unity触发事件
let NotifyEvent = function (host,name,param) {
  let args = {
    Name: name,
    Param: param,
  }
  __SendMessageToUnity(host, "OnWebGLEvent", JSON.stringify(args));
}

xmwsdk.logincallback((data)=>{
  NotifyEvent(xmwsdk_proxy, "OnLoginCallback", data);
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

xmwsdk_proxy.LogJson = function (logJson) {
  console.log(JSON.parse(logJson))
}

xmwsdk_proxy.LogString = function (logString) {
  console.log(logString)
  return logString + " from WebGL";
}

window['_SDKProxy'] = xmwsdk_proxy
console.log('_SDKProxy loaded')