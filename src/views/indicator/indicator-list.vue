<template>
    <div>
      <van-nav-bar
          :title="$t('indicator.indicatorManage')"
          left-arrow
          :right-text="$t('common.add')"
          @click-left="$back"
          @click-right="add"
          :safe-area-inset-top="true"
          :placeholder="true"
          :fixed="true"
        >
          <template #left>
              <van-icon name="arrow-left" size="22" color="#060C19" />
          </template>
      </van-nav-bar>
      <!-- <div class="p20">
        <van-button type="primary" @click="add">添加指标</van-button>
      </div> -->

      <van-loading v-if="loading" />

      <van-collapse v-model="firstActions" class="list" v-if="!loading">
        <van-collapse-item
          :name="index"
          v-for="(list, index) in listData"
          :key="index"
        >
          <template #title>
            <div class="level-1">{{ list.title }}</div>
          </template>
          <template #value>
             <van-icon name="ellipsis" color="#323842" size="24" @click.stop="list.showPop = true" />
             <van-popover
                v-model="list.showPop"
                placement="left"
                :actions="actions"
                @select="onSelect($event, list)"
              >
              </van-popover>
          </template>

          <div
            class="second-content"
            v-for="(secondItem, secondIndex) in list.childlist"
            :key="secondIndex"
          >
            <div class="level-2 flex flex-center" @click.stop="onSelect($event, secondItem)">
              <span>{{ secondItem.title }}</span>
              <div class="flex">
                <van-popover
                  v-model="secondItem.showPop"
                  trigger="click"
                  placement="left"
                  :actions="actions"
                  @select="onSelect($event, secondItem)"
                >
                  <template #reference>
                      <van-icon name="ellipsis" size="22" />
                  </template>
                </van-popover>
              </div>
            </div>
            <div
                class="third"
                v-for="(thirdItem, thirdIndex) in secondItem.childlist"
                :key="thirdIndex"
                @click.stop="onSelect($event, thirdItem)"
              >
                <div class="flex flex-center">
                  <p class="level-3 ellipsis">{{ thirdItem.title }}</p>
                  <div class="flex">
                    <van-popover
                      v-model="thirdItem.showPop"
                      trigger="click"
                      placement="left"
                      :actions="actions"
                      @select="onSelect($event, thirdItem)"
                    >
                      <template #reference>
                         <van-icon name="ellipsis" size="18" />
                      </template>
                    </van-popover>
                  </div>
                </div>
                <div class="content flex flex-center">
                  <span class="mr20">
                    <van-icon name="flag-o" size="15" />{{ $t('indicator.score') }}<i class="text">{{ thirdItem.score }}</i>
                  </span>
                  <span class="mr20">
                    <van-icon name="points" size="15" />{{ $t('indicator.weight') }}<i class="text">{{ thirdItem.weight }}</i>
                  </span>
                  <span>
                    <van-icon name="sign" size="15" />{{ $t('indicator.indicatorScoreType') }}<i class="text">{{ thirdItem.score_type }}</i>
                  </span>
                </div>
                <!-- <div class="content">
                  <span>
                    <van-icon name="clock-o" size="15" />创建时间<i class="text">{{ list.created_at }}</i>
                  </span>
                </div> -->
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
</template>

<script>
import _ from 'lodash';
export default {
    name: 'indicator-list',
    data() {
      return {
        firstActions: [],
        seconds: [0, 1, 2, 3, 4, 5],
        page: 1,
        per_page: 20,
        listData: [],
        actions: [
           { text: this.$t('common.view'), icon: 'orders-o', type: 'detail' }, 
           { text: this.$t('common.edit'), icon: 'edit', type: 'edit' },
           { text: this.$t('common.delete'), icon: 'delete-o', type: 'delete' }
        ],
        // showPopover: false,
        loading: true
      };
    },
    created() {
      this.getList();
    },
    methods: {
      add() {
        this.$router.push('/indicator/form');
      },
      getList() {
        this.loading = true;
        this.$api.get('/v1/indicators.tree', {
          per_page: this.per_page,
          page: this.page,
        })
        .finally(() => {
          this.loading = false;
        })
        .then(res => {
          if(res.error_code == 0) {
            this.listData = res.list;
            this.$store.state.indicatorsTree = _.cloneDeep(res.list);
            localStorage.setItem('indicatorsTree', JSON.stringify(_.cloneDeep(res.list)));
            this.listData.forEach((list, index) => {
              this.firstActions.push(index);
            })
            // console.log(this.listData);
          }
        })
      },
      onSelect(event, item) {
        switch(event.type) {
          case 'edit':
            this.$router.push({ path: '/indicator/form?id='+item.id});
            break;
          case 'delete':
            console.log(item);
            this.$dialog.confirm({
              title: '',
              message: '删除父级指标则子级指标也会被删除，是否继续操作？',
              beforeClose: (action, done) => {
                if (action === 'confirm') {
                  this.$api.get('/v1/indicators.delete', {
                    id: item.id
                  }).then(res => {
                    if(res.error_code == '0') {
                      this.$toast.success('删除成功');
                      this.getList();
                      done();
                    }
                  })
                } else {
                  done();
                }
              }
            })
            break;
          default:
            this.$router.push({ path: '/indicator/form', query: { id: item.id,  disabled: true }});
            break;
        }
      },
      beforeClose(action, done) {
        if (action === 'confirm') {
          setTimeout(done, 1000);
        } else {
          done();
        }
      },
      edit() {
        
      },
    }
}

</script>
<style lang='less' scoped>
/deep/ .list {

  .van-cell {

  }

  .van-collapse-item {
    margin-bottom: 30px;
    background: #fff;

    .van-icon-arrow {
      position: absolute;
      left: 0;
    }
  }
  .level-1 {
    padding-left: 20px;
    font-size: 30px;
    font-weight: bold;
    color: #323842;

    .van-icon {
      width: 40px;
      display: inline-block;
    }
  }
  .level-2 {
    padding: 20px 40px 20px 30px;
    font-weight: bold;
    color: #5a5e64;
    border-bottom: 2px solid #f5f5f5;
    // background: #f5f5f5;
  }
  .van-collapse-item__content {
    padding: 0 !important;

  }
  .second-content {
    border-bottom: 2px solid #f5f5f5;
    // padding: 0 30px;
  }
  .third {
    margin: 20px 20px;
    padding: 10px 20px;
    color: #5E636E;
    background: #f7f7f7;
    border-radius: 20px;
    border-bottom: 2px solid #f0f0f0;
  }
  .content {
    padding: 10px 0;
    font-size: 26px;
    .van-icon {
      margin-right: 5px;
    }
    .text {
      margin: 0 5px;
      font-style: normal;
      font-weight: bold;
    }
  }
  .level-3 {
    padding: 10px 0;
    font-size: 28px;
    color: #323842;
    // font-weight: bold;
  }
}
</style>