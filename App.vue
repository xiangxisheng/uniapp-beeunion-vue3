<script>
	import {
		fLoad,
	} from "@/common/i18n.js";

	export default {
		onLaunch: function() {
			console.log('App Launch')
			fLoad();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import '@/common/uni.css';

	page {
		background-color: #efeff4;
	}
</style>
