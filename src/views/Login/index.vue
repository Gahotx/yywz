<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { showFailToast, showSuccessToast, type FormInstance } from 'vant'
import { loginByPwd, getMobileCode, loginByCode } from '@/api'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

const agree = ref(false)
const isPwd = ref(true)
const mobile = ref('13230000088')
const password = ref('abc12345')
const code = ref('')
const show = ref(false)

const store = useUserStore()
const route = useRoute()
const router = useRouter()

const login = async () => {
  if (!agree.value) return showFailToast('请勾选协议')
  const res = isPwd.value
    ? await loginByPwd(mobile.value, password.value)
    : await loginByCode(mobile.value, code.value)
  // console.log(res)
  store.setUser(res.data)
  router.push((route.query.redirect as string) || '/user')
  showSuccessToast('登录成功')
}

// 发送验证码
const time = ref(0)
let timeId: number
const formRef = ref<FormInstance>()
const sendCode = async () => {
  if (time.value > 0) return
  await formRef.value?.validate('mobile')
  const res = await getMobileCode(mobile.value, 'login')
  showSuccessToast('发送成功')
  code.value = res.data.code
  // 倒计时
  time.value = 60
  timeId = window.setInterval(() => {
    time.value--
    if (time.value <= 0) {
      window.clearInterval(timeId)
    }
  }, 1000)
}

onUnmounted(() => {
  window.clearInterval(timeId)
})
</script>

<template>
  <div class="login-page">
    <cp-nav-bar
      right-text="注册"
      @click-right="$router.push('/register')"
    ></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPwd ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPwd = !isPwd">
        <span>{{ isPwd ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form autocomplete="off" @submit="login">
      <van-field
        placeholder="请输入手机号"
        type="tel"
        :rules="mobileRules"
        v-model="mobile"
        name="mobile"
      ></van-field>
      <van-field
        v-if="isPwd"
        placeholder="请输入密码"
        :type="show ? 'text' : 'password'"
        :rules="passwordRules"
        v-model="password"
      >
        <template #button>
          <cp-icon
            @click="show = !show"
            :name="`login-eye-${show ? 'on' : 'off'}`"
          ></cp-icon>
        </template>
      </van-field>
      <van-field
        v-else
        placeholder="短信验证码"
        :rules="codeRules"
        v-model="code"
      >
        <template #button>
          <span
            class="btn-send"
            :class="{ active: time > 0 }"
            @click="sendCode"
            >{{ time > 0 ? `${time}秒后重发` : '发送验证码' }}</span
          >
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit"
          >登 录</van-button
        >
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    display: flex;
    padding: 30px 30px 50px;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
