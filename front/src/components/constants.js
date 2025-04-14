import img_double_click_power from "../assets/images/ClickerGame/MainClicker/double_click_power.png";
import img_critical_click from "../assets/images/ClickerGame/MainClicker/critical_click.png";

export const EXPIRATION_HOUR = new Date(Date.now() + 60 * 60 * 1000);
export const PLAYER_EXPIRATION = new Date(Date.now() + 60 * 60 * 1000 + 40);

export const upgradeImages = {
    double_click_power: img_double_click_power,
    critical_click: img_critical_click,
};