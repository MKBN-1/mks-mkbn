// ==UserScript==
// @name         FR Knop klikken
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  FR Knop klikken. Belangrijk is dat de FR Knop aan staat
// @author       Barbarossa
// @match        https://www.meldkamerspel.com/missions/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const checkURLAndClickButton = () => {
        // Controleer of de huidige URL ongelijk is aan de doel-URL
        if (window.location.href === "https://www.meldkamerspel.com/missions/close") {
            return; // Stop het script als de URL overeenkomt
        }

        // Zoek de button met id="frrAlertButton"
        const button = document.getElementById('frrAlertButton');

        if (button) {
            button.click(); // Klik op de knop

            // Wacht tot de pagina opnieuw is geladen
            setTimeout(checkURLAndClickButton, 100); // Wacht 0,5 seconde en controleer opnieuw
        } else {
            // Wacht 0,1 seconden en probeer het opnieuw als de knop niet gevonden is
            setTimeout(checkURLAndClickButton, 100);
        }
    };

    // Start de functie
    checkURLAndClickButton();
})();
