<script>
	import {
		useI18nStore,
	} from "@/common/i18n.js";

	export default {
		onLaunch: async function() {
			console.log('App Launch')
			const i18n = useI18nStore();
			await i18n.fLoadData();
			setTimeout(async() => {
				await i18n.fTransTabBar();
			}, 200);
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