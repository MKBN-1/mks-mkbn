// ==UserScript==
// @name         Eigen meldingen vullen
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Voer het script uit in de actieve tab
// @author       Barbarossa
// @match        https://www.meldkamerspel.com/missions/*
// @resource     https://forum.leitstellenspiel.de/index.php?thread/23382-script-lehrgangszuweiser-by-bos-ernie/
// @downloadURL  https://update.greasyfork.org/scripts/461450/%2A%20Lehrgangszuweiser.user.js
// @updateURL    https://update.greasyfork.org/scripts/461450/%2A%20Lehrgangszuweiser.meta.js
// @grant        none
// ==/UserScript==

// Release Notes:
//
// Versie: 1.1.2
// Datum 2024-11-08
// - Gewijzigd: Bij credits boven de 50.000 wordt niet het eerste voertuig in de lijst gestuurd en dan de melding gedeeld maar altijd een DA van de brandweer.
//
// Versie: 1.1.1
// Datum: 2024-10-02
// - Toegevoegd: Als credits 12000 of hoger zijn, wordt het getal 1 naar de website gestuurd en wordt de alarmeren-knop geklikt. Aantal credits verhoogd naar 50000 ivm regelwijziging team per 1-11-2024
//
// Versie: 1.1
// Datum: 2024-10-18
// - Toegevoegd: Zoeken naar een <a> tag met id="easter-egg-link". Als deze wordt gevonden, wordt erop geklikt en "Eitje gevonden" in de console gelogd.
//
// Versie: 1.0.2
// Datum: 2024-10-02
// - Toegevoegd: Als credits 12000 of hoger zijn, wordt het getal 1 naar de website gestuurd en wordt de alarmeren-knop geklikt.
//
// Versie: 1.0.1
// Datum: 2024-10-01
// - Toegevoegd: Als creditsText "Alleen Ambulance" bevat, telt dit als credits < 12000 zodat het script gewoon verder kan.
//
// Versie: 1.0
// Datum: 2024-10-01
// - Pop-up met een OK-knop wordt automatisch geklikt als deze verschijnt.
// - Verbeterd logging door het verwijderen van overbodige variabelen in de console logs.
//
// Versie: 0.5
// Datum: 2024-09-30
// - Aantal credits wordt gecontroleerd bij het laden van de pagina.
// - Als credits < 12000, gaat het script verder met de normale functionaliteit.
// - Bij credits >= 12000 wordt een pop-up getoond met de melding "Volgens mij is dit een Team melding".
//
// Versie: 0.2
// Datum: 2024-09-24
// - Basisfunctionaliteit toegevoegd voor het automatiseren van meldingen in het spel.

(function() {
    'use strict';

    // Zoek naar een <a> tag met id="easter-egg-link"
    const easterEggLink = document.querySelector('a#easter-egg-link');

    // Controleer of de link bestaat
    if (easterEggLink) {
        //console.log('Eitje gevonden');
        easterEggLink.click(); // Klik op de link
    } else {
        //console.log('Geen eitje gevonden');
    }

    // Willekeurige pauze tussen 1000 en 2500 milliseconden
    const randomDelay = Math.floor(Math.random() * (983 - 800 + 1)) + 100;
    console.log(`Wachten voor ${randomDelay} milliseconden...`);

    // Start het script na de pauze
    setTimeout(checkCredits, randomDelay);

    // Functie om het aantal credits te controleren
    function checkCredits() {
        const creditsSpan = document.querySelector('#CreditsMissionheader');
        if (creditsSpan) {
            const creditsText = creditsSpan.textContent;
            //console.log('Credits tekst:', creditsText); // Log de gevonden credits tekst

            // Controleer of creditsText "Alleen Ambulance" bevat
            if (creditsText.includes("Alleen Ambulance")) {
                //console.log('Credits zijn "Alleen Ambulance". Voortzetten met het script.');
                executeScript(); // Voortzetten met het bestaande script
                return; // Stop verdere controle
            }

            const creditsMatch = creditsText.match(/~\s*([\d,.]+)\s*Credits/);
            if (creditsMatch && creditsMatch[1]) {
                const credits = parseInt(creditsMatch[1].replace('.', '').replace(',', ''), 10); // Verwijder punten en komma's
                //console.log('Gevonden credits:', credits);

                // Controleer of het aantal credits kleiner is dan 50000
                if (credits < 50000) {
                    //console.log('Credits zijn minder dan 50000. Voortzetten met het script.');
                    executeScript(); // Voortzetten met het bestaande script
                } else {
                    // Stuur het getal 1 naar de website
                    //console.log('Credits zijn 50000 of hoger. Getal 1 wordt verzonden.');
                    sendNumberAndProceed(1); // Stuur het getal 1 en ga verder
                }
            } else {
                console.error('Geen geldig aantal credits gevonden.');
            }
        } else {
            console.error('Geen <span> element met id="CreditsMissionheader" gevonden.');
        }
    }

    // Functie om het getal naar de website te sturen en de knop te klikken
    function sendNumberAndProceed(number) {
        // Simuleer het verzenden van het getal
        //console.log(`Verzend getal: ${number}`);

        // Simuleer het indrukken van de toetsen Control + Option + D
        const event = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'd',
            code: 'KeyD',
            keyCode: 68, // ASCII voor 'D' is 68
            ctrlKey: true,
            altKey: true
        });
        document.dispatchEvent(event);

        // Wacht een halve seconde
        setTimeout(() => {
            // Klik op de alarmeren-knop
            const alertNextButton = document.querySelector('a.btn.btn-success.btn-sm.alert_next_alliance');
            if (alertNextButton) {
                //console.log('Alarmeren-knop gevonden. Klikken...');
                alertNextButton.click(); // Klik op de knop
            } else {
                //console.error('Geen Alarmeren-knop gevonden.');
            }
        }, 500); // Wacht 500 ms
    }

    // Functie om reguliere expressies af te handelen
    function extractData(href, regex) {
        const match = href.match(regex);
        return match && match[1] ? match[1] : null;
    }

    // Functie om het script uit te voeren
    function executeScript() {
        //console.log('Script wordt uitgevoerd.');

        // Zoek naar de eerste <a> tag met href die begint met "/einsaetze/"
        const link = document.querySelector('a[href^="/einsaetze/"]');

        // Controleer of de link bestaat
        if (link) {
            //console.log('Link gevonden:');

            // Verkrijg de href-waarde
            const href = link.getAttribute('href');
            //console.log('Href-waarde:', href);

            // Verkrijg mission_id en overlay_index
            const missionIdEinsatz = extractData(href, /\/einsaetze\/(\d+)(?=\?)/)?.padStart(4, '0') || '';
            const missionIdParam = extractData(href, /mission_id=(\d+)/) || '';
            const overlayIndex = extractData(href, /overlay_index=(\d+)/) || '';

            if (missionIdEinsatz) {
                //console.log('Gevonden mission_id (einsaetze, opgevuld):', missionIdEinsatz);
            } else {
                console.error('Geen mission_id gevonden tussen /einsaetze/ en ?.');
            }

            if (missionIdParam) {
                //console.log('Gevonden mission_id (parameter):', missionIdParam);
            } else {
                console.error('Geen mission_id gevonden na mission_id=.');
            }

            if (overlayIndex) {
                //console.log('Gevonden overlay_index:', overlayIndex);
            } else {
                //console.error('Geen overlay_index gevonden.');
            }

            // Combineer missionIdEinsatz en overlayIndex met een '-'
            const combinedResult = (missionIdEinsatz && overlayIndex) ? `${missionIdEinsatz}-${overlayIndex}` : missionIdEinsatz;

            // Zoek naar de <a> tag met href="#aao_category_24526" en klik erop
            const inzettenLink = document.querySelector('a[href="#aao_category_24526"]');
            if (inzettenLink) {
                //console.log('Inzetten link gevonden. Klikken...');
                inzettenLink.click();  // Klik op de gevonden link
                checkLabels(combinedResult, missionIdParam);
            } else {
                console.error('Inzetten link niet gevonden.');
            }
        } else {
            console.error('Geen <a> tag met href="/einsaetze/" gevonden.');
        }
    }

    // Functie om te controleren op label-danger of label-success
    function checkLabels(combinedResult, missionIdParam) {
        setTimeout(() => {
            const resultLink = document.querySelector(`a[search_attribute="${combinedResult}"]`);
            if (resultLink) {
                //console.log('Link met search_attribute gevonden:');

                const spanElement = resultLink.querySelector('span');
                if (spanElement) {
                    if (spanElement.classList.contains('label-success')) {
                        resultLink.click(); // Klik op de link met label-success

                        // Wacht 500 ms om de dialoog te laten verschijnen en klik op de OK-knop als deze bestaat
                        setTimeout(() => {
                            // Zoek naar een dialog of modaal element dat mogelijk is verschenen
                            const okButton = document.querySelector('dialog button.btn-primary, .modal button.btn-primary'); // Voeg de juiste class of ID toe indien nodig

                            if (okButton) {
                                okButton.click(); // Klik op de OK-knop
                             //console.log('OK-Knop geklikt!!');
                            }
                            //console.log('Geen OK-knop gevonden!');
                            proceedToNext(); // Ga verder met de volgende stap
                        }, 500); // Pas de wachttijd aan indien nodig
                    }
                    else if (spanElement.classList.contains('label-danger')) {
                        //console.log('Link bevat label-danger. Klikken op de link met missing vehicles...');

                        const searchTerm = `/${missionIdParam}/missing_vehicles`;
                        const missingVehiclesLink = Array.from(document.querySelectorAll('a[href*="/missions/"]')).find(a => a.href.includes(searchTerm));
                        if (missingVehiclesLink) {
                            //console.log('Link met missing vehicles gevonden. Klikken...');
                            missingVehiclesLink.click(); // Klik op de link

                            // Wacht tot de pagina is geladen en controleer opnieuw op labels
                            checkLabels(combinedResult, missionIdParam); // Roep de functie opnieuw aan
                        } else {
                            //console.error('Geen link gevonden met', searchTerm);
                        }
                    } else {
                        //console.log('Link bevat geen label-danger of label-success.');
                    }
                } else {
                    console.error('Geen <span> element gevonden in de link.');
                }
            } else {
                console.error('Geen link gevonden met search_attribute=', combinedResult);
            }
        }, 1000); // Wacht 1 seconde om de pagina tijd te geven om te laden
    }

    // Functie om door te gaan naar de volgende stap
    function proceedToNext() {
        setTimeout(() => {
            const alertNextButton = document.querySelector('a.btn-success.alert_next');
            if (alertNextButton) {
                //console.log('Alarmeren en volgende button gevonden. Klikken...');
                alertNextButton.click(); // Klik op de button
            } else {
                console.error('Geen Alarmeren en volgende button gevonden.');
            }
        }, 1000); // Wacht 1 seconde om de pagina tijd te geven om te laden
    }

})();
