<template>
    <el-container>
        <el-main>
            <h2>库存管理</h2>

            <!-- 根据库存 ID 获取单个库存数据 -->
            <el-card class="inventory-card">
                <h3>查询库存</h3>
                <el-form :inline="true" @submit.prevent="fetchInventoryById">
                    <el-form-item label="库存ID">
                        <el-input v-model="inventoryId" placeholder="请输入库存ID"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="fetchInventoryById">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="inventoryData" style="width: 100%" v-if="inventoryData.length > 0">
                    <el-table-column prop="inventory_id" label="库存ID"></el-table-column>
                    <el-table-column prop="current_stock" label="当前库存"></el-table-column>
                </el-table>
            </el-card>

            <!-- Excel 表导入更新库存 -->
            <el-card class="inventory-card">
                <h3>Excel 表导入更新库存</h3>
                <el-upload action=""
                           :on-change="handleExcelUpload"
                           :auto-upload="false"
                           accept=".xlsx, .xls"
                           :show-file-list="false">
                    <el-button type="primary">选择 Excel 文件</el-button>
                </el-upload>
                <el-table :data="excelData" style="width: 100%" v-if="excelData.length > 0">
                    <el-table-column prop="inventory_id" label="库存ID"></el-table-column>
                    <el-table-column prop="current_stock" label="增加库存"></el-table-column>
                </el-table>
                <el-button type="primary" @click="submitExcelData" :disabled="excelData.length === 0">提交</el-button>
            </el-card>

            <!-- 手动更新库存 -->
            <el-card class="inventory-card">
                <h3>手动更新库存</h3>
                <el-form :model="updateInventoryForm" :rules="rules" ref="updateInventoryForm">
                    <el-form-item label="库存ID" prop="inventory_id">
                        <el-input v-model="updateInventoryForm.inventory_id" placeholder="请输入库存ID"></el-input>
                    </el-form-item>
                    <el-form-item label="增加库存" prop="current_stock">
                        <el-input v-model="updateInventoryForm.current_stock" placeholder="请输入增加库存"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitUpdateInventory">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
    import axios from 'axios';
    import * as XLSX from 'xlsx';

    export default {
        data() {
            return {
                inventoryId: null,
                inventoryData: [],
                excelData: [],
                updateInventoryForm: {
                    inventory_id: null,
                    current_stock: null,
                },
                rules: {
                    inventory_id: [{ required: true, message: '请输入库存ID', trigger: 'blur' }],
                    current_stock: [{ required: true, message: '请输入增加库存', trigger: 'blur' }],
                },
            };
        },
        methods: {
            async fetchInventoryById() {
                try {
                    const response = await axios.get(`http://localhost:5000/api/inventory/${this.inventoryId}`);
                    this.inventoryData = [response.data];
                } catch (error) {
                    console.error('获取库存数据失败', error);
                    this.inventoryData = [];
                }
            },
            handleExcelUpload(file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    this.excelData = jsonData.map((item) => ({
                        inventory_id: item['库存ID'],
                        current_stock: item['增加库存'],
                    }));
                };
                reader.readAsArrayBuffer(file.raw);
            },
            async submitExcelData() {
                try {
                    for (const item of this.excelData) {
                        const response = await axios.get(`http://localhost:5000/api/inventory/${item.inventory_id}`);
                        const currentStock = response.data.current_stock;

                        await axios.put(`http://localhost:5000/api/inventory/${item.inventory_id}`, {
                            inventory_id: item.inventory_id,
                            current_stock: currentStock + parseInt(item.current_stock),
                        });
                    }
                    this.$message.success('Excel 数据导入成功');
                    this.excelData = [];
                } catch (error) {
                    console.error('导入 Excel 数据失败', error);
                    this.$message.error('导入 Excel 数据失败');
                }
            },
            async submitUpdateInventory() {
                try {
                    const response = await axios.get(`http://localhost:5000/api/inventory/${this.updateInventoryForm.inventory_id}`);
                    const currentStock = response.data.current_stock;

                    await axios.put(`http://localhost:5000/api/inventory/${this.updateInventoryForm.inventory_id}`, {
                        inventory_id: this.updateInventoryForm.inventory_id,
                        current_stock: currentStock + parseInt(this.updateInventoryForm.current_stock),
                    });
                    this.$message.success('手动更新库存成功');
                    this.updateInventoryForm = { inventory_id: null, current_stock: null };
                } catch (error) {
                    console.error('手动更新库存失败', error);
                    this.$message.error('手动更新库存失败');
                }
            },
        },
    };
</script>

<style scoped>
    .inventory-card {
        margin-bottom: 20px;
    }

    h2 {
        margin-bottom: 20px;
    }

    h3 {
        margin-bottom: 10px;
    }
</style>
