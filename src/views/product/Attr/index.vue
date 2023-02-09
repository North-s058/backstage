<template>
  <div>
    <el-card style="margin:20px">
      <category-select @getCategoryId="getCategoryId"></category-select>
    </el-card>
    <el-card style="margin:20px">
      <div v-show="isShowTable">
        <el-button type="primary"  icon="el-icon-plus" :disabled="!cateId.c3Id" @click="isShowTable=false">添加</el-button>
        <el-table
          border
          style="width: 100%"
          :data="attrList"
        >
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="80">
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="属性值列表">
            <template slot-scope="{row,$index}">
              <el-tag style="margin:0 10px" type="success" v-for="(attrValue,index) in row.attrValueList" :key="attrValue.id">{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            width="150">
            <template v-slot="{row,$index}">
              <el-button type="warning" icon="el-icon-edit" siz="mini" ></el-button>
              <el-button type="danger" icon="el-icon-delete" siz="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item lable="属性名">
            <el-input placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus">添加属性值</el-button>
        <el-button @click="isShowTable=false">取消</el-button>
        <el-table
          style="width: 100%; margin:20px 0">
          <el-table-column
            label="序号"
            width="80"
            type="index"
            align="center"
          >

          </el-table-column>
          <el-table-column
            prop="name"
            label="属性值名称"
            width="width">
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作">
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Attr',
  data(){
    return{
      cateId:{
        c1Id:'',
        c2Id:'',
        c3Id:''
      },
      attrList:[],
      isShowTable:false
    }
  },
  methods:{
    getCategoryId(cateId){
      this.cateId=cateId
      this.getAttrList()
    },
    async getAttrList(){
      let result = await this.$API.attr.reqAttrList(this.cateId.c1Id,this.cateId.c2Id,this.cateId.c3Id)
      console.log(result)
      if(result.code==200){
        this.attrList = result.data
      }
    }

  }
}
</script>

<style scoped>

</style>
