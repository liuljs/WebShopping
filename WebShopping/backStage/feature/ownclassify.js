// 宣告要帶入的欄位
let groups = $('.groups'); // 群組類表
// 權限群組
let authArr = [
    { CODE: "MM", NAME: "會員管理", ACT_VIEW: "N", ACT_EDT: "N", ACT_DEL: "N" },
    { CODE: "OM", NAME: "訂單管理", ACT_VIEW: "N", ACT_EDT: "N", ACT_DEL: "N" },
    { CODE: "PM", NAME: "產品管理", ACT_VIEW: "N", ACT_EDT: "N", ACT_DEL: "N" },
    { CODE: "SM", NAME: "管理者管理", ACT_VIEW: "N", ACT_EDT: "N", ACT_DEL: "N" }
];
let arr = $.map(authArr, function (item, index) {
    return item.CODE;
});
let anoArr = [];
// 驗證
function dataUpdateCheck(aId, name, auth) {
    if (aId.trim() === '') {
        return check = false, errorText = '請確認必填欄位皆有填寫！';
    }
    if (name.val().trim() === '' || name.val().length > 20) {
        name.focus();
        return check = false, errorText = '請確認群組名稱有確實填寫、長度不得超過20字元！';
    }
    if (auth.val() == '') {
        auth.focus();
        return check = false, errorText = '請確認有設定群組的使用權限！';
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
                // 渲染出所有的管理群組
                for (let i = 0; i < callBackData.Content.length; i++) {
                    let arr = $.map(callBackData.Content[i].DATA, function (item, index) {
                        return item.CODE;
                    });
                    html += `
                        <tr>
                            <td class="num-box grpsName" data-title="名稱" data-id="${callBackData.Content[i].ID}">
                                <input type="text" class="form-control edit_grpsName inputStatus" disabled value="${callBackData.Content[i].NAME}">
                            </td>
                            <td class="auths" data-title="使用權限">
                                <select name="states" class="mulSelectz" multiple="multiple" style="display: none;">
                                <optgroup data-name="${arr.indexOf("MM")}" label="會員管理權限設定">
                                    <option data-val="${callBackData.Content[i].DATA[arr.indexOf("MM")].ACT_VIEW}" data-set="ACT_VIEW" value="MEM-VIEW">會員檢視</option>
                                    <option data-val="${callBackData.Content[i].DATA[arr.indexOf("MM")].ACT_EDT}" data-set="ACT_EDT" value="MEM-EDIT">會員編輯</option>
                                    <option data-val="${callBackData.Content[i].DATA[arr.indexOf("MM")].ACT_DEL}" data-set="ACT_DEL" value="MEM-DEL">會員刪除</option>
                                </optgroup>
                                <optgroup data-name="${arr.indexOf("OM")}" label="訂單管理權限設定">
                                    <option data-val="${callBackData.Content[i].DATA[arr.indexOf("OM")].ACT_VIEW}" data-set="ACT_VIEW" value="ODR-VIEW">訂單檢視</option>
                                    <option data-val="${callBackData.Content[i].DATA[arr.indexOf("OM")].ACT_EDT}" data-set="ACT_EDT" value="ODR-EDIT">訂單編輯</option>
                                    <option data-val="${callBackData.Content[i].DATA[arr.indexOf("OM")].ACT_DEL}" data-set="ACT_DEL" value="ODR-DEL">訂單刪除</option>
                                </optgroup>
                                <optgroup data-name="${arr.indexOf("PM")}" label="產品管理權限設定">
                                    <option data-val="${callBackData.Content[i].DATA[arr.indexOf("PM")].ACT_VIEW}" data-set="ACT_VIEW" value="PDT-VIEW">產品檢視</option>
                                    <option data-val="${callBackData.Content[i].DATA[arr.indexOf("PM")].ACT_EDT}" data-set="ACT_EDT" value="PDT-EDIT">產品編輯</option>
                                    <option data-val="${callBackData.Content[i].DATA[arr.indexOf("PM")].ACT_DEL}" data-set="ACT_DEL" value="PDT-DEL">產品刪除</option>
                                </optgroup>
                                <optgroup data-name="${arr.indexOf("SM")}" label="管理者管理權限設定">
                                    <option data-val="${callBackData.Content[i].DATA[arr.indexOf("SM")].ACT_VIEW}" data-set="ACT_VIEW" value="MGR-VIEW">管理者檢視</option>
                                    <option data-val="${callBackData.Content[i].DATA[arr.indexOf("SM")].ACT_EDT}" data-set="ACT_EDT" value="MGR-EDIT">管理者編輯</option>
                                    <option data-val="${callBackData.Content[i].DATA[arr.indexOf("SM")].ACT_DEL}" data-set="ACT_DEL" value="MGR-DEL">管理者刪除</option>
                                </optgroup>
                                </select>
                            </td>
                            <td class="setup" data-title="設定"></td>
                        </tr>
                    `;
                };
                groups.html(html);
                $('option[data-val="Y"]').prop('selected', true);

                var $mulSelectz = $('.mulSelectz'); // 群組列表 權限使用
                $mulSelectz.multiselect({
                    nonSelectedText: '-',
                    nSelectedText: ' - 已選擇（點擊展開選項）',
                    allSelectedText: '全部選擇（點擊展開選項）-',
                    onChange: function (element, checked) {
                        if (checked === true) {
                            anoArr[element.parent().data("name")][element.data("set")] = "Y";
                            console.log(anoArr)
                        }
                        else {
                            anoArr[element.parent().data("name")][element.data("set")] = "N";
                            console.log(anoArr)

                        };
                    }
                });
                $mulSelectz.multiselect('disable');
            }
            // 顯示新增、編輯功能
            if (menuAuth[authParent.indexOf("SM")].ACT_EDT == "Y") {
                $('.ownCls-contents').prepend(`
                    <div class="col-xl-4">
                        <div class="card">
                            <div class="card-header d-flex align-items-center">
                                <h2 class="text-primary d-inline mb-0">新增群組分類</h2>
                                <span class="notes">（＊號為必填欄位）</span>
                            </div>
                            <div class="card-body">
                                <div class="form">
                                    <div class="form-group">
                                        <label>新增群組<span class="markz"></span></label>
                                        <input type="text" class="form-control add_grps">
                                    </div>
                                    <div class="form-group">
                                        <label>使用權限<span class="markz"></span></label>
                                        <select id="addSelectz" name="states" class="add_auths" multiple="multiple" style="display: none;">
                                            <optgroup data-name="0" label="會員管理權限設定">
                                                <option data-set="ACT_VIEW" value="MEM-VIEW">會員檢視</option>
                                                <option data-set="ACT_EDT" value="MEM-EDIT">會員編輯</option>
                                                <option data-set="ACT_DEL" value="MEM-DEL">會員刪除</option>
                                            </optgroup>
                                            <optgroup data-name="1" label="訂單管理權限設定">
                                                <option data-set="ACT_VIEW" value="ODR-VIEW">訂單檢視</option>
                                                <option data-set="ACT_EDT" value="ODR-EDIT">訂單編輯</option>
                                                <option data-set="ACT_DEL" value="ODR-DEL">訂單刪除</option>
                                            </optgroup>
                                            <optgroup data-name="2" label="產品管理權限設定">
                                                <option data-set="ACT_VIEW" value="PDT-VIEW">產品檢視</option>
                                                <option data-set="ACT_EDT" value="PDT-EDIT">產品編輯</option>
                                                <option data-set="ACT_DEL" value="PDT-DEL">產品刪除</option>
                                            </optgroup>
                                            <optgroup data-name="3" label="管理者管理權限設定">
                                                <option data-set="ACT_VIEW" value="MGR-VIEW">管理者檢視</option>
                                                <option data-set="ACT_EDT" value="MGR-EDIT">管理者編輯</option>
                                                <option data-set="ACT_DEL" value="MGR-DEL">管理者刪除</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                    <div class="text-right my-3">
                                        <button type="submit" class="btn btn-primary btnAddGps">新增群組</button>
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                `);
                $('#addSelectz').multiselect({ // 新增用 權限使用
                    nonSelectedText: '-',
                    nSelectedText: ' - 已選擇（點擊展開選項）',
                    allSelectedText: '全部選擇（點擊展開選項）-',
                    selectAllText: '選擇全部權限',
                    includeSelectAllOption: true,
                    selectAllValue: 'select-all-value',
                    onChange: function (element, checked) {
                        if (checked === true) {
                            authArr[element.parent().data("name")][element.data("set")] = "Y";
                        }
                        else {
                            authArr[element.parent().data("name")][element.data("set")] = "N";
                        }
                    }
                });
                $('input[value="select-all-value"]').on('change', function () {
                    if ($(this).prop('checked') == true) {
                        authArr = [
                            { CODE: "MM", NAME: "會員管理", ACT_VIEW: "Y", ACT_EDT: "Y", ACT_DEL: "Y" },
                            { CODE: "OM", NAME: "訂單管理", ACT_VIEW: "Y", ACT_EDT: "Y", ACT_DEL: "Y" },
                            { CODE: "PM", NAME: "產品管理", ACT_VIEW: "Y", ACT_EDT: "Y", ACT_DEL: "Y" },
                            { CODE: "SM", NAME: "管理者管理", ACT_VIEW: "Y", ACT_EDT: "Y", ACT_DEL: "Y" }
                        ];
                    } else {
                        authArr = [
                            { CODE: "MM", NAME: "會員管理", ACT_VIEW: "N", ACT_EDT: "N", ACT_DEL: "N" },
                            { CODE: "OM", NAME: "訂單管理", ACT_VIEW: "N", ACT_EDT: "N", ACT_DEL: "N" },
                            { CODE: "PM", NAME: "產品管理", ACT_VIEW: "N", ACT_EDT: "N", ACT_DEL: "N" },
                            { CODE: "SM", NAME: "管理者管理", ACT_VIEW: "N", ACT_EDT: "N", ACT_DEL: "N" }
                        ];
                    };
                });
                $('.setup').append(`
                    <div class="setupBlock">
                        <a class="btn btn-warning btn-sm btnEdit" href="#"><i class="far fa-edit"></i> 編輯</a>
                    </div>
                `);
                // 編輯
                $(document).on('click', '.btnEdit', function (e) {
                    e.preventDefault(); // 取消 a 預設事件
                    e.stopPropagation(); // 取消冒泡 Bubble 事件
                    let trz = $(this).parents('tr'); // 宣告當下欄位

                    if ($('td.setup').hasClass('active')) { // 如果有欄位在編輯狀態的話，其他欄位就不能用
                        alert('請確認是否有欄位尚未儲存！');
                    } else {
                        // 權限欄位的禁用、啟用
                        $mulSelectz.eq(trz.index()).multiselect('enable');
                        anoArr = callBackData.Content[trz.index()].DATA;
                        // 原資料
                        let orgName = trz.find('.edit_grpsName').val();
                        let orgArr = $.extend(true, [], callBackData.Content[trz.index()].DATA);
                        // 點擊編輯後 -> 1.啟用欄位的編輯 2.動態產生儲存、刪除
                        trz.find('input.inputStatus').prop('disabled', false); // 啟用欄位的編輯
                        // 1.新增一個判斷更動與否的class 2.動態產生 儲存、刪除
                        // 顯示刪除功能
                        if (menuAuth[authParent.indexOf("SM")].ACT_DEL == "Y") {
                            trz.find('.setup').addClass('active').html('').append(`
                                <div class="setupBlock">
                                    <a class="btn btn-success btn-sm btnSave" href="#"><i class="fal fa-save"></i> 存儲</a> 
                                    <a class="btn btn-danger btn-sm btnDel" href="#"><i class="fas fa-trash"></i> 刪除</a>
                                    <a class="btn btn-sm btnCancel ml-2" href="#"><i class="far fa-window-close"></i> 取消</a>
                                </div>
                            `);
                            // Delete 當點擊編輯按鈕後，動態產生刪除按鈕
                            $('.btnDel').on('click', function (e) {
                                e.preventDefault(); // 取消 a 預設事件
                                let id = $(this).parents('tr').find('.grpsName').data('id'); // 取得要刪除的群組 ID
                                let dataObj = { // Post 物件
                                    "account_id": idz,
                                    "id": id
                                };
                                if (confirm("確定要刪除這個管理群組嗎?")) {
                                    let xhr = new XMLHttpRequest();
                                    xhr.onload = function () {
                                        if (xhr.status == 200) {
                                            let callBackData = JSON.parse(xhr.responseText);
                                            if (callBackData.Result == "OK") {
                                                alert("群組刪除成功！");
                                                location.reload();
                                            }
                                        } else {
                                            alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                                        };
                                    };
                                    xhr.open('POST', `${URL}ManagerGroup/Delete`, true)
                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                    xhr.send($.param(dataObj));
                                }
                            });
                        } else {
                            trz.find('.setup').addClass('active').html('').append(`
                                <div class="setupBlock">
                                    <a class="btn btn-success btn-sm btnSave" href="#"><i class="far fa-edit"></i> 存儲</a> 
                                    <a class="btn btn-sm btnCancel ml-2" href="#"><i class="far fa-window-close"></i> 取消</a>
                                </div>
                            `);
                        };
                        // Save 當點擊編輯按鈕後，動態產生儲存按鈕
                        $('.btnSave').on('click', function (e) {
                            // 點擊儲存後 -> 1.禁用欄位的編輯 2.動態產生編輯
                            e.preventDefault(); // 取消 a 預設事件
                            e.stopImmediatePropagation(); // 取消捕獲 Capture 事件
                            dataUpdateCheck(idz, trz.find('.edit_grpsName'), trz.find('.mulSelectz'));
                            if (check == true) {
                                if (confirm(`確定要進行修改嗎（會在下次登入生效）?`)) {
                                    let dataObj = {
                                        "account_id": idz,
                                        "id": trz.find('.grpsName').data('id'),
                                        "name": trz.find('.edit_grpsName').val(),
                                        "data": anoArr
                                    };
                                    let xhr = new XMLHttpRequest();
                                    xhr.onload = function () {
                                        if (xhr.status == 200) {
                                            let callBackData = JSON.parse(xhr.responseText);
                                            if (callBackData.Result == "OK") {
                                                alert("群組修改成功！");
                                                // 權限欄位的禁用、啟用
                                                $mulSelectz.eq(trz.index()).multiselect('rebuild');
                                                $mulSelectz.eq(trz.index()).multiselect('disable');
                                                if ($(this)) {
                                                    trz.find('input.inputStatus').prop('disabled', true); // 禁用欄位的編輯
                                                    // 1.移除判斷更動的class 2.動態產生編輯
                                                    trz.find('.setup').removeClass('active').html('').append(`
                                                    <div class="setupBlock">
                                                        <a class="btn btn-warning btn-sm btnEdit" href="#"><i class="far fa-edit"></i> 編輯</a> 
                                                    </div>
                                                `);
                                                };
                                                // 重新載入
                                                location.reload();
                                            } else {
                                                alert(callBackData.Content);
                                            }
                                        } else {
                                            alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                                        };
                                    };
                                    xhr.open('POST', `${URL}ManagerGroup/Update`, true);
                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                    xhr.send($.param(dataObj));
                                };
                            } else {
                                alert(errorText);
                            };
                        });
                        // Cancel
                        $('.btnCancel').on('click', function (e) {
                            e.preventDefault();
                            let trz = $(this).parents('tr');
                            if (confirm("尚未儲存更改的內容，確定要取消嗎？")) {
                                // 還原欄位資料
                                trz.find('.edit_grpsName').val(orgName);

                                $('.mulSelectz').eq(trz.index()).multiselect('destroy');
                                arr = $.map(orgArr, function (item, index) {
                                    return item.CODE;
                                });
                                html = `
                                    <optgroup data-name="${arr.indexOf("MM")}" label="會員管理權限設定">
                                        <option data-val="${orgArr[arr.indexOf("MM")].ACT_VIEW}" data-set="ACT_VIEW" value="MEM-VIEW">會員檢視</option>
                                        <option data-val="${orgArr[arr.indexOf("MM")].ACT_EDT}" data-set="ACT_EDT" value="MEM-EDIT">會員編輯</option>
                                        <option data-val="${orgArr[arr.indexOf("MM")].ACT_DEL}" data-set="ACT_DEL" value="MEM-DEL">會員刪除</option>
                                    </optgroup>
                                    <optgroup data-name="${arr.indexOf("OM")}" label="訂單管理權限設定">
                                        <option data-val="${orgArr[arr.indexOf("OM")].ACT_VIEW}" data-set="ACT_VIEW" value="ODR-VIEW">訂單檢視</option>
                                        <option data-val="${orgArr[arr.indexOf("OM")].ACT_EDT}" data-set="ACT_EDT" value="ODR-EDIT">訂單編輯</option>
                                        <option data-val="${orgArr[arr.indexOf("OM")].ACT_DEL}" data-set="ACT_DEL" value="ODR-DEL">訂單刪除</option>
                                    </optgroup>
                                    <optgroup data-name="${arr.indexOf("PM")}" label="產品管理權限設定">
                                        <option data-val="${orgArr[arr.indexOf("PM")].ACT_VIEW}" data-set="ACT_VIEW" value="PDT-VIEW">產品檢視</option>
                                        <option data-val="${orgArr[arr.indexOf("PM")].ACT_EDT}" data-set="ACT_EDT" value="PDT-EDIT">產品編輯</option>
                                        <option data-val="${orgArr[arr.indexOf("PM")].ACT_DEL}" data-set="ACT_DEL" value="PDT-DEL">產品刪除</option>
                                    </optgroup>
                                    <optgroup data-name="${arr.indexOf("SM")}" label="管理者管理權限設定">
                                        <option data-val="${orgArr[arr.indexOf("SM")].ACT_VIEW}" data-set="ACT_VIEW" value="MGR-VIEW">管理者檢視</option>
                                        <option data-val="${orgArr[arr.indexOf("SM")].ACT_EDT}" data-set="ACT_EDT" value="MGR-EDIT">管理者編輯</option>
                                        <option data-val="${orgArr[arr.indexOf("SM")].ACT_DEL}" data-set="ACT_DEL" value="MGR-DEL">管理者刪除</option>
                                    </optgroup>
                                `;
                                $('.mulSelectz').eq(trz.index()).html(html);
                                $('.mulSelectz').eq(trz.index()).find('option[data-val="Y"]').prop('selected', true);

                                $('.mulSelectz').eq(trz.index()).multiselect({
                                    nonSelectedText: '-',
                                    nSelectedText: ' - 已選擇（點擊展開選項）',
                                    allSelectedText: '全部選擇（點擊展開選項）-',
                                    onChange: function (element, checked) {
                                        if (checked === true) {
                                            anoArr[element.parent().data("name")][element.data("set")] = "Y";
                                        }
                                        else {
                                            anoArr[element.parent().data("name")][element.data("set")] = "N";
                                        };
                                    }
                                });
                                // 轉為編輯按鈕
                                trz.find('.setup').removeClass('active').html('').append(`
                                    <div class="setupBlock">
                                        <a class="btn btn-warning btn-sm btnEdit" href="#"><i class="far fa-edit"></i> 編輯</a>
                                    </div>
                                `);
                                // 權限欄位的禁用、啟用
                                trz.find('.inputStatus').prop('disabled', true);
                                $mulSelectz.eq(trz.index()).multiselect('disable');
                                // 還原
                                anoArr = orgArr;
                            }
                        });
                    };
                });
            };
        } else {
            // getLogout();
        };
    };
    xhr.open('POST', `${URL}ManagerGroup/Get`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(null);
    // 新增按鈕
    $(document).on('click', '.btnAddGps', function () {
        let add_grps = $('.add_grps'); // 群組名稱
        let add_auths = $('#addSelectz'); // 使用權限

        dataUpdateCheck(idz, add_grps, add_auths); // 前端驗證
        if (check == true) {
            if (confirm("確定要新增一個管理群組嗎？")) {
                let dataObj = {
                    "account_id": idz,
                    "name": add_grps.val(),
                    "data": authArr
                };
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200) {
                        let callBackData = JSON.parse(xhr.responseText);
                        if (callBackData.Result == "OK") {
                            // 重置
                            authArr = [
                                { CODE: "MM", NAME: "會員管理", ACT_VIEW: "N", ACT_EDT: "N", ACT_DEL: "N" },
                                { CODE: "OM", NAME: "訂單管理", ACT_VIEW: "N", ACT_EDT: "N", ACT_DEL: "N" },
                                { CODE: "PM", NAME: "產品管理", ACT_VIEW: "N", ACT_EDT: "N", ACT_DEL: "N" },
                                { CODE: "SM", NAME: "管理者管理", ACT_VIEW: "N", ACT_EDT: "N", ACT_DEL: "N" }
                            ];
                            location.reload();
                        } else {
                            alert(callBackData.Content);
                        }
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                    };
                };
                xhr.open('POST', `${URL}ManagerGroup/Insert`, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send($.param(dataObj));
            };
        } else {
            alert(errorText);
        };
    });
});