
/**
 * KHMER LUNAR CALENDAR (ចន្ទគតិខ្មែរ) - JavaScript Engine
 * Ported from modKhmerLunaCalendar_V7.bas (VBA) by Muong Maraing
 * (c) 2026 Muong Maraing. All rights reserved.
 *
 * This is a complete JavaScript port of the Chhankitek algorithm.
 * Zero external dependencies — works standalone in any browser.
 * FIX 2026-07-27: Normalize date to midnight before computing diffDays
 * to prevent Math.round() from rounding up the day count after noon.
 */

const KhmerLunarCalendar = (function() {

    function buildKhmer(csv) {
        if (!csv) return '';
        return csv.split(',').map(cp => String.fromCharCode(parseInt(cp))).join('');
    }

    const FMT = {
        DAY: buildKhmer("6032,6098,6020,6083"),
        MONTH: buildKhmer("6017,6082"),
        YEAR: buildKhmer("6022,6098,6035,6070,6086"),
        BE: buildKhmer("6038,6075,6033,6098,6034,6047,6016,6042,6070,6023"),
        CORR: buildKhmer("6031,6098,6042,6076,6044,6035,6073,6020,6032,6098,6020,6083,6033,6072"),
        KHEUT: buildKhmer("6016,6078,6031"),
        REACH: buildKhmer("6042,6084,6021"),
        SEIL: buildKhmer("6047,6072,6043"),
        FS: buildKhmer("6048,6075,6020,6047,6090,6075,6041"),
        CHONG: buildKhmer("6022,6075,6020"),
        ZODIAC: buildKhmer("6031,6070,6042,6070,6035,6071,6016,6042"),
        TODAY: buildKhmer("6032,6098,6020,6083,6035,6081,6087"),
        RASI: buildKhmer("6042,6070,6047,6072"),
    };

    const CODEPOINTS = {
        "MONTH_01": "6040,6071,6018,6047,6071,6042",
        "MONTH_02": "6036,6075,6047,6098,6047",
        "MONTH_03": "6040,6070,6019",
        "MONTH_04": "6037,6043,6098,6018,6075,6035",
        "MONTH_05": "6021,6081,6031,6098,6042",
        "MONTH_06": "6038,6071,6047,6070,6017",
        "MONTH_07": "6023,6081,6047,6098,6027",
        "MONTH_08": "6050,6070,6047,6070,6029",
        "MONTH_09": "6036,6027,6040,6070,6047,6070,6029",
        "MONTH_10": "6033,6075,6031,6071,6041,6070,6047,6070,6029",
        "MONTH_11": "6047,6098,6042,6070,6038,6030,6092",
        "MONTH_12": "6039,6033,6098,6042,6036,6033",
        "MONTH_13": "6050,6047,6098,6047,6075,6023",
        "MONTH_14": "6016,6031,6098,6031,6071,6016",
        "ANML_01": "6023,6076,6031",
        "ANML_02": "6022,6098,6043,6076,6044",
        "ANML_03": "6017,6070,6043",
        "ANML_04": "6032,6084,6087",
        "ANML_05": "6042,6084,6020",
        "ANML_06": "6040,6098,6047,6070,6025,6091",
        "ANML_07": "6040,6040,6072",
        "ANML_08": "6040,6040,6082",
        "ANML_09": "6044,6016",
        "ANML_10": "6042,6016,6070",
        "ANML_11": "6021",
        "ANML_12": "6016,6075,6042",
        "SAK_01": "6063,6016,6047,6096,6016",
        "SAK_02": "6033,6084,6047,6096,6016",
        "SAK_03": "6031,6098,6042,6072,6047,6096,6016",
        "SAK_04": "6021,6031,6098,6044,6070,6047,6096,6016",
        "SAK_05": "6036,6025,6098,6021,6047,6096,6016",
        "SAK_06": "6022,6047,6096,6016",
        "SAK_07": "6047,6036,6098,6031,6047,6096,6016",
        "SAK_08": "6050,6026,6098,6027,6047,6096,6016",
        "SAK_09": "6035,6038,6098,6044,6047,6096,6016",
        "SAK_10": "6047,6086,6042,6073,6033,6098,6034,6071,6047,6096,6016",
        "DAY_0": "6050,6070,6033,6071,6031,6098,6041",
        "DAY_1": "6021,6035,6098,6033",
        "DAY_2": "6050,6020,6098,6018,6070,6042",
        "DAY_3": "6038,6075,6034",
        "DAY_4": "6038,6098,6042,6048,6047,6098,6036,6031,6071,6093",
        "DAY_5": "6047,6075,6016,6098,6042",
        "DAY_6": "6047,6085,6042,6093",
        "GMONTH_01": "6040,6016,6042,6070",
        "GMONTH_02": "6016,6075,6040,6098,6039,6088",
        "GMONTH_03": "6040,6072,6035,6070",
        "GMONTH_04": "6040,6081,6047,6070",
        "GMONTH_05": "6055,6047,6039,6070",
        "GMONTH_06": "6040,6071,6032,6075,6035,6070",
        "GMONTH_07": "6016,6016,6098,6016,6026,6070",
        "GMONTH_08": "6047,6072,6048,6070",
        "GMONTH_09": "6016,6025,6098,6025,6070",
        "GMONTH_10": "6031,6075,6043,6070",
        "GMONTH_11": "6044,6071,6021,6098,6022,6071,6016,6070",
        "GMONTH_12": "6034,6098,6035,6076",
        "KHEUT": "6016,6078,6031",
        "REACH": "6042,6084,6021",
        "SEIL": "6047,6072,6043",
        "FS_VGOOD": "6043,6098,6050,6036,6086,6037,6075,6031",
        "FS_GOOD": "6043,6098,6050",
        "FS_AVG": "6040,6034,6098,6041,6040",
        "FS_BAD": "6050,6070,6016,6098,6042,6016,6091",
        "CHONG": "6022,6075,6020",
    };

    function getKhmerText(key, englishFallback) {
        var cp = CODEPOINTS[key];
        if (cp) return buildKhmer(cp);
        return englishFallback || '?';
    }

    var KHMER_DIGITS = ['០','១','២','៣','៤','៥','៦','៧','៨','៩'];

    function convertToKhmerNumeral(input) {
        var str = String(input);
        var result = '';
        for (var i = 0; i < str.length; i++) {
            var ch = str.charAt(i);
            if (ch >= '0' && ch <= '9') {
                result += KHMER_DIGITS[parseInt(ch)];
            } else {
                result += ch;
            }
        }
        return result;
    }

    var ENGLISH_MONTH_NAMES = [
        buildKhmer("6040,6071,6018,6047,6071,6042"),
        buildKhmer("6036,6075,6047,6098,6047"),
        buildKhmer("6040,6070,6019"),
        buildKhmer("6037,6043,6098,6018,6075,6035"),
        buildKhmer("6021,6081,6031,6098,6042"),
        buildKhmer("6038,6071,6047,6070,6017"),
        buildKhmer("6023,6081,6047,6098,6027"),
        buildKhmer("6050,6070,6047,6070,6029"),
        buildKhmer("6036,6027,6040,6070,6047,6070,6029"),
        buildKhmer("6033,6075,6031,6071,6041,6070,6047,6070,6029"),
        buildKhmer("6047,6098,6042,6070,6038,6030,6092"),
        buildKhmer("6039,6033,6098,6042,6036,6033"),
        buildKhmer("6050,6047,6098,6047,6075,6023"),
        buildKhmer("6016,6031,6098,6031,6071,6016"),
    ];

    var ENGLISH_ANIMAL_NAMES = [
        buildKhmer("6023,6076,6031"),
        buildKhmer("6022,6098,6043,6076,6044"),
        buildKhmer("6017,6070,6043"),
        buildKhmer("6032,6084,6087"),
        buildKhmer("6042,6084,6020"),
        buildKhmer("6040,6098,6047,6070,6025,6091"),
        buildKhmer("6040,6040,6072"),
        buildKhmer("6040,6040,6082"),
        buildKhmer("6044,6016"),
        buildKhmer("6042,6016,6070"),
        buildKhmer("6021"),
        buildKhmer("6016,6075,6042"),
    ];

    var ENGLISH_SAK_NAMES = [
        buildKhmer("6063,6016,6047,6096,6016"),
        buildKhmer("6033,6084,6047,6096,6016"),
        buildKhmer("6031,6098,6042,6072,6047,6096,6016"),
        buildKhmer("6021,6031,6098,6044,6070,6047,6096,6016"),
        buildKhmer("6036,6025,6098,6021,6047,6096,6016"),
        buildKhmer("6022,6047,6096,6016"),
        buildKhmer("6047,6036,6098,6031,6047,6096,6016"),
        buildKhmer("6050,6026,6098,6027,6047,6096,6016"),
        buildKhmer("6035,6038,6098,6044,6047,6096,6016"),
        buildKhmer("6047,6086,6042,6073,6033,6098,6034,6071,6047,6096,6016"),
    ];

    var ENGLISH_DAY_NAMES = [
        buildKhmer("6050,6070,6033,6071,6031,6098,6041"),
        buildKhmer("6021,6035,6098,6033"),
        buildKhmer("6050,6020,6098,6018,6070,6042"),
        buildKhmer("6038,6075,6034"),
        buildKhmer("6038,6098,6042,6048,6047,6098,6036,6031,6071,6093"),
        buildKhmer("6047,6075,6016,6098,6042"),
        buildKhmer("6047,6085,6042,6093"),
    ];

    var ENGLISH_GREG_MONTHS = [
        '',
        buildKhmer("6040,6016,6042,6070"),
        buildKhmer("6016,6075,6040,6098,6039,6088"),
        buildKhmer("6040,6072,6035,6070"),
        buildKhmer("6040,6081,6047,6070"),
        buildKhmer("6055,6047,6039,6070"),
        buildKhmer("6040,6071,6032,6075,6035,6070"),
        buildKhmer("6016,6016,6098,6016,6026,6070"),
        buildKhmer("6047,6072,6048,6070"),
        buildKhmer("6016,6025,6098,6025,6070"),
        buildKhmer("6031,6075,6043,6070"),
        buildKhmer("6044,6071,6021,6098,6022,6071,6016,6070"),
        buildKhmer("6034,6098,6035,6076"),
    ];

    var ACT_VGOOD = buildKhmer("6042,6080,6036,6050,6070,6038,6070,6048,6093") + ', ' + buildKhmer("6021,6070,6036,6091,6037,6098,6026,6078,6040") + ', ' + buildKhmer("6033,6071,6025,6026,6072,6034,6098,6044,6078,6037,6098,6033,6087") + ', ' + buildKhmer("6036,6078,6016,6047,6040,6098,6038,6084,6034");
    var ACT_GOOD = buildKhmer("6016,6070,6042,6034,6098,6044,6078") + ', ' + buildKhmer("6033,6033,6077,6043,6036,6070,6035") + ', ' + buildKhmer("6049,6078,6020,6031,6086,6030,6082,6020") + ', ' + buildKhmer("6047,6035,6098,6047,6086,6047,6086,6021,6083");
    var ACT_AVG = buildKhmer("6016,6070,6042,6020,6070,6042,6036,6098,6042") + ', ' + buildKhmer("6047,6035,6098,6047,6086,6047,6086,6021,6083") + ', ' + buildKhmer("6047,6040,6098,6050,6070,6031,6037,6098,6033,6087");
    var ACT_BAD = buildKhmer("6021,6080,6047,6044,6070,6020,6016,6070,6042,6021") + ', ' + buildKhmer("6021,6080,6047,6044,6070,6020,6016,6070,6042,6044,6071,6035,6071,6041,6084,6018") + ', ' + buildKhmer("6036,6098,6042,6075,6020,6036,6098,6042,6041,6096,6031,6098,6035");

    // =========================================================================
    // PUBLIC HOLIDAYS
    // color: 'red'=បុយ្ចូរាជិឈប្សម្រាក, 'blue'=បុយ្ចូពុទ្ធសាសនា
    // =========================================================================
    var HOLIDAY_FIXED = [
        [1, 1, "6032,6071,179c,6070,6021,17bc,179b,1786,17d2,1793,17c2,179b,179f,17b6,1780,179b", "red"],
        [1, 7, "6032,6071,179c,6070,1787,17c4,1799,1787,17d2,1793,17c0,179f,17cb", "red"],
        [4, 13, "1794,17bb,1799,17d2,1785,17bc,179b,1786,17d2,1793,17c2,179b,1781,17d2,1798,17c2,179a", "red"],
        [4, 14, "1794,17bb,1799,17d2,1785,17bc,179b,1786,17d2,1793,17c2,179b,1781,17d2,1798,17c2,179a", "red"],
        [4, 15, "1794,17bb,1799,17d2,1785,17bc,179b,1786,17d2,1793,17c2,179b,1781,17d2,1798,17c2,179a", "red"],
        [5, 1, "6032,6071,179c,6070,1796,179b,1780,1798,17d2,1798,17b6,1799,17cb,17a2,1793,17d2,1792,179a,17d2,179a,17b6,179f,17b7,178f,17b7", "red"],
        [5, 14, "1796,17d2,179a,17c2,179a,179a,17b6,1787,17b7,1796,17bb,1799,1785,17d2,1798,17c2,179a,1796,17d2,179a,17c2,1799,1798,17b6,179f,17cb", "red"],
        [6, 18, "1796,17d2,179a,17c2,179a,179a,17b6,1787,17b7,1796,17bb,1799,1785,17d2,1798,17c2,179a,1796,17d2,179a,17c2,1799,1798,17b6,179f,17cb,1798,17b6,179f,17b6,179a,17b6,1787,17b8", "red"],
        [11, 9, "6032,6071,179c,6070,1794,17bb,1799,17d2,1785,17bc,179a,17a2,1780,17d2,179a,17b6,1787,17d2,1799", "red"],
    ];

    var HOLIDAY_LUNAR = [
        ["MEAKH", 15, "K", "1798,17b6,1780,17d2,1792,1794,17bc,1787,17b6", "blue"],
        ["VISAKH", 15, "K", "1796,17b7,179f,17b6,1781,1794,17bc,1787,17b6", "blue"],
        ["PHOTROBAT", 14, "R", "1794,17bb,1799,17d2,1785,17bc,1797,17d2,1787,17bc,1794,17b7,1793,17d2,1791", "red"],
        ["PHOTROBAT", 15, "R", "1794,17bb,1799,17d2,1785,17bc,1797,17d2,1787,17bc,1794,17b7,1793,17d2,1791", "blue"],
        ["KATDEK", 15, "K", "1794,17bb,1799,17d2,1785,17bc,17a2,17bb,1798,17d2,1791,17bc,1780", "red"],
        ["KATDEK", 14, "K", "1794,17bb,1799,17d2,1785,17bc,179f,17b6,1798,17d2,1796,17b6,1796,17d2,179a,17c2,1780,17d2,179f,17bc", "red"],
    ];

    var HOLIDAY_COLORS = {
        'red': { bg: 'rgba(220,50,50,0.15)', border: 'rgba(220,50,50,0.4)' },
        'blue': { bg: 'rgba(50,120,220,0.15)', border: 'rgba(50,120,220,0.4)' },
    };

    function getHoliday(date) {
        var code = getKhmerLunarCode(date);
        if (!code) return null;
        var m = date.getMonth() + 1;
        var d = date.getDate();
        for (var i = 0; i < HOLIDAY_FIXED.length; i++) {
            var h = HOLIDAY_FIXED[i];
            if (h[0] === m && h[1] === d) return { name: buildKhmer(h[2]), color: h[3] };
        }
        var monthCode = parseInt(code.substring(8, 10));
        var period = code.charAt(10);
        var lunarInPeriod = parseInt(code.substring(11, 13));
        var mn = ['MIKOSER','BOSS','MEAKH','PHALKUN','CHETR','VISAKH','CHESTH','ASATH','BATHAMSATH','TUTEYEASATH','SRAPONA','PHOTROBAT','ASSOCH','KATDEK'][monthCode - 1];
        if (!mn) return null;
        for (var i = 0; i < HOLIDAY_LUNAR.length; i++) {
            var h = HOLIDAY_LUNAR[i];
            if (h[0] === mn && h[1] === lunarInPeriod && h[2] === period) return { name: buildKhmer(h[3]), color: h[4] };
        }
        return null;
    }

    function isHoliday(date) { return getHoliday(date) !== null; }
    function getHolidayName(date) { var h = getHoliday(date); return h ? h.name : ''; }

    function aharakoune(y) { return (y * 292207 + 373) % 800; }
    function harakoune(y) { return Math.floor((y * 292207 + 373) / 800) + 1; }
    function avomane(y) { return (11 * harakoune(y) + 650) % 692; }
    function regularLeap(y) { return (800 - aharakoune(y)) <= 207; }
    function bodethey(y) { var ha = harakoune(y); return (ha + Math.floor((11 * ha + 650) / 692)) % 30; }
    function jaisLeap(y) { var b0 = bodethey(y); var b1 = bodethey(y + 1); return (b0 > 24) || (b0 < 6) || (b0 === 24 && b1 === 6) || (b0 === 25 && b1 === 5); }

    function isProtetinLeap(y) {
        var avomane0 = avomane(y);
        var avomane1 = avomane(y + 1);
        var normal = regularLeap(y);
        var value = normal && (avomane0 < 127);
        if (!normal) {
            if (avomane0 === 137 && avomane1 === 0) { value = false; }
            else if (avomane0 < 138) { value = true; }
        }
        if (!value) { value = isProtetinLeap(y - 1) && jaisLeap(y - 1); }
        return value;
    }

    function greatLeap(y) {
        var value = isProtetinLeap(y);
        if (jaisLeap(y) && value) value = false;
        return value;
    }

    function daysInYear(y) {
        if (jaisLeap(y)) return 384;
        if (greatLeap(y)) return 355;
        return 354;
    }

    function monthsOfYear(y) {
        var ath = jaisLeap(y);
        var g = greatLeap(y);
        var totalMonths = ath ? 13 : 12;
        var items = [];
        for (var i = 0; i < totalMonths; i++) {
            var j = i;
            if (ath && j >= 8) j = j - 1;
            var days = 29;
            if ((j % 2) !== 0) days = days + 1;
            if (j === 6 && g) days = days + 1;
            items.push(days);
        }
        return items;
    }

    function getKhmerLunarCode(srcDate) {
        var dt = new Date(srcDate.getFullYear(), srcDate.getMonth(), srcDate.getDate());
        var CE = dt.getFullYear();
        var y = CE - 638;
        var refDate = new Date(1970, 10, 28, 0, 0, 0);
        var diffDays = Math.round((dt - refDate) / (24 * 60 * 60 * 1000));
        if (diffDays < 0) diffDays = -diffDays;
        var lunarDiff = 0;
        var startY = 1333;
        var endY = CE - 638;
        if (startY > endY) { var tmp = startY; startY = endY; endY = tmp; }
        for (var yy = startY; yy < endY; yy++) { lunarDiff += daysInYear(yy); }
        var dayInYear = diffDays - lunarDiff;
        if (dayInYear < 0) dayInYear = -dayInYear;
        dayInYear += 1;
        var BE = (dayInYear > 162) ? CE + 544 : CE + 543;
        var length = daysInYear(y);
        if (dayInYear > length) { dayInYear -= length; y++; BE = y + 638 + 543; }
        var loy = monthsOfYear(y);
        var remaining = dayInYear;
        var m = 0;
        for (var mlIdx = 0; mlIdx < loy.length; mlIdx++) {
            if (remaining <= loy[mlIdx]) break;
            remaining -= loy[mlIdx];
            m++;
        }
        var lunarDay = remaining;
        var period, lunarInPeriod;
        if (lunarDay <= 15) { period = 'K'; lunarInPeriod = lunarDay; }
        else { period = 'R'; lunarInPeriod = lunarDay - 15; }
        var bo = bodethey(y - 1);
        var bl0 = jaisLeap(y - 2);
        var sak_i;
        if (!bl0 || (bl0 && !isProtetinLeap(y - 2))) { sak_i = (bo < 6) ? bo + 1 : bo; }
        else { sak_i = bo + 1; }
        var sak_m = (sak_i >= 6 && sak_i <= 29) ? 4 : 3;
        var je = y - 1;
        if (sak_m > m || (sak_m === m && sak_i > dt.getDate())) { je = y - 2; }
        var animalIdx = ((je + 1) % 12 + 10) % 12 + 1;
        var sakIdx = ((je + 1) % 10 + 9) % 10 + 1;
        var monthNames = ["MIKOSER","BOSS","MEAKH","PHALKUN","CHETR","VISAKH","CHESTH","ASATH","BATHAMSATH","TUTEYEASATH","SRAPONA","PHOTROBAT","ASSOCH","KATDEK"];
        var filtered = [];
        var totalMonths = loy.length;
        for (var i = 0; i < 14; i++) {
            if (totalMonths === 12) { if (i !== 8 && i !== 9) filtered.push(monthNames[i]); }
            else { if (i !== 7) filtered.push(monthNames[i]); }
        }
        var monthCode = -1;
        for (var i = 0; i < 14; i++) { if (monthNames[i] === filtered[m]) { monthCode = i + 1; break; } }
        var beStr = String(BE);
        while (beStr.length < 4) beStr = '0' + beStr;
        var result = String(sakIdx).padStart(2, '0') + String(animalIdx).padStart(2, '0') + beStr + String(monthCode).padStart(2, '0') + period + String(lunarInPeriod).padStart(2, '0');
        var lastMonthDays = loy[loy.length - 1];
        if (lunarInPeriod === 8 || lunarInPeriod === 15 || (lastMonthDays === 29 && period === 'R' && lunarInPeriod === 14)) {
            result += 'S';
        }
        return result;
    }

    function getLunarDay(date) { var code = getKhmerLunarCode(date); return parseInt(code.substring(11, 13)); }
    function getLunarPeriod(date) { return getKhmerLunarCode(date).charAt(10); }
    function getLunarMonthIndex(date) { return parseInt(getKhmerLunarCode(date).substring(8, 10)); }
    function getLunarMonthName(date) { var idx = getLunarMonthIndex(date); return getKhmerText('MONTH_' + String(idx).padStart(2, '0'), ENGLISH_MONTH_NAMES[idx - 1] || '?'); }
    function getAnimalYearIndex(date) { return parseInt(getKhmerLunarCode(date).substring(2, 4)); }
    function getAnimalYearName(date) { var idx = getAnimalYearIndex(date); return getKhmerText('ANML_' + String(idx).padStart(2, '0'), ENGLISH_ANIMAL_NAMES[idx - 1] || '?'); }
    function getSakIndex(date) { return parseInt(getKhmerLunarCode(date).substring(0, 2)); }
    function getSakName(date) { var idx = getSakIndex(date); return getKhmerText('SAK_' + String(idx).padStart(2, '0'), ENGLISH_SAK_NAMES[idx - 1] || '?'); }
    function getBuddhistEra(date) { return parseInt(getKhmerLunarCode(date).substring(4, 8)); }
    function isPreceptDay(date) { var code = getKhmerLunarCode(date); return code.length >= 14 && code.charAt(13) === 'S'; }
    function getSeilName(date) { return isPreceptDay(date) ? FMT.DAY + getKhmerText('SEIL', 'សីល') : ''; }
    function getKhmerDayName(date) { var d = date.getDay(); return getKhmerText('DAY_' + d, ENGLISH_DAY_NAMES[d] || '?'); }
    function getGregorianMonthName(date) { var m = date.getMonth() + 1; return getKhmerText('GMONTH_' + String(m).padStart(2, '0'), ENGLISH_GREG_MONTHS[m] || '?'); }

    function getKhmerLunarString(date) {
        var code = getKhmerLunarCode(date);
        var kr = code.charAt(10);
        var lunarDay = parseInt(code.substring(11, 13));
        var monthCode = parseInt(code.substring(8, 10));
        var monthName = getKhmerText('MONTH_' + String(monthCode).padStart(2, '0'), ENGLISH_MONTH_NAMES[monthCode - 1] || '?');
        var result = FMT.DAY + getKhmerDayName(date) + ' ' + convertToKhmerNumeral(lunarDay) + (kr === 'K' ? getKhmerText('KHEUT', 'កុក') : getKhmerText('REACH', 'រោជ')) + ' ' + FMT.MONTH + monthName + ' ' + FMT.YEAR + getAnimalYearName(date) + ' ' + getSakName(date) + ' ' + FMT.BE + ' ' + convertToKhmerNumeral(getBuddhistEra(date));
        if (code.length >= 14 && code.charAt(13) === 'S') { result += ' ' + FMT.DAY + getKhmerText('SEIL', 'សីល'); }
        var hol = getHoliday(date);
        if (hol) { result += ' \u2014 ' + hol.name; }
        return result;
    }

    function getDailyBranchIndex(date) {
        var d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        var refDate = new Date(2000, 0, 1);
        return (((Math.round((d - refDate) / (24 * 60 * 60 * 1000)) % 12) + 12) % 12) + 1;
    }
    function getDailyBranchName(date) { var idx = getDailyBranchIndex(date); return getKhmerText('ANML_' + String(idx).padStart(2, '0'), ENGLISH_ANIMAL_NAMES[idx - 1] || '?'); }
    function getDailyConflictIndex(date) { return ((getDailyBranchIndex(date) + 5) % 12) + 1; }
    function getDailyConflictName(date) { var idx = getDailyConflictIndex(date); return getKhmerText('ANML_' + String(idx).padStart(2, '0'), ENGLISH_ANIMAL_NAMES[idx - 1] || '?'); }
    function isConflictingDay(date) { return ((getDailyBranchIndex(date) - getAnimalYearIndex(date) + 12) % 12) === 6; }

    function getFengShuiRating(date) {
        var ld = getLunarDay(date);
        if (ld === 1 || ld === 15) return getKhmerText('FS_VGOOD', 'ល្ៀនាស់');
        if (isConflictingDay(date)) return getKhmerText('FS_BAD', 'អាក្រាក់');
        if (isPreceptDay(date)) return getKhmerText('FS_GOOD', 'ល្ៀ');
        return getKhmerText('FS_AVG', 'មធ៍ម');
    }
    function getFengShuiScore(date) { var r = getFengShuiRating(date); if (r === getKhmerText('FS_VGOOD','')) return 4; if (r === getKhmerText('FS_GOOD','')) return 3; if (r === getKhmerText('FS_BAD','')) return 1; return 2; }
    function getFengShuiActivities(date) { var s = getFengShuiScore(date); return s === 4 ? ACT_VGOOD : s === 3 ? ACT_GOOD : s === 1 ? ACT_BAD : ACT_AVG; }

    function getZodiacSign(date) {
        var m = date.getMonth() + 1, d = date.getDate(), rasi = FMT.RASI;
        var western = [{month:1,split:19,before:'Capricorn',after:'Aquarius'},{month:2,split:18,before:'Aquarius',after:'Pisces'},{month:3,split:20,before:'Pisces',after:'Aries'},{month:4,split:19,before:'Aries',after:'Taurus'},{month:5,split:20,before:'Taurus',after:'Gemini'},{month:6,split:20,before:'Gemini',after:'Cancer'},{month:7,split:22,before:'Cancer',after:'Leo'},{month:8,split:22,before:'Leo',after:'Virgo'},{month:9,split:22,before:'Virgo',after:'Libra'},{month:10,split:22,before:'Libra',after:'Scorpio'},{month:11,split:21,before:'Scorpio',after:'Sagittarius'},{month:12,split:21,before:'Sagittarius',after:'Capricorn'}];
        var kz = {'Capricorn':buildKhmer("6040,6016,6042")+rasi,'Aquarius':buildKhmer("6016,6075,6040,6098,6039,6088")+rasi,'Pisces':buildKhmer("6040,6072,6035,6070")+rasi,'Aries':buildKhmer("6040,6081,6047,6070")+rasi,'Taurus':buildKhmer("6055,6047,6039,6070")+rasi,'Gemini':buildKhmer("6040,6071,6032,6075,6035,6070")+rasi,'Cancer':buildKhmer("6016,6016,6098,6016,6026,6070")+rasi,'Leo':buildKhmer("6047,6072,6048,6070")+rasi,'Virgo':buildKhmer("6016,6025,6098,6025,6070")+rasi,'Libra':buildKhmer("6031,6075,6043,6070")+rasi,'Scorpio':buildKhmer("6044,6071,6021,6098,6022,6071,6016,6070")+rasi,'Sagittarius':buildKhmer("6034,6098,6035,6076")+rasi};
        var w = western[m - 1], en = (d <= w.split) ? w.before : w.after;
        return (kz[en] || '') + ' (' + en + ')';
    }

    function getConflictAnimalName(date) {
        var ci = getAnimalYearIndex(date);
        if (ci >= 1 && ci <= 12) { var fi = ((ci + 5) % 12) + 1; return getKhmerText('ANML_' + String(fi).padStart(2,'0'), ENGLISH_ANIMAL_NAMES[fi-1]||'?'); }
        return '?';
    }

    function getKhmerFengShuiString(date) {
        return FMT.FS + ' ' + getFengShuiRating(date) + ': ' + getFengShuiActivities(date) + '\\n' + FMT.TODAY + ' ' + FMT.YEAR + getDailyBranchName(date) + ' ' + FMT.CHONG + ' ' + getDailyConflictName(date) + ',' + '\\n' + FMT.ZODIAC + ': ' + getZodiacSign(date);
    }

    function generateMonthlyGrid(year, month) {
        var firstDay = new Date(year, month - 1, 1);
        var lastDay = new Date(year, month, 0);
        var dim = lastDay.getDate();
        var swd = firstDay.getDay();
        var grid = [];
        var day = 1;
        for (var row = 0; row < 6; row++) {
            var week = [];
            for (var col = 0; col < 7; col++) {
                if (row === 0 && col < swd) { week.push(null); }
                else if (day <= dim) {
                    var date = new Date(year, month - 1, day);
                    var hol = getHoliday(date);
                    week.push({ gregDay: day, lunarDay: getLunarDay(date), period: getLunarPeriod(date), isSeil: isPreceptDay(date), holiday: hol ? { name: hol.name, color: hol.color } : null });
                    day++;
                } else { week.push(null); }
            }
            grid.push(week);
            if (day > dim) break;
        }
        return grid;
    }

    return {
        getKhmerLunarCode: getKhmerLunarCode,
        getKhmerLunarString: getKhmerLunarString,
        getLunarDay: getLunarDay,
        getLunarPeriod: getLunarPeriod,
        getLunarMonthIndex: getLunarMonthIndex,
        getLunarMonthName: getLunarMonthName,
        getAnimalYearIndex: getAnimalYearIndex,
        getAnimalYearName: getAnimalYearName,
        getSakIndex: getSakIndex,
        getSakName: getSakName,
        getBuddhistEra: getBuddhistEra,
        isPreceptDay: isPreceptDay,
        getSeilName: getSeilName,
        getKhmerDayName: getKhmerDayName,
        getGregorianMonthName: getGregorianMonthName,
        getDailyBranchIndex: getDailyBranchIndex,
        getDailyBranchName: getDailyBranchName,
        getDailyConflictIndex: getDailyConflictIndex,
        getDailyConflictName: getDailyConflictName,
        isConflictingDay: isConflictingDay,
        getFengShuiRating: getFengShuiRating,
        getFengShuiScore: getFengShuiScore,
        getFengShuiActivities: getFengShuiActivities,
        getZodiacSign: getZodiacSign,
        getConflictAnimalName: getConflictAnimalName,
        getKhmerFengShuiString: getKhmerFengShuiString,
        getHoliday: getHoliday,
        isHoliday: isHoliday,
        getHolidayName: getHolidayName,
        generateMonthlyGrid: generateMonthlyGrid,
        convertToKhmerNumeral: convertToKhmerNumeral,
        FMT: FMT,
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = KhmerLunarCalendar;
}
