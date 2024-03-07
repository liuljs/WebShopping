// 全域使用 Commons
let idz, namez, module, count, html;
let fNameArr = new Array();
// Base URL
let URL = "http://localhost:59415/", IMGURL = "http://localhost:59415/backStage/img/", CONNECT; // API 位置 || 圖片檔位置 || API 名稱
// 驗證資訊
let errorTitle, errorText = "", check = true;
let current = 1, pageCount = 3, listSize = 10, pageLens, clsRcd, cls1Rcd, cls2Rcd, cls3Rcd, pageRcd; // 流動碼 || 分頁器顯示頁數 || 紀錄目前停留的頁碼
let limit = (1024 * 1024) * 5; // 限制圖片大小 5MB
const PhoneRegExp = /^(\d{2,3}-?|\(\d{2,3}\))\d{3,4}-?\d{4}$/;
const CellRegExp = /^09\d{2}-?(\d{6}|\d{3}-\d{3})$/;
const EmailRegExp = /^([\w]+)(.[\w]+)*@([\w]+)(.[\w]{2,3}){1,2}$/;
const NumberRegExp = /^[0-9]*$/;
const Rules = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/; // 包含大小寫英數字，至少要4碼
const RulesSix = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/; // 包含大小寫英數字，至少要 6 碼

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
//
function dateChange(e) {
    return e.split(" ")[0].replace(/\//g, '').replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
};
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
// 分頁器 Pagination
function curPage(iNow, lens, count) { // 當前頁碼 , 總頁數 , 頁面上產生幾個頁碼
    var pickz = `<li class="page-item active"><a class="page-link" data-num="${iNow}">` + iNow + `</a></li>`; // 指向當前頁碼
    // 迴圈產呈現在頁面上的頁碼，count 控制迴圈數，用以控制產生的頁碼數量
    for (let i = 1; i < count; i++) {
        if (iNow - i > 1) { // 當 iNow - i 小於 1 時，會產生小於 iNow 的頁碼 
            pickz = `<li class="page-item"><a class="page-link" data-num="${iNow - i}">` + (iNow - i) + `</a></li>` + pickz;
        }
        if (iNow + i < lens) { // 當 iNow - i 大於 1 時，會產生大於 iNow 的頁碼 
            pickz = pickz + `<li class="page-item"><a class="page-link" data-num="${iNow + i}">` + (iNow + i) + `</a></li>`;
        }
    };
    if (iNow == 1) { // 當前頁碼是1的時候，上一頁的按鈕鎖定
        paginations.find('li:first-child').addClass('disabled');
    }
    if (iNow - 3 > 0) { // 當 當前頁碼 大於3的話 前面的頁碼 省略
        pickz = `<li class="page-item disabled"><a class="page-link" data-num="none">...</a></li>` + pickz;
    }
    if (iNow > 1) { // 當 當前頁碼 大於1的話 要顯示第1頁的頁碼，並且開啟上一頁按鈕
        pickz = `<li class="page-item"><a class="page-link" data-num="1">1</a></li>` + pickz;
        paginations.find('li:first-child').removeClass('disabled');
    }
    if (iNow + 2 < lens) { // 當前頁碼 的下一頁之後 省略
        pickz = pickz + `<li class="page-item disabled"><a class="page-link" data-num="none">...</a></li>`;
    }
    if (iNow < lens) { // 當前頁碼 小於總頁碼的話 頁顯示最後1頁的頁碼，並且開啟下一頁按鈕
        pickz = pickz + `<li class="page-item"><a class="page-link" data-num="${lens}">` + lens + `</a></li>`;
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
                    let pages = Math.ceil(callBackData.length / Number(dataObj.Counts)); // 資料總筆數 / 頁面顯示筆數 
                    resolve(pages); // 返回取得總頁數
                } else {
                    resolve(0); // 沒有資料，所以總頁數為 
                };

            } else {
                reject("NOTFOUND"); // 沒有成功 || 資料筆數為 0 沒有檔案
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
}
// 取得登入者資訊
function getLoginInFo() {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.status == 200) {
                let callBackData = JSON.parse(xhr.responseText);
                if (callBackData.Result == "OK") {
                    // 將取得的資訊寫入 LocalStorage
                    let localData = JSON.parse(callBackData.Content);
                    resolve(localData);
                } else {
                    reject("NotSignIn");
                }
            } else {
                alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                getLogout();
            };
        }
        xhr.open('POST', `${URL}AuthAdmin/LoginInfo`, true);
        xhr.send(null);
    })
};
// 寫入 LocalStorage
function writeData(res) {
    localStorage.setItem('id', res.id);
    localStorage.setItem('name', res.name);
    localStorage.setItem('module', JSON.stringify(res.module));

    // 取得在 LocalStorage 中的登入者資訊
    idz = localStorage.getItem('id');
    namez = localStorage.getItem('name');
    module = localStorage.getItem('module');
    // 管理者名稱
    let get_admin = $('.get_admin');
    if (idz !== "") {
        get_admin.text(namez);
    } else {
        get_admin.text("");
    }
}
// 登出 Logout
function getLogout() {
    // 1. 清除Session中的登入者資訊
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    localStorage.removeItem('module');
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
    xhr.open('POST', `${URL}AuthAdmin/Logout`, true);
    xhr.send(null);
};
// 取得天數
function dayz(nowz, dayz) {
    return nowz.setDate(nowz.getDate() + dayz);
};
// 驗證修改密碼
function checkPassword(oPsw, nPsw, cPsw) {
    if (oPsw.val().trim() === '') {
        oPsw.focus();
        return check = false, errorText = '請確實填寫舊密碼！';
    }
    else if (Rules.test(oPsw.val()) === false) {
        oPsw.focus();
        return check = false, errorText = '請填寫正確的密碼格式！';
    }
    if (nPsw.val().trim() === '') {
        nPsw.focus();
        return check = false, errorText = '請確實填寫新密碼！';
    }
    else if (Rules.test(nPsw.val()) === false) {
        nPsw.focus();
        return check = false, errorText = '請填寫正確的密碼格式！';
    }
    if (cPsw.val().trim() === '') {
        cPsw.focus();
        return check = false, errorText = '請確實填寫確認新密碼！';
    }
    else if (Rules.test(cPsw.val()) === false) {
        cPsw.focus();
        return check = false, errorText = '請填寫正確的密碼格式！';
    }
    else {
        return check = true;
    }
};
// 修改密碼
function changePsw(oldz, newz, cfmz) {
    checkPassword(oldz, newz, cfmz);
    if (check == true) {
        let dataObj = {
            "old_password": oldz.val(),
            "new_password": newz.val(),
            "new_password_again": cfmz.val()
        };
        if (confirm("再確認要修改密碼嗎？")) {
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status == 200) {
                    let callBackData = JSON.parse(xhr.responseText);
                    if (callBackData.Result == "OK") {
                        alert('修改成功！');
                        getLogout();
                    } else {
                        alert(callBackData.Content);
                    };
                } else {
                    alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                    getLogout();
                };
            };
            xhr.open('POST', `${URL}Manager/UpdatePassword`, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
            xhr.send($.param(dataObj));
        }
    } else {
        alert(errorText);
    };
};