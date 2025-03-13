var WebGLSDK = {
    //调用web中的函数，并传递参数
    _SendMessageToWebGL: function (funcName, args) {
        let result = null;
        args = UTF8ToString(args);
        funcName = UTF8ToString(funcName);
        let proxy = window["_SDKProxy"];
        proxy["__Dispatcher"](funcName, args);
    }
};

mergeInto(LibraryManager.library, WebGLSDK);