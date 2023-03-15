<template>
	<view class="content">
		<view class="uni-form-item uni-column">
			<input class="uni-input" focus :placeholder="$t('customer.search')" v-model="search.name" @input="getList()" />
		</view>
		<uni-list>
			<uni-list-item showArrow clickable @click="navigate_detail_edit(item.id)" v-for="item of apiResData.items"
				:key="item.id" :customStyle="{ padding: '0' }">
				<template v-slot:header>
					<image src="/static/img/userHL.png" style="width: 120rpx; height: 120rpx"></image>
				</template>
				<template v-slot:body>
					<table cellspacing="0" cellpadding="0" class="table1">
						<tr>
							<td>
								<span>{{ item.name }}</span>
								<span style="padding-left:8rpx;color:#cccccc;font-size:20rpx;">ID:{{ item.id }}</span>
							</td>
						</tr>
						<tr>
							<td>
								<span v-if="item.phone">{{ item.phone }}</span>
							</td>
						</tr>
						<tr>
							<td>
								<span v-if="item.remark">{{ item.remark }}</span>
							</td>
						</tr>
					</table>
				</template>
			</uni-list-item>
		</uni-list>
		<button @click="navigate_detail_add(search.name)" v-if="search.name !== ''">{{$t('customer.newCustomer')}}
			"{{ search.name }}"</button>
	</view>
</template>
<script>
	import {
		fGetTransResult,
	} from "@/common/i18n.js";
	import {
		getRequest
	} from '@/common/request.js';
	import uniList from "@/components/uni-list/uni-list.vue";
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue";
	export default {
		data() {
			return {
				apiResData: {
					items: [],
					option: {}
				},
				search: {
					name: '',
				},
			};
		},
		components: {
			uniList,
			uniListItem,
		},
		async created() {
			uni.setNavigationBarTitle({
				title: this.$t('customer.myCustomer'),
			});
			await this.getList();
		},
		onNavigationBarButtonTap(e) {
			//新增按钮
			uni.navigateTo({
				url: 'detail?action=add'
			});
		},
		async onPullDownRefresh() {
			console.log("onPullDownRefresh");
			await this.getList();
			uni.stopPullDownRefresh();
		},
		methods: {
			$t(_formatpath, _param) {
				return fGetTransResult(_formatpath, _param);
			},
			async getList() {
				try {
					this.apiResData = await getRequest("/panel/front/customer/list", this.search);
				} catch (e) {

				}
			},
			navigate_detail_add(name) {
				uni.navigateTo({
					url: 'detail?action=add&name=' + name
				})
			},
			navigate_detail_edit(id) {
				uni.navigateTo({
					url: 'detail?action=edit&id=' + id
				})
			},
		},
	};
</script>
<style scoped>
	.table1 {
		margin: 8rpx 0;
	}

	.table1 td {
		font-size: 30rpx;
		line-height: 100%;
		height: 36rpx;
	}
</style>
