<template>
	<view>
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">{{$t('sign.username')}}:</view>
				<input class="uni-input" focus placeholder="" v-model="post.username" required />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">{{$t('sign.password')}}:</view>
				<input class="uni-input" type="password" placeholder="" v-model="post.password" required />
			</view>
			<view class="uni-form-item uni-column" v-if="action === 'register'">
				<view class="title">{{$t('sign.confirmPassword')}}:</view>
				<input class="uni-input" type="password" placeholder="" v-model="password2" required />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">Language / 语言选择</view>
				<radio-group class="uni-input" @change="languageChange">
					<label v-for="(item, index) in aLocales" :key="item.locale">
						<radio :value="item.locale" :checked="item.locale === post.language" />
						{{ item.title }}
					</label>
					<a href="javascript:void(0)" @click="fResetLocale()">{{$t('common.resetLocale')}}</a>
				</radio-group>
			</view>
			<view class="uni-padding-wrap uni-common-mt">
				<button type="primary" :disabled="bLoading" @click="fetchData()"
					v-if="action === 'login'">{{$t('sign.login')}}</button>
				<button type="primary" :disabled="bLoading" @click="fetchData()"
					v-if="action === 'register'">{{$t('sign.register')}}</button>
			</view>
			<view class="uni-padding-wrap uni-common-mt">
				<button @click="action = 'register'" v-if="action === 'login'">{{$t('sign.register')}}</button>
				<button @click="action = 'login'" v-if="action === 'register'">{{$t('sign.login')}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		postRequest,
		navigateBack,
		showAlert,
	} from '@/common/request.js';
	import {
		fGetTransResult,
		fGetLocales,
		fGetCurrentLocale,
		fSetCurrentLocale,
		fRemoveCurrentLocale,
	} from "@/common/i18n.js";
	export default {
		data() {
			return {
				bLoading: false,
				action: 'login',
				password2: '',
				post: {
					username: '',
					password: '',
					language: null,
				},
				aLocales: [],
			}
		},
		created() {
			this.post.language = fGetCurrentLocale();
			this.aLocales = fGetLocales();
			this.onLocale();
		},
		onPullDownRefresh() {
			//下拉
			console.log("onPullDownRefresh");
			uni.stopPullDownRefresh();
		},
		methods: {
			$t(_formatpath, _param) {
				return fGetTransResult(_formatpath, _param, this.post.language);
			},
			onLocale() {
				uni.setNavigationBarTitle({
					title: this.$t('common.title'),
				});
			},
			fResetLocale() {
				fRemoveCurrentLocale();
				this.post.language = fGetCurrentLocale();
				this.onLocale();
			},
			languageChange(s) {
				this.post.language = s.detail.value;
				fSetCurrentLocale(this.post.language);
				this.onLocale();
			},
			async fetchData() {
				//alert('fetchData()');
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 */
				if (this.post.username.length < 3) {
					return showAlert(this.$t('common.cantLessChar', [this.$t('sign.username'), 3]));
				}
				if (this.post.password.length < 6) {
					return showAlert(this.$t('common.cantLessChar', [this.$t('sign.password'), 6]));
				}
				if (this.action === 'register' && this.post.password != this.password2) {
					return showAlert(this.$t('sign.passwordNotMatch'));
				}
				this.bLoading = true;
				try {
					const result = await postRequest('/' + this.action, this.post);
					navigateBack();
				} catch (errno) {
					console.log(errno);
				}
				this.bLoading = false;
			},
		}
	}
</script>
