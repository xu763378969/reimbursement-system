import dayjs from "dayjs";

export const unixToTime = (unix: number) => {
  return dayjs(unix).format("YYYY-MM-DD HH:mm:ss");
};

export const unixToDate = (unix: number) => {
  return dayjs(unix).format("YYYY-MM-DD");
};

/* eslint-disable */
// 去除空格 type 1-所有空格 2-前后空格 3-前空格 4-后空格
export function trim(value: string, trim: number) {
  switch (trim) {
    case 1:
      return value.replace(/\s+/g, "");
    case 2:
      return value.replace(/(^\s*)|(\s*$)/g, "");
    case 3:
      return value.replace(/(^\s*)/g, "");
    case 4:
      return value.replace(/(\s*$)/g, "");
    default:
      return value;
  }
}

//保留2位小数
export function toFixed(val: any, acc: any) {
  let num = parseFloat(val);
  if (isNaN(num)) {
    num = 0;
  }
  let accuracy = parseInt(acc);
  if (isNaN(accuracy) || accuracy < 0 || accuracy > 10) {
    accuracy = 2;
  }
  return num.toFixed(accuracy);
}
//任意格式日期处理
//使用格式：
// {{ '2018-09-14 01:05' | formatDate(yyyy-MM-dd hh:mm:ss) }}
// {{ '2018-09-14 01:05' | formatDate(yyyy-MM-dd) }}
// {{ '2018-09-14 01:05' | formatDate(MM/dd) }} 等
interface DateFormat {
  [index: string]: number;
}
export function formatDate(value: any, fmt: any) {
  var date = new Date(value);
  var o: DateFormat = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "w+": date.getDay(), //星期
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o) {
    if (k === "w+") {
      if (o[k] === 0) {
        fmt = fmt.replace("w", "周日");
      } else if (o[k] === 1) {
        fmt = fmt.replace("w", "周一");
      } else if (o[k] === 2) {
        fmt = fmt.replace("w", "周二");
      } else if (o[k] === 3) {
        fmt = fmt.replace("w", "周三");
      } else if (o[k] === 4) {
        fmt = fmt.replace("w", "周四");
      } else if (o[k] === 5) {
        fmt = fmt.replace("w", "周五");
      } else if (o[k] === 6) {
        fmt = fmt.replace("w", "周六");
      }
    } else if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
}

export function padLeftZero(str: any) {
  return ("00" + str).substr(str.length);
}

//格式化处理字符串
//ecDo.formatText('1234asda567asd890')
//result："12,34a,sda,567,asd,890"
//ecDo.formatText('1234asda567asd890',4,' ')
//result："1 234a sda5 67as d890"
//ecDo.formatText('1234asda567asd890',4,'-')
//result："1-234a-sda5-67as-d890"
export function formatText(str: any, size: any, delimiter: any) {
  var _size = size || 3,
    _delimiter = delimiter || ",";
  var regText = "\\B(?=(\\w{" + _size + "})+(?!\\w))";
  var reg = new RegExp(regText, "g");
  return str.replace(reg, _delimiter);
}

//现金额大写转换函数
//ecDo.upDigit(168752632)
//result："人民币壹亿陆仟捌佰柒拾伍万贰仟陆佰叁拾贰元整"
//ecDo.upDigit(1682)
//result："人民币壹仟陆佰捌拾贰元整"
//ecDo.upDigit(-1693)
//result："欠人民币壹仟陆佰玖拾叁元整"
export function upDigit(n: any) {
  var fraction = ["角", "分", "厘"];
  var digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  var unit = [
    ["元", "万", "亿"],
    ["", "拾", "佰", "仟"]
  ];
  var head = n < 0 ? "欠人民币" : "人民币";
  n = Math.abs(n);
  var s = "";
  for (var i = 0; i < fraction.length; i++) {
    s += (
      digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
    ).replace(/零./, "");
  }
  s = s || "整";
  n = Math.floor(n);
  for (var i = 0; i < unit[0].length && n > 0; i++) {
    var p = "";
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
    //s = p + unit[0][i] + s;
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, "元")
      .replace(/(零.)+/g, "零")
      .replace(/^整$/, "零元整")
  );
}

//字符替换*，隐藏手机号或者身份证号等
//replaceStr(字符串,字符格式, 替换方式,替换的字符（默认*）)
//ecDo.replaceStr('18819322663',[3,5,3],0)
//result：188*****663
//ecDo.replaceStr('asdasdasdaa',[3,5,3],1)
//result：***asdas***
//ecDo.replaceStr('1asd88465asdwqe3',[5],0)
//result：*****8465asdwqe3
//ecDo.replaceStr('1asd88465asdwqe3',[5],1,'+')
//result："1asd88465as+++++"
export function replaceStr(str: string, regArr: any, type: any, ARepText: any) {
  var regtext = "",
    Reg = null,
    replaceText = ARepText || "*";
  //repeatStr是在上面定义过的（字符串循环复制），大家注意哦
  if (regArr.length === 3 && type === 0) {
    regtext =
      "(\\w{" + regArr[0] + "})\\w{" + regArr[1] + "}(\\w{" + regArr[2] + "})";
    Reg = new RegExp(regtext);
    var replaceCount = this.repeatStr(replaceText, regArr[1]);
    return str.replace(Reg, "$1" + replaceCount + "$2");
  } else if (regArr.length === 3 && type === 1) {
    regtext =
      "\\w{" + regArr[0] + "}(\\w{" + regArr[1] + "})\\w{" + regArr[2] + "}";
    Reg = new RegExp(regtext);
    var replaceCount1 = this.repeatStr(replaceText, regArr[0]);
    var replaceCount2 = this.repeatStr(replaceText, regArr[2]);
    return str.replace(Reg, replaceCount1 + "$1" + replaceCount2);
  } else if (regArr.length === 1 && type === 0) {
    regtext = "(^\\w{" + regArr[0] + "})";
    Reg = new RegExp(regtext);
    var replaceCount = this.repeatStr(replaceText, regArr[0]);
    return str.replace(Reg, replaceCount);
  } else if (regArr.length === 1 && type === 1) {
    regtext = "(\\w{" + regArr[0] + "}$)";
    Reg = new RegExp(regtext);
    var replaceCount = this.repeatStr(replaceText, regArr[0]);
    return str.replace(Reg, replaceCount);
  }
}

// 格式化数字三位加一逗号
export function NumFormat(value: any) {
  if (!value) return "0.00";

  /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
  /*后来改成了 Number(value)|0,但是输入超过十一位就为负数了，具体见评论 */
  var intPart = Number(value) - (Number(value) % 1); //获取整数部分（这里是windy93的方法）
  var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); //将整数部分逢三一断

  var floatPart = ".00"; //预定义小数部分
  var value2Array = value.toString().split(".");

  //=2表示数据有小数位
  if (value2Array.length == 2) {
    floatPart = value2Array[1].toString(); //拿到小数部分

    if (floatPart.length == 1) {
      //补0,实际上用不着
      return intPartFormat + "." + floatPart + "0";
    } else {
      return intPartFormat + "." + floatPart;
    }
  } else {
    return intPartFormat + floatPart;
  }
}
