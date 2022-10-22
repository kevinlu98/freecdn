//表单序列化
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function Freewind(page = false) {
    let that = this;
    this.page = page
    // 站点url
    this.siteUrl = $("#site-url").data('url');
    this.themaUrl = $("#theme-url").data('theme');
    this.freewindCdn = $("#cdn-url").data('cdn');
    this.tocPos = {}
    this.comment = {}
    this.editor;

    let categoryCtx = document.getElementById("category")
    let categoryChart = echarts.init(categoryCtx);
    let categoryOption = {
        title: {
            text: '分类雷达图', textStyle: {
                fontSize: 14, fontWeight: 'light'
            }
        }, radar: {
            center: ['50%', '50%'], radius: 50, name: {
                textStyle: {
                    color: '#111', borderRadius: 3, padding: [3, 5]
                },
            }, indicator: [{name: 'emlog教程', max: 8}, {name: '网站相关', max: 8}, {
                name: 'Linux学习', max: 8
            }, {name: 'Mac小技能', max: 8}, {name: '后端技术学习', max: 8}, {name: '前端小知识', max: 8}, {
                name: '其它', max: 8
            }],
        }, series: [{
            type: 'radar', color: '#3ECF8E', data: [{
                value: [8, 5, 2, 3, 2, 3, 1], areaStyle: {
                    opacity: 0.3, color: '#3ECF8E'
                }, fontStyle: {
                    fontSize: '12px',
                }
            }]
        }]
    };
    let labelsCtx = document.getElementById("labels")
    let labelsChart = echarts.init(labelsCtx);
    let labelsOption = {
        title: {
            text: '标签统计', textStyle: {
                fontSize: 14, fontWeight: 'light'
            }
        }, grid: [{
            left: '10%', bottom: '30%', top: '15%', right: '10%'
        }],

        xAxis: {
            type: 'category', data: [], axisLabel: {
                color: '#333', //  让x轴文字方向为竖向
                interval: 0, formatter: function (params) {
                    let newParamsName = '' // 最终拼接成的字符串
                    let paramsNameNumber = params.length // 实际标签的个数
                    let provideNumber = 2 // 每行能显示的字的个数
                    let rowNumber = Math.ceil(paramsNameNumber / provideNumber) // 换行的话，需要显示几行，向上取整
                    //     /**
                    //  * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                    //  */
                    // 条件等同于rowNumber>1
                    if (paramsNameNumber > provideNumber) {
                        /** 循环每一行,p表示行 */
                        for (let p = 0; p < rowNumber; p++) {
                            let tempStr = '' // 表示每一次截取的字符串
                            let start = p * provideNumber // 开始截取的位置
                            let end = start + provideNumber // 结束截取的位置
                            // 此处特殊处理最后一行的索引值
                            if (p === rowNumber - 1) {
                                // 最后一次不换行
                                tempStr = params.substring(start, paramsNameNumber)
                            } else {
                                // 每一次拼接字符串并换行
                                tempStr = params.substring(start, end) + '\n'
                            }
                            newParamsName += tempStr // 最终拼成的字符串
                        }
                    } else {
                        // 将旧标签的值赋给新标签
                        newParamsName = params
                    }
                    // 将最终的字符串返回
                    return newParamsName
                }// x轴文字换行

            }
        }, yAxis: {
            type: 'value'
        }, series: [{
            data: [], type: 'bar'
        }]
    };
    let timeCtx = document.getElementById("time-statistic")
    let timeChart = echarts.init(timeCtx);
    let timeOption = {
        title: {
            text: '发布动态图', textStyle: {
                fontSize: 14, fontWeight: 'light'
            }
        }, xAxis: {
            type: 'category', data: []
        }, yAxis: {
            type: 'value'
        }, series: [{
            data: [], type: 'line'
        }]
    }
    this.headHight = $("#app-header").height() + 20;

    this.refreshChart = function () {
        $.ajax({
            url: `${that.siteUrl}report`, dataType: 'json', async: false, success: res => {
                let article = res.data['article']
                let category = res.data['category']
                let tag = res.data['tag']
                let timeX = [];
                let timeY = [];
                for (let i = 0; i < article.length; i++) {
                    timeX.push(article[i]['time'])
                    timeY.push(article[i]['count'])
                }
                timeOption.xAxis.data = timeX;
                timeOption.series = [{
                    data: timeY, type: 'line'
                }]
                let categoryS = [];
                let categoryI = [];
                for (let i = 0; i < category.length; i++) {
                    categoryI.push({
                        name: category[i]['name'], max: category[0]['count']
                    })
                    categoryS.push(category[i]['count'])
                }
                categoryOption.radar.indicator = categoryI
                categoryOption.series[0].data[0].value = categoryS
                let tagX = []
                let tagY = []
                let tagColor = ['#FC625D', '#3ECF8E', '#73D8FF', '#AEA1FF', '#FE9200', '#FE9200', '#6FA8DC']
                for (let i = 0; i < tag.length; i++) {
                    tagX.push(tag[i]['name'])
                    tagY.push({
                        value: tag[i]['count'], itemStyle: {
                            color: tagColor[i]
                        }
                    })
                }
                labelsOption.xAxis.data = tagX
                labelsOption.series = [{
                    data: tagY, type: 'bar'
                }]
            }
        })
        timeChart.clear();
        timeChart.resize()
        timeChart.setOption(timeOption)
        labelsChart.clear();
        labelsChart.resize();
        labelsChart.setOption(labelsOption)
        categoryChart.clear();
        categoryChart.resize();
        categoryChart.setOption(categoryOption);
    }

    function dealshuo() {
        let imgs = $('.shuo-content img');
        let shuoImg = []
        for (let i = 0; i < imgs.length; i++) {
            let img = $(imgs[i]);
            if (!img.attr('title')) {
                img.parent().children('br').remove()
            }
        }
    }

    function topbarPos() {
        let rightBar = $("#app-main")
        let bodyWidth = $("body").width();
        let loginRight = bodyWidth - rightBar.offset().left - rightBar.outerWidth();
        $("#login-pain").css({"right": loginRight, "top": that.headHight})
        let whisperRight = $("#login-bar-btn").outerWidth() + loginRight;
        console.log(loginRight, whisperRight);
        $("#whisper-pain").css("right", whisperRight)
    }

    function shuoImg() {
        let contents = $('.blog-item .shuo-content,#shuo-content');
        for (let i = 0; i < contents.length; i++) {
            let content = $(contents[i])
            let img = content.find(".lw-shuo-img");
            let width = img.parent().width()
            if (img.length === 1) {
                let height = width * 0.7
                img.css({'width': '70%', 'height': height + 'px'})
            } else if (img.length === 2 || img.length === 4) {
                let height = width * 0.48
                img.css({'width': '48%', 'height': height + 'px'})
            } else {
                let height = width * 0.31
                img.css({'height': height + 'px'})
            }
        }
    }

    function initEdit() {
        let emotions = [];
        let expression = [];
        $.ajax({
            url: that.freewindCdn + 'json/emotions.json', async: false, success: res => {
                for (let i = 0; i < res.length; i++) {
                    emotions.push({src: that.freewindCdn + res[i]['src'], alt: res[i]['alt']})
                }
            }
        })
        $.ajax({
            url: that.freewindCdn + 'json/expression.json', async: false, success: res => {
                for (let i = 0; i < res.length; i++) {
                    expression.push({src: that.freewindCdn + res[i]['src'], alt: res[i]['alt']})
                }
            }
        })
        const E = window.wangEditor
        const editor = new E("#common-edit")
        editor.config.height = 150
        editor.config.placeholder = '你的评论一针见血'
        editor.config.menus = ['bold', 'italic', 'underline', 'strikeThrough', 'foreColor', 'link', 'emoticon', 'undo', 'redo',]
        editor.config.emotions = [{
            title: 'QQ表情', type: 'image', content: emotions
        }, {
            title: '其它表情', type: 'image', content: expression
        }]

        editor.config.onchange = function (html) {
            that.comment.comText.val(html)
        }
        editor.config.onchangeTimeout = 500
        editor.config.showFullScreen = false
        editor.config.zIndex = 1010
        editor.create()
        that.comment.comText.val(editor.txt.html())
        return editor;
    }

    this.calcToc = function () {
        if (that.tocPos.topEle.length !== 0) {
            let bodyWidth = $("body").width();
            let scrollHieght = $(document).scrollTop();
            let windownHeight = $(window).height();
            let h = windownHeight - (that.tocPos.offsetTop - scrollHieght);
            let tagEle = $(".tag-cloud");
            let tagBottom = tagEle.offset().top + tagEle.height();
            let rightBar = $("#app-content #app-main");
            let loginRight = bodyWidth - rightBar.offset().left - rightBar.outerWidth();
            if (h > that.tocPos.showPos && scrollHieght > tagBottom) {
                that.tocPos.topEle.css({position: 'fixed', top: that.tocPos.headHight, right: loginRight})
            } else {
                that.tocPos.topEle.css({position: 'relative', top: 0, right: 0})
            }
        }
    }

    this.topInit = function () {
        let navList = $("#app-aside .nav-list");
        let navTop = navList.offset().top
        let footTop = $("#app-aside .user-footer").offset().top
        let height = footTop - navTop;
        height -= 20
        if (height > 0) {
            navList.css({"height": height + "px"})
        }
        dealshuo()
        topbarPos()
        let rightSelector = $(".right-bar .right-tab>ul span");
        let activeItem = $(".right-bar .right-tab>ul .active");
        shuoImg()
        rightSelector.css({'width': activeItem.width(), 'left': activeItem.position().left, 'display': 'block'});
        if (that.page) {
            that.tocPos['topEle'] = $("#blog-tree").parent()
            that.tocPos['offsetTop'] = that.tocPos['topEle'].offset().top;
            that.tocPos['headHight'] = $("#app-header").height() + 20;
            that.tocPos['showPos'] = that.tocPos['offsetTop'] + 90;
            that.calcToc()
        }
        $("img.lazy").lazyload({effect: "fadeIn"});
    }

    function randomStr(number = 4) {
        let str = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
        let len = str.length
        let result = ""
        for (let i = 0; i < number; i++) {
            let index = parseInt(Math.random() * len);
            result += str[index]
        }
        return result
    }

    function commentSubmit() {
        if (!that.comment.comText.val()) {
            cocoMessage.error("请输入评论内容", 2000);
            return false;
        }
        if (!that.comment.comName.val()) {
            cocoMessage.error("请输入用户昵称，可通过填写QQ号快速获取信息", 2000);
            return false;
        }
        if (!that.comment.comMail.val()) {
            cocoMessage.error("请输入邮箱，可通过填写QQ号快速获取信息", 2000);
            return false;
        } else {
            let mailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
            if (!mailReg.test(that.comment.comMail.val())) {
                cocoMessage.error("邮箱格式不正确，可通过填写QQ号快速获取信息", 2000);
                return false;
            }
        }

        let url = $(this).attr('action');
        let method = $(this).attr('method');
        let data = $(this).serializeJson();
        let pname = $("#comPname");
        if (pname.val()) data['text'] = `<p><span class="parent-name">@${pname.val()}</span></p>` + data['text'];
        let closeLoad = cocoMessage.loading(true);
        $.ajax({
            url: url, type: method, data: data, dataType: 'json', success: res => {
                closeLoad()
                if (res.success) {
                    cocoMessage.success(res.msg, 1000, function () {
                        location.reload();
                    });
                } else {
                    cocoMessage.error(res.msg, 1000);
                }
            }, error: res => {
                closeLoad()
            }
        })
        return false;
    }

    function copyText(text) {
        const input = document.createElement('input');

        input.setAttribute('id', 'input_for_copyText');
        input.value = text;

        document.getElementsByTagName('body')[0].appendChild(input);
        document.getElementById('input_for_copyText').select();
        document.execCommand('copy');
        document.getElementById('input_for_copyText').remove();
    }


    function getQQInfo() {
        let qq = $(this).val();
        if (qq) {
            let closeLoad = cocoMessage.loading(true);
            $.ajax({
                url: "https://api.usuuu.com/qq/" + qq, dataType: "json", success: res => {
                    closeLoad()
                    if (res.code === 200) {
                        let mail = qq + "@qq.com";
                        that.comment.comMail.val(mail)
                        let name = res.data.name;
                        that.comment.comName.val(name)
                        let url = `https://user.qzone.qq.com/${qq}/main`
                        that.comment.comUrl.val(url)
                    } else {
                        cocoMessage.error(res.msg, 2000)
                    }
                }, error: res => {
                    closeLoad()
                }
            })
        }
    }

    function createId(parent = "") {
        for (let i = 1; i < 7; i++) {
            let selector = `${parent} h${i}`;
            let elems = $(selector)
            for (let j = 0; j < elems.length; j++) {
                let id = randomStr(16);
                let elem = $(elems[j]);
                elem.attr('id', `h${i + id}`)
                elem.attr('data-level', i)
            }
        }
    }

    this.registerHandler = function () {
        $('.nav-list .fw-nav-item a').on('click', function () {
            $('.nav-list .fw-nav-item a').removeClass('nav-active')
            $(this).addClass('nav-active')
            console.log($(this).attr('class'));
            return true;
        })
        $("img.lazy").lazyload({
            placeholder: "http://cos.kevinlu98.cn/static/image/upload.png", effect: "fadeIn", // 载入使用何种效果
            threshold: 200, // 提前开始加载
        });
        new Swiper("#swiper-slider", {
            loop: true, autoplay: {
                delay: 3000,//1秒切换一次
            }, pagination: {
                el: '.swiper-pagination',
            }, navigation: {
                nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev',
            },
        });
        $(".blog-item .photo-list img:nth-child(2n)").after('<br>')
        /**
         * 登录
         */
        $('#login-form').on('submit', function () {
            let url = $(this).attr('action');
            let data = $(this).serializeObject();
            let closeLoad = cocoMessage.loading(true);
            $.ajax({
                url: url, type: "POST", data: data, dataType: 'json', success: res => {
                    closeLoad()
                    if (res.success) {
                        cocoMessage.success(res.msg, 2000, function () {
                            location.reload();
                        });
                    } else {
                        cocoMessage.error(res.msg, 1000);
                    }
                }, error: res => {
                    closeLoad()
                    cocoMessage.error('发生未知错误', 2000);
                }
            })
            return false;
        })
        $("#to-register").on('click', function () {
            $('#login-div').stop().fadeOut()
            $('#register-div').stop().fadeIn()
        })
        /**
         * 注册
         */
        $("#register-form").on('submit', function () {
            let url = $(this).attr('action');
            let data = $(this).serializeObject();
            let closeLoad = cocoMessage.loading(true);
            $.ajax({
                url: url, type: "POST", data: data, dataType: 'json', success: res => {
                    closeLoad()
                    if (res.success) {
                        cocoMessage.success(res.msg, 2000, function () {
                            location.reload()
                        });
                    } else {
                        cocoMessage.error(res.msg, 2000);
                        $("#code-img").attr('src', '/verify/code?time=' + new Date().getTime())
                    }
                }, error: res => {
                    closeLoad()
                    cocoMessage.error('发生未知错误', 2000);
                }
            })
            return false;
        })

        /**
         * 评论热门
         */
        $(".right-bar .right-tab>ul li").on('click', function () {
            $(this).addClass('active').siblings().removeClass('active')
            let rightSelector = $(".right-bar .right-tab>ul span");
            let activeItem = $(".right-bar .right-tab>ul .active");
            rightSelector.css({'width': activeItem.width()}).stop().animate({'left': activeItem.position().left});
            let selectBody = $(this).data('select');
            $(".right-bar .right-tab .select-item.current").removeClass("current")
            $(`#${selectBody}`).addClass("current")
        })

        /**
         * 返回登录
         */
        $('#return-login').on('click', function () {
            $('#login-div').stop().fadeIn()
            $('#register-div').stop().fadeOut()
        })
        /**
         * 点赞
         */
        $('.post-suport').on('click', function () {
            let cid = $(this).data('cid');
            $.ajax({
                url: `${that.siteUrl}support`, type: 'POST', data: {
                    cid: cid
                }, dataType: 'json', success: res => {
                    if (res.success) {
                        $(this).parent().removeClass('fa-thumbs-o-up').addClass('fa-thumbs-up')
                        $(this).text('(' + res.data + ')' + '已赞')
                    } else {
                        cocoMessage.error(res.msg, 1000);
                    }
                }
            })
        })
    }

    this.registerPage = function () {
        that.comment['comText'] = $('#comment-text')
        that.comment['comName'] = $('#com-name')
        that.comment['comMail'] = $('#com-mail')
        that.comment['comUrl'] = $('#com-url')
        that.comment['comPid'] = $("#comPid");
        hljs.highlightAll();
        that.editor = initEdit()

        $(".file-down li .file-download").on('click', function () {
            let pwd = $(this).data('pwd')
            if (pwd) {
                copyText(pwd)
                let url = $(this).attr('href')
                cocoMessage.success(`已成功将云盘密码[${pwd}]复制到剪切板，正在前往下载...`, 2000, function () {
                    window.open(url)
                });
                return false;
            } else {
                return true;
            }
        })


        $("#write .fwh .fwthead").on('click', function () {
            $(this).parent().children('.fwthead').removeClass('fwcurrent')
            $(this).addClass('fwcurrent')
            $(this).parent().parent().find('.fwtbody').hide()
            $(this).parent().parent().find(`.fwtbody-${$(this).data('target')}`).stop().fadeIn()
        })

        $("#write .fwtab .fwh .fwthead:first-child").click()


        createId("#write")
        $("#write pre").before(`
                <div class="mac-bar pos-rlt">
                <i></i><i></i><i></i>
                <span class="copy-tips pos-abs">复制</span>
                <a href="javascript:void(0);" class="copy-btn pos-abs fa fa-file-text-o"></a>
                </div>`)
        $("#write .mac-bar .copy-btn").mouseenter(function () {
            $(this).parent().children('.copy-tips').stop().fadeIn()
        }).mouseleave(function () {
            $(this).parent().children('.copy-tips').stop().fadeOut().text('复制')
        })
        // console.log(window.clipboard);
        if (!window.clipboard) {
            window.clipboard = new Clipboard("#write .mac-bar .copy-btn", {
                text: function (trigger) {
                    let copytext = $(trigger).parent().next().text();
                    return copytext.trim();
                }
            });

            window.clipboard.on("success", function (e) {
                $(e.trigger).parent().children('.copy-tips').text('已复制!')
            });
        }

        $("#write a").attr("target", "_blank")
        $("#write .mac-bar a.copy-btn").attr("target", "")
        tocbot.init({
            tocSelector: '#blog-tree',
            contentSelector: '#write',
            headingSelector: 'h1, h2, h3, h4',
            hasInnerContainers: true,
        });
        $('#com-qq').blur(getQQInfo)
        $("#comment-form").submit(commentSubmit)
        $(".comments-list .comm-title .replay-btn").on('click', function () {
            $(".comments-list .comm-title .replay-btn").show()
            $(".comments-list .comm-title a.no-replay").remove()
            let btnEle = $(this)
            btnEle.hide()
            let comEle = $(".blog-content .comment-box")
            let commentbox = document.getElementById('comment-box');
            comEle.remove()
            let pid = $(this).data('parent');
            let pname = $(this).data('pname');

            $("#comPname").val(pname)
            that.comment.comPid.val(pid)
            $(this).after(`<a class="no-replay" href="javascript:void (0);">取消回复</a>`)
            this.parentNode.parentNode.appendChild(commentbox)
            $("#comment-form").submit(commentSubmit)
            $('#com-qq').blur(getQQInfo)
            $(".comments-list .comm-title .no-replay").on('click', function () {
                btnEle.show()
                comEle.remove()
                $(this).remove()
                $(".blog-content .comments-list").before(commentbox)
                that.comment.comPid.val(0)
                $("#comPname").val('')
                $("#comment-form").submit(commentSubmit)
                $('#com-qq').blur(getQQInfo)
            })
        })
    }

}