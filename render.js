// 渲染器

function h(tag, props, children) {
    // vnode => javaScript对象 => {}
    return {
        tag,
        props,
        children
    }
}
// 挂载函数
function mounted(vnode, container) {
    // vnode =》 真实dom并在vnode上保存
    // 1、创建出原生dom，并在vnode上保留el
    const el = vnode.el = document.createElement(vnode.tag);

    // 2、处理props
    if (vnode.props) {
        for (const key in vnode.props) {
            const value = vnode.props[key];
            // 对事件监听的判断
            if (key.startsWith("on")) {
                el.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                // 添加属性
                el.setAttribute(key, value);
            }
        }
    }

    // 对children处理
    if(vnode.children) {
        if (typeof vnode.children === 'string') {
            el.textContent = vnode.children;
        } else {
            vnode.children.forEach(item => {
                mounted(item, el);
            });
        }
    }

    // 挂载
    container.appendChild(el);

}

// 对比两个节点
function patch(n1, n2) {
    // 对比两个节点的元素是否相同
    if(n1.tag !== n2.tag) {
        // 拿到父节点
        const n1Parent = n1.el.parentNode;
        console.log(n1Parent)
        n1Parent.removeChild(n1.el);
        mounted(n2, n1Parent);
    } else {
        // 取出element对象，并在n2中保存
        const el = n2.el = n1.el;

        // 1.取出新旧props
        const oldProps = n1.props || {};
        const newProps = n2.props || {};
        // 2.将所有的新的props添加到el
        for (let key in newProps) {
            const oldValue = oldProps[key];
            const newValue = newProps[key];
            if (oldValue !== newValue) {
                if (key.startsWith("on")) {
                    el.addEventListener(key.slice(2), newValue);
                } else {
                    el.setAttribute(key, newValue);
                }
            }
        }

        // 3.移除所有旧的props
        for (let key in oldProps) {
            // 如果不存在
            if (!newProps[key]) {
                if (key.startsWith("on")) {
                    const oldValue = oldProps[key];
                    el.removeEventListener(key.slice(2), oldValue);
                } else {
                    el.removeAttribute(key);
                }
            }
        }
        // 4.处理child
        const oldChild = n1.children || [];
        const newChild = n2.children || [];
        // 1.判断新child是否为字符串
        if (typeof newChild === 'string') {
            // 新旧child都是字符串则替换内容
            if (typeof oldChild === 'string') {
                if (oldChild !== newChild) {
                    el.textContent = newChild;
                }
            } else {
                // 旧节点不是字符串，则html内容替换
                el.innerHTML = newChild;
            }
        } else { // 新child不是字符串
            // 1.旧child为字符串
            if (typeof oldChild === 'string') {
                // 清空当前节点内容
                el.innerHTML = ""
                // 将新child挂载上去
                newChild.forEach(item => {
                    mounted(item, el);
                })
            } else {
                // 当新旧child都是数组
                const commentLength = Math.min(oldChild.length, newChild.length);
                // 相同长度部分直接对比
                for (let i = 0; i < commentLength; i++) {
                    patch(oldChild[i], newChild[i])
                }
                // 多余部分处理
                // 1.当旧child多余新child
                if (oldChild.length > newChild.length) {
                    oldChild.slice(commentLength).forEach(item => {
                        el.removeChild(item.el);
                    })
                }
                // 2.当新的child多余旧的child
                if (oldChild.length < newChild.length) {
                    newChild.slice(commentLength).forEach(item => {
                        mounted(item, el);
                    })
                }
            }
        }

    }
}