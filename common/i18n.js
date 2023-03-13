import en_US from '@/common/i18n/en-US.json';
import zh_CN from '@/common/i18n/zh-CN.json';
import km_KH from '@/common/i18n/km-KH.json';
const lang = {
	'en-US': {
		title: 'English',
		lang: en_US,
	},
	'zh-CN': {
		title: '简体中文',
		lang: zh_CN,
	},
	'km-KH': {
		title: 'ខ្មែរ',
		lang: km_KH,
	},
};
export function fGetRadioItems() {
	const arr = [];
	for (const k in lang) {
		const row = lang[k];
		arr.push({
			value: k,
			title: row.title
		});
	}
	return arr;
}
export function t(key) {
	const locale = 'en-US';
	return lang[locale].lang[key];
}
export function fGetVueI18nConfig() {
	const i18nConfig = {
		locale: 'en-US',
		messages: {},
	};
	const locale = uni.getStorageSync('locale');
	if (locale) {
		i18nConfig.locale = locale;
	}
	for (const k in lang) {
		i18nConfig.messages[k] = './common/i18n/' + k + '.json';
	}
	return i18nConfig;
}
