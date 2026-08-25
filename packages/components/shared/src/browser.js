const testUserAgent = regexp => regexp.test(navigator.userAgent);
export const isSafari = testUserAgent(/^((?!chrome|android).)*safari/i);
//# sourceMappingURL=browser.js.map
