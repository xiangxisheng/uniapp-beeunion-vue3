<template>
	<view>
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">{{$t('username')}}</view>
				<input class="uni-input" focus placeholder="" v-model="post.username" required />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">{{$t('password')}}</view>
				<input class="uni-input" type="password" placeholder="" v-model="post.password" required />
			</view>
			<view class="uni-form-item uni-column" v-if="action === 'register'">
				<view class="title">{{$t('confirmPassword')}}</view>
				<input class="uni-input" type="password" placeholder="" v-model="password2" required />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">Language / 语言选择</view>
				<radio-group class="uni-input" @change="languageChange">
					<label v-for="(item, index) in language.items" :key="item.value">
						<radio :value="item.value" :checked="item.value === language.current" />
						{{ item.title }}
					</label>
				</radio-group>
			</view>
			<view class="uni-padding-wrap uni-common-mt">
				<button type="primary" :disabled="bLoading" @click="fetchData()"
					v-if="action === 'login'">{{$t('login')}}</button>
				<button type="primary" :disabled="bLoading" @click="fetchData()"
					v-if="action === 'register'">{{$t('register')}}</button>
			</view>
			<view class="uni-padding-wrap uni-common-mt">
				<button @click="action = 'register'" v-if="action === 'login'">{{$t('register')}}</button>
				<button @click="action = 'login'" v-if="action === 'register'">{{$t('login')}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		inject
	} from 'vue';
	import {
		postRequest,
		navigateBack,
		showAlert,
	} from '@/common/request.js';
	import {
		fGetRadioItems,
	} from '@/common/i18n.js';
	export default {
		data() {
			return {
				bLoading: false,
				action: 'login',
				password2: '',
				post: {
					username: '',
					password: '',
				},
				language: {
					current: 'zh-CN',
					items: [],
				},
			}
		},
		async onLoad() {
			this.$t = inject('$t');
			this.language.items = fGetRadioItems();
		},
		onPullDownRefresh() {
			//下拉
			console.log("onPullDownRefresh");
			uni.stopPullDownRefresh();
		},
		methods: {
			async fetchData() {
				//alert('fetchData()');
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 */
				if (this.post.username.length < 3) {
					return showAlert(this.$t(['usernameCantLess', 3]));
				}
				if (this.post.password.length < 6) {
					return showAlert(this.$t(['passwordCantLess', 6]));
				}
				if (this.action === 'register' && this.post.password != this.password2) {
					return showAlert(this.$t('passwordNotMatch'));
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
			languageChange(s) {
				console.log(s)
			}
		}
	}
</script>
