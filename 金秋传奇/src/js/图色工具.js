/**
 * 图色工具 — 封装 EC image 模块，方法名均为中文
 */

/**
 * 截图（全屏或指定区域）
 * @param {number} 重试次数 默认 3
 * @param {number} x 起始X
 * @param {number} y 起始Y
 * @param {number} ex 终点X
 * @param {number} ey 终点Y
 * @return {AutoImage|null}
 */
function 截图(x, y, ex, ey,重试次数) {
    重试次数 = 重试次数 || 3;
    return image.captureScreen(重试次数, x, y, ex, ey);
}

function 截图_全屏(){
    return image.captureFullScreen()
}

/**
 * 截图并保存到文件
 * @param {string} 保存路径
 * @param {number} 重试次数 默认 3
 * @return {boolean}
 */
function 截图并保存(保存路径, 重试次数) {
    重试次数 = 重试次数 || 3;
    return image.captureToFile(重试次数, 0, 0, 0, 0, 保存路径);
}

/**
 * 读取图片文件
 * @param {string} 路径
 * @return {AutoImage|null}
 */
function 读取图片(路径) {
    return image.readImage(路径);
}

/**
 * 获取图片指定坐标的像素色值
 * @param {AutoImage} 图片对象
 * @param {number} x
 * @param {number} y
 * @return {number|null}
 */
function 获取像素色值(图片对象, x, y) {
    return image.pixelInImage(图片对象, x, y);
}
/**
 * 定位图标元素
 * @return {Rect} 获取到定位元素返回 rect, 否则返回null
 */
function ff_定位元素(x, y, ex, ey, filePath){
    let ret = false
    //从 工程目录下res文件夹下读取文件
    let smallTmplate = readResAutoImage(filePath);
    //抓取屏幕
    let screenImage = image.captureScreen(3, x, y, ex, ey);

    if (smallTmplate == null) {
        screenImage.recycle();
        return null;
    }

    let points = image.findImage(screenImage, smallTmplate, 0, 0, 0, 0, 0.7, 0.8, 1, 5);
    logd("points " + JSON.stringify(points));

    smallTmplate.recycle();
    screenImage.recycle();
    if (points) {
        return points[0];
    }
    return null;


}


/**

@return {boolean} 找到返回 true，未找到返回 false
 */
function ff_识图_是否(x, y, ex, ey, filePath) {
    let ret = false
    //从 工程目录下res文件夹下读取文件
    let smallTmplate = readResAutoImage(filePath);
    //抓取屏幕
    let screenImage = image.captureScreen(3, x, y, ex, ey);
    if (screenImage != null) {
        //在图片中查找
        let points = image.findImage(screenImage, smallTmplate, 0,0,0,0, 0.7, 0.8, 1, 5);
        //这玩意是个数组
        if (points) {
            ret = true
            logd("points " + JSON.stringify(points));
        }
        //图片要回收
        image.recycle(screenImage)
    }
    //图片要回收
    image.recycle(smallTmplate)
    return ret;
}

function ff_点击(x, y, sleepTime = 1000) {
    clickPoint(x, y);
    sleep(sleepTime)
}

/**
 * 在当前屏幕找图
 * @param {AutoImage} 小图
 * @param {number} x
 * @param {number} y
 * @param {number} ex
 * @param {number} ey
 * @param {number} 弱阈值 默认 0.7
 * @param {number} 阈值 默认 0.9
 * @param {number} 限制数 默认 1
 * @return {Rect[]|null}
 */
function 屏幕找图(小图, x, y, ex, ey, 弱阈值, 阈值, 限制数) {
    return image.findImageEx(小图, x, y, ex, ey, 弱阈值, 阈值, 限制数);
}

/**
 * 等待小图在屏幕上出现
 * @param {AutoImage} 小图
 * @param {number} 超时时间 毫秒，默认 10000
 * @param {number} 间隔 轮询间隔毫秒，默认 1000
 * @param {number} 阈值 默认 0.9
 * @return {Rect|null} 找到返回区域对象，超时返回 null
 */
function 等待图片出现(小图, 超时时间, 间隔, 阈值) {
    超时时间 = 超时时间 || 10000;
    间隔 = 间隔 || 1000;
    阈值 = 阈值 || 0.9;
    var 开始时间 = time();
    while (time() - 开始时间 < 超时时间) {
        var 结果 = 屏幕找图(小图, 0, 0, 0, 0, 0.7, 阈值, 1);
        if (结果 != null && 结果.length > 0) {
            return 结果[0];
        }
        sleep(间隔);
    }
    return null;
}

/**
 * 等待小图从屏幕上消失
 * @param {AutoImage} 小图
 * @param {number} 超时时间 毫秒，默认 10000
 * @param {number} 间隔 轮询间隔毫秒，默认 1000
 * @param {number} 阈值 默认 0.9
 * @return {boolean} 消失返回 true，超时返回 false
 */
function 等待图片消失(小图, 超时时间, 间隔, 阈值) {
    超时时间 = 超时时间 || 10000;
    间隔 = 间隔 || 1000;
    阈值 = 阈值 || 0.9;
    var 开始时间 = time();
    while (time() - 开始时间 < 超时时间) {
        var 结果 = 屏幕找图(小图, 0, 0, 0, 0, 0.7, 阈值, 1);
        if (结果 == null || 结果.length == 0) {
            return true;
        }
        sleep(间隔);
    }
    return false;
}

/**
 * 找色 — 在指定区域查找颜色
 * @param {string} 颜色 如 "0xFF0000" 或 "#FF0000"
 * @param {number} 阈值 0.0 ~ 1.0 默认 0.9
 * @param {number} x
 * @param {number} y
 * @param {number} ex
 * @param {number} ey
 * @param {number} 限制数 默认 1
 * @param {number} 方向 1-8 默认 1
 * @return {PointIndex[]|null}
 */
function 找色(颜色, 阈值, x, y, ex, ey, 限制数, 方向) {
    return image.findColorEx(颜色, 阈值, x, y, ex, ey, 限制数, 方向);
}

/**
 * 比色 — 单点或多点比色，全部匹配返回 true
 * @param {string|string[]} 颜色点 如 "6|1|0xFF0000-0x101010,2|3|0x00FF00"
 * @param {number} 阈值 默认 0.9
 * @param {number} x 默认 0
 * @param {number} y 默认 0
 * @param {number} ex 默认 0
 * @param {number} ey 默认 0
 * @return {boolean}
 */
function 比色(颜色点, 阈值, x, y, ex, ey) {
    return image.cmpColorEx(颜色点, 阈值, x, y, ex, ey);
}

/**
 * 多点比色 — 传入多个颜色点组，依次匹配，返回匹配到的索引
 * @param {string[]} 颜色点组 数组，每组用逗号分隔
 * @param {number} 阈值 默认 0.9
 * @param {number} x 默认 0
 * @param {number} y 默认 0
 * @param {number} ex 默认 0
 * @param {number} ey 默认 0
 * @return {number} 匹配到的索引，-1 表示未匹配
 */
function 多点比色(颜色点组, 阈值, x, y, ex, ey) {
    return image.cmpMultiColorEx(颜色点组, 阈值, x, y, ex, ey);
}

/**
 * 多点找色
 * @param {string} 第一个颜色 如 "0xFF0000"
 * @param {string} 偏移点列表 如 "6|1|0x969696,1|12|0x969696"
 * @param {number} 阈值 默认 0.9
 * @param {number} x
 * @param {number} y
 * @param {number} ex
 * @param {number} ey
 * @param {number} 限制数 默认 1
 * @param {number} 方向 默认 1
 * @return {Point[]|null}
 */
function 多点找色(第一个颜色, 偏移点列表, 阈值, x, y, ex, ey, 限制数, 方向) {
    return image.findMultiColorEx(第一个颜色, 偏移点列表, 阈值, x, y, ex, ey, 限制数, 方向);
}

/**
 * 获取屏幕宽度
 * @return {number}
 */
function 获取屏幕宽度() {
    var img = 截图(1);
    if (img == null) return 0;
    var w = image.getWidth(img);
    img.recycle();
    return w;
}

/**
 * 获取屏幕高度
 * @return {number}
 */
function 获取屏幕高度() {
    var img = 截图(1);
    if (img == null) return 0;
    var h = image.getHeight(img);
    img.recycle();
    return h;
}



/**
 * 初始化图色模块（OpenCV + 截图权限）
 * @return {boolean}
 */
function 初始化图色模块() {
    // 1
    image.setInitParam({
        auto_click_request_dialog: true,  // 找图找色动作的最大时间，超时后会自动返回避免阻塞，单位是毫秒
        auto_detect_orientation: true  // 是否自动点击截屏授权对话框，默认是true，自动点击
    });
    // 2
    image.useOpencvMat(1);
    // 3
    let cvOk = image.initOpenCV();
    logd("初始化OpenCV: " + cvOk);
    // 4
    let scrOk = image.requestScreenCapture(10000, 0);
    logd("申请截图权限: " + scrOk);

    return cvOk && scrOk;
}
