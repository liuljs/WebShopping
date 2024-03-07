// ALBUMS2
let titles = $('.titles'), btnMore = $('.btnMore');
let lists = $('.lists'), images, sliders = $('.sliders'), slider, sliderLimit = 10;
// 接收資料，做渲染、處理
function process(data) {
    titles.html(data.Title);
    btnMore.attr('href', data.More_Pic_Url);
    // ALBUMS2 10 PICS
    html = "", slider = "";
    for (let i = 1; i < sliderLimit + 1; i++) { // 10 張 需加1 
        if (i < 10) { // 個位數
            if (data[`Picture0${i}`] !== null && data[`Picture0${i}`] !== undefined && data[`Picture0${i}`] !== "") {
                images = `${IMGURL}/PictureList/${data[`Picture0${i}`]}`;
                html += `
                    <div class="albumn_item" data-bs-toggle="modal" data-bs-target="#pictures">
                        <a>
                            <div class="a_img">
                                <img src="${images}" alt="">
                            </div>
                        </a>
                    </div>
                `;
                slider += `
                    <div class="swiper-slide">
                        <img src="${images}" />
                    </div>
                `;
            };
        } else { // 十位數
            if (data[`Picture${i}`] !== null && data[`Picture${i}`] !== undefined && data[`Picture${i}`] !== "") {
                images = `${IMGURL}/PictureList/${data[`Picture${i}`]}`;
                html += `
                    <div class="albumn_item" data-bs-toggle="modal" data-bs-target="#pictures">
                        <a>
                            <div class="a_img">
                                <img src="${images}" alt="">
                            </div>
                        </a>
                    </div>
                `;
                slider += `
                    <div class="swiper-slide">
                        <img src="${images}" />
                    </div>
                `;
            };
        };
    };
    lists.html(html), sliders.html(slider);
    // OPEN LIGHTBOX
    $('.albumn_item').on('click', function () {
        let num = $(this).index();
        // swipers
        var controller = new Swiper(".mySwiper2", {
            spaceBetween: 10,
            slidesPerView: 7,
            freeMode: true,
            watchSlidesProgress: true,
            initialSlide: num,
        });
        var shows = new Swiper(".mySwiper1", {
            spaceBetween: 10,
            initialSlide: num,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            thumbs: {
                swiper: controller,
            },
        });
    });
};
// NOTFOUND
function fails() { };
$().ready(function () {
    //
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `PictureList`,
        "QUERYs": "",
        "Counts": "",
        "Sends": "",
    };
    getPageDatas(dataObj).then(res => {
        // DOSOMETHING
        if (res !== null) {
            process(res);
        } else {
            fails();
        };
    }, rej => {
        if (rej == "NOTFOUND") {
            fails();
        };
    });
});