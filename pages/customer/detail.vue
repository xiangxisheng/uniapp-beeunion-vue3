<template>
	<view>
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">{{$t('customer.customerName')}}</view>
				<input class="uni-input" focus placeholder="" v-model="mPostData.name" required />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">{{$t('customer.phoneNumber')}}</view>
				<input class="uni-input" placeholder="" v-model="mPostData.phone" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">{{$t('customer.remark')}}</view>
				<input class="uni-input" placeholder="" v-model="mPostData.remark" />
			</view>
			<view class="uni-padding-wrap uni-common-mt">
				<button type="primary" :disabled="mOtherParam.bLoading" @click="submit()">
					<span v-if="mLoadParam.action === 'add'">{{$t('customer.add')}}</span>
					<span v-else-if="mLoadParam.action === 'edit'">{{$t('customer.save')}}</span>
					<span v-else>Submit</span>
				</button>
			</view>
			<view class="uni-padding-wrap uni-common-mt" v-if="mLoadParam.action === 'edit'">
				<button type="warn" :disabled="mOtherParam.bLoading" @click="submit('del')">{{$t('customer.delete')}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		fGetTransResult,
	} from "@/common/i18n.js";
	import {
		getRequest,
		postRequest,
		navigateBack,
		showAlert,
		showConfirm
	} from '@/common/request.js'
	export default {
		data() {
			return {
				mLoadParam: {
					action: 'add',
					name: '',
					id: '',
				},
				mPostData: {
					name: '',
					phone: '',
					remark: '',
				},
				mOtherParam: {
					bLoading: false,
				},
			}
		},
		async onLoad(option) {
			for (const k in option) {
				this.mLoadParam[k] = option[k];
			}
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
			getUrl(_action) {
				const aUrl = ['/panel/front/customer'];
				if (this.mLoadParam.id) {
					aUrl.push(this.mLoadParam.id);
				}
				if (!_action) {
					_action = this.mLoadParam.action;
				}
				aUrl.push(_action);
				return aUrl.join('/');
			},
			async reload() {
				if (this.mLoadParam.action === 'add') {
					uni.setNavigationBarTitle({
						title: this.$t('customer.newCustomer')
					});
					if (this.mLoadParam.name) {
						this.mPostData.name = this.mLoadParam.name;
					}
					return;
				}
				if (this.mLoadParam.action === 'edit') {
					uni.setNavigationBarTitle({
						title: this.$t('customer.editCustomer')
					});
					const apiResData = await getRequest(this.getUrl('detail'), {});
					if (typeof(apiResData) === 'object') {
						for (const k in this.mPostData) {
							if (apiResData.hasOwnProperty(k)) {
								this.mPostData[k] = apiResData[k];
							}
						}
					}
					return;
				}
			},
			async submit(_action) {
				if (_action === 'del') {
					if (!await showConfirm(this.$t('customer.deleteConfirm', [this.mPostData.name]))) {
						return;
					}
				} else {
					if (this.mPostData.name.length < 3) {
						return showAlert(this.$t('common.cantLessChar', [this.$t('customer.customerName'), 3]));
					}
				}
				this.mOtherParam.bLoading = true;
				try {
					const result = await postRequest(this.getUrl(_action), this.mPostData);
					navigateBack();
				} catch (errno) {
					console.log(errno);
				}
				this.mOtherParam.bLoading = false;
			}
		}
	}
</script>
