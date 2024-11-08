// ==UserScript==
// @name         Meldkamerspel - Toon inzet- en indexnummer op pagina
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Zoek inzet- en indexnummer en combineer ze, dan weergeef op de pagina
// @author       Barbarossa
// @match        https://www.meldkamerspel.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Functie om een bericht weer te geven in de mission_general_info
    function displayMessageInMissionInfo(message) {
        // Zoek het element met de id mission_general_info
        let missionInfoElement = document.getElementById('mission_general_info');

        if (missionInfoElement && message) { // Controleer of er een bericht is om weer te geven
            // Maak een nieuw span-element voor het bericht
            let messageSpan = document.createElement('span');
            messageSpan.textContent = message;
            messageSpan.className = 'label label-success'; // Voeg class 'label label-success' toe

            // Voeg het bericht toe aan het missionInfoElement
            missionInfoElement.appendChild(messageSpan);
        }
    }

    // Functie om het inzetnummer aan te vullen tot 4 karakters
    function padInzetnummer(num) {
        return num.padStart(4, '0'); // Vul het nummer aan met nullen aan de voorkant tot het 4 karakters heeft
    }

    // Zoek naar het inzetnummer
    let inzetnummerMatch = document.documentElement.outerHTML.match(/<a href="\/einsaetze\/(.*?)\?/);
    if (inzetnummerMatch) {
        let capturedInzetnummer = inzetnummerMatch[1];

        // Vul het inzetnummer aan met nullen als het minder dan 4 cijfers heeft
        let paddedInzetnummer = padInzetnummer(capturedInzetnummer);

        // Zoek naar het indexnummer
        let pageSource = document.documentElement.outerHTML;
        let indexnummerMatch = pageSource.match(/overlay_index=(\d+)/);
        let capturedIndexnummer = indexnummerMatch ? indexnummerMatch[1] : null;

        // Combineer de nummers
        let CombiInzetNummer = capturedIndexnummer ? `${paddedInzetnummer}-${capturedIndexnummer}` : paddedInzetnummer;

        // Weergeef het gecombineerde nummer in de mission_general_info
        displayMessageInMissionInfo(CombiInzetNummer); // Toon alleen het gecombineerde nummer
    }
})();
