/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url: string) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, " ") +
      '"}'
  );
}

export function deepClone(source: any) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments");
  }
  const targetObj: any = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time: any, cFormat: string): string {
  if (arguments.length === 0) {
    return '';
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  interface DateFormat {
    [index: string]: number;
  }
  const formatObj: DateFormat = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str: string = format.replace(
    /{(y|m|d|h|i|s|a)+}/g,
    (result: any, key: any) => {
      let value: any = formatObj[key];
      // Note: getDay() returns 0 on Sunday
      if (key === "a") {
        return ["日", "一", "二", "三", "四", "五", "六"][value];
      }
      if (result.length > 0 && value < 10) {
        value = "0" + value;
      }
      return value || "0";
    }
  );
  return time_str;
}

export function getQueryVariable(variable: any) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time: any, option: any) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d: any = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

/**
 * 计算两个日期之间的天数
 * @param dateString1  开始日期 yyyy-MM-dd
 * @param dateString2  结束日期 yyyy-MM-dd
 * @returns {number} 如果日期相同 返回一天 开始日期大于结束日期，返回0
 */
export function getDaysBetween(
  dateString1: string,
  dateString2: string
): number {
  var startDate = Date.parse(dateString1);
  var endDate = Date.parse(dateString2);
  if (startDate > endDate) {
    return 0;
  }
  if (startDate === endDate) {
    return 1;
  }
  var days: number = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
  return days;
}
