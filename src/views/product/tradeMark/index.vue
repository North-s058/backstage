<template>
  <div>
    <!--    按钮-->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px; background-color: #20a0ff"
      @click="showDialog"
      >添加</el-button
    >
    <el-table border  :data="list" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="180" align="center">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo" align="center">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 150px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="addOrEdit(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delTrademark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page='page'      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->, sizes,total"
      :total="total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    >
    </el-pagination>
<!--   对话框-->
    <el-dialog :title='tmForm.id?"修改品牌":"添加品牌"' :visible.sync="dialogFormVisible">
      <el-form style="width:80%" :model="tmForm" :rules="rules" ref=formValidation>
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="添加图片" style="margin-left: 30px" prop="logoUrl">
          <el-upload
            :model="tmForm"
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadToServer">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      page: 1,
      limit: 5,
      list: [],
      total: 0,
      dialogFormVisible: false,
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        tmName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2到 10 个字符', trigger: 'blur' }
        ],
        logoUrl: [
          { required: true, message: '请选择图片' }
        ],}
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    async getPageList(page = 1) {
      this.page = page
      let result = await this.$API.tradeMark.reqTradeMarkList(
        this.page,
        this.limit
      );
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    handleSizeChange(pageSize) {
      this.limit = pageSize
      this.getPageList()

    },
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
     uploadToServer() {
      this.$refs.formValidation.validate(async (success)=>{
        if(success){
          let result =await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
          if(result.code == 200){
            this.dialogFormVisible = false
            //   弹出一个信息
            this.$message({
              type:"success",
              message:this.tmForm.id?'修改品牌成功':'添加品牌成功'
            })

            this.getPageList(this.tmForm.id?this.page:1)
          }
        }else{
          console.log('error submit!!')
          return false

        }
      })

    },
    showDialog(){
      this.dialogFormVisible = true
      this.tmForm = {
        logoUrl: '' ,
        tmName: ''
      }
    },
    addOrEdit(row){
      console.log(row)
      this.dialogFormVisible = true
      this.tmForm = {...row}
    },
    delTrademark(row){
      this.$confirm(`你确定删除${row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
        if(result.code ==200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getPageList(this.list.length>1?this.page:this.page-1);
        }else{
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }

  }
}



</script>

<style >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>


