// LOGIN
let mem_act = $('.mem_act'), mem_psw = $('.mem_psw');
let btnLogin = $('.btnLogin');
let btnWithFaceBook = $('.btnWithFaceBook'), btnWithGoogle = $('.btnWithGoogle'), btnWithLine = $('.btnWithLine');
// 驗證碼
let codes = $('.codes'), code_var = $('.code_var'), btnCode = $('.btnCode');
$().ready(function () {
    // 如果已成功登入，將會導到會員中心頁
    getLoginInFo()
        .then(res => {
            location.href = "./member_profile.html"
        })
        .catch(rej => {
            if (rej === "NotSignIn") { };
        });
    // 驗證碼
    createCode(code_var);
    btnCode.on('click', function (e) {
        e.preventDefault();
        createCode(code_var);
    });
    // 登入會員
    btnLogin.on('click', function (e) {
        e.preventDefault();
        // 驗證
        dataUpdateCheck(mem_act, mem_psw, codes);
        if (check == true) {
            let loginObj = {
                "account": mem_act.val(),
                "password": mem_psw.val()
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
                        location.href = "./member_profile.html";
                    } else {
                        alert(callBackData.Content);
                    };
                } else {
                    alert("錯誤訊息 " + xhr.status);
                };
            };
            xhr.open('POST', `${URL}AuthUser/Login`, true);
            // xhr.withCredentials = true; // 設定跨域請求是否帶 Cookies
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
            xhr.send($.param(loginObj));
        } else {
            alert(errorText);
            codes.val(''), createCode(code_var); // 重新產生驗證碼
        };
    });
    // FACEBOOK For Login
    btnWithFaceBook.on('click', function (e) {
        e.preventDefault();
        FACEBOOKLOGIN();
    });
    // GOOGLE For Login
    btnWithGoogle.on('click', function (e) {
        e.preventDefault();
        GOOGLELOGIN();
    });
    // LINE For Login
    btnWithLine.on('click', function (e) {
        e.preventDefault();
        LINELOGIN();
    });
});