<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">幺鸡测试</h2>
      <p class="login-subtitle">欢迎登录</p>
      <el-form :model="form" ref="formRef" class="login-form">
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            size="large"
          />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            size="large"
          />
        </el-form-item>
        <el-form-item class="remember-me">
          <el-checkbox v-model="form.rememberMe">记住我</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" class="login-btn" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
        <p class="login-tip">用户名: admin, 密码: 123456</p>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const store = useAppStore()

const formRef = reactive<{ form: FormInstance | null }>({ form: null })

const form = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const handleLogin = () => {
  if (store.login(form.username, form.password)) {
    if (form.rememberMe) {
      localStorage.setItem('login-username', form.username)
      localStorage.setItem('login-password', form.password)
      localStorage.setItem('login-remember', 'true')
    } else {
      localStorage.removeItem('login-username')
      localStorage.removeItem('login-password')
      localStorage.removeItem('login-remember')
    }
    router.push('/dashboard')
  } else {
    alert('用户名或密码错误')
  }
}

onMounted(() => {
  const remember = localStorage.getItem('login-remember') === 'true'
  if (remember) {
    const username = localStorage.getItem('login-username') || ''
    const password = localStorage.getItem('login-password') || ''
    form.username = username
    form.password = password
    form.rememberMe = true
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 14px;
  text-align: center;
  color: #6b7280;
  margin: 0 0 32px 0;
}

.login-form {
  margin-top: 24px;
}

.remember-me {
  padding: 0;
  margin-bottom: 16px;
}

.login-btn {
  width: 100%;
}

.login-tip {
  text-align: center;
  color: #9ca3af;
  font-size: 12px;
  margin-top: 16px;
}
</style>