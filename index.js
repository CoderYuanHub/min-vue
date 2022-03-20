function createApp(rootComponent) {
    return {
        mount(selector) {
            const container = document.querySelector(selector);
            let isMount = false;
            let oldVnode = null;

            watchEffect(function() {
                if (!isMount) {
                    oldVnode = rootComponent.render();
                    // 改mound为渲染器电mount
                    mounted(oldVnode, container);
                    isMount = true;
                } else {
                    const newVnode = rootComponent.render();
                    patch(oldVnode, newVnode);
                    oldVnode = newVnode;
                }
            })
        }
    }
}