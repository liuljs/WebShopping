// 宣告要帶入的欄位
let options;
let managers = $('.managers');
// 驗證
function dataUpdateCheck(aId, id, name, mail) {
    if (aId.trim() === '') {
        id.focus();
        return check = false, errorText = '請確認必填欄位皆有填寫！';
    }
    if (id.val().trim() === '') {
        id.focus();
        return check = false, errorText = '請確認使用者ID是否確實填寫，或格式是否正確！';
    }
    if (name.val().trim() === '') {
        name.focus();

        return check = false, errorText = '請確認使用者名稱是否確實填寫，或格式是否正確！';
    }
    if (mail.val().trim() === '' || EmailRegExp.test(mail.val()) === false) {
        mail.focus();

        return check = false, errorText = '請確認信箱是否確實填寫，或格式是否正確！';
    }
    else {
        return check = true, errorText = "";
    }
};
function manPswCheck(psw) {
    if (psw.val().trim() === '' || Rules.test(psw.val()) === false) {
        psw.focus();
        return check = false, errorText = '請確認新密碼是否確實填寫，或格式是否正確！';
    }
    else {
        return check = true, errorText = "";
    }
};
$().ready(function () {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status == 200) {
            let callBackData = JSON.parse(xhr.responseText);
            if (callBackData.Result == "OK") {
                // 動態產生群組分類的名稱
                options = "";
                for (let i = 0; i < callBackData.Content.length; i++) {
                    options += `
                        <option value="${callBackData.Content[i].ID}">${callBackData.Content[i].NAME}</option>
                    `;
                };
                // 顯示新增
                if (menuAuth[authParent.indexOf("SM")].ACT_EDT == "Y") {
                    $('.own-contents').prepend(`
                        <div class="col-xl-4">
                            <div class="card">
                                <div class="card-header d-flex align-items-center">
                                    <h2 class="text-primary mb-0">新增使用者</h2>
                                    <span class="notes">（＊號為必填欄位）</span>
                                </div>
                                <div class="card-body">
                                    <div class="form">
                                        <div class="form-group">
                                            <label>管理者帳號<span class="markz"></span></label>
                                            <input type="text" class="form-control add_manaId">
                                        </div>
                                        <div class="form-group">
                                            <label>名字<span class="markz"></span></label>
                                            <input type="text" class="form-control add_manaName">
                                        </div>
                                        <div class="form-group">
                                            <label>Email<span class="markz"></span></label>
                                            <input type="text" class="form-control add_manaEmail">
                                        </div>
                                        <div class="form-group">
                                            <label>群組分類 </label>
                                            <select id="addSelectz" name="states" class="form-control badge_text add_sort" multiple="multiple" style="display: none;"></select>
                                        </div>
                                        <div class="text-right my-3">
                                            <button type="submit" class="btn btn-primary btnAddMana">新增使用者</button>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    `);
                    $('#addSelectz').html(options); // 渲染群組選項
                    $('#addSelectz').bsMultiSelect(); // 宣告 新增用群組類別 
                    let add_manaId = $('.add_manaId');
                    let add_manaName = $('.add_manaName');
                    let add_manaEmail = $('.add_manaEmail');
                    // 新增管理者
                    $('.btnAddMana').on('click', function () {
                        dataUpdateCheck(idz, add_manaId, add_manaName, add_manaEmail);
                        if (check == true) { // 驗證通過的話，將資料放入 Post 物件
                            let dataObj = {
                                "account_id": idz,
                                "account": add_manaId.val(),
                                "name": add_manaName.val(),
                                "email": add_manaEmail.val(),
                                "groups": $('#addSelectz').val()
                            };
                            if (confirm("您確定要新增一個管理者嗎？")) {
                                let xhr = new XMLHttpRequest();
                                xhr.onload = function () {
                                    if (xhr.status == 200) {
                                        let callBackData = JSON.parse(xhr.responseText);
                                        if (callBackData.Result == "OK") {
                                            location.reload();
                                        } else {
                                            alert(callBackData.Content);
                                        }
                                    } else {
                                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                                        // getLogout();
                                    };
                                };
                                xhr.open('POST', `${URL}Manager/Insert`, true);
                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                xhr.send($.param(dataObj));
                            }
                        } else {
                            alert(errorText);
                        };
                    });
                };
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200) {
                        let callBackData = JSON.parse(xhr.responseText);
                        if (callBackData.Result == "OK") {
                            let auth = new Array();
                            // 渲染出所有的管理者帳號
                            for (let i = 0; i < callBackData.Content.length; i++) {
                                if (callBackData.Content[i].INFO == null) {
                                    callBackData.Content[i].INFO = [];
                                }
                                if (callBackData.Content[i].INFO.length > 0) {
                                    for (let j = 0; j < callBackData.Content[i].INFO.length; j++) {
                                        auth.push((callBackData.Content[i].INFO[j].GROUP_ID))
                                    }
                                } else {
                                    auth = [];
                                }
                                html += `
                                    <tr>
                                        <td class="managerName" data-title="管理者帳號" data-id="${callBackData.Content[i].ID}">
                                            <div class="btnThirds d-flex justify-content-between align-items-center">
                                                <input type="text" readonly class="form-control-plaintext edit_account" value="${callBackData.Content[i].ACCOUNT}">
                                            </div>
                                        </td> 
                                        <td data-title="電子郵件">
                                            <input type="email" class="form-control edit_email inputStatus" disabled value="${callBackData.Content[i].EMAIL}">
                                        </td>
                                        <td data-title="名字">
                                            <input type="text" class="form-control edit_name inputStatus" disabled value="${callBackData.Content[i].NAME}">
                                        </td>
                                        <td data-title="群組分類">
                                            <input class="gId" value="${auth}" hidden>
                                            <select name="states" class="form-control badge_text mulSelectz" multiple="multiple" style="display: none;"></select>
                                        </td>
                                        <td class="attitude" data-title="狀態">
                                            <div class="custom-control custom-switch">
                                                <input type="checkbox" class="custom-control-input edit_status inputStatus" id="customSwitch${i}" value="${callBackData.Content[i].ENABLED}" disabled>
                                                <label class="custom-control-label" for="customSwitch${i}">開啟</label>
                                            </div>
                                        </td>
                                        <td class="setup" data-title="設定"></td>
                                    </tr>
                                `;
                                auth = [];
                            };
                            managers.html(html);

                            var $mulSelectz = $('.mulSelectz'); // 群組列表 群組分類
                            $mulSelectz.html(options); // 渲染群組選項
                            for (let i = 0; i < managers.find('tr').length; i++) {
                                if (managers.find('tr').eq(i).find('.gId').val()) {
                                    let auth = managers.find('tr').eq(i).find('.gId').val().split(',');
                                    for (let j = 0; j < auth.length; j++) {
                                        managers.find('tr').eq(i).find(`option[value="${auth[j]}"]`).prop('selected', true)
                                    }
                                }
                            };
                            // 權限使用與否
                            var getIsAttached = function () { return $mulSelectz.data("DashboardCode.BsMultiSelect") != null };
                            var disabled = true;
                            var install = function () {
                                $mulSelectz.bsMultiSelect({
                                    getDisabled: function () { return disabled }, // 禁用、啟用欄位
                                });
                            };
                            install(); // 啟用 BsMultiSelect
                            // 管理者帳號的狀態顯示
                            let chk = $('.edit_status');
                            for (let i = 0; i < chk.length; i++) {
                                if (chk.eq(i).val() == "1") {
                                    chk.eq(i).prop('checked', true);
                                } else {
                                    chk.eq(i).prop('checked', false);
                                };
                            };
                            // 顯示編輯
                            if (menuAuth[authParent.indexOf("SM")].ACT_EDT == "Y") {
                                $('.setup').append(`
                                    <div class="setupBlock">
                                        <a class="btn btn-warning btn-sm btnEdit" href="#" > <i class="far fa-edit"></i> 編輯</a>
                                    </div>
                                `);
                                // Edit 取得 window 物件上所有編輯按鈕（靜態、第一次產生、第N次動態產生）
                                $(document).on('click', '.btnEdit', function (e) {
                                    e.preventDefault(), e.stopPropagation();// 取消 a 預設事件 // 取消冒泡 Bubble 事件
                                    let trz = $(this).parents('tr'); // 宣告當下欄位
                                    if ($('td.setup').hasClass('active')) { // 如果有欄位在編輯狀態的話，其他欄位就不能用
                                        alert('請確認是否有欄位尚未儲存！');
                                    } else {
                                        // 原資料
                                        let orgMail = trz.find('.edit_email').val(), orgName = trz.find('.edit_name').val(), orgStatus = trz.find('.edit_status').val();
                                        let orgAuths = trz.find('.gId').val().split(',');
                                        // 權限欄位的禁用、啟用
                                        if (getIsAttached()) { // 如果有成功使用權限欄位
                                            disabled = !disabled; // 轉換 Boolean
                                            trz.find('.mulSelectz').bsMultiSelect("UpdateDisabled"); // 更新權限欄位
                                        };
                                        // 點擊編輯後 -> 1.啟用欄位的編輯 2.動態產生儲存、刪除
                                        trz.find('input.inputStatus').prop('disabled', false); // 啟用欄位的編輯
                                        // 顯示刪除功能
                                        if (menuAuth[authParent.indexOf("SM")].ACT_DEL == "Y") {
                                            // 1.新增一個判斷更動與否的class 2.動態產生 儲存、刪除
                                            trz.find('.setup').addClass('active').html('').append(`
                                                <div class="setupBlock ownSets">
                                                    <a class="btn btn-success btn-sm btnSave" href="#"><i class="far fa-edit"></i> 存儲</a> 
                                                    <a class="btn btn-danger btn-sm btnDel" href="#"><i class="fas fa-trash"></i> 刪除</a>
                                                    <a class="btn btn-sm ml-2 btnCancel" href="#"><i class="far fa-window-close"></i> 取消</a>
                                                </div>
                                            `);
                                            // Delete 當點擊編輯按鈕後，動態產生刪除按鈕
                                            $('.btnDel').on('click', function (e) {
                                                e.preventDefault(); // 取消 a 預設事件
                                                let id = $(this).parents('tr').find('.managerName').data('id');
                                                let dataObj = { // Post 物件
                                                    "account_id": idz,
                                                    "id": id
                                                };
                                                if (confirm("您確定要刪除這個管理者帳號嗎？")) {
                                                    let xhr = new XMLHttpRequest();
                                                    xhr.onload = function () {
                                                        if (xhr.status == 200) {
                                                            let callBackData = JSON.parse(xhr.responseText);
                                                            if (callBackData.Result == "OK") {
                                                                location.reload();
                                                            }
                                                        } else {
                                                            alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                                                            // getLogout();
                                                        };
                                                    };
                                                    xhr.open('POST', `${URL}Manager/Delete`, true)
                                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                    xhr.send($.param(dataObj));
                                                }
                                            });
                                        } else {
                                            trz.find('.setup').addClass('active').html('').append(`
                                                <div class="setupBlock ownSets">
                                                    <a class="btn btn-success btn-sm btnSave" href="#"><i class="far fa-edit"></i> 存儲</a>
                                                    <a class="btn btn-sm ml-2 btnCancel" href="#"><i class="far fa-window-close"></i> 取消</a>
                                                </div>
                                            `);
                                        };
                                        // 管理者帳號的狀態控制
                                        trz.find('.edit_status').on('change', function () {
                                            if ($(this).prop('checked') == true) {
                                                $(this).val("1");
                                            } else {
                                                $(this).val("0");
                                            }
                                        });
                                        // Save 當點擊編輯按鈕後，動態產生儲存按鈕
                                        $('.btnSave').on('click', function (e) {
                                            e.preventDefault(); // 取消 a 預設事件
                                            e.stopImmediatePropagation(); // 取消捕獲 Capture 事件
                                            dataUpdateCheck(idz, trz.find('.edit_account'), trz.find('.edit_name'), trz.find('.edit_email'));
                                            if (check == true) {
                                                let trz = $(this).parents('tr'); // 宣告當下欄位
                                                let dataObj = {
                                                    "account_id": idz,
                                                    "id": trz.find('.managerName').data('id'),
                                                    "account": trz.find('.edit_account').val(),
                                                    "name": trz.find('.edit_name').val(),
                                                    "email": trz.find('.edit_email').val(),
                                                    "groups": trz.find('.mulSelectz').val(),
                                                    "Enabled": trz.find('.edit_status').val()
                                                };
                                                if (confirm("您確定要進行修改嗎（會在下次登入生效）?")) {
                                                    let xhr = new XMLHttpRequest();
                                                    xhr.onload = function () {
                                                        if (xhr.status == 200) {
                                                            let callBackData = JSON.parse(xhr.responseText);
                                                            if (callBackData.Result == "OK") {
                                                                // 權限欄位的禁用、啟用
                                                                if (getIsAttached()) { // 如果有成功使用權限欄位
                                                                    disabled = !disabled; // 轉換 Boolean
                                                                    trz.find('.mulSelectz').bsMultiSelect("UpdateDisabled"); // 更新權限欄位
                                                                }
                                                                // 點擊儲存後 -> 1.禁用欄位的編輯 2.動態產生編輯
                                                                if ($(this)) {
                                                                    trz.find('input.inputStatus').prop('disabled', true); // 禁用欄位的編輯
                                                                    // 1.移除判斷更動的class 2.動態產生編輯
                                                                    trz.find('.setup').removeClass('active').html('').append(`
                                                                        <a class="btn btn-warning btn-sm btnEdit" href="#"><i class="far fa-edit"></i> 編輯</a> 
                                                                    `);
                                                                };
                                                                // 重新載入
                                                                location.reload();
                                                            } else {
                                                                alert(callBackData.Content);
                                                            }
                                                        } else {
                                                            alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                                                            // getLogout();
                                                        };
                                                    };
                                                    xhr.open('POST', `${URL}Manager/Update`, true);
                                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                    xhr.send($.param(dataObj));
                                                };
                                            } else {
                                                alert(errorText);
                                            }
                                        });
                                        // 顯示變更密碼
                                        trz.find('.btnThirds').append(`
                                            <a href="#" class="text-primary btnOpenPsw" data-toggle="modal" data-target="#manPswEdit">［密碼］</a>
                                        `);
                                        // 更新會員密碼
                                        $('.btnOpenPsw').on('click', function () {
                                            let trz = $(this).parents('tr');
                                            $('.man_id').val(trz.find('.managerName').data('id'));
                                            // Cancel
                                            $('.btnCancel, .close').unbind('click').on('click', function (e) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                let trz = $(this).parents('.modal-content');
                                                if (confirm("尚未儲存內容，確定要取消嗎？")) {
                                                    // 清空欄位資料
                                                    trz.find('input[type="password"]').val('');
                                                    $('.closez').trigger('click');
                                                };
                                            });
                                        });
                                        $('.btnChangeManPsw').on('click', function () {
                                            let trz = $(this).parents('.modal-content');
                                            manPswCheck(trz.find('.new_manPsw'));
                                            if (check == true) {
                                                let dataObj = {
                                                    "id": trz.find('.man_id').val(),
                                                    "new_password": trz.find('.new_manPsw').val(),
                                                    "new_password_again": trz.find('.agn_manPsw').val()
                                                };
                                                if (confirm("您確定要進行修改嗎（會在下次登入生效）?")) {
                                                    let xhr = new XMLHttpRequest();
                                                    xhr.onload = function () {
                                                        if (xhr.status == 200 || xhr.status == 204) {
                                                            alert("修改成功！");
                                                            location.reload();
                                                        } else {
                                                            alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                                                        };
                                                    };
                                                    xhr.open('POST', `${URL}Manager/ResetPassword`, true);
                                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                    xhr.send($.param(dataObj));
                                                }
                                            } else {
                                                alert(errorText);
                                            };
                                        });
                                        // Cancel
                                        trz.find('.btnCancel').on('click', function (e) {
                                            e.preventDefault();
                                            let trz = $(this).parents('tr');
                                            if (confirm("尚未儲存更改的內容，確定要取消嗎？")) {
                                                // 還原欄位資料
                                                trz.find('.edit_email').val(orgMail);
                                                trz.find('.edit_name').val(orgName);
                                                trz.find('.edit_status').val(orgStatus);
                                                if (trz.find('.edit_status').val() == "1") {
                                                    trz.find('.edit_status').prop('checked', true);
                                                } else {
                                                    trz.find('.edit_status').prop('checked', false);
                                                };
                                                $mulSelectz = trz.find('.mulSelectz');
                                                $mulSelectz.bsMultiSelect("Dispose");
                                                $mulSelectz.unbind();
                                                for (let i = 0; i < orgAuths.length; i++) {
                                                    $mulSelectz.find(`option[value="${orgAuths[i]}"]`).prop('selected', true)
                                                };
                                                // 權限使用與否
                                                getIsAttached = function () { return $mulSelectz.data("DashboardCode.BsMultiSelect") != null };
                                                disabled = true;
                                                install = function () {
                                                    $mulSelectz.bsMultiSelect({
                                                        getDisabled: function () { return disabled }, // 禁用、啟用欄位
                                                    });
                                                };
                                                install(); // 啟用 BsMultiSelect
                                                // 轉為編輯按鈕
                                                trz.find('.setup').removeClass('active').html('').append(`
                                                    <div class="setupBlock">
                                                        <a class="btn btn-warning btn-sm btnEdit" href="#"><i class="far fa-edit"></i> 編輯</a>
                                                    </div>
                                                `);
                                                // 權限欄位的禁用、啟用
                                                trz.find('.inputStatus').prop('disabled', true);
                                                //
                                                trz.find('.btnThirds .btnOpenPsw').remove();
                                            };
                                        });
                                    };

                                });
                            };
                        } else {
                            alert(callBackData.Content);
                        };
                    } else { };
                };
                xhr.open('POST', `${URL}Manager/Get`, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send(null);
            } else {
                alert(callBackData.Content)
            }
        } else {
            // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
            // getLogout();
        }
    };
    xhr.open('POST', `${URL}ManagerGroup/Get`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(null);
});