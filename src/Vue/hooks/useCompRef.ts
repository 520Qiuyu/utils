import { ref } from "vue";

/** 传入组件声明即可得到该组件的类型 */
export function useCompRef<T extends abstract new (...args: any) => any>(Comp: T) {
    return ref<InstanceType<T>>()
}

/**
 * 例 
 * const elformRef = useCompRef(ElForm)
 * elformRef.value.XXX        // 即可访问组件的方法
 * 
 */