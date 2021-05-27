// 每次调用$.get() / $.POST() / $.ajax()的时候都
// 会先调用ajaxPrefilter 这个函数
$.ajaxPrefilter(function(options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
})