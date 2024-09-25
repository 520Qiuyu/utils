import { ObjectDirective, DirectiveBinding, nextTick } from "vue";

interface IScrollToOptions {
  frequency?: number;
  scrollDistance?: number;
  backTopTime?: number;
  startScrollTime?: number;
  childQuerySelector?: string;
}

interface ICustomHtmlElement extends HTMLElement {
  startScrollId?: any;
  backTopId?: any;
  timeId?: any;
  startFn: any;
  stopFn: any;
}

// 用于给列表元素自动滚动
export const autoScroll: ObjectDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(
    el: ICustomHtmlElement,
    binding: DirectiveBinding<IScrollToOptions>,
    vnode,
    prevVnode
  ) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(
    el: ICustomHtmlElement,
    binding: DirectiveBinding<IScrollToOptions>,
    vnode,
    prevVnode
  ) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(
    el: ICustomHtmlElement,
    binding: DirectiveBinding<IScrollToOptions>,
    vnode,
    prevVnode
  ) {
    // 确定el
    const { value = {}, arg } = binding;
    const { childQuerySelector } = value;
    // 如果设置了子选择器，那么就将el设置成该元素
    if (childQuerySelector) {
      el = el.querySelector(childQuerySelector)!;
    }
    // 开始函数
    el.startFn = () => {
      startScroll(el, value);
    };
    // 结束函数
    el.stopFn = () => {
      stopScroll(el);
    };
    setTimeout(() => {
      el.startFn();
    }, 0);
    el.addEventListener("mouseenter", el.stopFn);
    el.addEventListener("mouseleave", el.startFn);
  },
  // 绑定元素的父组件更新前调用
  beforeUpdate(
    el: ICustomHtmlElement,
    binding: DirectiveBinding<IScrollToOptions>,
    vnode,
    prevVnode
  ) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(
    el: ICustomHtmlElement,
    binding: DirectiveBinding<IScrollToOptions>,
    vnode,
    prevVnode
  ) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(
    el: ICustomHtmlElement,
    binding: DirectiveBinding<IScrollToOptions>,
    vnode,
    prevVnode
  ) {
    // 确定el
    const { value = {}, arg } = binding;
    const { childQuerySelector } = value;
    if (childQuerySelector) {
      el = el.querySelector(childQuerySelector) as ICustomHtmlElement;
    }
    el.stopFn();
    el.removeEventListener("mouseenter", el.stopFn);
    el.removeEventListener("mouseleave", el.startFn);
  },
  // 绑定元素的父组件卸载后调用
  unmounted(
    el: ICustomHtmlElement,
    binding: DirectiveBinding<IScrollToOptions>,
    vnode,
    prevVnode
  ) {}
};

const startScroll = (el: ICustomHtmlElement, options: IScrollToOptions) => {
  const {
    frequency = 1000,
    scrollDistance = 10,
    backTopTime = 0,
    startScrollTime = 0
  } = options;
  if (!el) console.warn("该容器不存在");
  // 延迟滚动
  el.startScrollId = setTimeout(() => {
    const { clientHeight, scrollHeight } = el;
    // 可以滚动
    if (scrollHeight > clientHeight) {
      function setScrollTop() {
        el.timeId = setTimeout(() => {
          // 滑动到底部
          if (el.scrollTop + scrollDistance >= el.scrollHeight - clientHeight) {
            el.scrollTop = el.scrollHeight - clientHeight;
            // 延迟回顶部
            el.backTopId = setTimeout(() => {
              el.scrollTop = 0;
              // 顶部延迟滑动
              setTimeout(setScrollTop, startScrollTime);
            }, backTopTime);
          } else {
            el.scrollTop = el.scrollTop + scrollDistance;
            setScrollTop();
          }
        }, frequency);
      }
      setScrollTop();
    } else {
      console.warn("该容器不能滚动");
    }
  }, startScrollTime);
};
const stopScroll = (el: ICustomHtmlElement) => {
  clearTimeout(el.startScrollId);
  clearTimeout(el.backTopId);
  clearTimeout(el.timeId);
};
