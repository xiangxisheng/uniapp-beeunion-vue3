<template>
	<view>
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">{{$t('customer.customerName')}}</view>
				<input class="uni-input" focus placeholder="" v-model="mPostData.name" required />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">{{$t('customer.phoneNumber')}}</view>
				<input class="uni-input" placeholder="" v-model="mPostData.detail.phone" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">{{$t('customer.remark')}}</view>
				<input class="uni-input" placeholder="" v-model="mPostData.detail.remark" />
			</view>
			<view class="uni-padding-wrap uni-common-mt">
				<button type="primary" :disabled="mOtherParam.bLoading"
					@click="submit(mLoadParam.action==='add'?'POST':'PUT')">
					<span v-if="mLoadParam.action === 'add'">{{$t('customer.add')}}</span>
					<span v-else-if="mLoadParam.action === 'edit'">{{$t('customer.save')}}</span>
					<span v-else>Submit</span>
				</button>
			</view>
			<view class="uni-padding-wrap uni-common-mt" v-if="mLoadParam.action === 'edit'">
				<button type="warn" :disabled="mOtherParam.bLoading"
					@click="submit('DELETE')">{{$t('customer.delete')}}</button>
			</view>
			<view class="uni-padding-wrap uni-common-mt" v-if="0&&mLoadParam.action === 'edit'">
				<button type="button" :disabled="mOtherParam.bLoading"
					@click="nav('list')">{{$t('customer.listOrder')}}</button>
			</view>
			<view class="uni-padding-wrap uni-common-mt" v-if="mLoadParam.action === 'edit'">
				<button type="button" :disabled="mOtherParam.bLoading"
					@click="nav('add')">{{$t('order.newOrder')}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		useI18nStore,
	} from "@/common/i18n.js";
	const i18n = useI18nStore();
	import {
		request,
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
					detail: {},
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
				return i18n.fGetTransResult(_formatpath, _param);
			},
			getUrl(_action) {
				const aUrl = ['/panel/front/customer'];
				if (this.mLoadParam.id) {
					aUrl.push(this.mLoadParam.id);
				}
				if (_action) {
					aUrl.push(_action);
				}
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
					const apiResData = await request('GET', this.getUrl(), {});
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
			async submit(_method) {
				if (_method === 'DELETE') {
					if (!await showConfirm(this.$t('customer.deleteConfirm', [this.mPostData.name]))) {
						return;
					}
				}
				if (this.mPostData.name.length < 3) {
					return showAlert(this.$t('common.cantLessChar', [this.$t('customer.customerName'), 3]));
				}
				this.mOtherParam.bLoading = true;
				try {
					const result = await request(_method, this.getUrl(), this.mPostData);
					navigateBack();
				} catch (errno) {
					console.log(errno);
				}
				this.mOtherParam.bLoading = false;
			},
			nav(name) {
				if (name === 'list') {
					uni.navigateTo({
						url: '/pages/order/index?customer_id=' + this.mLoadParam.id,
					});
					return;
				}
				if (name === 'add') {
					uni.navigateTo({
						url: '/pages/order/detail?action=add&customer_id=' + this.mLoadParam.id,
					});
					return;
				}
			}
		}
	}
</script>