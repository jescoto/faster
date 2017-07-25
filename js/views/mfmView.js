/**
 * Created by donbrad on 5/4/17.
 */
var mfmView = {
    _initialized : false,
    _isShown: false,

    init: function () {
        if (mfmView._initialized)
            return;

        mfmView._initialized = true;

        mfmView.initPledgeBlock();

        fluidvids.init({
            selector: ['iframe'], // runs querySelectorAll()
            players: ['www.youtube.com', 'player.vimeo.com'] // players to support
        });

        pledgeModal.init();
        donationModal.init();
        pledgeInfoModal.init();
       /* $(window).on(ghEvent.userLoaded, function (){
           userPledge.fetch();
        });*/

    },

    initPledgeBlock : function () {
        var pledge =  $('#mfmPledgeBlock').data('kendoPledgeBlock');

        if (typeof pledge !== "undefined") {
            pledge.refresh();
        } else {
            $('#mfmPledgeBlock').kendoPledgeBlock({
                title: 'Milk-Free Mornings Pledge',
                buttonText : "Pledge Now",
                pledgeId : 'bff-milk-free-mornings',
                requireEmail: true,
                requireAddress : false,
                pledgeAction: "<ul class='list-unstyled gh-pledge-custom'><li><img src='images/icon-breakfast.svg' />Every morning for 30 days</li><li><img src='images/icon-plant.svg'/>Use plant-based milk</li><li><img src='images/icon-save.svg'>Save on plant-based products</li></ul>",
                description: 'Pledge to make your mornings milk-free for 30 days and we’ll send you recipes, nutritional tips, and coupons for our favorite plant-based products!',
                thankyou: 'Thanks for joining the thousands of people who go milk-free every morning! Share Milk-Free Mornings with your friends and family to let them know how easy it is to make healthy and more humane food choices. Interested in a non-dairy coffee creamer replacement? Try <a href="https://lairdsuperfood.com">Lairds Superfood Creamers</a> and receive a 25% discount with this digital code at their checkout: FORWARD25  ',
                thankyouTitle: 'I pledged on ',
                message: "Almost there, just a few more pieces of info to complete your pledge. This pledge includes an email newsletter and valuable coupons mailed to your home!"
            });
        }
    },

    onShow : function () {

        if(!mfmView._isShown){
            mfmView._isShown = true;
            fluidvids.render();
        }
       /* mfmView.setMeta( 'meta[property="og:title"]', "Milk Free Mornings");
        mfmView.setMeta( 'meta[property="og:url"]', "https://milkfreemornings.org");
        mfmView.setMeta( 'meta[property="og:image"]', "https://www.betterfoodfoundation.org/images/mfmsocial.png");
        mfmView.setMeta( 'meta[property="og:description"]', "Our choices matter. Almost half of all cow’s milk consumed in the U.S. is consumed at the breakfast table. Every time we find a humane alternative to cow’s milk, we help reduce the suffering of cows on dairy farms. It’s simple: Drinking less milk means fewer animals suffer. Pledge now!");
*/
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

    onHide : function () {

    },

    showVideo: function(){
        $(".mfm-video-player").removeClass("hidden");
        $("#mfm-video").addClass("hidden");

        var iframe = document.getElementById("mfm-video-frame");
        var player = new Vimeo.Player(iframe);

        player.play().then(function(){

        }).catch(function(error){
            ux.notify('Error playing video', "error");
        });
    },

    hideVideo: function(){
        $(".mfm-video-player").addClass("hidden");
        $("#mfm-video").removeClass("hidden");

        var iframe = document.getElementById("mfm-video-frame");
        var player = new Vimeo.Player(iframe);

        player.pause();
    },

    goTo : function () {

        if(ux.isBSMobile()){
            ux.closeMobileMenu("#mainMenu")
        }
        APP.router.navigate("#/mfm");
        analyticsModel.sendGAEvent("milkfreemornings", "open", "PII");
    },

    toggleCite: function(){
        var isOpen = $("#mfm-cite-container").hasClass("in");
        if(isOpen){
            $("#mfm-cite-container").collapse("toggle");
            $("#mfm-cite-icon").text("keyboard_arrow_down");
            $(".mfm-cite > a > span").text("View References");
        } else {
            $("#mfm-cite-icon").text("keyboard_arrow_up");
            $(".mfm-cite > a > span").text("Hide References");
        }
    },

    setMeta: function (tag, content) {
        $(tag).attr('content', content);
    },

    facebookShare : function () {

        var url = 'https://www.facebook.com/dialog/share?app_id=1875609289379201'+
            '&href='+ encodeURIComponent('https://www.betterfoodfoundation.org/#/mfm')+
            '&image='+ 'https://www.betterfoodfoundation.org/images/mfmsocial.png' +
            '&quote=' + encodeURIComponent("Our choices matter. Almost half of all cow’s milk consumed in the U.S. is consumed at the breakfast table. Every time we find a humane alternative to cow’s milk, we help reduce the suffering of cows on dairy farms. It’s simple: Drinking less milk means fewer animals suffer. Pledge now!") +
            /*   '&redirect_uri='+ encodeURIComponent('https://www.betterfoodfoundation.org/#/mfm');*/
            '&display=popup';

        var x = screen.width/2 - 640/2;
        var y = screen.height/2 - 480/2;
        window.open(url,'feedDialog','toolbar=0,status=0,width=640,height=480,left='+x+",y="+y);
    }

};