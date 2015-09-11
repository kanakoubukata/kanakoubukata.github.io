$(function(){
    $(window).on("scroll", function() {
        // スクロール量を取得
        var scroll = $(window).scrollTop();
        // 画像の高さを取得
        var height = $("#over img").height();
        // 前面のdiv要素の高さを削る
        $("#over").css("height", height-scroll);
    });
});
