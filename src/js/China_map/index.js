import * as THREE from 'three'
import '../../css/global.css'
// import '../flexble.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// * 标题切换 内容区展示 
import '@/util/TitleFn/container_show'

// * 中国地图 JSON
import chinaJson from '@/static/json/china.json'
// * 中国地图边框 JSON
import chinaLine from '@/static/json/chinaLine.json'

// * 中国地图绘制方法
import chinaDrawFnList from '@/util/chinaFn/china_map_draw'
// * 中国地图点击事件
import chinaEventFnList from '@/util/chinaFn/china_detail_click'


// * Scene
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
const map = new THREE.Object3D();
const circleYs = [];

// * Loader file
const loader = new THREE.FileLoader();
loader.load(chinaJson, (data) => {
    const jsonData = JSON.parse(data);
    /**
     * jsonData 中国地图点位数据
     * scene 展示矢量的容器
     */
    chinaDrawFnList.operationData(jsonData, scene, map);
    // * 坐标转换 根据中心点设置 光点源
    const projection = d3.geoMercator().center([104.06, 34.26]).translate([0, 0])

    // * 北京中心坐标点
    const res1 = projection([116.405285, 39.904989]);
    chinaDrawFnList.spotCircle(scene, [res1[0], res1[1], 7], circleYs);

    // * 湖北中心坐标点
    const res2 = projection([114.298572, 30.584355]);
    chinaDrawFnList.spotCircle(scene, [res2[0], res2[1], 7], circleYs);

})
loader.load(chinaLine, (data) => {
    const json = JSON.parse(data);
    // * 画出流动的轮廓线
    chinaDrawFnList.flowingDrawLine(json, scene, map);
    // * 流动形式 返回的结果 
    let flowingResult = chinaDrawFnList.flowingDrawStyle(scene);
    let currentPos = 0;
    let pointSpeed = 15;

    // * 动画渲染函数
    // * Refersh
    const tick = () => {
        // * 鼠标控制事件更新
        controls.update();
        if (flowingResult[0] && flowingResult[1].attributes.position) {
            currentPos += pointSpeed
            for (let i = 0; i < pointSpeed; i++) {
                flowingResult[3][(currentPos - i) % flowingResult[2].length] = 0
            }

            for (let i = 0; i < 200; i++) {
                flowingResult[3][(currentPos + i) % flowingResult[2].length] = i / 50 > 2 ? 2 : i / 50
            }
            flowingResult[1].attributes.aOpacity.needsUpdate = true
        }
        // * 标记点动画
        circleYs.forEach(function (mesh) {
            // console.log(mesh);
            mesh._s += 0.01;
            mesh.scale.set(1 * mesh._s, 1 * mesh._s, 1 * mesh._s)
            if (mesh._s <= 2) {
                mesh.material.opacity = 2 - mesh._s
            } else {
                mesh._s = 1;
            }
        })
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    }
    tick()
})
// * H5 点击事件的兼容
$('#webgl').click((event) => {
    let infoDom = $('#provinceInfo')[0];
    let videoCon = $('#videoContainer')[0];
    chinaEventFnList.onRay(event, canvas, camera, map, infoDom, videoCon)
})
// * Sizes
const sizes = {
    width: $('#container_1')[0].clientWidth,
    height: $('#container_1')[0].clientHeight
}

// * Resize 等比例缩放 场景
window.addEventListener('resize', () => {
    // * Sizes Update
    sizes.width = $('#container_1')[0].clientWidth;
    sizes.height = $('#container_1')[0].clientHeight;

    // * Camera Update
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // * Update Renderer
    renderer.setSize(sizes.width, sizes.height);
    // * Pixel 像素更新
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

// * 全屏场景 及 兼容浏览器写法
// window.addEventListener('dblclick', () => {
//     const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
//     if (!fullscreenElement) {
//         if (canvas.requestFullscreen) {
//             canvas.requestFullscreen();
//         } else if (canvas.webkitRequestFullscreen) {
//             canvas.webkitRequestFullscreen();
//         }

//     } else {
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen();
//         }
//     }
// })

// * Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(0, 20, 250);
camera.lookAt(0, 0, 0)
scene.add(camera);

// * Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// * Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})

// * Update Renderer
renderer.setSize(sizes.width, sizes.height);
// * Pixel 像素更新
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// * Renderer theme
// renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1.6;



