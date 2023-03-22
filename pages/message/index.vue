<template>
	<view class="content">
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
	import {
		fGetTransResult,
	} from "@/common/i18n.js";
	import {
		getRequest,
	} from '@/common/request.js'
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		async created() {
			uni.setNavigationBarTitle({
				title: this.$t('common.title'),
			});
			await this.reload();
		},
		async onPullDownRefresh() {
			//下拉
			console.log("onPullDownRefresh");
			await this.reload();
			uni.stopPullDownRefresh();
		},
		methods: {
			$t(_formatpath, _param) {
				return fGetTransResult(_formatpath, _param);
			},
			async reload() {
				try {
					const result = await getRequest('/panel/getUserInfo');
					this.title = result;
				} catch (errno) {
					console.log(errno);
				}
			},
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
