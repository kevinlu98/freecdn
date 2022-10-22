$(function () {
    $(".nav-list>ul>li>a").on('click', function () {
        $(".nav-list>ul>li>a").removeClass('nav-active')
        $(this).addClass('nav-active')
        let navRight = $(".nav-list .nav-right")
        navRight.removeClass('fa-angle-down').addClass('fa-angle-right')
        $(this).next('.nav-right').removeClass('fa-angle-right').addClass('fa-angle-down')
        let target = $(this).data('target')
        let targetEle = $(`#${target}`)
        if (targetEle.css('display') === 'none') {
            $(".nav-list .child-nav-list").css('display', 'none')
            targetEle.fadeIn()
        } else {
            $(".nav-list .child-nav-list").fadeOut()
            navRight.removeClass('fa-angle-down').addClass('fa-angle-right')
            $(this).removeClass('nav-active')
            $('.nav-list .child-nav-list .child-active').removeClass('child-active')
        }

    })

    showZoomImg('#write img', 'img');
    showZoomImg('.lw-shuo-img', 'img');

    $(".nav-list .child-nav-list li>a").on('click', function () {
        $(".nav-list .child-nav-list li>a").removeClass('child-active')
        $(this).addClass('child-active')
        $(".nav-list .child-nav-list .nav-right").removeClass('fa-angle-down').addClass('fa-angle-right')
        $(this).next('.nav-right').removeClass('fa-angle-right').addClass('fa-angle-down')
        let target = $(this).data('target')
        let targetEle = $(`#${target}`)
        let other = $(this).parent().parent().children('li').children('.child-nav-list');
        if (targetEle.css('display') === 'none') {
            other.css('display', 'none')
            targetEle.fadeIn()
        } else {
            other.fadeOut()
            $(this).next(".nav-right").removeClass('fa-angle-down').addClass('fa-angle-right')
            $(this).removeClass('child-active')

        }
    })

    $("#show-left-bar").on('click', function () {
        let aside = $("#app-aside")
        if (aside.css("left") === '0px') {
            aside.stop().animate({'left': '-100%'})
            $("#app-content").stop().fadeIn()
        } else {
            aside.stop().animate({'left': 0})
            $("#app-content").stop().fadeOut()
        }

    })

    /**
     * 统计
     */
    $("#app-statistic").on('click', function () {
        $("#whisper-pain").stop().css({'display': 'none'})
        $("#login-pain").stop().css({'display': 'none'})
        let statistic = $("#statistic-pain");
        statistic.stop().fadeToggle()
        window.freewind.refreshChart()
    })

    /**
     * 站点说明
     */
    $("#whisper-btn").on('click', function () {
        $("#statistic-pain").stop().css({'display': 'none'})
        $("#login-pain").stop().css({'display': 'none'})
        $("#whisper-pain").fadeToggle()
    })
    /**
     * 登录框
     */
    $("#login-bar-btn").on('click', function () {
        $("#whisper-pain").stop().css({'display': 'none'})
        $("#statistic-pain").stop().css({'display': 'none'})
        $("#login-pain").fadeToggle()
    })

    //搜索框
    $("#show-search-sm,#show-search-btn").on('click', function () {
        $("#bg-cover").stop().fadeIn();
    })
    $("#bg-cover .cover-close").on('click', function () {
        $("#bg-cover").stop().fadeOut();
    })
    $("#bg-cover .keywords-list a").on('click', function () {
        let search = $("#search-form");
        let input = $("#search-form input[name=s]");
        input.val($(this).data('key'))
        search.submit()
    })


    $(window).resize(function () {
        window.freewind.topInit();
        window.freewind.refreshChart();
    })

    $("#code-img").on('click', function () {
        $(this).attr('src', '/verify/code?time=' + new Date().getTime())
    })

    // 右侧工具栏
    let rightItem = $("#right-tool-bar .right-tool-item");

    function hidenRight(animate) {
        for (let i = 0; i < rightItem.length; i++) {
            console.log(rightItem[i])
            let item = $(rightItem[i]);
            if (animate)
                item.animate({marginLeft: 0}, 50)
            else
                item.css('margin-left', 0)
        }
    }

    $("#right-tool-bar").show()
    $("#right-tool-bar .right-tool-item .right-btn").on('click', function () {
        let target = $(this).data('target')
        let targetItem = $(`#${target}`);
        let width = targetItem.width()
        if (targetItem.css('marginLeft') === '0px') {
            hidenRight(true)
            targetItem.animate({marginLeft: `-${width}px`})
        } else {
            targetItem.animate({marginLeft: 0})
        }

    })
    $("#color-btn").on('click', function () {
        $("#color-setting").fadeToggle()
    })
    $("#right-color .set-color-btn").on('click', function () {
        $.ajax({
            url: `${window.freewind.siteUrl}local/color?name=${$(this).data('color')}`,
            dataType: 'json',
            success: res => {
                if (res['success']) {
                    cocoMessage.success(res.msg, 2000, function () {
                        location.reload();
                    });
                } else {
                    cocoMessage.error(res.msg, 2000);
                }
            }
        })
    })

    $(window).scroll(function () {
        if (window.freewind.page) {
            window.freewind.calcToc()
        }
        //滚动高度
        let scTop = $(window).scrollTop()
        //屏幕高度
        let height = $(window).height()
        if (scTop >= height * 0.5) {
            //利用jquery动画组件显示
            $("#top-btn").stop().animate({'opacity': '1'}, 500)
        } else {
            $("#top-btn").stop().animate({'opacity': '0'}, 500)
        }
    })
    $("#top-btn").on('click', function () {
        $('body,html').stop().animate({
            scrollTop: 0
        })
    })
})