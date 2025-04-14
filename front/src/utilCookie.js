import Cookies from "universal-cookie";

const cookie = new Cookies();

export const setCookie = (key, value, expires) => {
    cookie.set(key, JSON.stringify(value), {
        expires,
        path: "/",
    });
};

export const getCookie = (key) => {
    const val = cookie.get(key);
    try {
        return JSON.parse(val);
    } catch {
        return val;
    }
};

export const removeCookie = (key) => {
    cookie.remove(key, { path: "/" });
};

export const clearAllCookies = () => {
    removeCookie("user");
    removeCookie("player");
    removeCookie("customer");
};

