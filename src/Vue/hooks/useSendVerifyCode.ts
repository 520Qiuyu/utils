import { ref, computed } from "vue";
import { useStorage } from '@vueuse/core'

/**
 * @description 获取验证码
 * @param page {string} 使用的页面
 * @returns 
 */
export const useSendVerifyCode = (page: string = 'page') => {

    // 开始时间
    const startTime = useStorage(page + 'startTime', 0, sessionStorage);
    /** 倒计时 */
    const countDown = ref(startTime.value ? Math.floor((Date.now() - startTime.value) / 1000) : 0);
    /** 倒计总时 */
    const countDownTime = ref(60);
    /** 计时器id */
    let timer

    // 存在记录，直接开始计时
    startTime.value && interval()

    /** 发送短信验证码 */
    const sendSmsCode = (phone: string) => {
        if (countDown.value > 0) return
        interval()
    };
    /** 发送邮箱验证码 */
    const sendEmailCode = (phone: string) => {
        if (countDown.value > 0) return
        interval()
    };

    function clearStartTime() {
        sessionStorage.removeItem(page + 'startTime')
    }

    /** 初始化的时候查看是否计时完成，未完成则计时直接输 */
    function interval() {
        startTime.value ||= Date.now();
        countDown.value += 1;
        clearInterval(timer)
        timer = setInterval(() => {
            countDown.value += 1;
            if (countDown.value >= countDownTime.value) {
                clearInterval(timer);
                countDown.value = 0;
                clearStartTime()
            }
        }, 1000);
    }


    return {
        countDown,
        countDownTime,
        sendSmsCode,
        sendEmailCode
    }
}



