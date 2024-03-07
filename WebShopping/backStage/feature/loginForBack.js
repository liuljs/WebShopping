// Login for backStage

// 宣告要帶入的欄位
let memberAcc = $('#ca_id'), memberPsw = $('#password');
let btnLogin = $('.btnLogin'), rememberCheck = $('#rememberPasswordCheck');
// 驗證
function formatCheck(acc, psw) {
    if (acc.val().trim() === '') {
        return check = false, errorText = '請填寫帳號！';
    }
    else if (Rules.test(acc.val()) === false) {
        return check = false, errorText = '請填寫正確的帳號格式！';
    }
    if (psw.val().trim() === '') {
        return check = false, errorText = '請填寫密碼！';
    }
    else if (Rules.test(psw.val()) === false) {
        return check = false, errorText = '請填寫正確的密碼格式！';
    }
    else {
        return check = true;
    }
};
// 設定 Cookies（名稱, 值, 到期天數）
function setCookies(name, value, day) {
    if (value !== "") {
        let date = new Date();
        date.setDate(date.getDate() + day);
        document.cookie = `${name}=${value};expires=${date}`;
    }
};
// 解析 Cookie 轉換成物件
function parseCookie() {
    let cookieObj = {};
    let cookieAry = document.cookie.trim().split(';');
    let cookie;

    for (let i = 0, l = cookieAry.length; i < l; i++) {
        if (cookieAry[i].includes('=')) {
            cookie = cookieAry[i].trim().split('=');
            cookieObj[cookie[0]] = cookie[1];
        }
    }
    return cookieObj;
};
// 取得 Cookie 的值
function getCookieByName(name) {
    let value = parseCookie()[name];
    if (value)
        value = decodeURIComponent(value); // encodeURIComponent() 這個方法來儲存內容，可以讓特殊符號（ $#@*^!,）這種轉換成URI形式，讓程式解析的時候比較不會出錯。
    return value;
};
// 刪除 Cookie 的值
function removeCookies(name) {
    document.cookie = `${name}=''; max-age=0`;
};
$().ready(function () {
    // Remember info
    // 1. loading 頁面時，檢查 cookie 是否有紀錄登錄者資訊
    // 2. 是否有勾選 "記住帳號"
    // 3. 如果有，讀取 Cookie 並且自動代入欄位中
    if (getCookieByName('memberAcc')) {
        memberAcc.val(getCookieByName('memberAcc'));
        rememberCheck.prop('checked', true);
    };
    // 取消記錄帳號密碼，則清除 Cookies
    rememberCheck.on('change', function (e) {
        if (!e.target.checked) {
            removeCookies('memberAcc');
        } else {
            setCookies('memberAcc', memberAcc.val(), 7);
        }
        console.log(document.cookie);
    });
    //  如果已勾選記住帳號，更改帳號後將覆蓋Cokkie中紀錄的登錄者資訊
    memberAcc.on('change', function () {
        if (rememberCheck.prop('checked') == true) {
            setCookies('memberAcc', memberAcc.val(), 7);
        } else {

        };
    });
    // Login
    btnLogin.on('click', function (e) {
        // 驗證
        // formatCheck(memberAcc, memberPsw);
        if (check == true) {
            let loginObj = {
                "account": memberAcc.val(),
                "password": memberPsw.val()
            };
            let xhr = new XMLHttpRequest();
            xhr.onload = async () => {
                if (xhr.status == 200) {
                    // 將回傳的資料轉為物件作使用
                    let callBackData = JSON.parse(xhr.responseText);
                    if (callBackData.Result == 'OK') {
                        await getLoginInFo().then(res => {
                            writeData(res);
                        });
                        location.href = "./index.html";
                    } else {
                        alert(callBackData.Content);
                    }
                } else {
                    alert("錯誤訊息 " + xhr.status);
                }
            }
            xhr.open('POST', `${URL}AuthAdmin/Login`, true);
            // xhr.withCredentials = true; // 設定跨域請求是否帶 Cookies
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
            xhr.send($.param(loginObj));
        } else {
            alert(errorText);
        };
    });
});


