import {
	useI18nStore,
} from "@/common/i18n.js";
const i18n = useI18nStore();

export function fGetTimeWithRand() {
	//返回一个29位的随机数字（前面13位是时间戳）
	const a = [];
	a.push(new Date().getTime().toString());
	a.push((Math.random() * Math.pow(10, 18)).toString().substring(0, 16));
	return a.join('');
};
export function fGetSesskey() {
	var sesskey = uni.getStorageSync('sesskey');
	if (sesskey) {
		return sesskey;
	}
	sesskey = fGetTimeWithRand();
	uni.setStorageSync('sesskey', sesskey);
	return sesskey;
};
export function showAlert(content) {
	return new Promise(function(success) {
		uni.showModal({
			title: i18n.fGetTransResult('common.alertTitle'),
			content,
			confirmText: i18n.fGetTransResult('common.alertOk'),
			showCancel: false,
			success
		});
	});
}
export function showConfirm(content) {
	return new Promise(function(success) {
		uni.showModal({
			title: i18n.fGetTransResult('common.confirmTitle'),
			content,
			cancelText: i18n.fGetTransResult('common.confirmCancel'),
			confirmText: i18n.fGetTransResult('common.confirmOk'),
			showCancel: true,
			success: (res) => {
				success(res.confirm);
			}
		});
	});
}
export function fGetCurPageRoute() {
	const aCurPages = getCurrentPages();
	const sCurPage = aCurPages[aCurPages.length - 1];
	return sCurPage.route;
}
export function fRequest(method, path, data) {
	return new Promise(function(resolve) {
		const header = {};
		header.Sesskey = fGetSesskey();
		const token = uni.getStorageSync('token');
		if (token) {
			header.Authorization = token;
		} else {
			// 未登录状态
			if (0 && fGetCurPageRoute() !== '/pages/public/sign') {
				// 当未登录时，不允许在非登录页面请求接口
				uni.navigateTo({
					url: '/pages/public/sign',
				});
				return resolve();
			}
		}
		const locale = i18n.fGetCurrentLocale();
		const url = `${window.config.api_url}${path}?locale=${locale}`;
		uni.request({
			url,
			data,
			header,
			method,
			success: async (res) => {
				//console.log(res);
				if (res.statusCode !== 200) {
					// 非200状态直接提示文本内容
					return resolve({
						code: res.statusCode,
						message: res.data,
					});
				}
				const mData = res.data;
				return resolve(mData);
			},
			fail: (mData) => {
				if (mData.errMsg) {
					mData.code = -1;
					mData.message = mData.errMsg;
					delete mData.errMsg;
				}
				return resolve(mData);
			}
		});
	});
};
export async function request(method, path, data) {
	uni.showLoading({
		title: i18n.fGetTransResult('common.loading'),
	});
	const mData = await fRequest(method, path, data);
	uni.hideLoading();
	if (mData.message) {
		if (mData.i18n && mData.i18n.param) {
			mData.message = i18n.fGetTransResult(mData.message, mData.i18n.param);
		}
		await showAlert(mData.message);
	}
	if (mData.statusCode === 401) {
		uni.navigateTo({
			url: '/pages/public/sign',
		});
		throw 401;
	}
	if (mData.code !== 0) {
		throw mData.code;
	}
	if (mData.result) {
		if (mData.result.token) {
			uni.setStorageSync('token', mData.result.token);
		}
		return mData.result;
	}
};
export function getRequest(path, data) {
	return request('GET', path, data);
};
export function postRequest(path, data) {
	return request('POST', path, data);
};
export function navigateBack() {
	// 通常在登录成功后返回操作页面
	const sCurPageRoute = fGetCurPageRoute();
	const aPages = getCurrentPages().filter((o) => o.route !== sCurPageRoute);
	var url = '/';
	if (aPages.length >= 1) {
		url = '/' + aPages[aPages.length - 1].route;
	}
	uni.reLaunch({
		url
	});
};