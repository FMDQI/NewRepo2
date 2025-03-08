<template>
    <el-container class="login-container">
        <el-main>
            <el-card class="login-card">
                <h2>登录</h2>
                <el-form :model="loginForm" :rules="rules" ref="loginForm">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="loginForm.password"
                                  type="password"
                                  placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleLogin">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
    import { ElMessage } from 'element-plus';
    import axios from 'axios';

    export default {
        data() {
            return {
                loginForm: {
                    username: '',
                    password: '',
                },
                rules: {
                    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                },
            };
        },
        methods: {
            async handleLogin() {
                try {
                    const response = await axios.post('http://localhost:5000/api/auth/login', this.loginForm);
                    const { access_token, user_id, role } = response.data;

                    // 保存 token 和用户信息到 localStorage
                    localStorage.setItem('access_token', access_token);
                    localStorage.setItem('user_id', user_id);
                    localStorage.setItem('role', role);

                    // 跳转到仪表盘
                    this.$router.push('/dashboard');
                } catch (error) {
                    ElMessage.error('登录失败，请检查用户名和密码');
                }
            },
        },
    };
</script>

<style scoped>
    .login-container {
        display: flex;
        justify-content: center; /* 水平居中 */
        align-items: center; /* 垂直居中 */
        height: 100vh; /* 占满整个视口高度 */
        background-color: #f5f5f5;
    }

    .login-card {
        width: 400px;
        padding: 20px;
        margin: 0 auto; /* 水平居中 */
    }
</style>