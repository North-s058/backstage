<template>
  <div>
    <el-card class="box-card" style="margin: 20px 0">
      <category-select @getCategoryId="getCategoryId"></category-select>
    </el-card>
    <el-card>
      <div v-show="sense==0">
        <!--        展示spu列表的结构-->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addOrEditSpu">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="180">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述"> </el-table-column>
          <el-table-column prop="prop" label="描述">
          <template slot-scope="{row,$index}">
            <hint-button  title='添加' type="success" icon="el-icon-plus" size="mini"></hint-button>
            <hint-button  title='修改' type="warning" icon="el-icon-edit" size="mini" @click="addOrEditSpu(row)"></hint-button>
            <hint-button  title='信息' type="info" icon="el-icon-info" size="mini"></hint-button>
            <hint-button  title='删除' type="danger" icon="el-icon-delete" size="mini"></hint-button>
          </template> </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          :current-page='page'
          :page-sizes="[3, 6, 9]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total">
        </el-pagination>
      </div>
      <spuform v-show="sense==1">
      </spuform>
      <skuform v-show="sense==2"></skuform>
    </el-card>
  </div>
</template>

<script>
import spuform from "@/views/product/Spu/spuform/index.vue";
import skuform from "@/views/product/Spu/skuform/index.vue";
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page:1,
      limit:3,
      total:'',
      records:[],

      sense: 0,  //显示状态的切换


    };
  },
  methods: {
    // 三级联动自定义事件，把子组件对应的id传给父组件
    getCategoryId({ c1Id, c2Id, c3Id }, cate) {
      if (cate == 1) {
        this.category1Id = c1Id;
        this.category2Id = "";
        this.category3Id = "";
      } else if (cate == 2) {
        this.category2Id = c2Id;
        this.category3Id = "";
      } else {
        this.category3Id = c3Id;
        this.getSpuList();
      }
    },
    async getSpuList(pages=1) {
      this.page=pages
      const {page,limit,category3Id} = this
      let result = await this.$API.spu.reqSpuList(page,limit,category3Id)
      if(result.code==200){
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    handleSizeChange(limit){
      this.limit = limit
      this.getSpuList()
    },
    //添加或修改spu的回调
    addOrEditSpu(row){
      this.sense=1
    }

  },
  components:{
    spuform,
    skuform
  }
};
</script>

<style scoped></style>
