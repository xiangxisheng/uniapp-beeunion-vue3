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
			title: '提示',
			content,
			showCancel: false,
			success
		});
	});
}
export function showConfirm(content) {
	return new Promise(function(success) {
		uni.showModal({
			title: '提示',
			content,
			showCancel: true,
			success: (res) => {
				success(res.confirm);
			}
		});
	});
}
export function fRequest(method, path, data) {
	return new Promise(function(resolve, reject) {
		const header = {};
		header.Sesskey = fGetSesskey();
		const token = uni.getStorageSync('token');
		if (token) {
			header.Authorization = token;
		} else {
			uni.navigateTo({
				url: '/pages/public/sign',
			});
		}
		uni.request({
			url: 'http://5.28.39.4:9000/bee/api' + path,
			data,
			header,
			method,
			withCredentials: true,
			success: async (res) => {
				//console.log(res);
				const mData = res.data;
				if (mData.message) {
					await showAlert(mData.message);
				}
				if (res.statusCode === 401) {
					uni.navigateTo({
						url: '/pages/public/sign',
					});
					return reject(401);
				}
				if (mData.code !== 0) {
					return reject(mData.code);
				}
				if (mData.result) {
					if (mData.result.token) {
						uni.setStorageSync('token', mData.result.token);
					}
				}
				return resolve(mData.result);
			},
			fail: (mData) => {
				if (mData.errMsg) {
					uni.showToast({
						icon: 'none',
						title: mData.errMsg,
					});
				}
				return reject(mData);
			}
		});
	});
};
export async function request(method, path, data) {
	uni.showLoading({
		title: '加载中'
	});
	try {
		return await fRequest(method, path, data);
	} catch (e) {
		throw e;
	} finally {
		uni.hideLoading();
	}
};
export function getRequest(path, data) {
	return request('GET', path, data);
};
export function postRequest(path, data) {
	return request('POST', path, data);
};
export function navigateBack() {
	const aCurPages = getCurrentPages();
	const sCurPageRoute = aCurPages[aCurPages.length - 1].route;
	const aPages = getCurrentPages().filter((o) => o.route !== sCurPageRoute);
	var url = '/';
	if (aPages.length >= 1) {
		url = '/' + aPages[aPages.length - 1].route;
	}
	uni.reLaunch({
		url
	});
};
