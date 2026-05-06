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
    logi("===== 金秋传奇脚本启动 =====");
    if (!初始化()) {
        loge("初始化失败，脚本退出");
        exit();
        return;
    }
    logi("===== 初始化完成，进入挂机循环 =====");

    if(!初始化数据()){
        loge("初始化数据失败，脚本退出");
        exit();
        return;
    }

    挂机主循环();
}

function 初始化() {
    logd("开始初始化...");

    // 1. 图色模块
    if (!初始化图色模块()) {
        return false;
    }

    // 2. 自动化服务
    if (!autoServiceStart(3)) {
        loge("自动化服务启动失败");
        return false;
    }
    logd("自动化服务正常");

    // 3. 卡密验证
    if (!netcardProcessor()) {
        return false;
    }

    return true;
}

function 初始化数据(){
    g_线路 = {
        "兽人古墓线路1": [
            { "兽人古墓第一层": { "是否入口": true, "入口方式": "传送员", "入口参数": "" } },
            { "兽人古墓第二层": { "坐标位置": [111, 222], "精确位置": [333, 444] } },
            { "兽人古墓第三层": { "坐标位置": [111, 222], "精确位置": [333, 444] } },
            { "骷髅王墓地": { "坐标位置": [111, 222], "精确位置": [333, 444] } }
        ],
        "蜈蚣洞穴线路1": [
            { "兽人古墓第一层": { "是否入口": true, "入口方式": "传送员", "入口参数": "" } },
            { "兽人古墓第二层": { "坐标位置": [111, 222], "精确位置": [333, 444] } },
            { "兽人古墓第三层": { "坐标位置": [111, 222], "精确位置": [333, 444] } },
            { "骷髅王墓地": { "坐标位置": [111, 222], "精确位置": [333, 444] } }
        ]
    }
}

function 挂机主循环() {

    setInterval(function() {
        cz_使用装备()
        cz_回收();
    }, 5000);


    var 挂机上一轮 = 0;
    let 挂机时间 = 2 * 60 * 1000
    while (true) {
        if (isScriptExit()) {
            break;
        }
        let 当前时间 = time();
        if (当前时间 - 挂机上一轮 >= 挂机时间) {
            挂机一轮();
            挂机上一轮 = 当前时间;
        }
        sleep(500);
    }

}

function 挂机一轮() {


}

function 原生main(){
    toast("Hello World");
    var name = readConfigString("name");
    logd("姓名: " + name);
    logd("年龄: " + readConfigString("age"));
    logd("听音乐: " + readConfigString("music"));
    logd("是不是一年级: " + readConfigString("one"));
    logd("备注: " + readConfigString("mark"));
    logd("开始 " + isServiceOk());
    regFuncToUI();
    let uih = callUIRegisteFunction("uihello", "-date-" + new Date());
    logd("调用 uihello 函数结果：" + uih)
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

function tool_drawDebugBox(x1, y1, x2, y2, showTime = 1000) {
    let tag = "debugBox"; // 悬浮窗的唯一标签

    // 【核心修改点：计算宽、高和起始点】
    // 1. 计算实际的左上角坐标 (取两个点中较小的x和较小的y)
    let startX = Math.min(x1, x2);
    let startY = Math.min(y1, y2);

    // 2. 计算框的宽度和高度 (两点之间的绝对距离)
    let boxWidth = Math.abs(x1 - x2);
    let boxHeight = Math.abs(y1 - y2);

    // 容错处理：如果宽度或高度是0，强制设为1，防止悬浮窗异常
    if (boxWidth === 0) boxWidth = 1;
    if (boxHeight === 0) boxHeight = 1;

    // 检查悬浮窗权限 (EasyClick 内置函数)
    let p = floaty.requestFloatViewPermission(1000);
    if (!p) {
        logd("没有悬浮窗权限，无法画框");
        return;
    }

    // 显示悬浮窗，加载 box.xml，并将它显示在计算出的左上角坐标
    // (如果你的 box.xml 在 layout 文件夹下，请改为 "layout/box.xml")
    floaty.showFloatXml(tag, "box.xml", startX, startY);

    // 调整悬浮窗的宽度和高度到计算出的大小
    floaty.updateSize(tag, boxWidth, boxHeight);

    // 【重要】设置悬浮窗为不可触摸，点击事件穿透到游戏
    floaty.touchable(tag, false);

    // 倒计时后自动关闭
    if (showTime > 0) {
        sleep(showTime);
        floaty.close(tag);
    }
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
