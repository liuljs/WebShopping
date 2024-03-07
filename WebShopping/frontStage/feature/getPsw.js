/* GETPASSWORD */
let mem_act = $('.mem_act');
let changePsw = $('.getpsw-wrap .group-wrap');
let btnSend = $('.btnSend');
let btnWithFaceBook = $('.btnWithFaceBook'), btnWithGoogle = $('.btnWithGoogle'), btnWithLine = $('.btnWithLine');
// 驗證
function dataUpdateCheck(acc, code) {
    if (acc.val().trim() === '' || EmailRegExp.test(acc.val()) === false) {
        acc.focus();
        return check = false, errorText = '請確認帳號（Email）是否確實填寫，或格式是否正確！';
    }
    if (code.val().trim() === "") {
        code.focus();
        return check = false, errorText = '請確認驗證碼欄位是否確實填寫！';
    }
    if (code.val().trim() !== code_var.html()) {
        code.focus();
        return check = false, errorText = '請確認驗證碼欄位是否填寫正確！';
    }
    else {
        return check = true, errorText = "";
    }
};
function dataChangeCheck(psw, news, agn) {
    if (psw.val().trim() === '' || RulesSix.test(psw.val()) === false) {
        psw.focus();
        return check = false, errorText = '請確認目前密碼是否確實填寫，或格式是否正確！';
    }
    if (news.val().trim() === '' || RulesSix.test(news.val().trim()) === false) {
        news.focus();
        return check = false, errorText = '請確認新密碼是否確實填寫，或格式是否正確！';
    }
    if (agn.val().trim() === '' || RulesSix.test(agn.val().trim()) === false || agn.val().trim() !== news.val().trim()) {
        agn.focus();
        return check = false, errorText = '請確認再次輸入的密碼是否確實填寫，或格式是否正確！';
    }
    else {
        return check = true, errorText = "";
    }
};
// 驗證碼
let codes = $('.codes'), code_var = $('.code_var'), btnCode = $('.btnCode');
$().ready(function () {
    // 驗證碼
    createCode(code_var);
    btnCode.on('click', function (e) {
        e.preventDefault();
        createCode(code_var);
    });
    // 
    btnSend.on('click', function (e) {
        e.preventDefault();
        // 驗證
        dataUpdateCheck(mem_act, codes);
        if (check == true) {
            let loginObj = {
                "account": mem_act.val()
            };
            if (confirm(`系統將發送新密碼至您的會員信箱（帳號）中。
（使用新密碼成功登入後，建議您先修改密碼。）`)) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 204) {
                        alert(`新密碼已發送，請至您的信箱中查看哦！`);
                        location.href = "./login.html";
                        // changePsw.html(`
                        //     <div class="p-title">重新設定密碼</div>
                        //     <div class="group-full">
                        //         <div class="group-box import">
                        //             <div class="group-title">請輸入目前的密碼</div>
                        //             <div class="group-main">
                        //                 <input type="password" placeholder="請輸入目前的密碼" class="group-input old_psw">
                        //             </div>
                        //         </div>
                        //     </div>
                        //     <div class="group-full">
                        //         <div class="group-box import">
                        //             <div class="group-title">請輸入您的新密碼</div>
                        //             <div class="group-main">
                        //                 <input type="password" placeholder="請輸入您的新密碼" class="group-input new_psw">
                        //             </div>
                        //         </div>
                        //     </div>
                        //     <div class="group-full">
                        //         <div class="group-box import">
                        //             <div class="group-title">請再次輸入新密碼</div>
                        //             <div class="group-main">
                        //                 <input type="password" placeholder="請再次輸入新密碼" class="group-input new_agn">
                        //             </div>
                        //         </div>
                        //     </div>
                        //     <div class="group-full link-text">
                        //         <a href="#" class="btn-third btnGetAgn">重新傳送密碼</a>
                        //     </div>
                        //     <div class="group-full button-box">
                        //         <button type="button" class="button-style first btnChangePsw">確認修改</button>
                        //     </div>
                        // `);
                        // // 重新傳送
                        // $('.btnGetAgn').on('click', function (e) {
                        //     e.preventDefault();
                        // });
                        // // 確認修改
                        // $('.btnChangePsw').on('click', function () {

                        // });
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                        location.reload();
                    };
                };
                xhr.open('PATCH', `${URL}MemberUser/ForgetPassword`, true);
                // xhr.withCredentials = true; // 設定跨域請求是否帶 Cookies
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
                xhr.send($.param(loginObj));
            };
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