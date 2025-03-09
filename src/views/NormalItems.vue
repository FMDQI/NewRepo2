<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                newItemForm: {
                    item_name: '',
                    item_type: '',
                    production_date: '',
                    shelf_life: '',
                },
                normalItems: [],
                loading: false,  // 新增加载状态
                itemRules: {
                    item_name: [{ required: true, message: '请输入物品名称', trigger: 'blur' }],
                    item_type: [{ required: true, message: '请输入物品类型', trigger: 'blur' }],
                    production_date: [{ required: true, message: '请选择生产日期', trigger: 'blur' }],
                    shelf_life: [{
                        required: true,
                        message: '请输入有效的保质期天数',
                        trigger: 'blur',
                        validator: (rule, value, callback) => {  // 自定义校验规则
                            if (!/^[1-9]\d*$/.test(value)) {
                                callback(new Error('请输入正整数'));
                            } else {
                                callback();
                            }
                        }
                    }]
                },
            };
        },
        methods: {
            async submitNewItem() {
                try {
                    this.$refs.newItemForm.validate(async (valid) => {
                        if (!valid) return;

                        this.loading = true;
                        await axios.post(
                            'http://localhost:5000/api/normal_items/normal_items',
                            this.newItemForm
                        );

                        this.$message.success('添加成功');
                        this.$nextTick(() => {  // 确保 DOM 更新后再重置表单
                            this.$refs.newItemForm.resetFields();  // 使用官方方法重置表单
                        });
                        await this.fetchNormalItems();
                    });
                } catch (error) {
                    const errorMsg = error.response?.data?.error || '添加失败，请检查网络连接';
                    this.$message.error(errorMsg);
                } finally {
                    this.loading = false;
                }
            },
            async fetchNormalItems() {
                try {
                    this.loading = true;
                    const { data } = await axios.get('http://localhost:5000/api/normal_items/normal_items');

                    this.normalItems = Array.isArray(data) ? data : [];
                } catch (error) {
                    this.$message.error('数据加载失败');
                } finally {
                    this.loading = false;
                }
            },
            // 格式化生产日期显示
            formatDate(dateStr) {
                if (!dateStr) return '-';
                const date = new Date(dateStr);
                return isNaN(date) ? dateStr : date.toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).replace(/\//g, '-');
            }
        },
        mounted() {
            this.fetchNormalItems();
        }
    };
</script>

<template>
    <el-container>
        <el-main>
            <!-- 添加加载状态 -->
            <el-skeleton :loading="loading" animated>
                <template #template>
                    <el-skeleton-item variant="h3" style="width: 30%" />
                    <el-skeleton :rows="5" style="margin-top: 20px" />
                </template>

                <template #default>
                    <h2>库存物品信息管理</h2>

                    <!-- 添加库存物品卡片 -->
                    <el-card class="normal-items-card" shadow="hover">
                        <h3>添加库存物品</h3>
                        <el-form :model="newItemForm" :rules="itemRules" ref="newItemForm" label-width="100px">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="物品名称" prop="item_name">
                                        <el-input v-model="newItemForm.item_name" placeholder="请输入物品名称" clearable />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="物品类型" prop="item_type">
                                        <el-input v-model="newItemForm.item_type" placeholder="请输入物品类型" clearable />
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="生产日期" prop="production_date">
                                        <el-date-picker v-model="newItemForm.production_date"
                                                        type="date"
                                                        placeholder="选择生产日期"
                                                        value-format="YYYY-MM-DD"
                                                        format="YYYY-MM-DD"
                                                        style="width: 100%" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="保质期" prop="shelf_life">
                                        <el-input-number v-model="newItemForm.shelf_life"
                                                         :min="1"
                                                         :max="3650"
                                                         controls-position="right"
                                                         style="width: 100%" />
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-form-item>
                                <el-button type="primary"
                                           @click="submitNewItem"
                                           :loading="loading">
                                    立即添加
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-card>

                    <!-- 库存列表卡片 -->
                    <el-card class="normal-items-card" shadow="hover">
                        <template #header>
                            <div class="card-header">
                                <h3>库存物品列表</h3>
                                <el-button type="primary" @click="fetchNormalItems" :loading="loading">
                                    <el-icon><Refresh /></el-icon>
                                    刷新数据
                                </el-button>
                            </div>
                        </template>

                        <el-table :data="normalItems"
                                  stripe
                                  border
                                  highlight-current-row
                                  v-loading="loading">
                            <el-table-column prop="item_id" label="ID" width="80" align="center" sortable />
                            <el-table-column prop="item_name" label="物品名称" min-width="120" />
                            <el-table-column prop="item_type" label="物品类型" width="120" />
                            <el-table-column label="生产日期" width="120" align="center">
                                <template #default="{ row }">
                                    {{ formatDate(row.production_date) }}
                                </template>
                            </el-table-column>
                            <el-table-column label="保质期" width="120" align="center">
                                <template #default="{ row }">
                                    {{ row.shelf_life }} 天
                                </template>
                            </el-table-column>
                        </el-table>

                        <!-- 空状态显示 -->
                        <el-empty v-if="!loading && normalItems.length === 0"
                                  description="暂无库存数据"
                                  :image-size="200" />
                    </el-card>
                </template>
            </el-skeleton>
        </el-main>
    </el-container>
</template>

<style scoped>
    .normal-items-card {
        margin-bottom: 20px;
        transition: all 0.3s;
    }

        .normal-items-card:hover {
            box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
        }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    h2 {
        margin-bottom: 20px;
        color: var(--el-color-primary);
        font-size: 24px;
    }

    h3 {
        margin: 0;
        font-size: 18px;
    }
</style>
