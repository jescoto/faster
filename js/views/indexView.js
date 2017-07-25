'use strict';

var indexView = {
    filteredBlogData: new kendo.data.DataSource(),
    _onInit: false,
    _callbackFired: false,
    init: function(){

        if(!indexView._onInit){
            //indexView.filteredBlogData = blogModel.blogDS.data().slice(0,3);
            indexView._onInit = true;

            if (APP.socialFeed) {
                $('.index-social').socialfeed({
                    // FACEBOOK
                    facebook: {
                        accounts: ['@BetterFoodFoundation','@lighterculture', '@purplecarrotxo', '@califiafarms','@ripplefoods'],
                        limit: 1,
                        access_token: '1769550126625987|ASkS_59vC41kbXLLlTIufigeX3M'
                    },
                    // Twitter
                   twitter: {
                        accounts: ['@BetterFoodFdn'/*, '@lighterculture', '@purplecarrotxo', '@CalifiaFarms', '@RippleFoods'*/],
                        limit: 1,
                        consumer_key: 'uLWcGWmebBDET8C1s5wM90NIp', // make sure to have your app read-only
                        consumer_secret: 'P95UdolvtVnhMG3rfleAm1enrjQU0ZQHb6Hjd8eE580p3ic0j4' // make sure to have your app read-only
                    },
                    /*instagram:{
                        accounts: ['@betterfoodfoundation'],  //Array: Specify a list of accounts from which to pull posts
                        limit: 1,                                    //Integer: max number of posts to load
                        client_id: 'ccfed662819c4240ad4584184956c74c',       //String: Instagram client id (optional if using access token)
                        access_token: '5445102613.ccfed66.fa4193d6540e4f5ea759069df2c319cf' //String: Instagram access token
                    },*/
                    // GENERAL SETTINGS
                    //template: "../../../templates/index-social-tmpl.html",
                    show_media: true,
                    length: 300,
                    update_period: 0,
                    // When all the posts are collected and displayed - this function is evoked
                    callback: function() {
                        indexView.socialLayout();
                        indexView._callbackFired = true;
                    }
                });
            }

            /*$("#index-owl").owlCarousel({
                items: 1,
                //singleItem:true,
                center: true,
                nav: true,
                autoWidth: true,
                dots: true,
                lazyLoad: true,
                navContainer: "",
                dotsContainer: "index-owl-nav",
                responsive:{
                    0:{
                        items:1,
                        nav:false
                    },
                    600:{
                        items:1,
                        nav:false
                    },
                    1000:{
                        items:1,
                        nav: false
                    }
                }
            });

            $(".owl-nav").addClass("hidden");*/


            donationModal.init();
            indexView.initDonorBlock();
            indexView.initSignInBlock();
            indexView.initPeopleBlock();


        }

    },

    socialLayout: function(){
        var $grid = $(".index-social").packery({
            itemSelector: ".index-social-card",
            //percentPosition: true,
            gutter: 16

        });

        $grid.one('layoutComplete', function() {
            $(".index-social").velocity("fadeIn").css("visibility", "visible");
            $(".gh-loader").addClass("hidden");
        });

        $grid.imagesLoaded().progress(function() {
            $grid.packery();
        });


    },

    goToHomeAnchor: function(anchor){
        APP.router.navigate('/?anchor=' + anchor);
        var mobileMenu = $("#mainMenu").hasClass("in");
        if(mobileMenu){
            $("#mainMenu").collapse('toggle');
        }

        indexView.scrollTo(anchor);
    },

    scrollTo: function(anchor){
        window.location.href.substr(0, window.location.href.indexOf('?'));
        if (anchor !== undefined && anchor !== null) {
            var anchorTag =  document.getElementById(anchor);
            if (anchorTag !== null && anchorTag.scrollIntoView !== undefined) {
                anchorTag.scrollIntoView({ behavior: 'smooth' });
            }
        }
    },

    onShow: function(){

      /*  indexView.setMeta( 'meta[property="og:title"]', "Better Food Foundation");
        indexView.setMeta( 'meta[property="og:url"]', "https://www.betterfoodfoundation.org");
        indexView.setMeta( 'meta[property="og:image"]', "https://betterfoodfoundation.org/images/socialprofile.png");
        indexView.setMeta( 'meta[property="og:description"]', "Promoting dietary changes that reduce the suffering of farmed animals by advocating for healthy, values-based food choices.");
*/
        if(indexView._callbackFired){
            var isShowing = $(".gh-loader").hasClass("hidden");

            if(!isShowing){
                $(".index-social").velocity("fadeIn").css("visibility", "visible").packery({
                    gutter: 16
                });
                $(".gh-loader").addClass("hidden");
            }
        }
    },

    setMeta: function (tag, content) {
        $(tag).attr('content', content);
    },


    updateRecentBlogs: function(){
        // todo - just for display, better selection needed
        var blogData = blogModel.blogsByDate.slice(0,3);
        indexView.filteredBlogData.data(blogData);

        var listView = $("#blog-listView").data("kendoListView");
        listView.refresh();
    },

    initSignInBlock : function () {
        var signin =  $('#indexSignInBlock').data('kendoSignInBlock');

        if (typeof signin !== "undefined") {
            signin.refresh();
        } else {
            $('#indexSignInBlock').kendoSignInBlock({
                buttonTitle: "Join Us!",
                description: "Sign up to receive updates from the Better Food Foundation",
                hideOnActive: true,
                buttonText: "Join"
            });
        }
    },

    initDonorBlock : function () {
        var donor =  $('#indexDonateBlock').data('kendoDonateBlock');

        if (typeof donor !== "undefined") {
            donor.refresh();
        } else {
            $('#indexDonateBlock').kendoDonateBlock({
                widgetSlug:  'bff-donation'/*,
                donationId : 'bff-annual',
                title: 'You can help right now',
                message: 'Support Better Food Foundation to encourage healthy, values-based food choices.'*/
            });
        }
    },

    initPeopleBlock : function () {
        var people =  $('#indexPeopleBlock').data('kendoPeopleBlock');

        if (typeof people !== "undefined") {
            people.refresh();
        } else {
            $('#indexPeopleBlock').kendoPeopleBlock({
                widgetSlug : 'bff-about-us'/*,
                title: 'About Us',
                description: "Key Staff",
                peopleList: ['john-millspaugh', 'claire-fitch','heather-b-armstrong']*/
            });
        }
    },

    facebookShare : function () {
        /* var url = 'https://www.facebook.com/dialog/feed?app_id=1875609289379201'+
         '&link='+ encodeURIComponent('https://www.betterfoodfoundation.org/#/mfm')+
         '&picture='+ 'https://www.betterfoodfoundation.org/images/mfmsocial.png' +
         '&name=' + encodeURIComponent('Milk Free Mornings') +
         '&caption=' + encodeURIComponent('Better Food Foundation') +
         '&description=' + encodeURIComponent("Our choices matter. Almost half of all cow’s milk consumed in the U.S. is consumed at the breakfast table. Every time we find a humane alternative to cow’s milk, we help reduce the suffering of cows on dairy farms. It’s simple: Drinking less milk means fewer animals suffer. Pledge now!") +
         /!*   '&redirect_uri='+ encodeURIComponent('https://www.betterfoodfoundation.org/#/mfm');*!/
         '&display=popup';*/

        var url = 'https://www.facebook.com/dialog/share?app_id=1875609289379201'+
            '&href='+ encodeURIComponent('https://www.betterfoodfoundation.org')+
            '&image='+ 'https://www.betterfoodfoundation.org/images/socialprofile.png' +
            '&quote=' + encodeURIComponent("Our choices matter! Visit Better Food Foundation to learn more...") +
            /*   '&redirect_uri='+ encodeURIComponent('https://www.betterfoodfoundation.org/#/mfm');*/
            '&display=popup';

        var x = screen.width/2 - 640/2;
        var y = screen.height/2 - 480/2;
        window.open(url,'feedDialog','toolbar=0,status=0,width=640,height=480,left='+x+",y="+y);
    }
};