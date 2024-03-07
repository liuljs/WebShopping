// PRODUCT DETAIL
let titles = $('.titles'), prices = $('.prices'), contents = $('#editorz');
let remainQty, minVal, maxVal; // 至少買一件，最多買（依規格庫存訂定）
let btnAddCart = $('.btnAddCart');

let qties = $('.qties'), qty = $('.qty'), edit_qty = $('.edit_qty'); // 取頁面上要增加的數量
// SWIPERS
let sliders = $('.sliders');
// 接收資料，做渲染、處理
function process(data) {
    console.log(data)
    html = "";
    // SWIPERS
    for (let i = 1; i < imgLimit + 1; i++) { // 對應名稱從 1 開始算，總數限制 + 1 才為對應正常數值 
        // 如果有就加入輪播圖
        if (data[`Product0${i}`] !== "" && data[`Product0${i}`] !== null) {
            html += `
                <div class="swiper-slide"><img src="${IMGURL}/products/${data.Id}/${data[`Product0${i}`]}"></div>
            `;
            check = false;
        };
    };
    if (check == true) { // 如果沒有輪播圖，會呈現封面圖
        html = "";
        html = `
            <div class="swiper-slide"><img src="${IMGURL}products/${data.Id}/${data.Product_Cover}"></div>
        `;
    };
    sliders.html(html);
    // PRODUCT DETAIL || 單一商品、相同規格 SellInfos[0]
    titles.html('').html(data.Title);
    prices.html('').html(`
        <div class="price"><span>NTD$</span>
            <p>${thousands(data.SellInfos[0].Sell_Price)}</p>
        </div>
        <div class="old_price"><span>NTD$</span>
            <p>${thousands(data.Price)}</p>
        </div>
    `);
    // QUANTITY
    if (data.SellInfos[0].Stock_Qty <= 0) {
        // 最少購買數量變為 0
        edit_qty.val(0);
        minVal = 0, maxVal = 0;
        // 禁止加入購物車
        btnAddCart.unbind('click').addClass('none');
    } else {
        // 最少購買數（至少要 1 件）
        edit_qty.val(1);
        minVal = 1, maxVal = data.SellInfos[0].Stock_Qty; // 最大購買數
        // ADD CART
        btnAddCart.on('click', function (e) {
            e.preventDefault();
            let dataObj = {
                "spu_id": data.SellInfos[0].Spu_Id, // 選取的商品規格 Id
                "sku_id": data.SellInfos[0].Id, // 選取的商品規格 Id
                "qty": $('.edit_qty').val(), // 
                "stock_qty": data.SellInfos[0].Stock_Qty,
                "sell_stop": data.Sell_Stop
            };
            console.log(dataObj);
            addCart(e, dataObj);
        });
    };
    edit_qty.val(minVal);
    edit_qty.on('input', function () {
        if ($(this).val() == 0) {
            $(this).val(minVal);
        } else if ($(this).val() > maxVal) {
            $(this).val(maxVal)
        };
    });
    // INTRODUCTION
    html = quill.setContents(JSON.parse(data.Detail.Introduction1).ops);
    contents.html(quill.root.innerHTML);
};
// NOTFOUND
function fails() { };
$().ready(function () {
    // 從 localStorage 取編號，用於呼叫資訊
    // let num = localStorage.getItem('productNum');
    let num = request('pdtId');
    if (num) {
        // PRODUCT DETAIL
        let dataObj = {
            "Methods": "GET",
            "APIs": URL,
            "CONNECTs": `Product/${num}`,
            "QUERYs": "",
            "Counts": "",
            "Sends": "",
        };
        getPageDatas(dataObj).then(res => {
            // DO SOMETHING
            if (res !== null) {
                process(res);
            } else {
                fails();
            };
        }, rej => {
            if (rej == "NOTFOUND") { };
        });
    };
    // QUANTITY
    qty.find('div').on('click', function () {
        let trz = $(this);
        let val = trz.parents('.qty').find('input').val(), newVal;
        if (trz.data('num') == "minus") {
            if (val > minVal) {
                newVal = parseFloat(val) - 1;
            } else {
                newVal = minVal;
            }
        } else {
            if (val < maxVal) {
                newVal = parseFloat(val) + 1;
            } else {
                newVal = maxVal;
            }
        }
        trz.parents('.qty').find('input').val(newVal);
    });
});