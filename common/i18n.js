import en_US from '@/common/i18n/en-US.json';
import zh_CN from '@/common/i18n/zh-CN.json';
import km_KH from '@/common/i18n/km-KH.json';
const mLang = {
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
export function fGetLanguageItems() {
	const arr = [];
	for (const k in mLang) {
		const row = mLang[k];
		arr.push({
			value: k,
			title: row.title
		});
	}
	return arr;
}

function replaceAll(s0, s1, s2) {
	return s0.replace(new RegExp(s1, "gm"), s2);
}

function fGetFormatString(format, vals) {
	if (typeof(vals) === 'string') {
		return format;
	}
	if (typeof(vals) === 'object') {
		vals.shift();
		var out = format;
		for (const k in vals) {
			console.log(out);
			out = replaceAll(out, '\\{' + k + '\\}', vals[k]);
		}
		return out;
	}
	return '-';
}
export function fGetTransResult(vals, group) {
	const sKey = typeof(vals) === 'string' ? vals : vals[0];
	const locale = fGetCurrentLocale();
	if (!mLang.hasOwnProperty(locale)) {
		return '-';
	}
	const lang = mLang[locale].lang;
	if (group) {
		if (lang.hasOwnProperty(group) && lang[group].hasOwnProperty(sKey)) {
			return fGetFormatString(lang[group][sKey], vals);
		}
	}
	group = 'common';
	if (lang.hasOwnProperty(group) && lang[group].hasOwnProperty(sKey)) {
		return fGetFormatString(lang[group][sKey], vals);
	}
	return sKey;
}
export function fGetCurrentLocale() {
	const locale = uni.getStorageSync('locale');
	if (locale) {
		return locale;
	}
	for (const k in mLang) {
		return k;
	}
}
export function fSetCurrentLocale(val) {
	uni.setStorageSync('locale', val);
}
