import img_click_power from "../assets/images/ClickerGame/MainClicker/click_power.png";
import img_click_crit_chance from "../assets/images/ClickerGame/MainClicker/click_crit_chance.png";

export const EXPIRATION_HOUR = new Date(Date.now() + 60 * 60 * 1000);
export const PLAYER_EXPIRATION = new Date(Date.now() + 60 * 60 * 1000 + 40);

export const upgradeImages = {
    plus_one: img_click_power,
    times_two: img_click_crit_chance,
};