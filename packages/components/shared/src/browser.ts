const testUserAgent = (regexp: RegExp): boolean => regexp.test(navigator.userAgent);

export const isSafari = testUserAgent(/^((?!chrome|android).)*safari/i);
