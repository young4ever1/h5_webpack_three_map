let chinaEventFnList = {
    getCanvasRelativePosition: function (event, canvas) {
        const rect = canvas.getBoundingClientRect()
        return {
            x: ((event.clientX - rect.left) * canvas.width) / rect.width,
            y: ((event.clientY - rect.top) * canvas.height) / rect.height
        }
    },
    // * 弹窗展示位置 设置
    getDetialPosition(event, infoDom) {
        infoDom.style.left = event.clientX + 2 + 'px';
        infoDom.style.top = event.clientY + 2 + 'px';
    },
    // * 点位设置数据处理
    setPickPosition: function (event, canvas) {
        let pickPosition = { x: 0, y: 0 }
        // 计算后 以画布 开始为 （0，0）点
        const pos = this.getCanvasRelativePosition(event, canvas)
        console.log(pos);
        // 数据归一化
        pickPosition.x = (pos.x / canvas.width) * 2 - 1
        pickPosition.y = (pos.y / canvas.height) * -2 + 1
        return pickPosition
    },

    // * 省份模块选中状态存储
    lastPick: null,
    onRay: function (event, canvas, camera, map, infoDom, videoCon) {
        console.log(event);
        let pickPosition = this.setPickPosition(event, canvas)
        console.log(pickPosition);
        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(pickPosition, camera)
        // 计算物体和射线的交点
        const intersects = raycaster.intersectObjects([map], true)
        console.log(intersects);
        if (intersects.length !== 0) {
            console.log(intersects[0].object.type);
            if (intersects[0].object.type === 'Mesh') {
                console.log('yes');
                // 数组大于0 表示有相交对象
                if (intersects.length > 0) {
                    if (this.lastPick) {
                        if (this.lastPick.object.uuid !== intersects[0].object.uuid) {
                            this.lastPick.object.material.color.set('#0527AF')
                            this.lastPick = null
                        }
                    }
                    if (intersects[0].object.uuid) {
                        intersects[0].object.material.color.set('#238E23')
                        // * 省份详情事件
                        this.provinceDetail(intersects[0], infoDom, videoCon);
                        this.getDetialPosition(event, infoDom)
                        // * 
                        this.getDetialPosition(event, videoCon)
                    }
                    this.lastPick = intersects[0]
                    console.log(this.lastPick);
                } else {
                    if (this.lastPick) {
                        // * 复原
                        if (this.lastPick.object.uuid) {
                            this.lastPick.object.material.color.set('#0527AF')
                            this.lastPick = null
                        }
                    }
                }
            }
        }
    },

    // * 省份弹窗详情
    provinceIds: [],
    provinceDetail(intersects, infoDom, videoCon) {
        // * 存储点击记录
        this.provinceIds.push(intersects.object.id);
        // * 存储两次点击状态
        // * 第一次点击时 且不为指定区域时进行 信息展示 else 为其他信息展示
        // * 两次点击后进行 进行比对相同id 取消点击状态
        // * 两次点击后进行 进行比对不同id 删除第一次记录 展示信息
        // * 信息展示为指定地区时 展示对应内容弹窗
        if (intersects.object.id === 641) {
            videoCon.style.display = 'block';
            infoDom.style.display = 'none';
        }
        if (this.provinceIds.length === 2) {
            // * 比较两次点击记录进行对比
            if (this.provinceIds[0] === this.provinceIds[1]) {
                // * 取消弹窗 video
                infoDom.style.display = 'none';
                // * 取消板块选中
                this.lastPick.object.material.color.set('#0527AF')
                this.lastPick = null
                infoDom.style.display = 'none';
                // * 清空记录
                this.provinceIds = [];
            } else {
                // * 去除上一次点击记录
                this.provinceIds.shift();
                infoDom.textContent = intersects.object.parent.properties;
                // * 不为指定地区 隐藏 video
                infoDom.style.display = 'block';
            }
        } else {
            if (intersects.object.type === 'Mesh' ) {
                infoDom.textContent = intersects.object.parent.properties;
                infoDom.style.display = 'block';
            }
            // if (intersects.object.type === 'Mesh' && intersects.object.id !== 641) {
            //     infoDom.textContent = intersects.object.parent.properties;
            //     infoDom.style.display = 'block';
            // } else {
            //     videoCon.style.display = 'block';
            //     infoDom.style.display = 'none';
            // }
        }
    }

}
export default chinaEventFnList
