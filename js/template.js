/** Returns the mobile controls instruction markup.
 * @returns {string} HTML fragment for touch controls.
 */
export function mobileInstructionsTemp() {
    return /*html*/ `
        <p><strong>Links</strong><img src="./assets/icons/chevron-double-left.svg" alt="Links" style="width:30px;" /></p>
            <p><strong>Rechts</strong><img src="./assets/icons/chevron-double-right.svg" alt="Rechts" style="width:30px;" /></p>
            <p><strong>Sprung</strong><img src="./assets/icons/chevron-double-up.svg" alt="Sprung" style="width:30px;" /></p>
            <p><strong>Werfen</strong><img src="./assets/icons/clipart1871127.png" alt="Werfen" style="width:30px;" /></p>
    `;
}

/** Returns the desktop controls instruction markup.
 * @returns {string} HTML fragment for keyboard controls.
 */
export function instructionsTemp() {
    return /*html*/ `
        <p><strong>Links</strong><img src="./assets/icons/arrow-left-square.svg" alt="Pfeiltaste Links" /></p>
            <p><strong>Rechts</strong><img src="./assets/icons/arrow-right-square.svg" alt="Pfeiltaste Rechts" /></p>
            <p><strong>Sprung</strong><img src="./assets/icons/arrow-up-square.svg" alt="Pfeiltaste Oben" /></p>
            <p><strong>Werfen</strong><img src="./assets/icons/spacebar-svgrepo-com.svg" alt="Space Taste" /></p>
    `;
}
