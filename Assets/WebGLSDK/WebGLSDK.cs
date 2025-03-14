using System;
using LitJson;
using UnityEngine;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public class WebGLSDK : MonoBehaviour
{
#if UNITY_WEBGL 
#if !UNITY_EDITOR
    [DllImport("__Internal")]
    static extern void _SendMessageToWebGL(string funcName, string message);
#else
    static void _SendMessageToWebGL(string funcName, string message) {}
#endif

    static WebGLSDK m_instance;
    void Awake()
    {
        m_instance = this;
        Debug.Log("WebGLSDK Inited");
        SendMessage("__SaveProxyNameForUnity", m_instance.name);
    }

    static public void Init()
    {
        if(m_instance == null)
        {
            GameObject go = new GameObject("WebGLSDK");
            m_instance = go.AddComponent<WebGLSDK>();
            SendMessage("__SaveProxyNameForUnity", m_instance.name);
        }
    }

    static string m_strSendMessageToWebGLResult = "";
    void OnSendMessageToWebGLResult(string result)
    {
        m_strSendMessageToWebGLResult = result;
    }

    public static string SendMessage(string funcName, params string[] args)
    {
        Init();
        string message = null;
        if(args.Length == 1)
        {
            message = args[0];
        }
        else if(args.Length > 1)
        {
            //使用LitJson序列化参数
            JsonData data = new JsonData();
            for (int i = 0; i < args.Length; i++)
            {
                data.Add(args[i]);
            }
            message = data.ToJson();
        }
        m_strSendMessageToWebGLResult = null;
        _SendMessageToWebGL(funcName, message);
        return m_strSendMessageToWebGLResult;
    }

    static Dictionary<string, System.Action<string, JsonData>> m_webgleventDict = new Dictionary<string, System.Action<string, JsonData>>();
    void OnWebGLEvent(string json)
    {
        JsonData data = JsonMapper.ToObject(json);
        try
        {
            //解析json，获取Name和Param
            JsonData param = data["Param"];
            string name = data["Name"].ToString();
            m_webgleventDict.TryGetValue(name, out System.Action<string, JsonData> listener);
            if (listener != null)
            {
                Debug.Log("OnWebGLEvent: " + name + " " + param + " " + listener);
                listener(name, param);
            }
            else
            {
                Debug.LogWarning("OnWebGLEvent: " + name + " " + param + " no listener");
            }
        }
        catch (Exception e)
        {
            Debug.LogException(e);
        }
    }

    static public void AddListener(string eventName, System.Action<string, JsonData> listener)
    {
        if(listener == null)
        {
            return;
        }
        m_webgleventDict.TryGetValue(eventName, out System.Action<string, JsonData> oldListener);
        if(oldListener != null)
        {
            oldListener += listener;
        }
        else
        {
            m_webgleventDict.Add(eventName, listener);
        }
    }

    static public void DelListener(string eventName, System.Action<string, JsonData> listener)
    {
        if(listener == null)
        {
            return;
        }
        m_webgleventDict.TryGetValue(eventName, out System.Action<string, JsonData> oldListener);
        if(oldListener != null)
        {
            oldListener -= listener;
        }
    }
#endif
}