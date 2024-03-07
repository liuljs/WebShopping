// 全域使用 Commons
let idz, namez, module, count, html;
// BASE URL
let URL = "http://localhost:59415/", IMGURL = "http://localhost:59415/backStage/img/", CONNECT; // API 位置 || 圖片檔位置 || API 名稱
// 判斷是否為 LINE 內建瀏覽器，如果是就加上 "openExternalBrowser=1"
if (navigator.userAgent.indexOf("Line") > -1) {
    location.href = window.location.href + "?" + "openExternalBrowser=1";
};
// Search
btnSearch = $('.btnSearch'), keywords = $('.keywords');
// 驗證資訊
let errorTitle, errorText = "", check = true;
let limit = (1024 * 1024) * 5, imgLimit = 6; // 限制圖片大小 5MB || 圖片數量限制
const PhoneRegExp = /^(\d{2,3}-?|\(\d{2,3}\))\d{3,4}-?\d{4}$/; // 市話
const CellRegExp = /^09\d{2}-?(\d{6}|\d{3}-\d{3})$/; // 手機
const EmailRegExp = /^([\w]+)(.[\w]+)*@([\w]+)(.[\w]{2,3}){1,2}$/; // 信箱
const NumberRegExp = /^[0-9]*$/; // 數字
const Rules = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/; // 包含大小寫英數字，至少要 4 碼
const RulesSix = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/; // 包含大小寫英數字，至少要 6 碼
// 圖片驗證
function imgUpdateCheck(file) {
    if (file.val() !== "") {
        let imgFile = file[0].files;

        // 前端限制上傳的檔案格式
        if (!imgFile[0].type.match('image/*')) {
            alert('檔案格式錯誤，請上傳圖片檔格式！');
            file.val(''); // 重置檔案上傳欄位的內容，避免重複出現預覽圖片
            return false;
        }
        // 前端限制圖片大小
        else if (imgFile[0].size > limit) {
            alert(`圖片大小不得超過 ${limit / (1024 * 1024)} MB`);
            file.val(''); // 重置檔案上傳欄位的內容，避免重複出現預覽圖片
            return false;
        }
        else {
            return true;
        };
    };
};
// 驗證碼
let code = '', codeLength = 6;
function createCode(checkCode) {
    code = new Array();
    checkCode.html('');
    var selectChar = new Array(2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
    for (var i = 0; i < codeLength; i++) {
        var charIndex = Math.floor(Math.random() * 32);
        code += selectChar[charIndex];
    }
    if (code.length != codeLength) {
        createCode();
    }
    checkCode.html(code);
};
// 免運規則
let freeRules = "none", homeDevFee = 150; // 滿多少免運費 || 宅配費用
// 金流資訊
let flowObj = {
    "MerchantId": "990000008", // 測試用
    "TerminalId": "900080001", // 測試用
    "MerchantName": "", // 商家名稱
    "RequestUrl": "https://test.payware.com.tw/wpss/authpay.aspx", // 測試用
    "ReturnURL": "https://mantoto.webshopping.vip/api/Payment/Return",  // RETURN API 
    "Encoding": "utf-8",
    "GoBackURL": "https://mantoto.webshopping.vip", // 網站網址
    "ReceiveURL": "https://mantoto.webshopping.vip/api/Payment/Receive", // RECEIVE API
    "DeadlineDate": "",
    "RequiredConfirm": "1",
    "deferred": 7,
    "validateKey": "validateKey"
};
// 送出訂單
function sendOrder(mchantId, termId, mchantName, rquetURL, rturnURL, payType, odrNo, amt, pdt, odrDesc, enConding, mobile, telNum, addr, mail, memId, goBackURL, receURL, dLineDate, rquiredCfm, deferred, carrier, invoName, validateKey) {
    let formData = $('.sendOrderForm');

    formData.find('input[name="MerchantId"]').val(mchantId);
    formData.find('input[name="TerminalId"]').val(termId);
    formData.find('input[name="MerchantName"]').val(mchantName);
    formData.find('input[name="RequestUrl"]').val(rquetURL);
    formData.find('input[name="ReturnURL"]').val(rturnURL);
    formData.find('input[name="PayType"]').val(payType);
    formData.find('input[name="OrderNo"]').val(odrNo);
    formData.find('input[name="Amount"]').val(amt);
    formData.find('input[name="Product"]').val(pdt);
    formData.find('input[name="OrderDesc"]').val(odrDesc);
    formData.find('input[name="Encoding"]').val(enConding);
    formData.find('input[name="Mobile"]').val(mobile);
    formData.find('input[name="TelNumber"]').val(telNum);
    formData.find('input[name="Address"]').val(addr);
    formData.find('input[name="Email"]').val(mail);
    formData.find('input[name="memberId"]').val(memId);
    formData.find('input[name="GoBackURL"]').val(goBackURL);
    formData.find('input[name="ReceiveURL"]').val(receURL);
    formData.find('input[name="DeadlineDate"]').val(dLineDate);
    formData.find('input[name="RequiredConfirm"]').val(rquiredCfm);
    formData.find('input[name="deferred"]').val(deferred);
    formData.find('input[name="Carrier"]').val(carrier);
    formData.find('input[name="InvoiceName"]').val(invoName);
    formData.find('input[name="validateKey"]').val(validateKey);

    formData.submit();
};
// 表單
/*
    <form class="sendOrderForm" hidden action="https://test.payware.com.tw/wpss/authpay.aspx" method="POST">
        <input type="hidden" name="MerchantId">
        <input type="hidden" name="TerminalId">
        <input type="hidden" name="MerchantName">
        <input type="hidden" name="RequestUrl">
        <input type="hidden" name="ReturnURL">
        <input type="hidden" name="PayType">
        <input type="hidden" name="OrderNo">
        <input type="hidden" name="Amount">
        <input type="hidden" name="Product">
        <input type="hidden" name="OrderDesc">
        <input type="hidden" name="Encoding">
        <input type="hidden" name="Mobile">
        <input type="hidden" name="TelNumber">
        <input type="hidden" name="Address">
        <input type="hidden" name="Email">
        <input type="hidden" name="memberId">
        <input type="hidden" name="GoBackURL">
        <input type="hidden" name="ReceiveURL">
        <input type="hidden" name="DeadlineDate">
        <input type="hidden" name="RequiredConfirm">
        <input type="hidden" name="deferred">
        <input type="hidden" name="Carrier">
        <input type="hidden" name="InvoiceName">
        <input type="hidden" name="validateKey">
    </form>
*/
// QueryString 
function request(paras) {
    let url = location.href;
    let paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    let paraObj = {}
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    };
    let returnValue = paraObj[paras.toLowerCase()];
    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    };
};
// HTML STATUS : 2XX (SUCCESS)
// 200 成功、201 新增成功、202 接受請求，未處裡、203 已處理，反饋可能非來自伺服器、204 已處理，未反饋、205 已處理、未反饋、206 已處理部分 GET 的請求
// FAIL STATUS : || ...
// Send Objects
// dataObj = {
//     "Methods": "", // 方法
//     "APIs": "", // API
//     "CONNECTs": "", // CONNECT 預設 || 總筆數用
//     "QUERYs":"", // 網址式：QUERY 內容篩選條件 (未填則為使用 CONNECTs)
//     "Sends": "", // 物件式：內容篩選條件 (GET 方法可 Null)
//     "Counts": "" // 頁面顯示筆數
// };
let paginations = $('.pagination'); // 分頁器
let current = 1, pageCount = 3, listSize = 12, pageLens, clsRcd, cls1Rcd, cls2Rcd, cls3Rcd, pageRcd; // 流動碼 || 分頁器顯示頁數 || 紀錄目前停留的頁碼
// 分頁器 Pagination
function curPage(iNow, lens, count) { // 當前頁碼 , 總頁數 , 頁面上產生幾個頁碼
    var pickz = `<li class="page-item active"><a data-num="${iNow}">` + iNow + `</a></li>`; // 指向當前頁碼
    // 迴圈產呈現在頁面上的頁碼，count 控制迴圈數，用以控制產生的頁碼數量
    for (let i = 1; i < count; i++) {
        if (iNow - i > 1) { // 當 iNow - i 小於 1 時，會產生小於 iNow 的頁碼 
            pickz = `<li class="page-item"><a data-num="${iNow - i}">` + (iNow - i) + `</a></li>` + pickz;
        }
        if (iNow + i < lens) { // 當 iNow - i 大於 1 時，會產生大於 iNow 的頁碼 
            pickz = pickz + `<li class="page-item"><a data-num="${iNow + i}">` + (iNow + i) + `</a></li>`;
        }
    };
    if (iNow == 1) { // 當前頁碼是1的時候，上一頁的按鈕鎖定
        paginations.find('li:first-child').addClass('disabled');
    }
    if (iNow - 3 > 0) { // 當 當前頁碼 大於3的話 前面的頁碼 省略
        pickz = `<li class="page-item disabled"><a data-num="none">...</a></li>` + pickz;
    }
    if (iNow > 1) { // 當 當前頁碼 大於1的話 要顯示第1頁的頁碼，並且開啟上一頁按鈕
        pickz = `<li class="page-item"><a data-num="1">1</a></li>` + pickz;
        paginations.find('li:first-child').removeClass('disabled');
    }
    if (iNow + 2 < lens) { // 當前頁碼 的下一頁之後 省略
        pickz = pickz + `<li class="page-item disabled"><a data-num="none">...</a></li>`;
    }
    if (iNow < lens) { // 當前頁碼 小於總頁碼的話 頁顯示最後1頁的頁碼，並且開啟下一頁按鈕
        pickz = pickz + `<li class="page-item"><a data-num="${lens}">` + lens + `</a></li>`;
        paginations.find('li:last-child').removeClass('disabled');
    }
    if (iNow == lens) { // 當 當前頁碼為最後一頁時，鎖定下一頁按鈕
        paginations.find('li:last-child').addClass('disabled');
    };
    // paginations.unbind('click'); // 重設原本已有的點擊事件
    return pickz;
};
// 取得總頁數 ( 1. CONNECT 為全資料總頁數 || 2. QUERY 為篩選的資料總頁數 )
function getTotalPages(dataObj) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.status == 200) {
                if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                    let callBackData = JSON.parse(xhr.responseText);
                    console.log(callBackData)
                    let pages = Math.ceil(callBackData.length / Number(dataObj.Counts)); // 資料總筆數 / 頁面顯示筆數 
                    resolve(pages); // 返回取得總頁數
                } else {
                    resolve(0); // 沒有資料，所以總頁數為 0
                };

            } else {
                reject("NOTFOUND"); // 沒有成功
            };
        };
        xhr.open(`${dataObj.Methods}`, `${dataObj.APIs}${(dataObj.CONNECTs !== "") ? dataObj.CONNECTs : dataObj.QUERYs}`, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send((dataObj.Sends !== "") ? $.param(dataObj.Sends) : null);
    });
};
// 點擊頁碼取得對應筆數的資料 || 取得內容
function getPageDatas(dataObj) {
    // 1. 動態顯示點擊後的資料
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.status == 200) {
                if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                    let callBackData = JSON.parse(xhr.responseText);
                    resolve(callBackData); // 返回取得資料
                } else {
                    resolve(null); // 沒有資料
                };
            } else {
                reject("NOTFOUND"); // 沒有成功
            };
        };
        xhr.open(`${dataObj.Methods}`, `${dataObj.APIs}${(dataObj.QUERYs !== "") ? dataObj.QUERYs : dataObj.CONNECTs}`, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send((dataObj.Sends !== "") ? $.param(dataObj.Sends) : null);
    });
};
// 接收資料，做渲染、處理
// function process(data) {
// };

// 金額每三位數加逗號
function thousands(num) {
    let str = num.toString();
    let reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
    return str.replace(reg, "$1,");
};
// 日期轉換
function dateChange(e) {
    return e.split(" ")[0].replace(/\//g, '').replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
};
// 取得距今至..的天數
// function dayz(nowz, dayz) {
//     return nowz.setDate(nowz.getDate() + dayz);
// };

// 數字欄位的限制（包含頁面上動態產生的數字欄位）
// 1. 只能輸入數字
$(document).on('input', '.numberz', function () {
    $(this).val($(this).val().replace(/[^\d].*$/g, ''));
});
// 2. 只能輸入英數字
$(document).on('input', '.alphabetz', function () {
    $(this).val($(this).val().replace(/[^\w].*$/g, ''));
});
// 3. 折扣額度的限制（只能輸入最多一位數、加小數點只能後一位）
$(document).on('input', '.qtaz', function () {
    $(this).val($(this).val().replace(/[^0-9]{0,1}(\d?(?:\.\d{0,1})?).*$/g, '$1'));
});
// 加入購物車
function addCart(e, addObj) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status == 200) {
            if (xhr.responseText !== "") {
                let callBackData = JSON.parse(xhr.responseText);
                check = true; // 重置 check
                if (callBackData.Count > 0) {
                    let res = $.map(callBackData.Items, function (item, index) {
                        if (item.sku_id == addObj.sku_id) {
                            return check = false;
                        };
                    });
                    if (check == true) {
                        if (addObj.stock_qty > 0 && addObj.sell_stop == 0) {
                            let xhr = new XMLHttpRequest();
                            xhr.onload = function () {
                                if (xhr.status == 200) {
                                    let callBackData = JSON.parse(xhr.responseText);
                                    if (callBackData.Result == "OK") {
                                        alert(`加入成功，目前購物車有 ${callBackData.Content} 件商品。`);
                                        // 更新 Header 上的購物車商品數量
                                        $('#header').find('.cart-box .num').text(callBackData.Content);
                                    }
                                }
                            };
                            xhr.open('POST', `${URL}Orders/AddCart`, true);
                            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
                            xhr.send($.param(addObj));
                        } else {
                            alert("不好意思，商品目前已售完。")
                        };
                    } else {
                        alert("此商品已加入購物車囉！");
                    };
                };
            } else {
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200) {
                        alert(`加入購物車成功！`);
                        location.reload();
                    };
                };
                xhr.open('POST', `${URL}Orders/AddCart`, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
                xhr.send($.param(addObj));
            };
        } else {
            location.href = "./login.html";
        };
    };
    xhr.open('GET', `${URL}Orders/GetCart`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
    xhr.send(null);
};

// FACEBOOK
let FBAPPID = '547722152992384';
window.fbAsyncInit = function () {
    FB.init({
        appId: FBAPPID,
        cookie: true,
        xfbml: true,
        version: 'v12.0'
    });
    FB.AppEvents.logPageView();
};
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
// FACEBOOK
function FACEBOOKLOGIN() {
    FB.login(function (res) {
        if (res.status === "connected") { // 瀏覽器目前已記錄使用者登入的 FB
            let FB_TOKEN = res["authResponse"]["accessToken"];
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status == 200) {
                    if (xhr.responseText !== "") {
                        let callBakData = JSON.parse(xhr.responseText);
                        location.href = "./member_profile.html";
                    };
                };
            };
            xhr.open('GET', `${URL}AuthUser/FBLogin?token=${FB_TOKEN}`, true);
            // xhr.withCredentials = true; // 設定跨域請求是否帶 Cookies
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
            xhr.send(null);
        } else { };
    }, { scope: 'public_profile,email' });
};
// GOOGLE
function GOOGLELOGIN() {
    location.href = "https://accounts.google.com/o/oauth2/v2/auth?client_id=622095848089-v76470qg1k7vdvamaaqou0v09undi7vp.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fmantoto.webshopping.vip%2Fapi%2Fauthuser%2Fgooglelogin&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code";
};
// LINE
function LINELOGIN() {
    location.href = "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1656451902&redirect_uri=https%3A%2F%2Fmantoto.webshopping.vip%2Fapi%2Fauthuser%2Flinelogin&state=https%3A%2F%2Fmantoto.webshopping.vip&scope=openid%20profile%20email";
};
// 登入驗證
function dataUpdateCheck(acc, psw, code) {
    if (acc.val().trim() === '' || EmailRegExp.test(acc.val().trim()) === false) {
        acc.focus();
        return check = false, errorText = '請確認帳號（Email）是否確實填寫，或格式是否正確！';
    }
    if (psw.val().trim() === '' || Rules.test(psw.val().trim()) === false) {
        psw.focus();
        return check = false, errorText = '請確認密碼是否確實填寫，或格式是否正確！';
    }
    if (code.val().trim() === "") {
        code.focus();
        return check = false, errorText = '請確認驗證碼欄位是否確實填寫！';
    }
    if (code.val().trim() !== $('.code_var').html()) {
        code.focus();
        return check = false, errorText = '請確認驗證碼欄位是否填寫正確！';
    }
    else {
        return check = true, errorText = "";
    };
};
// 取得登入者資訊
function getLoginInFo() {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.status == 200) {
                let callBackData = JSON.parse(xhr.responseText);
                if (callBackData.Result == "OK") {
                    // 將取得的資訊寫入 LocalStorage
                    resolve(callBackData.Content);
                } else {
                    resolve("NotSignIn");
                }
            } else {
                reject('NotSignIn');
            };
        };
        xhr.open('POST', `${URL}AuthUser/LoginInfo`, true);
        xhr.send(null);
    });
};
// 寫入 LocalStorage
function writeData(res) {
    localStorage.setItem('id', res.id);
    localStorage.setItem('name', res.name);
    localStorage.setItem('module', JSON.stringify(res.module));
    localStorage.setItem('count', res.Count);

    // 取得在 LocalStorage 中的登入者資訊
    idz = localStorage.getItem('id');
    namez = localStorage.getItem('name');
    module = localStorage.getItem('module');
    count = localStorage.getItem('count');

}
// 登出 Logout
function getLogout() {
    // 1. 清除Session中的登入者資訊
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    localStorage.removeItem('module');
    localStorage.removeItem('count');
    localStorage.removeItem(`fblst_${FBAPPID}`);
    sessionStorage.removeItem(`fbssls_${FBAPPID}`);
    // 2. 呼叫登出的API
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status == 200) {
            let callBackData = JSON.parse(xhr.responseText);
            if (callBackData.Result == 'OK') {
                location.href = './login.html';
            } else {
                alert(callBackData.Content);
            }
        };
    };
    xhr.open('POST', `${URL}AuthUser/Logout`, true);
    xhr.send(null);
};
// MemberSet
$('.btnMember').on('click', function (e) {
    e.preventDefault();
    getLoginInFo().then(res => {
        writeData(res);
        location.href = "./member_profile.html"
    }, rej => {
        if (rej == "NotSignIn") {
            location.href = "./login.html"
        };
    });
});
// GoCart
$('.btnGoCart').on('click', function (e) {
    e.preventDefault();
    getLoginInFo().then(res => {
        writeData(res);
        location.href = "./cart.html"
    }, rej => {
        if (rej == "NotSignIn") {
            location.href = "./login.html"
        };
    });
});

// 判斷登入與否
getLoginInFo()
    .then(res => {
        // 登入成功，將資訊寫入 LocalStorage
        writeData(res);
        // 將目前購物車的商品數寫入 Header
        $('#header').find('.cart-box .num').text(count);
    })
    .catch(rej => {
        // 尚未登入
        if (rej === "NotSignIn") {
            // Header 上的購物車商品數為 0
            $('#header').find('.cart-box .num').text("0");
        };
    });
$().ready(function () {
    // Search
    btnSearch.on('click', function (e) {
        e.preventDefault();
        if (keywords.val() !== "") {
            let num = keywords.val();
            // 導到商品列表頁
            location.href = `./product_search.html?search=${num}`;
        } else {
            alert("請輸入商品名稱或關鍵字！");
        };
    });
});
