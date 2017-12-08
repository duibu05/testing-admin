<template>
	<el-menu class="navbar" mode="horizontal">
		<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
		<levelbar></levelbar>
		<el-dropdown class="avatar-container" trigger="click">
			<div class="avatar-wrapper">
				<!-- <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'"> -->
				<span>{{nickname}}</span>
				<span class="el-icon-caret-bottom"></span>
			</div>
			<el-dropdown-menu class="user-dropdown" slot="dropdown">
				<router-link class='inlineBlock' to="/profile">
					<el-dropdown-item>
						个人中心
					</el-dropdown-item>
				</router-link>
				<router-link class='inlineBlock' to="/profile/password">
					<el-dropdown-item>
						修改密码
					</el-dropdown-item>
				</router-link>
				<!-- <el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item> -->
				<el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
	</el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Levelbar from './Levelbar'
// import TabsView from './TabsView'
import Hamburger from 'components/Hamburger'
// import Screenfull from 'components/Screenfull'
import ErrorLog from 'components/ErrLog'
import errLogStore from 'store/errLog'

export default {
  components: {
    Levelbar,
    // TabsView,
    Hamburger,
    ErrorLog
    // Screenfull
  },
  data() {
    return {
      log: errLogStore.state.errLog
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'nickname'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.navbar {
			height: 50px;
			line-height: 50px;
			border-radius: 0px !important;
			.hamburger-container {
					line-height: 58px;
					height: 50px;
					float: left;
					padding: 0 10px;
			}
			.avatar-container {
					height: 50px;
					display: inline-block;
					position: absolute;
					right: 20px;
					.avatar-wrapper {
							cursor: pointer;
							position: relative;
							.user-avatar {
									width: 35px;
									height: 35px;
									border-radius: 10px;
									margin-right: 5px;
							}
							.el-icon-caret-bottom {
									margin-left: 5px;
									font-size: 12px;
							}
					}
			}
	}
</style>



