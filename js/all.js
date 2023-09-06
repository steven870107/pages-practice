document.addEventListener('DOMContentLoaded', function () {
    // 獲取當前 HTML 文件的路徑
    // var currentPath = window.location.pathname;
    // var basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    
    // 點擊header以外的區域-toggleBtn關閉,dropdownMenu關閉
    function bindHeaderClickEvents(containerId) {
        document.addEventListener('click', function (event) { 
            var headerElement = document.querySelector(containerId + ' .header');
            var toggleBtnBars = document.querySelector(containerId + ' .navbar__toggleBtn__bars');
            var navbarMenu = document.querySelector(containerId + ' .navbar__menu');
            var languageIcon = document.querySelector(containerId + ' .navbar__menu__language i');
            var languageChoose = document.querySelector(containerId + ' .navbar__menu__language__choose');

            // 確保目標元素不是空值後再進行操作
            if (headerElement && toggleBtnBars && navbarMenu) {
                // 检查click事件是否在 header 之外
                if (!headerElement.contains(event.target)) {
                    // 關閉 toggleBtn 和 navbarMenu
                    toggleBtnBars.classList.remove('active');
                    navbarMenu.classList.remove('show');
                    languageIcon.classList.remove('active');
                    languageChoose.classList.remove('active');
                    if(window.scrollY > 40){
                        headerElement.classList.add('scrollTop');
                    }
                }
            }
        });
        // navbar__toggleBtn開關
        document.querySelector(containerId + ' .navbar__toggleBtn').addEventListener('click', function () { 
            var toggleBtnBars = document.querySelector(containerId + ' .navbar__toggleBtn__bars');
            var navbarMenu = document.querySelector(containerId + ' .navbar__menu');
            var languageIcon = document.querySelector(containerId + ' .navbar__menu__language i');
            var languageChoose = document.querySelector(containerId + ' .navbar__menu__language__choose');
            
            toggleBtnBars.classList.toggle('active');
            navbarMenu.classList.toggle('show');
            languageIcon.classList.remove('active');
            languageChoose.classList.remove('active');
            // 根据navbarMenu是否含有show类，添加或移除scrollTop类
            var headerElement = document.querySelector(containerId + ' .header');
            if (window.scrollY > 40){
                    if (navbarMenu.classList.contains('show')) {
                        headerElement.classList.remove('scrollTop');
                    } else {
                        headerElement.classList.add('scrollTop');
                    }
            }
        });

        // navbar__menu__language開關
        document.querySelector(containerId + ' .navbar__menu__language').addEventListener('click', function () {
            var toggleBtnBars = document.querySelector(containerId + ' .navbar__toggleBtn__bars');
            var navbarMenu = document.querySelector(containerId + ' .navbar__menu');
            var languageIcon = document.querySelector(containerId + ' .navbar__menu__language i');
            var languageChoose = document.querySelector(containerId + ' .navbar__menu__language__choose');

            languageIcon.classList.toggle('active');
            languageChoose.classList.toggle('active');
            toggleBtnBars.classList.remove('active');
            navbarMenu.classList.remove('show');
            // 如果languageChoose含有active类，则移除scrollTop类
            var headerElement = document.querySelector('.header');
            if (window.scrollY > 40){
                    if (languageChoose.classList.contains('active')) {
                        headerElement.classList.remove('scrollTop');
                    } else {
                        headerElement.classList.add('scrollTop');
                    }
            }
        });
        
        // 視窗寬度變換 避免移動裝置一滑就變動
        var cachedWidth = $(window).width();
        window.addEventListener('resize', function () { 
            var newWidth = $(window).width();
            if(newWidth !== cachedWidth){
                //DO RESIZE HERE
                var navbarMenu = document.querySelector(containerId + ' .navbar__menu');
                var toggleBars = document.querySelector(containerId + ' .navbar__toggleBtn__bars');
                navbarMenu.classList.remove('show', newWidth < 992);
                toggleBars.classList.remove('active', newWidth < 992);

                var list = document.querySelectorAll('.list');
                var listBtnToggle = document.querySelectorAll('.list__btn__toggle');
                list.forEach(function(element) {
                    element.style.display = newWidth < 992 ? 'none' : 'block';
                });
                listBtnToggle.forEach(function(element){
                    element.classList.remove('active', newWidth < 992);
                });

                cachedWidth = newWidth;
            }
        });
        // 視窗滾動
        window.addEventListener('scroll', function () { 
            var scrollTop = window.scrollY;
            var isScrolled = scrollTop > 40;
            var navbarElements = document.querySelectorAll('.navbar__menu__link, .navbar__menu__language, .navbar__menu__language__choose, .header, .navbar__menu');
            navbarElements.forEach(function(element) {
                element.classList.toggle('scrollTop', isScrolled);
            });
            
            var navbarMenu = document.querySelector(containerId + ' .navbar__menu');
            var headerElement = document.querySelector(containerId + ' .header');
            var languageChoose = document.querySelector(containerId + ' .navbar__menu__language__choose');
            if(window.scrollY > 40){
                if (navbarMenu.classList.contains('show') || languageChoose.classList.contains('active')) {
                    headerElement.classList.remove('scrollTop');
                } else {
                    headerElement.classList.add('scrollTop');
                }
            }
        });
    }
    // 根據頁面中的不同的id来載入對應的header和footer
    var pageConfig = {
        'load-header-c': {
            headerPath: '/load-header-c.html'
        },
        'load-footer-c': {
            footerPath: '/load-footer-c.html'
        },
        'load-header': {
            headerPath: '/load-header.html'
        },
        'load-footer': {
            footerPath: '/load-footer.html'
        },
    };

    // 動態載入頁首和頁尾的內容
    function loadHeaderAndFooter(elementId) {
        var config = pageConfig[elementId];
        if (config) {
            var headerPath = config.headerPath;
            var footerPath = config.footerPath;
            
            if (headerPath) {
                fetch(headerPath)
                    .then(response => response.text())
                    .then(data => {
                        var headerElement = document.getElementById(elementId);
                        if (headerElement) {
                            headerElement.innerHTML = data;
                            bindHeaderClickEvents('#' + elementId);
                        }
                    })
                    .catch(error => {
                        console.error('無法加載頁首內容:', error);
                    });
            }
            
            if (footerPath) {
                fetch(footerPath)
                    .then(response => response.text())
                    .then(data => {
                        var footerElement = document.getElementById(elementId.replace('header', 'footer'));
                        if (footerElement) {
                            footerElement.innerHTML = data;
                        }
                    })
                    .catch(error => {
                        console.error('無法加載頁尾內容:', error);
                    });
            }
        }
    }

    // 使用動態載入函數，根据頁面的id進行運作
    loadHeaderAndFooter('load-header-c');
    loadHeaderAndFooter('load-footer-c');
    loadHeaderAndFooter('load-header');
    loadHeaderAndFooter('load-footer');

    // catalog-menu
    var cachedWidth = $(window).width();
    window.addEventListener('resize', function () { 
        var newWidth = $(window).width();
        if(newWidth !== cachedWidth){
            //DO RESIZE HERE
            var catalogMenu = document.querySelectorAll('.catalog__menu');
                // $('.catalog__menu').css("display", "block");
                catalogMenu.forEach(function(element){
                    element.style.display= newWidth >= 992 ? "block" : "none";
                    // $('.catalog__menu').css("display", "none");
                    // catalogMenu.style.display="none";
                });
            cachedWidth = newWidth;
        }
    });

    $('.catalog__menu__toggle').click(function (e) { 
        e.preventDefault();
        $('.catalog__menu__toggle').toggleClass('active');
        $('.catalog__menu__toggle i').toggleClass('active');
        $('.catalog__menu').slideToggle();
    });
    $('.catalog__menu__link').click(function (e) { 
        e.preventDefault();
        $(this).parent().siblings().find("ul").slideUp();
        $(this).siblings().slideToggle(300);
        $(this).parent().siblings().find("a").removeClass('active');
        $(this).toggleClass('active');
    });
    $('.catalog__menu__open a').click(function () { 
        $('.catalog__menu__open a').removeClass('active');
        $(this).addClass('active');
    });

    // product-features/specifications list button
    $('.list__btn').click(function () { 
        if($(window).width() < 992){
            $(this).find('.list__btn__toggle').toggleClass('active');
            $(this).parent().siblings().slideToggle(500);
        }
    });

    // gotop-button
    $(document).on('click' , '#gotop' , function(e){
        e.preventDefault();
        $('html,body').animate({
            scrollTop: 0
        },1000)
    })
    $(window).scroll(function () { 
        let win_h = $(window).scrollTop();
        if (win_h > 200){
            $('#gotop').addClass('show');
        }else{
            $('#gotop').removeClass('show');
        }
    })
});