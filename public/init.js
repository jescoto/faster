jQuery(function($){
	"use strict";
	var app = window.app || {};
	
/* ==================================================
   Init Functions
================================================== */

$(document).ready(function(){
    String.prototype.capitalize = function(){
        return this.toLowerCase().replace( /\b\w/g, function (m) {
            return m.toUpperCase();
        });
    };

    ux.setFavicon('favicon.ico');

      OAuth.initialize('yhytMDXgKJyoCXQ8D6J2FxZw-Ng');  // Farm Forward
    //OAuth.initialize('hkaukWgit7mWBgnG0pVeHgV0MQA');  // Better Food Foundation

    if(APP.devMode !== undefined && APP.devMode){
        APP.serverUrl = "http://localhost:5555"; // Dev server
    } else {
        APP.serverUrl = "https://gaiaapi.herokuapp.com"; // Live server
    }
    
    APP.siteSlug = "bff";
    APP.siteName = "Better Food Foundation";
    APP.welcomeMessage = "Welcome to Better Food Foundation. Help us promote dietary changes that reduce or eliminate the suffering of farmed animals.";
    APP.siteUrl = "https://www.betterfoodfoundation.org";
    APP.privacyUrl = "https://www.betterfoodfoundation.org/#/privacy";
    APP.termsUrl = "https://www.betterfoodfoundation.org/#/privacy";
    APP.siteEmail= "info@www.betterfoodfoundation.org";
    APP.siteFB = "";
    APP.siteTwitter = "";
    //APP.stripeKey = 'pk_test_QYNngJ3DR8khE2fgoQYwUrBt';
    APP.stripeKey = 'pk_live_kwfHqrBxM2COunzSmi7n5z6i';

    APP.googleTrackingId = 'UA-99965919-1';
    APP.isEmailRequired = true;
    APP.isAddressRequired = true;


    APP.stripe = null;
    APP.stripeElements = null;


    APP.socialFeed = true;

    APP.profileFields = ['name', 'email', 'newsletters', 'impact'];


    APP.emailTemplates = {
       // welcome : "01265680-1ef5-11e7-8e4c-b15d89e317c8",
        verifyEmail : "8754f060-400e-11e7-891f-d18073c9719a"
    };


    APP.donationInfo = "Your donation will go to work instantly to promote healthy, values-based food choices";
    APP.donationInfoMore = "Better Food Foundation fosters conversations and actions that reduce or eliminate the consumption of animal products with the mission of promoting healthy, values-based food choices";

    APP.uploadWidget = null;


    /*APP.uploadWidget = cloudinary.createUploadWidget({ cloud_name: 'hyjvcxzjt', upload_preset: 'bpblog', client_allowed_formats : ["png","gif", "jpeg"] },
        function(error, result) {
            if (error !== null) {
                ux.notify("Upload widget error " + JSON.stringify(error));
            }

        }
    );*/

    APP.canNotify = false;

    /*if (Notification.permission === 'granted') {
        APP.canNotify = true;
        // var not = new Notification ("Welcome! ", {icon: 'favicon.ico', body: "Welcome to Buying Poultry.  Part of the Farm Forward family..."});

    } else  if (Notification.permission === 'default') {
        Notification.requestPermission()
            .then(function (result) {
                APP.canNotify = result === 'granted';
                // var not = new Notification ("Welcome! ", {icon: 'favicon.ico', body: "Welcome to Buying Poultry.  Part of the Farm Forward family..."});
            })
    }*/


    /* Layouts */
    APP.layout =  new kendo.Layout("layout");

    /* Views */
    APP.index = new kendo.View('index', {
        show: indexView.onShow
    });



    APP.routeError = new kendo.View("routeError");

    APP.glossaryEditor = null;

    /*APP.glossary = new kendo.View('glossaryView', {
        model: glossaryView.activeObj
    });*/



    APP._homeInitialized = false;
    APP.layout.render('#app');
    ux.init();

    userView.init();


    APP.layout.showIn("#content", APP.index);


    APP.router = new kendo.Router({
        init: function(){
            APP.socialFeed = true;
            everlive.init();
//			algolia.init();
            userView.initPublicModels();
            userView.getCurrentUser();
            indexView.init();
        },

        change: function(e){
            ux.selectMenu(e.url);
            //ux.sendUrlChange(e.url);
            ux.windowScrollReset();
            if(ux.isBSMobile()){
                var menuOpen = $("#mainMenu").hasClass("in");
                if(menuOpen){
                    $("#mainMenu").collapse("toggle");
                }
            }
        },
        routeMissing: function(e){
            //console.log(e);
            var url = e.url;

            // Don't show the route error for in document anchor navigation
            if (url.indexOf('/') !== -1) {
                APP.layout.showIn("#content", APP.routeError);
            } else {
                APP.router.route("/");
            }
        }
    });


    APP.router.route("/", function(params) {

        if (params.socialfeed !== undefined) {
            if (params.socialfeed === 'false')
                APP.socialFeed = false;
        }

        APP.layout.showIn("#content", APP.index);

        if (params.anchor !== undefined) {
            var anchor = params.anchor;
            indexView.scrollTo(anchor);
        }
        shareModel.setShare("Better Food Foundation", "Check out the Better Food Foundation", 'http://www.betterfoodfoundation.org');

    });

    APP.profile = null;
    APP.router.route('/profile', function (params) {
        templateLoader.load('https://gaiaapi.herokuapp.com/templates/profile.html', function(status) {
            if(status){
                if (APP.profile === null) {
                    APP.profile = new kendo.View('profile', {
                        model: userModel.userObj
                    });
                }
                APP.layout.showIn("#content", APP.profile);
                profileView.openProfile();
                userView.updateUserProfile();
            }


        });
    });


    APP.router.route('/oauth/linkedin/callback', function(params) {

    });

    APP.mfm = null;
    APP.router.route("/mfm", function(params) {
        templateLoader.load('templates/mfm.html', function(status) {
            if (APP.mfm === null) {
                APP.mfm = new kendo.View('mfmView');
            }

            APP.layout.showIn("#content", APP.mfm);
            mfmView.init();
            mfmView.onShow();
            shareModel.setShare("Milk Free Mornings", "Pledge to make your mornings milk-free for 30 days", 'http://milkfreemornings.org');
            if (params.anchor !== undefined) {
                var anchor = params.anchor;
                mfmView.scrollTo(anchor);
            }
        });
    });

    APP.faq = null;
    APP.router.route("/faq", function(params) {
        templateLoader.load('templates/faq.html', function(status) {
            if(status){
                if (APP.faq === null) {
                    APP.faq = new kendo.View('faqView');
                }
                APP.layout.showIn("#content", APP.faq);
            }
        });
    });

    APP.router.route("/zapme", function (params){
        var password = params.password;

        if (password !== undefined && password.toLowerCase() === 'really') {
            ux.notify("Please wait.  Deleting this account...", 'success');
            if (!userView.isActive()) {
                ux.notify("No active user to delete!!", 'error');
                return;
            }


            userView.signOut();

           userModel.zapMe();

        } else {
            APP.router.route("/");
        }
    });

    /*APP.router.route('/about', function (params){
        APP.layout.showIn("#content", APP.about);
    });*/

    /*APP.router.route('/contact', function (params){
        APP.layout.showIn("#content", APP.contact);
    });*/

    APP.privacy = new kendo.View('privacy');
    APP.router.route('/privacy', function (params){
        APP.layout.showIn("#content", APP.privacy);
    });

    APP.contact = new kendo.View('contact');
    APP.router.route('/contact', function(){
       APP.layout.showIn("#content", APP.contact);
    });



    APP.myVote = null;
    APP.router.route('/myvote', function (params){
        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/');
            return;
        }
        templateLoader.load('../../templates/myvote.html', function(status) {
            if (APP.myVote === null) {
                APP.myVote = new kendo.View('myvote', {
                    model : myvoteView.activeObj
                });
            }
            APP.layout.showIn("#content", APP.myVote);
            myvoteView.open();
        });
    });



    APP.contributor = null;
    APP.router.route("/contributor", function(params) {
        templateLoader.load('../../templates/contributor.html', function(status) {
            if (APP.contributor === null) {
                APP.contributor = new kendo.View('contributorView');
            }
            APP.layout.showIn("#content", APP.contributor);
            var personId = null;
            if (params.personid !== undefined) {
                personId = params.personid;
            }
            contributorView.init();
        });
    });




    /*APP.router.route("/glossary", function(params){
        APP.layout.showIn("#content", APP.glossary);
        //    app.StickyHeader();
        glossaryView.init();
    });

    APP.router.route("/glossarymodal*", function(params) {
        if (params.slug !== undefined) {
            glossaryModal.init();
            glossaryModal.open(params.slug);
        }

    });*/


    /*APP.router.route("#/blog", function(params) {
        shareModel.setShare("Buying Poultry", "Check out the blogs!", 'http://www.buyfarmfoward.com/#/blog/');

        APP.layout.showIn("#content", APP.blogsView);
        blogsView.init();
        blogView.init();
        if (params.blogid !== undefined) {
            // blogView.init();
            // blogView.openModal(params.blogid);
            APP.layout.showIn("#content", APP.blogView);
            blogView.onShow(params.blogid);
        }

    });

    APP.router.route("/blog", function(params) {
        shareModel.setShare("Buying Poultry", "Check out the blogs!", 'http://www.buyfarmfoward.com/#/blog');
        if (!blogModel.blogLoaded) {
            ux.toggleLoader("blog", 2000);
            setTimeout(function(){
                APP.layout.showIn("#content", APP.blogsView);
                blogsView.init();
                blogView.init();
                if (params.blogid !== undefined) {
                    //blogView.init();
                    // blogView.openModal(params.blogid);
                    APP.layout.showIn("#content", APP.blogView);
                    blogView.onShow(params.blogid);
                }
            }, 2000);
        } else {
            APP.layout.showIn("#content", APP.blogsView);
            blogsView.init();
            blogView.init();
            if (params.blogid !== undefined) {
                //blogView.init();
                // blogView.openModal(params.blogid);
                APP.layout.showIn("#content", APP.blogView);
                blogView.onShow(params.blogid);
            }
        }
    });*/


    APP.router.route("/legacyData", function(params) {
        legacyData.init();
    });




    //*****************************************
    // Buying Poultry Editor Routes ...
    //*****************************************

    APP.brand = null;
    APP.router.route("/brand*", function(params){
        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/');
            return;
        }

        templateLoader.load('../../templates/brand.html', function(status) {
            if (APP.brand === null) {
                APP.brand = new kendo.View('brand');
            }
            APP.layout.showIn("#content", APP.brand);
            //app.StickyHeader();
            brandView.init();
             if (params.objectid !== undefined) {
             brandEditor.openModalByObjectId(params.objectid);
             }
             if (params.brandid !== undefined) {
             brandEditor.openModalByBrandId(params.brandid);
             }
        });
    });

    APP.brandEditor = null;
    APP.router.route("/brandeditor", function(params){
        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/#');
            return;
        }

        templateLoader.load('templates/brandkEditor.html', function(status) {
            if (APP.brandEditor === null) {
                APP.brandEditor = new kendo.View('brandEditor', {
                    model: brandEditor.activeObj
                });
            }

            APP.layout.showIn("#content", APP.brandEditor);

            brandEditor.init();
            if (params.objectid !== undefined) {
                brandEditor.openModalByObjectId(params.objectid);
            }
            if (params.brandid !== undefined) {
                brandEditor.openModalByBrandId(params.brandid);
            }
        });
    });


    //*****************************************
    // Staff Editor Routes....
    //*****************************************
    APP.blogEditor = null;
    APP.router.route("/blogeditor", function(params) {
        templateLoader.load('../../templates/blogEditor.html', function(status) {

            if (APP.blogEditor === null) {
                APP.blogEditor = new kendo.View("blogEditor", {
                    model: blogEditor.activeObj
                });

            }
            APP.layout.showIn("#content", APP.blogEditor);
            if (blogEditor._editor !== null) {
                blogEditor._editor.refresh();
            }

            var blogId = null;
            if (params.blogid !== undefined) {
                blogId = params.blogid;
            }

            blogEditor.open(blogId);
        });
    });

    APP.blogList = null;
    APP.router.route("/blogList", function(params) {
        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/');
            return;
        }
        templateLoader.load('../../templates/blogList.html', function(status) {
            if (APP.blogList === null) {
                APP.blogList = new kendo.View('blogList');
            }
            APP.layout.showIn("#content", APP.blogList);
            var siteId = null;
            if (params.siteid !== undefined) {
                siteId = params.siteid;
            }
            blogListView.open(siteId);
        });
    });

    APP.donationList = null;
    APP.router.route("/donationList", function(params) {
        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/');
            return;
        }

        templateLoader.load('../../templates/donationList.html', function(status) {
            if (APP.donationList === null) {
                APP.donationList = new kendo.View('donationList');
            }
            APP.layout.showIn("#content", APP.donationList);
            var siteId = APP.siteSlug;
            if (params.siteid !== undefined) {
                siteId = params.siteid;
            }
            donationListView.open(siteId);
        });
    });

    APP.pledgeList = null;
    APP.router.route("/pledgeList", function(params) {
        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/');
            return;
        }

        templateLoader.load('../../templates/pledgeList.html', function(status) {
            if (APP.pledgeList === null) {
                APP.pledgeList = new kendo.View('pledgeList');
            }
            APP.layout.showIn("#content", APP.pledgeList);
            var siteId = null;
            if (params.siteid !== undefined) {
                siteId = params.siteid;
            }
           pledgeListView.open(siteId);
        });
    });

    APP.contributorEditor = null;
    APP.router.route("/contributoreditor", function(params) {
        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/');
            return;
        }
        templateLoader.load('../../templates/contributorEditor.html', function(status) {

            if (APP.contributorEditor === null) {
                APP.contributorEditor = new kendo.View('contributorEditor', {
                    model : contributorEditor.activeObj
                });
            }


            APP.layout.showIn("#content", APP.contributorEditor);
            var personId = null;
            if (params.personid !== undefined) {
                personId = params.personid;
            }

            contributorEditor.init();
        });
    });

    APP.glossaryEditor = null;
    APP.router.route("/glossaryeditor", function(params){

        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/');
            return;
        }

        templateLoader.load('../../templates/glossaryEditor.html', function(status) {
            if (APP.glossaryEditor === null) {
                APP.glossaryEditor = new kendo.View('glossaryEditor');
            }

            APP.layout.showIn("#content", APP.glossaryEditor);
            //    app.StickyHeader();
            glossaryEditor.init();
        });
    });

    APP.menuEditor = null;
    APP.router.route("/menuEditor", function(params) {
        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/');
            return;
        }
        templateLoader.load('../../templates/menuEditor.html', function(status) {
            if (APP.menuEditor === null) {
                APP.menuEditor = new kendo.View('menuEditor');
            }

            APP.layout.showIn("#content", APP.menuEditor);
            var siteId = null;
            if (params.siteid !== undefined) {
                siteId = params.siteid;
            }

            menuEditor.open(siteId);
        });
    });

    APP.pageEditor = null;
    APP.router.route("/pageEditor", function(params) {
        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/');
            return;
        }
        templateLoader.load('../../templates/pageEditor.html', function(status) {
            if (APP.pageEditor === null) {
                APP.pageEditor = new kendo.View('pageEditor');
            }
            APP.layout.showIn("#content", APP.pageEditor);
            var pageId = null;
            if (params.pageid !== undefined) {
                pageId = params.pageId;
            }


            pageEditor.open(pageId);
        });
    });

    APP.backlogList = null;
    APP.router.route("/backloglist", function(params) {
        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/');
            return;
        }
        templateLoader.load('../../templates/backlogList.html', function (status) {
            if (APP.backlogList === null) {
                APP.backlogList = new kendo.View('backlogList');
            }
            APP.layout.showIn("#content", APP.backlogList);
            var siteId = null;
            if (params.siteid !== undefined) {
                siteId = params.siteid;
            }

            var reportId = null;
            if (params.reportid !== undefined) {
                reportId = params.reportid
            }

            backlogListView.open(siteId, reportId);
        });
    });

    APP.feedbackList = null;
    APP.router.route("/feedbacklist", function(params) {
        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/');
            return;
        }
        templateLoader.load('../../templates/feedbackList.html', function (status) {
            if (APP.feedbackList === null) {
                APP.feedbackList = new kendo.View('feedbackList');
            }
            APP.layout.showIn("#content", APP.feedbackList);
            var siteId = null;
            if (params.siteid !== undefined) {
                siteId = params.siteid;
            }

            var reportId = null;
            if (params.reportid !== undefined) {
                reportId = params.reportid
            }

            feedbackListView.open(siteId, reportId);
        });
    });

    APP.campaignList = null;
    APP.router.route("/campaignList", function(params) {
        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/');
            return;
        }
        templateLoader.load('../../templates/campaignList.html', function(status) {
            if (APP.campaignList === null) {
                APP.campaignList = new kendo.View('campaignList');
            }
            APP.layout.showIn("#content", APP.campaignList);
            var siteId = null;
            if (params.siteid !== undefined) {
                siteId = params.siteid;
            }
            campaignListView.open(siteId);
        });
    });

    APP.pledgeList = null;
    APP.router.route("/pledgeList", function(params) {
        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/');
            return;
        }
        templateLoader.load('../../templates/pledgeList.html', function(status) {
            if (APP.pledgeList === null) {
                APP.pledgeList = new kendo.View('pledgeList');
            }
            APP.layout.showIn("#content", APP.pledgeList);
            var siteId = null;
            if (params.siteid !== undefined) {
                siteId = params.siteid;
            }
            pledgeListView.open(siteId);
        });
    });

    APP.donorList = null;
    APP.router.route("/donorlist", function(params) {
        templateLoader.load('../../templates/donorList.html', function (status) {
            if (APP.donorList === null) {
                APP.donorList = new kendo.View('donorList');
            }
            APP.layout.showIn("#content", APP.donorList);
            var siteId = APP.siteSlug;
            if (params.siteid !== undefined) {
                siteId = params.siteid;
            }
            donorListView.open(siteId);
        });
    });

    APP.pageList = null;
    APP.router.route("/pageList", function(params) {
        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/');
            return;
        }
        templateLoader.load('../../templates/pageList.html', function(status) {
            if (APP.pageList === null) {
                APP.pageList = new kendo.View('pageList');
            }
            APP.layout.showIn("#content", APP.pageList);
            var siteId = null;
            if (params.siteid !== undefined) {
                siteId = params.siteid;
            }
            pageListView.open(siteId);
        });
    });

    APP.siteEditor = null;
    APP.router.route("/siteeditor", function(params){
        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/');
            return;
        }

        var siteId, view = null;
        if (params.siteid !== undefined) {
            siteId = params.siteid;
        }

        if(params.view !== undefined){
            view = params.view;
        }

        templateLoader.load('../../templates/siteEditor.html', function(status) {
            if (APP.siteEditor === null) {
                APP.siteEditor = new kendo.View('siteEditor',{model: siteEditor.activeObj});
            }
            siteEditor.init();
            APP.layout.showIn("#content", APP.siteEditor);

            siteEditor.open(siteId, view);
        });

    });

    APP.tagEditor = null;
    APP.router.route("/tageditor", function(params){
        if (!userView.isStaff()) {
            ux.notify('Staff only - redirecting...', 'error');
            APP.router.route('/');
            return;
        }

        templateLoader.load('../../templates/tagEditor.html', function(status) {
            if (APP.tagEditor !== null) {
                APP.tagEditor = new kendo.View('tagEditor');
            }
            APP.layout.showIn("#content", APP.tagEditor);
            tagView.init();
        });
    });



    APP.router.start();

});
	



});