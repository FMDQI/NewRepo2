<template>
    <el-container>
        <el-main>
            <h2>补货服务</h2>

            <!-- 根据销售数据生成订单 -->
            <el-card class="replenishment-card">
                <h3>根据销售数据生成订单</h3>
                <el-button type="primary" @click="generateOrdersFromSalesData">生成订单</el-button>
            </el-card>

            <!-- 展示所有补货订单 -->
            <el-card class="replenishment-card">
                <h3>所有补货订单</h3>
                <el-button type="primary" @click="fetchReplenishmentOrders">刷新</el-button>
                <el-table :data="replenishmentOrders" style="width: 100%">
                    <el-table-column prop="order_id" label="订单ID"></el-table-column>
                    <el-table-column prop="item_id" label="物品ID"></el-table-column>
                    <el-table-column prop="order_quantity" label="补货数量"></el-table-column>
                    <el-table-column prop="order_date" label="订单日期"></el-table-column>
                    <el-table-column prop="status" label="状态"></el-table-column>
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button type="success"
                                       @click="approveOrder(scope.row.order_id)"
                                       :disabled="scope.row.status === 'completed'">
                                批准
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页组件 -->
                <el-pagination background
                               layout="prev, pager, next"
                               :total="total"
                               :page-size="pageSize"
                               :current-page="currentPage"
                               @current-change="handlePageChange"></el-pagination>
            </el-card>

            <!-- 生成补货订单 -->
            <el-card class="replenishment-card">
                <h3>手动生成补货订单</h3>
                <el-form :model="newOrderForm" :rules="rules" ref="newOrderForm">
                    <el-form-item label="物品ID" prop="item_id">
                        <el-input v-model="newOrderForm.item_id" placeholder="请输入物品ID"></el-input>
                    </el-form-item>
                    <el-form-item label="补货数量" prop="order_quantity">
                        <el-input v-model="newOrderForm.order_quantity" placeholder="请输入补货数量"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitNewOrder">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                replenishmentOrders: [], // 当前页的补货订单
                total: 0, // 总记录数
                pageSize: 10, // 每页数量
                currentPage: 1, // 当前页码
                newOrderForm: {
                    item_id: null,
                    order_quantity: null,
                },
                rules: {
                    item_id: [{ required: true, message: '请输入物品ID', trigger: 'blur' }],
                    order_quantity: [{ required: true, message: '请输入补货数量', trigger: 'blur' }],
                },
            };
        },
        methods: {
            // 获取所有补货订单（分页）
            async fetchReplenishmentOrders() {
                try {
                    const response = await axios.get('http://localhost:5000/api/replenishment/replenishment_orders', {
                        params: {
                            page: this.currentPage,
                            page_size: this.pageSize,
                        },
                    });
                    this.replenishmentOrders = response.data.orders;
                    this.total = response.data.total;
                } catch (error) {
                    console.error('获取补货订单失败', error);
                    this.$message.error('获取补货订单失败');
                }
            },
            // 批准补货订单
            async approveOrder(orderId) {
                try {
                    const response = await axios.put(`http://localhost:5000/api/replenishment/replenishment_orders/${orderId}`, {
                        status: 'completed',
                    });
                    this.$message.success('订单已批准');
                    this.fetchReplenishmentOrders(); // 刷新订单列表
                } catch (error) {
                    console.error('批准订单失败', error);
                    this.$message.error('批准订单失败');
                }
            },
            // 提交新的补货订单
            async submitNewOrder() {
                try {
                    const response = await axios.post('http://localhost:5000/api/replenishment/replenishment_orders', this.newOrderForm);
                    this.$message.success('补货订单创建成功');
                    this.newOrderForm = { item_id: null, order_quantity: null }; // 清空表单
                    this.fetchReplenishmentOrders(); // 刷新订单列表
                } catch (error) {
                    console.error('创建补货订单失败', error);
                    this.$message.error('创建补货订单失败');
                }
            },
            // 根据销售数据生成订单
            async generateOrdersFromSalesData() {
                try {
                    const response = await axios.post('http://localhost:5000/api/replenishment/predict_and_order');
                    this.$message.success('订单生成成功');
                    this.fetchReplenishmentOrders(); // 刷新订单列表
                } catch (error) {
                    console.error('生成订单失败', error);
                    this.$message.error('生成订单失败请检查是否有未批准订单');
                }
            },
            // 处理分页变化
            handlePageChange(page) {
                this.currentPage = page;
                this.fetchReplenishmentOrders(); // 获取新页的数据
            },
        },
        mounted() {
            // 页面加载时获取所有补货订单
            this.fetchReplenishmentOrders();
        },
    };
</script>

<style scoped>
/* 手动生成订单表单对齐 */
.replenishment-card:last-child .el-form-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  margin-bottom: 20px;
}

.replenishment-card:last-child .el-form-item__label {
  text-align: right;
  padding-right: 15px;
}

.replenishment-card:last-child .el-form-item__content {
  max-width: 300px;
}

.replenishment-card {
        margin-bottom: 20px;
        background: transparent !important;
    }

    .replenishment-card .el-card__body {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(25px) saturate(200%);
  -webkit-backdrop-filter: blur(25px) saturate(200%);
  border-radius: 8px;
  border: 1px solid rgba(103, 194, 58, 0.25);
  box-shadow: 0 8px 32px rgba(103, 194, 58, 0.2);
}
   

    h2 {
        margin-bottom: 20px;
    }

    h3 {
        margin-bottom: 10px;
    }
</style>