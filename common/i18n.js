import pages from '@/pages.json';
import * as Pinia from 'pinia';

export function fSetCurrentLocale(val) {
	// 设置语言
	uni.setStorageSync('locale', val);
}

export function fRemoveCurrentLocale() {
	// 恢复默认语言
	uni.removeStorageSync('locale');
}

const storage = (key, object) => {
	let data = (() => {
		const str = object.getItem(key);
		if (str === null || typeof(str) !== 'string' || str === '') {
			return {};
		}
		try {
			return JSON.parse(str);
		} catch (e) {}
		return {};
	})();
	return {
		set(name, value) {
			data[name] = value;
		},
		del(name) {
			delete data[name];
		},
		has(name) {
			return data.hasOwnProperty(name);
		},
		get(name) {
			return data[name];
		},
		save() {
			object.setItem(key, JSON.stringify(data));
		},
		clear() {
			object.removeItem(key);
		},
	};
};

const oI18nState = storage('i18n', sessionStorage);

function formatLocale(str) {
	return str.toLowerCase().replace('-', '_');
}

function fGetLocaleMap(aLocales) {
	const mRet = {};
	for (const mLocaleOne of aLocales) {
		mRet[mLocaleOne.name] = mLocaleOne;
	}
	return mRet;
}

function fGetLangMap(mLocaleMap) {
	const mRet = {};
	for (const sLocale in mLocaleMap) {
		const sLang = sLocale.split('_')[0];
		mRet[sLang] = mLocaleMap[sLocale];
	}
	return mRet;
}

function replaceAll(s0, s1, s2) {
	return s0.replace(new RegExp(s1, "gm"), s2);
}

function fGetFormatString(sFormatValue, aParam) {
	if (aParam) {
		var out = sFormatValue;
		for (const k in aParam) {
			out = replaceAll(out, '\\{' + k + '\\}', aParam[k]);
		}
		return out;
	}
	return sFormatValue;
}

export const useI18nStore = Pinia.defineStore('i18n', {
	state: () => {
		return {
			locale: '',
			mConfLocale: {},
			mCacheData: {},
		}
	},
	actions: {
		async fGetI18nData(locale) {
			if (this.mCacheData.hasOwnProperty(locale)) {
				return;
			}
			const jsonPath = `${window.config.api_url}/locale/${locale}.json`;
			this.mCacheData[locale] = await (await fetch(jsonPath)).json();
		},
		async fTransTabBar() {
			// 为tabBar重新加载语言
			if (0 && pages.globalStyle) {
				if (pages.globalStyle.navigationBarTitleText) {
					const title = this.fGetTransResult(pages.globalStyle.navigationBarTitleText);
					pages.globalStyle.navigationBarTitleText = title;
				}
			}
			if (pages.tabBar && pages.tabBar.list) {
				for (const index in pages.tabBar.list) {
					const item = pages.tabBar.list[index];
					const tabBarOptions = {
						index: parseFloat(index),
						text: this.fGetTransResult(item.text),
					}
					console.log(tabBarOptions)
					uni.setTabBarItem(tabBarOptions);
				}
			}
		},
		async fLoadData() {
			// 这是页面加载后的入口，用于加载默认语言包
			this.mConfLocale = fGetLocaleMap(window.config.setting.i18n_locales);
			// 首先取得与当前浏览器最匹配的语言
			const locale = this.locale = this.fGetCurrentLocale();
			// 然后加载这个语言包
			await this.fGetI18nData(locale);
		},
		fGetCurrentLocale() {
			const mLocale = this.mConfLocale;
			if (mLocale === undefined) {
				mLocale = mConfLocale;
			}
			// locale = lang code(iso639) + country code(iso3166)
			const locale = oI18nState.get('locale');
			if (locale && mLocale.hasOwnProperty(locale)) {
				return locale;
			}
			const navLang = navigator.language || navigator.userLanguage;
			// 1：首先尝试匹配完整的locale
			const LocaleFormatted = formatLocale(navLang);
			if (mLocale.hasOwnProperty(LocaleFormatted)) {
				return LocaleFormatted;
			}
			const locale0 = navLang.split('-')[0];
			// 2：如果完整的匹配不到的情况下可以只匹配lang
			const mLangMap = fGetLangMap(mLocale);
			if (mLangMap.hasOwnProperty(locale0)) {
				return mLangMap[locale0].name;
			}
			// 3：都匹配不到的情况下随便选一个
			for (const k in mLocale) {
				return k;
			}
		},
		fGetTransResult(sFormatPath, aParam) {
			if (sFormatPath === null) {
				return sFormatPath;
			}
			if (typeof(sFormatPath) !== 'string') {
				// 只处理[数据类型]为[字符串]，其他类型直接返回，例如：数字型和逻辑型
				return sFormatPath;
			}
			const locale = this.fGetCurrentLocale();
			if (!locale) {
				// 没有匹配到语言包
				return sFormatPath;
			}
			if (!this.mCacheData.hasOwnProperty(locale)) {
				// 该语言包尚未加载完成
				return sFormatPath;
			}
			const aFormatPath = sFormatPath.split('.');
			const i18nDataByGroupName = this.mCacheData[locale];
			if (!i18nDataByGroupName.hasOwnProperty(aFormatPath[0])) {
				// 匹配不到语言组的情况下，直接对字符串进行处理
				return fGetFormatString(sFormatPath, aParam);
			}
			const i18nDataByFormatKey = i18nDataByGroupName[aFormatPath[0]];
			if (!i18nDataByFormatKey.hasOwnProperty(aFormatPath[1])) {
				// 匹配不到语言项的情况下，直接对字符串进行处理
				return fGetFormatString(sFormatPath, aParam);
			}
			const sFormatValue = i18nDataByFormatKey[aFormatPath[1]];
			return fGetFormatString(sFormatValue, aParam);
		},
		async fSetCurrentLocale(locale) {
			// 设置语言
			await this.fGetI18nData(locale);
			oI18nState.set('locale', locale);
			oI18nState.save();
			this.locale = locale;
		},
		fRemoveCurrentLocale() {
			// 恢复默认语言
			oI18nState.del('locale');
			oI18nState.save();
		},
		fGetLocales() {
			return window.config.setting.i18n_locales;
		},
	}
});