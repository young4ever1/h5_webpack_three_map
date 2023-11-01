/**
 * 1.切换标题
 * 2.展示标题对应内容
 */
let client = $('#app')[0].clientHeight - 50;

// * 默认展示
let initId = 1;
$(`#${initId}`).addClass('active');
$(`#container_${initId}`).show();

// * 设置内容区的高度
$(`#container_${initId}`).css('height', client + 'px')

// * 切换标题 事件
$('#title').children().click((event) => {
    $(`#${initId}`).removeClass('active')
    $(`#container_${initId}`).hide();
    // * 更新标题
    initId = event.target.id;
    $(`#${initId}`).addClass('active');
    // * 展示对应模块
    $(`#container_${initId}`).show();
    // * 设置内容区的高度
    $(`#container_${initId}`).css('height', client + 'px')
})