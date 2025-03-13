using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SDKTest : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        string strResult = WebGLSDK.SendMessage("LogString", "test log string");
        Debug.LogFormat("LogString: {0}, {1}", strResult, strResult.Length);
        strResult = WebGLSDK.SendMessage("dologin");
    }
}
