'use strict';

(function ($) {

    /* ---------------------- PRELOADER ---------------------- */
    $(window).on('load', function () {
        $('.loader').fadeOut();
        $('#preloder').delay(200).fadeOut('slow');
    });

    /* ---------------------- DOM READY ---------------------- */
    $(function () {

        /* ---------- BG IMAGES (data-bgset) ---------- */
        $('.bg-set-with-filter').each(function () {
            const bg = $(this).data('bgset');

            $(this).css(
                'background-image',
                'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(' + bg + ')'
            );
        });

        $('.bg-set').each(function () {
            const bg = $(this).data('bgset');

            $(this).css('background-image', 'url(' + bg + ')');
        });

        /* ---------- AIRPORT GALLERY (MASONRY) ---------- */
        if ($('.airport__gallery').length) {
            $('.airport__gallery').masonry({
                itemSelector: '.airport__item',
                columnWidth: '.grid-sizer',
                gutter: 10
            });
        }

        /* ---------- VACANCY SLIDER (OWL CAROUSEL) ---------- */
        if ($('.vacancy__slider').length) {
            const $vacancySlider = $('.vacancy__slider');

            $vacancySlider.owlCarousel({
                loop: true,
                dots: true,
                mouseDrag: false,
                animateOut: 'fadeOut',
                animateIn: 'fadeIn',
                items: 1,
                margin: 0,
                smartSpeed: 1200,
                autoHeight: false,
                autoplay: true
            });

            const $dots = $vacancySlider.find('.owl-dot');

            $dots.each(function (index) {
                const num = index + 1;
                $(this).html(num < 10 ? '0' + num : num);
            });
        }

        /* ---------- TIMELINE (advantages.html) ---------- */
        const timelineItems = document.querySelectorAll('.timeline li');

        if (timelineItems.length) {
            function isElementInViewport(el) {
                const rect = el.getBoundingClientRect();
                const viewHeight = window.innerHeight || document.documentElement.clientHeight;
                const viewWidth = window.innerWidth || document.documentElement.clientWidth;

                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= viewHeight &&
                    rect.right <= viewWidth
                );
            }

            function updateTimeline() {
                for (let i = 0; i < timelineItems.length; i++) {
                    const item = timelineItems[i];

                    if (isElementInViewport(item)) {
                        item.classList.add('in-view');
                    } else {
                        item.classList.remove('in-view');
                    }
                }
            }

            window.addEventListener('load', updateTimeline);
            window.addEventListener('scroll', updateTimeline);
        }

        /* ---------- SMOOTH SCROLL FOR ANCHORS ---------- */
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetSelector = this.getAttribute('href');
                const target = document.querySelector(targetSelector);

                if (!target) return;

                e.preventDefault();
                target.scrollIntoView({behavior: 'smooth'});
            });
        });

        /* ---------- WOW.JS ---------- */
        if (typeof WOW !== 'undefined') {
            new WOW({
                animateClass: 'animate__animated'
            }).init();
        }

        /* ---------- MODAL FORM (CALLBACK) ---------- */
        const $nameInputModal = $('#nameInputModal');
        const $phoneInputModal = $('#phoneInputModal');
        const $emailInputModal = $('#emailInputModal');
        const $modalOpenBtn = $('#modalOpenBtn');

        const $modalContent = $('#modal-content');
        const $responseSuccess = $('#response-success');
        const $responseError = $('#response-error');

        if ($phoneInputModal.length && typeof IMask !== 'undefined') {
            IMask($phoneInputModal[0], {mask: '+{7}(000)000-00-00'});
        }

        // очистка полей при открытии модалки
        $modalOpenBtn.on('click', function () {
            $nameInputModal.val('');
            $phoneInputModal.val('');
            $emailInputModal.val('');
            $nameInputModal.removeClass('is-invalid');
            $phoneInputModal.removeClass('is-invalid');
        });

        // только буквы в имени
        $nameInputModal.on('keydown', function (e) {
            const key = e.key;
            // рус/лат буквы, backspace, delete, пробел
            return /[А-ЯA-Zа-яa-zЁё]/i.test(key)
            key === 'Backspace'
            key === 'Delete' || key === ' ';
        });

        function validateModal() {
            let isError = false;

            if ($nameInputModal.val() && $nameInputModal.val().match(/^[А-ЯA-ZЁ][а-яa-zё]+$/i)) {
                $nameInputModal.removeClass('is-invalid');
            } else {
                isError = true;
                $nameInputModal.addClass('is-invalid');
            }

            if ($phoneInputModal.val() && $phoneInputModal.val().match(/^\+\d\(\d{3}\)\d{3}-\d{2}-\d{2}$/)) {
                $phoneInputModal.removeClass('is-invalid');
            } else {
                isError = true;
                $phoneInputModal.addClass('is-invalid');
            }

            return !isError;
        }

        // отправка формы из модалки
        $(document).on('click', '#modalPhone .primary-btn', function (e) {
            e.preventDefault();

            if (!validateModal()) return;

            const personData = {
                name: $nameInputModal.val(),
                phone: $phoneInputModal.val(),
                email: $emailInputModal.val() || 'email не указан'
            };

            $.ajax({
                type: 'POST',
                url: 'mail-callback.php',
                data: personData,
                success: function () {
                    $modalContent.hide();
                    $responseError.hide();
                    $responseSuccess.show();
                },
                error: function () {
                    $modalContent.hide();
                    $responseSuccess.hide();
                    $responseError.show();
                }
            });
        });

        /* ---------- FOOTER EMAIL FORM ---------- */
        const $emailInputFooter = $('#emailInputForFeedback');
        const $buttonForFeedback = $('#buttonForFeedback');
        const $modalEmail = $('#modalEmail');

        function isValidEmail(value) {
            return /^\w+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value.trim());
        }

        $buttonForFeedback.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (isValidEmail($emailInputFooter.val())) {
                $emailInputFooter.removeClass('is-invalid');
                $modalEmail.modal('show');
            } else {
                $emailInputFooter.addClass('is-invalid');
            }
        });

        $modalEmail.on('show.bs.modal', function () {
            const $respSuccess = $('#email-response-success');
            const $respError = $('#email-response-error');

            $.ajax({
                type: 'POST',
                url: 'mail-doc-get.php',
                data: {email: $emailInputFooter.val()},
                success: function () {
                    $respError.hide();
                    $emailInputFooter.val('');
                    $respSuccess.show();
                },
                error: function () {
                    $respSuccess.hide();
                    $emailInputFooter.val('');
                    $respError.show();
                }
            });
        })
        /* ---------- BURGER MENU ---------- */
        const $menu = $('.header__menu');
        const $burger = $('#burger-menu');
        const $menuItems = $('.header__menu-items');
        const $links = $('.header__link');

        $burger.on('click', function () {
            const isOpen = $burger.is(':checked');

            $menu.toggleClass('open', isOpen);
            $menuItems.toggleClass('open', isOpen);
            $(document.body).css('overflow', isOpen ? 'hidden' : 'unset');
        });

        $links.on('click', function () {
            $menu.removeClass('open');
            $menuItems.removeClass('open');
            if ($burger.is(':checked')) {
                $burger.prop('checked', false).trigger('change');
            }
            $(document.body).css('overflow', 'unset');
        });

        /* ---------- ADVANTAGES SWIPER ---------- */
        if ($('.advantages__swiper').length && typeof Swiper !== 'undefined') {
            const width = window.innerWidth;

            let slidesPerView = 3;
            let spaceBetween = 30;

            if (width < 1130 && width > 541) {
                slidesPerView = 2;
                spaceBetween = 20;
            } else if (width <= 540) {
                slidesPerView = 1;
                spaceBetween = 30;
            }

            new Swiper('.advantages__swiper', {
                slidesPerView,
                spaceBetween,
                freeMode: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                }
            });
        }

    }); // end of DOM ready
})(jQuery);