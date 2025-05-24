import {DEFAULT_MESSAGE} from "../constants/constants";

export function getRandomMessage(items: string[] = DEFAULT_MESSAGE): string {
    return items[Math.floor(Math.random()*items.length)];
}