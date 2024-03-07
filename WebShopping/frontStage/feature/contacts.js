// CONTACT
let btnSend = $('.btnSend');
let customer_name = $('input[name="customer_name"]'), customer_phone = $('input[name="customer_phone"]'), customer_email = $('input[name="customer_email"]'), customer_content = $('textarea[name="customer_content"]');
// 驗證
function dataUpdateCheck(name, cell, email, content, code) {
    if (name.val().trim() === '') {
        name.focus();
        return check = false, errorText = '請確認姓名欄位是否確實填寫！';
    }
    if (cell.val().trim() === '' || CellRegExp.test(cell.val()) === false) {
        cell.focus();
        return check = false, errorText = '請確認手機欄位是否確實填寫，或格式是否正確！';
    }
    if (email.val().trim() === '' || EmailRegExp.test(email.val()) === false) {
        email.focus();
        return check = false, errorText = '請確認帳號（Email）是否確實填寫，或格式是否正確！';
    }
    if (content.val().trim() === '') {
        content.focus();
        return check = false, errorText = '請確認內容欄位是否確實填寫！';
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
// 驗證碼
let codes = $('.codes'), code_var = $('.code_var'), btnCode = $('.btnCode');
$().ready(function () {
    // 驗證碼
    createCode(code_var);
    btnCode.on('click', function (e) {
        e.preventDefault();
        createCode(code_var);
    });
    btnSend.on('click', function (e) {
        e.preventDefault();
        dataUpdateCheck(customer_name, customer_phone, customer_email, customer_content, codes);
        if (check == true) {
            let dataObj = {
                "name": customer_name.val(),
                "gender": $('input[name="gender"]:checked').val(),
                "cell_phone": customer_phone.val(),
                "email": customer_email.val(),
                "message": customer_content.val(),
            };
            if (confirm("您確定要傳送嗎？")) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200) {
                        let callBackData = JSON.parse(xhr.responseText);
                        console.log(callBackData)
                        if (callBackData.Result == "OK") {
                            alert('傳送成功，我們將盡快回覆！');
                            location.reload();
                        };
                    };
                };
                xhr.open('POST', `${URL}ContactUs`, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send($.param(dataObj));
            };
        } else {
            alert(errorText);
            codes.val(''), createCode(code_var); // 重新產生驗證碼
        };
    });
});