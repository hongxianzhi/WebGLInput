using LitJson;
using UnityEngine;

public class SDKTest : MonoBehaviour
{
    string m_strMessage = "SDKTest";
    void Start()
    {
        WebGLSDK.AddListener("logincallback", delegate (string name, JsonData param)
        {
            m_strMessage = string.Format("logincallback: {0}", param.ToJson());
            Debug.Log(m_strMessage);
        });
        WebGLSDK.AddListener("bindEmailCallback", delegate (string name, JsonData param)
        {
            m_strMessage = string.Format("bindEmailCallback: {0}", param.ToJson());
            Debug.Log(m_strMessage);
        });
        WebGLSDK.AddListener("isSwitchAccount", delegate (string name, JsonData param)
        {
            m_strMessage = string.Format("isSwitchAccount: {0}", param.ToJson());
            Debug.Log(m_strMessage);
        });
    }

    void OnGUI()
    {
        //在屏幕中央创建显示文本框，尺寸为文本颜色为红色，内容为m_strMessage，字号为20
        Color oldColor = GUI.contentColor;
        GUI.contentColor = Color.red;
        int width = Screen.width - 100;
        int height = Screen.height - 50;
        GUI.Label(new Rect(width / 2, height / 2, 100, 50), m_strMessage, new GUIStyle() { fontSize = 20 });
        GUI.contentColor = oldColor;

        //左上角创建显示登录按钮
        if (GUI.Button(new Rect(10, 10, 100, 50), "dologin"))
        {
            WebGLSDK.SendMessage("dologin");
        }
        //左上角创建显示拉起绑定邮箱按钮
        if (GUI.Button(new Rect(10, 70, 100, 50), "bindEmail"))
        {
            WebGLSDK.SendMessage("bindEmail");
        }
        //左上角创建显示切换账号按钮
        if (GUI.Button(new Rect(10, 130, 100, 50), "switchAccount"))
        {
            WebGLSDK.SendMessage("switchAccount");
        }
        //左上角创建角色上报按钮
        if (GUI.Button(new Rect(10, 190, 100, 50), "roleUpdate"))
        {
            WebGLSDK.SendMessage("roleUpdate","用户uid", "用户名称", "服务器id", "服务器名称", "角色ID", "角色名称", "角色等级", "支付等级");
        }
        //左上角创建显示支付按钮
        if (GUI.Button(new Rect(10, 250, 100, 50), "dopay"))
        {
            WebGLSDK.SendMessage("dopay","6","2018030115073428056673311", "102553", "1区", "奥金斧", "1", "6元充值礼包", "158005", "四中杜兰特", "42","com.pick.yc.588");
        }
        //左上角创建打点按钮
        if (GUI.Button(new Rect(10, 310, 100, 50), "staticEvent"))
        {
            WebGLSDK.SendMessage("staticEvent", "Loading_Completed");//初始化资源loading完毕
        }
    }
}
