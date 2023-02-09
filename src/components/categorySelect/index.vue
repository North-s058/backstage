<template>
  <div>
    <el-form :inline="true"  :model='formInline' class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="formInline.cateForm.c1Id" placeholder="请选择" @change="changeHandler(1)">
          <el-option v-for="(c1,index) in list1" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="formInline.cateForm.c2Id" placeholder="请选择" @change="changeHandler(2)">
          <el-option v-for="(c2,index) in list2" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="formInline.cateForm.c3Id" placeholder="请选择" @change="getInfo">
          <el-option v-for="(c3,index) in list3" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'categorySelect',
  data() {
    return {
      formInline: {
        user: '',
        cateForm:{
          c1Id:'',
          c2Id:'',
          c3Id:''
        }
      },
      list1:[],
      list2:[],
      list3:[]
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods: {
    async getCategory1List(){
      let result = await this.$API.attr.reqCategory1List()
      if(result.code ==200){
        this.list1 = result.data
      }
},
    async changeHandler(cate){
      const {c1Id,c2Id} = this.formInline.cateForm
      if(cate==1){
        this.list2 = [],
          this.list3 = [],
          this.formInline.cateForm.c2Id = ''
          this.formInline.cateForm.c3Id = ''
        let result = await this.$API.attr.reqCategory2List(c1Id)
        if(result.code==200){
          this.list2 = result.data
        }
      }else{
        this.list3 = [],
          this.formInline.cateForm.c3Id=''
        let result = await this.$API.attr.reqCategory3List(c2Id)
        if(result.code==200){
          this.list3 = result.data
        }
      }
    },
    getInfo(){
      this.$emit('getCategoryId',this.formInline.cateForm)
    }
  },

}
</script>

<style lang="scss" scoped>

</style>
