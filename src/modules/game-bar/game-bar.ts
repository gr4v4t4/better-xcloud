import { CE, createSvgIcon } from "@utils/html";
import { ScreenshotAction } from "./action-screenshot";
import { TouchControlAction } from "./action-touch-control";
import { BxEvent } from "@utils/bx-event";
import { BxIcon } from "@utils/bx-icon";
import type { BaseGameBarAction } from "./action-base";
import { STATES } from "@utils/global";
import { PrefKey, getPref } from "@utils/preferences";


export class GameBar {
    static readonly #VISIBLE_DURATION = 2000;
    static #timeout: number | null;

    static #$gameBar: HTMLElement;
    static #$container: HTMLElement;

    static #$actions: BaseGameBarAction[] = [];

    static #beginHideTimeout() {
        GameBar.#clearHideTimeout();

        GameBar.#timeout = window.setTimeout(() => {
                GameBar.#timeout = null;
                GameBar.hideBar();
            }, GameBar.#VISIBLE_DURATION);
    }

    static #clearHideTimeout() {
        GameBar.#timeout && clearTimeout(GameBar.#timeout);
        GameBar.#timeout = null;
    }

    static enable() {
        GameBar.#$gameBar && GameBar.#$gameBar.classList.remove('bx-gone');
    }

    static disable() {
        GameBar.#$gameBar && GameBar.#$gameBar.classList.add('bx-gone');
        GameBar.hideBar();
    }

    static showBar() {
        if (!GameBar.#$container) {
            return;
        }

        GameBar.#$container.classList.remove('bx-offscreen', 'bx-hide');
        GameBar.#$container.classList.add('bx-show');

        GameBar.#beginHideTimeout();
    }

    static hideBar() {
        if (!GameBar.#$container) {
            return;
        }

        GameBar.#$container.classList.remove('bx-show');
        GameBar.#$container.classList.add('bx-hide');
    }

    // Reset all states
    static reset() {
        for (const action of GameBar.#$actions) {
            action.reset();
        }
    }

    static setup() {
        let $container;
        const $gameBar = CE('div', {id: 'bx-game-bar', class: 'bx-gone'},
                $container = CE('div', {class: 'bx-game-bar-container bx-offscreen'}),
                createSvgIcon(BxIcon.CARET_RIGHT),
            );

        GameBar.#$actions = [
            new ScreenshotAction(),
            ...(STATES.hasTouchSupport && (getPref(PrefKey.STREAM_TOUCH_CONTROLLER) !== 'off') ? [new TouchControlAction()] : []),
        ];

        for (const action of GameBar.#$actions) {
            $container.appendChild(action.render());
        }

        // Toggle game bar when clicking on the game bar box
        $gameBar.addEventListener('click', e => {
            if (e.target === $gameBar) {
                if ($container.classList.contains('bx-show')) {
                    GameBar.hideBar();
                } else {
                    GameBar.showBar();
                }
            }
        });

        // Hide game bar after clicking on an action
        window.addEventListener(BxEvent.GAME_BAR_ACTION_ACTIVATED, GameBar.hideBar);

        $container.addEventListener('pointerover', GameBar.#clearHideTimeout);
        $container.addEventListener('pointerout', GameBar.#beginHideTimeout);

        // Add animation when hiding game bar
        $container.addEventListener('transitionend', e => {
            const classList = $container.classList;
            if (classList.contains('bx-hide')) {
                classList.remove('bx-offscreen', 'bx-hide');
                classList.add('bx-offscreen');
            }
        });

        document.documentElement.appendChild($gameBar);
        GameBar.#$gameBar = $gameBar;
        GameBar.#$container = $container;
    }
}