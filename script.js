$(function () {
    var $mainMenuItems = $("#main-menu ul").children("li");
    var totalMainMenuItems = $mainMenuItems.length;
    var openedIndex = -1;

    var init = function () {
        $mainMenuItems.children(".images").click(function () {
            var newIndex = $(this).parent().index(),
            $item = $mainMenuItems.eq(newIndex),
            $colorImage = $item.find(".color");

            if (openedIndex === newIndex)
            {
                animateItem($item,false,250);
                openedIndex = -1;
            }
            else
            {
                if ((newIndex>=0) && (newIndex <totalMainMenuItems) )
                {
                    animateItem($mainMenuItems.eq(openedIndex), false, 250);                         
                    openedIndex = newIndex;
                    animateItem($item, true, 250); 
                }
            }
                   
        });

        //link musique video
        $mainMenuItems.children(".description").children("#button1").on('click',function() {
            var win = window.open('https://www.youtube.com/watch?v=xpVfcZ0ZcFM', '_blank');
            return win;
        })
        $mainMenuItems.children(".description").children("#button2").on('click',function() {
            var win = window.open('https://www.youtube.com/watch?v=lWA2pjMjpBs', '_blank');
            return win;
        })
        $mainMenuItems.children(".description").children("#button3").on('click',function() {
            var win = window.open('https://www.youtube.com/watch?v=vk6014HuxcE', '_blank');
            return win;
        })
        $mainMenuItems.children(".description").children("#button4").on('click',function() {
            var win = window.open('https://www.youtube.com/watch?v=5abamRO41fE', '_blank');
            return win;
        })
        $mainMenuItems.children(".description").children("#button5").on('click',function() {
            var win = window.open('https://www.youtube.com/watch?v=a5uQMwRMHcs', '_blank');
            return win;
        })
    };
    animateItem = function($item,toOpen,speed) {
        var $colorImage = $item.find(".color"),itemParam,colorImageParam;

        if (toOpen)
        {
            itemParam ={width:"420px"};
            colorImageParam ={left:"0px"}
        }
        else
        {
            itemParam ={width:"140px"};
            colorImageParam ={left:"140px"}
        }
        $colorImage.animate(colorImageParam,speed);
        $item.animate(itemParam,250);  
    }
    init();

    // Audio play musique 
    var playerTrack = $("#player-track"),
    bgArtwork = $("#bg-artwork"),
    bgArtworkUrl,
    albumName = $("#album-name"),
    trackName = $("#track-name"),
    albumArt = $("#album-art"),
    sArea = $("#s-area"),
    seekBar = $("#seek-bar"),
    trackTime = $("#track-time"),
    insTime = $("#ins-time"),
    sHover = $("#s-hover"),
    playPauseButton = $("#play-pause-button"),
    i = playPauseButton.find("i"),
    tProgress = $("#current-time"),
    tTime = $("#track-length"),
    seekT,
    seekLoc,
    seekBarPos,
    cM,
    ctMinutes,
    ctSeconds,
    curMinutes,
    curSeconds,
    durMinutes,
    durSeconds,
    playProgress,
    bTime,
    nTime = 0,
    buffInterval = null,
    tFlag = false,
    albums = [
      "God's Plan",
      "Diamond",
      "Empire State Of Mind",
      "Psychosocial",
      "Instant Crush"
    ],
    trackNames = [
      "Drake - God's Plan",
      "Diamond - Rihanna",
      "JAY-Z - Empire State Of Mind",
      "Slipknot - Psychosocial",
      "Daft Punk - Instant Crush"
    ],
    albumArtworks = ["_1", "_2", "_3", "_4", "_5"],
    trackUrl = [
      "https://github.com/kid0707/music/blob/main/Drake%20-%20God's%20Plan.mp3?raw=true",
      "https://github.com/kid0707/music/blob/main/Rihanna%20-%20Diamond.mp3?raw=true",
      "https://github.com/kid0707/music/blob/main/JCttMTFXa3X_jay-z-feat-alicia-keys-empire-state-of-mind-official-music-video-original-version.mp3?raw=true",
      "https://github.com/kid0707/music/blob/main/Slipknot%20-%20Psychosocial.mp3?raw=true",
      "https://github.com/kid0707/music/blob/main/Draft%20Punk%20-%20Instant%20Crush.mp3?raw=true"
    ],
    playPreviousTrackButton = $("#play-previous"),
    playNextTrackButton = $("#play-next"),
    currIndex = -1;

    function playPause() {
        setTimeout(function () {
            if (audio.paused) {
                playerTrack.addClass("active");
                albumArt.addClass("active");
                checkBuffering();
                i.attr("class", "fas fa-pause");
                audio.play();
            } else {
                playerTrack.removeClass("active");
                albumArt.removeClass("active");
                clearInterval(buffInterval);
                albumArt.removeClass("buffering");
                i.attr("class", "fas fa-play");
                audio.pause();
            }
        }, 300);
    }

    function showHover(event) {
        seekBarPos = sArea.offset();
        seekT = event.clientX - seekBarPos.left;
        seekLoc = audio.duration * (seekT / sArea.outerWidth());

        sHover.width(seekT);

        cM = seekLoc / 60;

        ctMinutes = Math.floor(cM);
        ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

        if (ctMinutes < 0 || ctSeconds < 0) return;

        if (ctMinutes < 0 || ctSeconds < 0) return;

        if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
        if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

        if (isNaN(ctMinutes) || isNaN(ctSeconds)) insTime.text("--:--");
        else insTime.text(ctMinutes + ":" + ctSeconds);

        insTime.css({ left: seekT, "margin-left": "-21px" }).fadeIn(0);
    }

    function hideHover() {
        sHover.width(0);
        insTime.text("00:00").css({ left: "0px", "margin-left": "0px" }).fadeOut(0);
    }

    function playFromClickedPos() {
        audio.currentTime = seekLoc;
        seekBar.width(seekT);
        hideHover();
    }

    function updateCurrTime() {
        nTime = new Date();
        nTime = nTime.getTime();

        if (!tFlag) {
        tFlag = true;
        trackTime.addClass("active");
        }

        curMinutes = Math.floor(audio.currentTime / 60);
        curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

        durMinutes = Math.floor(audio.duration / 60);
        durSeconds = Math.floor(audio.duration - durMinutes * 60);

        playProgress = (audio.currentTime / audio.duration) * 100;

        if (curMinutes < 10) curMinutes = "0" + curMinutes;
        if (curSeconds < 10) curSeconds = "0" + curSeconds;

        if (durMinutes < 10) durMinutes = "0" + durMinutes;
        if (durSeconds < 10) durSeconds = "0" + durSeconds;

        if (isNaN(curMinutes) || isNaN(curSeconds)) tProgress.text("00:00");
        else tProgress.text(curMinutes + ":" + curSeconds);

        if (isNaN(durMinutes) || isNaN(durSeconds)) tTime.text("00:00");
        else tTime.text(durMinutes + ":" + durSeconds);

        if (
            isNaN(curMinutes) ||
            isNaN(curSeconds) ||
            isNaN(durMinutes) ||
            isNaN(durSeconds)
        )
        trackTime.removeClass("active");
        else trackTime.addClass("active");

        seekBar.width(playProgress + "%");

        if (playProgress == 100) {
            i.attr("class", "fa fa-play");
            seekBar.width(0);
            tProgress.text("00:00");
            albumArt.removeClass("buffering").removeClass("active");
            clearInterval(buffInterval);
        }
    }

    function checkBuffering() {
        clearInterval(buffInterval);
        buffInterval = setInterval(function () {
            if (nTime == 0 || bTime - nTime > 1000) albumArt.addClass("buffering");
            else albumArt.removeClass("buffering");

            bTime = new Date();
            bTime = bTime.getTime();
        }, 100);
    }

    function selectTrack(flag) {
        if (flag == 0 || flag == 1) ++currIndex;
        else --currIndex;

        if (currIndex > -1 && currIndex < albumArtworks.length) {
        if (flag == 0) i.attr("class", "fa fa-play");
        else {
            albumArt.removeClass("buffering");
            i.attr("class", "fa fa-pause");
        }

        seekBar.width(0);
        trackTime.removeClass("active");
        tProgress.text("00:00");
        tTime.text("00:00");

        currAlbum = albums[currIndex];
        currTrackName = trackNames[currIndex];
        currArtwork = albumArtworks[currIndex];

        audio.src = trackUrl[currIndex];

        nTime = 0;
        bTime = new Date();
        bTime = bTime.getTime();

        if (flag != 0) {
            audio.play();
            playerTrack.addClass("active");
            albumArt.addClass("active");

            clearInterval(buffInterval);
            checkBuffering();
        }

        albumName.text(currAlbum);
        trackName.text(currTrackName);
        albumArt.find("img.active").removeClass("active");
        $("#" + currArtwork).addClass("active");

        bgArtworkUrl = $("#" + currArtwork).attr("src");

        bgArtwork.css({ "background-image": "url(" + bgArtworkUrl + ")" });
        } else {
            if (flag == 0 || flag == 1) --currIndex;
            else ++currIndex;
        }
    }

    function initPlayer() {
        audio = new Audio();

        selectTrack(0);

        audio.loop = false;

        playPauseButton.on("click", playPause);

        sArea.mousemove(function (event) {
            showHover(event);
        });

        sArea.mouseout(hideHover);

        sArea.on("click", playFromClickedPos);

        $(audio).on("timeupdate", updateCurrTime);

        playPreviousTrackButton.on("click", function () {
            selectTrack(-1);
        });
        playNextTrackButton.on("click", function () {
            selectTrack(1);
        });
    }

    initPlayer();

});
    

