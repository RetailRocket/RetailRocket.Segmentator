var retailrocket = window["retailrocket"] || {};

retailrocket.segmentator = (function () {
    var visitorSegmenRecordCookieName = "rr-VisitorSegment";

    function getCookie(cName) {
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
    }

    function setCookie(cName, value, expireInSecond, path, domain) {
        var exdate = new Date();
        exdate.setSeconds(exdate.getSeconds() + expireInSecond);

        var cValue = escape(value || "") + ((expireInSecond == null) ? "" : "; expires=" + exdate.toUTCString()) + (";path=" + (path || "/")) + (domain ? ";domain=" + punycode.toASCII(domain) : "");
        document.cookie = cName + "=" + cValue;
    }

    function setRootCookie(cName, value, expireInSecond) {
        var hostname = location.hostname;
        var subDomains = hostname.split('.');

        for (var i = 1; i <= subDomains.length; i++) {
            var domain = subDomains.slice(subDomains.length - i).join(".");
            setCookie(cName, value, expireInSecond, "/", domain);
            if (getCookie(cName) == value)
                break;
        }
    }

    var rrLibrary = {
        getCookie: getCookie,
        daysToSecond: function (days) {
            return days * 24 * 60 * 60;
        },
        setRootCookie: setRootCookie
    };

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return {
        getVisitorSegment: function (nSegment, option) {
            option = option || {};
            var visitorSegmentRecord = rrLibrary.getCookie(visitorSegmenRecordCookieName);

            if (!visitorSegmentRecord || visitorSegmentRecord.split(":")[0] != nSegment) {
                visitorSegmentRecord = nSegment + ":" + randomInt(1, nSegment);
            }

            rrLibrary.setRootCookie(visitorSegmenRecordCookieName, visitorSegmentRecord, rrLibrary.daysToSecond(option.expireInDay || 60), "/");
            return visitorSegmentRecord.split(":")[1];
        }
    };
}());
