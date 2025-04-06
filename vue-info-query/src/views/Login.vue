<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const debugMode = ref(false)
const form = ref({
  name: '',
  password: '',
  secrete: ''
})

watch(debugMode, (val) => {
  localStorage.setItem('debugMode', val.toString())
  if (val) {
    router.push('/')
  }
})

const onSubmit = async () => {
  try {
    loading.value = true
    await api.login(form.value)
    router.push('/')
  } catch (error) {
    ElMessage.error('Login failed. Please check your credentials.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="onSubmit">
      <div>
        <label>Username</label>
        <input v-model="form.name" type="text" required>
      </div>
      <div>
        <label>Password</label>
        <input v-model="form.password" type="password" required>
      </div>
      <div>
        <label>Secrete</label>
        <input v-model="form.secrete" type="text" required>
      </div>
      <div class="debug-toggle">
        <el-checkbox v-model="debugMode">Debug Mode (Skip Login)</el-checkbox>
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
.debug-toggle {
  margin: 15px 0;
  display: flex;
  align-items: center;
}
.debug-toggle input {
  margin-right: 8px;
}
</style>
