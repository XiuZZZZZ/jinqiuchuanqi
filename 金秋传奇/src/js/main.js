/**
 * 常用JS变量:
 * agentEvent = 代理模式下自动点击模块
 * acEvent= 无障碍模式下自动点击模块
 * device = 设备信息模块
 * file = 文件处理模块
 * http = HTTP网络请求模块
 * shell = shell命令模块
 * thread= 多线程模块
 * image = 图色查找模块
 * utils= 工具类模块
 * global = 全局快捷方式模块
 * 常用java变量：
 *  context : Android的Context对象
 *  javaLoader : java的类加载器对象
 * 导入Java类或者包：
 *  importClass(类名) = 导入java类
 *      例如: importClass(java.io.File) 导入java的 File 类
 *  importPackage(包名) =导入java包名下的所有类
 *      例如: importPackage(java.util) 导入java.util下的类
 *
 */

    function main() {
    //开始再这里编写代码了！！
    toast("Hello World");
    var name = readConfigString("name");
    logd("姓名: " + name);
    logd("年龄: " + readConfigString("age"));
    logd("听音乐: " + readConfigString("music"));
    logd("是不是一年级: " + readConfigString("one"));
    logd("备注: " + readConfigString("mark"));
    logd("开始 " + isServiceOk());
    // 注册函数给UI调用的例子
    regFuncToUI();
    // 调用UI uihello 函数例子
    let uih = callUIRegisteFunction("uihello", "-date-" + new Date());
    logd("调用 uihello 函数结果：" + uih)

    //如果自动化服务正常
    if (!autoServiceStart(3)) {
        logd("自动化服务启动失败，无法执行脚本")
        exit();
        return;
    }
    logd("开始执行脚本...")
    if (!netcardProcessor()) {
        return;
    }
    home();
}


function netcardProcessor() {
    logd("开始进行卡密验证")
    // 官方自带的卡密系统
    // appId 和 appSecret的值 请到 http://uc.ieasyclick.com/ 进行注册后提卡
    let appId = "";
    let appSecret = "";
    let cardNo = readConfigString("cardNo")
    if (cardNo == null || cardNo == undefined || cardNo.length <= 0) {
        toast("请输入卡密")
        loge("请输入卡密")
        exit()
        return false;
    }
    let inited = ecNetCard.netCardInit(appId, appSecret)
    logd("inited card => " + JSON.stringify(inited));
    let bind = ecNetCard.netCardBind(cardNo)
    let bindResult = false;
    if (bind != null && bind != undefined && bind["code"] == 0) {
        logd("卡密绑定成功")
        let leftDays = bind['data']['leftDays'] + "天";
        logd("剩余时间：" + leftDays);
        logd("激活时间：" + bind['data']['startTime'])
        logd("过期时间：" + bind['data']['expireTime'])
        bindResult = true;
        toast("卡密剩余时间:" + leftDays)
    } else {
        if (bind == null || bind == undefined) {
            loge("卡密绑定失败,无返回值 ")
            let msg = "卡密绑定失败,无返回值"
            loge(msg)
            toast(msg)
        } else {
            let msg = "卡密绑定失败: " + bind["msg"]
            loge(msg)
            toast(msg)
        }
    }
    return bindResult;
}


function autoServiceStart(time) {
    for (var i = 0; i < time; i++) {
        if (isServiceOk()) {
            return true;
        }
        var started = startEnv();
        logd("第" + (i + 1) + "次启动服务结果: " + started);
        if (isServiceOk()) {
            return true;
        }
    }
    return isServiceOk();
}

function regFuncToUI() {
    // 注册一个scripthello函数，UI可以调用
    registeScriptFunctionToUI("scripthello", function (data) {
        logd("我是 regFuncToUI 的打印:" + data)
        return "" + new Date();
    })

    // 在合适的时候移出注册的函数，一般不移出已不会影响
    //removeAllUIToScriptFunc();
    //removeAllScriptToUIFunc()
}

main();
