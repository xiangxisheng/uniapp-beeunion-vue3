<template>
	<view class="content">
		<view class="uni-common-mt">
			<view style="text-align: center;">
				<image class="logo" :src="mUserInfo.avatar"></image>
			</view>
			<view style="text-align: center;">
				<text class="title">{{ mUserInfo.username }}</text>
			</view>
			<view class="uni-padding-wrap uni-common-mt">
				<button type="primary" :disabled="mOtherParam.bLoading" @click="submit('logout')">Logout</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getRequest,
		postRequest,
		navigateBack
	} from '@/common/request.js'
	export default {
		data() {
			return {
				mUserInfo: {
					username: '-',
				},
				mOtherParam: {
					bLoading: false,
				},
			}
		},
		async onLoad() {
			await this.reload();
		},
		async onPullDownRefresh() {
			//下拉
			console.log("onPullDownRefresh");
			await this.reload();
			uni.stopPullDownRefresh();
		},
		methods: {
			async reload() {
				try {
					const result = await getRequest('/panel/getUserInfo');
					this.mUserInfo = result;
				} catch (errno) {
					console.log(errno);
				}
			},
			async submit(_action) {
				this.mOtherParam.bLoading = true;
				try {
					const result = await getRequest('/logout', {});
					navigateBack();
				} catch (errno) {
					console.log(errno);
				}
				this.mOtherParam.bLoading = false;
			}
		}
	}
</script>

<style>
	.content {
		/*display: flex;*/
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 50rpx auto 15rpx auto;
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
