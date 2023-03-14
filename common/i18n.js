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

function fGetFormatString(sFormat, aParam) {
	if (aParam) {
		var out = sFormat;
		for (const k in aParam) {
			console.log(out);
			out = replaceAll(out, '\\{' + k + '\\}', aParam[k]);
		}
		return out;
	}
	return sFormat;
}
export function fGetTransResult(sKey, aParam, sGroup) {
	const locale = fGetCurrentLocale();
	if (!mLang.hasOwnProperty(locale)) {
		return '-';
	}
	const lang = mLang[locale].lang;
	if (sGroup) {
		if (lang.hasOwnProperty(sGroup) && lang[sGroup].hasOwnProperty(sKey)) {
			return fGetFormatString(lang[sGroup][sKey], aParam);
		}
	}
	sGroup = 'common';
	if (lang.hasOwnProperty(sGroup) && lang[sGroup].hasOwnProperty(sKey)) {
		return fGetFormatString(lang[sGroup][sKey], aParam);
	}
	return sKey;
}
export function fGetCurrentLocale() {
	// locale = lang code(iso639) + country code(iso3166)
	const locale = uni.getStorageSync('locale');
	if (locale && mLang.hasOwnProperty(locale)) {
		return locale;
	}
	var navLang = navigator.language || navigator.userLanguage;
	if (mLang.hasOwnProperty(navLang)) {
		return navLang;
	}
	const locale0 = navLang.split('-')[0];
	if (locale0 === 'en') {
		navLang = 'en-US';
	}
	if (locale0 === 'km') {
		navLang = 'km-KH';
	}
	if (locale0 === 'zh') {
		navLang = 'zh-CN';
	}
	if (mLang.hasOwnProperty(navLang)) {
		return navLang;
	}
	for (const k in mLang) {
		return k;
	}
}
export function fSetCurrentLocale(val) {
	uni.setStorageSync('locale', val);
}
export function fRemoveCurrentLocale() {
	uni.removeStorageSync('locale');
}
