//深拷贝
export function deepCloneObj(obj){
    var str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    } else if(window.JSON){
        str = JSON.stringify(obj), //系列化对象
        newobj = JSON.parse(str); //还原
    } else {
        for(var i in obj){
            newobj[i] = typeof obj[i] === 'object' ? 
            cloneObj(obj[i]) : obj[i]; 
        }
    }
    return newobj;
};

//获取日期
export function getTheDate(start,i) {
    var myDate = new Date(start).getTime();
	var lw = new Date(myDate + 1000 * 60 * 60 * 24 * i); //最后一个数字30可改，30天的意思
	var lastY = lw.getFullYear();
	var lastM = lw.getMonth() + 1;
	var lastD = lw.getDate();
	var startdate =
		lastY + '-' + (lastM < 10 ? '0' + lastM : lastM) + '-' + (lastD < 10 ? '0' + lastD : lastD); //三十天之前日期
	return startdate;
}