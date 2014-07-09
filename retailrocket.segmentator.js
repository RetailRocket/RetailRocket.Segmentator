var retailrocket = window["retailrocket"] || {};
 
retailrocket.segmentator = (function () {  
  var visitorSegmenRecordCookieName = "rr-VisitorSegment";
  
  var rrLibrary = {  
    getCookie: function (cName) {  
      var i, x, y, arRcookies = document.cookie.split(";");  
      for (i = 0; i < arRcookies.length; i++) {  
        x = arRcookies[i].substr(0, arRcookies[i].indexOf("="));  
        y = arRcookies[i].substr(arRcookies[i].indexOf("=") + 1);  
        x = x.replace(/^\s+|\s+$/g, "");  
        if (x == cName) {  
          return unescape(y);  
        }  
      }  
      return null;  
    },  
    daysToSecond: function (days) {  
      return days * 24 * 60 * 60;  
    },  
    setCookie: function (cName, value, expireInSecond, path) {  
      var exdate = new Date();  
      exdate.setSeconds(exdate.getSeconds() + expireInSecond);  
      var cValue = escape(value) + ((expireInSecond == null) ? "" : "; expires=" + exdate.toUTCString()) + (";path=" + (path || "/"));  
      document.cookie = cName + "=" + cValue;  
    }  
  };  
    
  return {  
    getVisitorSegment: function (nSegment, option) {  
      option = option || {};
      var visitorSegmentRecord = rrLibrary.getCookie(visitorSegmenRecordCookieName);
        
      if (!visitorSegmentRecord || visitorSegmentRecord.split(":")[0] != nSegment) {  
        visitorSegmentRecord = nSegment + ":" + (new Date().getTime() % nSegment);  
      }  
        
      rrLibrary.setCookie(visitorSegmenRecordCookieName, visitorSegmentRecord, rrLibrary.daysToSecond(option.expireInDay || 60), "/");  
      return visitorSegmentRecord.split(":")[1];  
    }  
  };  
}());  