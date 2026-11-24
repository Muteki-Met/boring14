// Testi. Inglese predefinito; per aggiungere una lingua copia il blocco `en`.
export const LANGS = { en: 'English', it: 'Italiano' };

const en = {
  locale: 'en-GB',
  habits: {
    drinks: ['No sugary drinks or alcohol', 'Water, sparkling with lime, coffee without sugar'],
    plate: ['Simple plate', 'Protein and veg first, carbs last'],
    walk: ['Walk after your meal', '10–15 min within half an hour of your main meal'],
    steps: ['Step goal', ''],
    circuit: ['Bodyweight circuit', '3 rounds, about 20–25 min'],
    wake: ['Same wake-up time', 'Daylight in the first half hour'],
    kitchen: ['Kitchen closed after dinner', 'Hungry? Water, wait 15 min, then yogurt or an egg'],
    waist: ['Measure your waist', 'Morning, relaxed belly, at the navel'],
  },
  tips: [
    'Day one: measure your waist, drop the sugary drinks and close the kitchen after dinner.',
    'Just count your steps today. Change nothing: this is your baseline.',
    'From today, 2,000 extra steps, the simple plate and your first circuit. Veg before carbs.',
    'Get off the bus one stop early or park far away. Steps add up.',
    'Circuit: lower slowly for 2–3 seconds, push up with control. It is not a race.',
    'Another 1,000 steps. Take your phone calls standing up.',
    'Halfway measurement. The scale lies, the tape measure much less.',
    'Circuit again. If push-ups are hard, put your hands on the sofa.',
    'Sleeping badly? Breathe in for 4, out for 6 to 8, for five minutes.',
    'Last step increase: another 1,000. Circuit today.',
    'No caffeine after early afternoon. Your sleep will thank you.',
    'Last circuit. If squats feel easy, try split squats.',
    'Almost there. Boring? Good, that means it works.',
    'Day 14: final measurement. Compare it with day one.',
  ],
  circuit: [
    ['Squats', 'Too easy? Split squats with your back foot on a chair.', ['Feet shoulder-width apart, toes slightly out.', 'Sit back and down as if onto a chair, chest up, thighs at least parallel.', 'Push through your heels to stand.']],
    ['Push-ups', 'Too hard? Hands on the sofa, a table or a wall.', ['Hands under your shoulders, body in one straight line.', 'Lower your chest towards the floor, elbows at about 45°.', 'Push back up without letting your hips sag.']],
    ['Alternating lunges', 'Reps are per leg.', ['Stand tall and step one foot forward.', 'Lower until both knees are at about 90°, back knee almost touching the floor.', 'Push off the front foot back to standing, then switch legs.']],
    ['Towel rows', 'Feet closer to the door makes it harder.', ['Loop a towel round the handle of a solid, closed door.', 'Hold both ends, feet near the door, lean back with straight arms.', 'Pull your chest to your hands, squeezing your shoulder blades.']],
    ['Plank', 'Start with 20 s, build to 40 s.', ['Forearms on the floor, elbows under your shoulders.', 'Lift your hips: head, back and heels in one line.', 'Hold and breathe slowly. Do not let your hips drop.']],
  ],
  cheer: ['One tick at a time.', 'Good start, keep going.', 'Almost there, don\'t stop now.', 'Perfect day. Repeat tomorrow.'],
  day: 'Day', of: 'of', today: 'Today', past: 'Past day', doneOf: '{a} of {b} done', toGo: '{n} days to go', finish: 'Finish line',
  steps: 'Steps', stepsUnit: 'steps', goal: 'Goal {n}', observe: 'Days 1–2: just count', goalHit: 'Goal reached', sync: 'Sync', manual: 'Enter',
  plan: 'Today\'s habits', note: 'Today\'s note',
  synced: '⌚ {n} steps synced', noClip: 'No steps on the clipboard. Run the Shortcut first.', dayDone: 'Day complete! 🔥',
  circuitT: 'Circuit', circuitToday: 'Your turn today', circuitNext: 'Next one: day {n}. Walk today.', circuitOver: 'Circuits done. Keep walking.',
  rounds: '3 rounds', roundsSub: '5 exercises, 90 s rest between rounds', rest: 'Rest', restSub: 'Breathe, have a sip of water.', skip: 'Skip',
  round: 'Round', restBtn: 'Rest 90 s, then round {n}', go: 'Round {n}, go! 💪', logCircuit: 'Mark as done', circuitDone: 'Circuit done ✓',
  measure: 'Measure', measureSub: 'Tape measure, not scale', start: 'Start', target: 'Target', now: 'Now', cm: 'cm',
  ratioNone: 'Add your first measurement to see waist to height.', ratioGood: 'Waist under half your height 👏', ratioHigh: 'Above 0.5: target {n} cm or less.',
  fromDay1: '{s}{n} cm since day 1', entries: 'Measurements', tapToAdd: 'Tap to add',
  howTo: 'In the morning, after the bathroom and before eating. Tape at the navel, belly relaxed, breathing normally.',
  settings: 'Settings', height: 'Height', language: 'Language', watch: 'Apple Watch and reminders', watchSub: 'Shortcuts guide',
  install: 'Add to Home Screen', installSub: 'How to install the app', reset: 'Start over', resetSub: 'Deletes the data on this phone',
  resetQ: 'Start over?', resetBody: 'This deletes all challenge data from this phone. It can\'t be undone.', del: 'Delete', cancel: 'Cancel', save: 'Save',
  progress: 'Progress', progressT: 'Every day counts,<br>even the boring ones.', spectrum: 'Your 14 colours', streak: 'In a row', complete: 'Complete', totalSteps: 'Steps',
  quote: 'You don\'t need something interesting.<br>You need 14 boring days.', back: 'Back',
  // tour
  next: 'Next', begin: 'Start today', ready: 'I’m in', heightPh: 'Your height in cm',
  t1: ['14 boring days.', 'Seven plain habits, two weeks, one tape measure. That\'s the whole plan.'],
  t2: ['Small, on purpose.', 'Nothing here is exciting. That\'s exactly why you\'ll still be doing it on day 14.'],
  t3: ['Yours only.', 'No account, no server, no tracking. Everything you log stays on this phone.'],
  t4: ['Put it on your Home Screen.', 'It opens full screen, works offline and keeps your data safe.'],
  t5: ['Last thing.', 'Your height sets the waist target: under half your height is the goal.'],
  iosSteps: ['Tap <b>Share</b> at the bottom of Safari', 'Scroll and tap <b>Add to Home Screen</b>', 'Tap <b>Add</b>, then open it from the Home Screen'],
  andSteps: ['Tap the <b>⋮</b> menu in Chrome', 'Tap <b>Install app</b> or <b>Add to Home screen</b>', 'Open it from your Home Screen'],
  installBtn: 'Install now', installed: 'Already installed ✓', iosSafari: 'On iPhone this only works in Safari.',
  medical: 'If you have diabetes, high blood pressure, take medication, are pregnant or have any health condition, talk to your doctor before changing your diet or activity.',
  guideT: 'Apple Watch and reminders',
  guide: `<p>Your Watch saves steps to the Health app. A Shortcut reads them and copies the number; then you tap <b>Sync</b> here. No server involved.</p>
    <h3>1. Create the "Boring 14 steps" Shortcut</h3>
    <ol><li>Open <b>Shortcuts</b> and tap <b>+</b>.</li>
    <li>Add <b>Find Health Samples</b>: Type is <b>Steps</b>, Start Date is <b>Today</b>, Group By <b>Day</b>.</li>
    <li>Add <b>Calculate Statistics</b>, set to <b>Sum</b>.</li>
    <li>Add <b>Round Number</b>.</li>
    <li>Add <b>Copy to Clipboard</b>.</li>
    <li>Add <b>Show Notification</b>: "Today [Rounded Number] steps. Open Boring 14 and tap Sync".</li></ol>
    <p class="muted">The first time, compare the number with the Health app.</p>
    <h3>2. Run it every evening</h3>
    <ol><li>Shortcuts, <b>Automation</b>, <b>+</b>, <b>Time of Day</b>: 21:30, daily.</li>
    <li>Choose <b>Run Immediately</b> and the "Boring 14 steps" Shortcut.</li></ol>
    <h3>3. Reminders (optional)</h3>
    <ol><li>More "Time of Day" automations with just <b>Show Notification</b>:</li>
    <li>13:45 "🚶 10 minute walk after lunch"</li><li>20:45 "🚶 Walk after dinner"</li><li>21:30 "🌙 Kitchen closed. Brush your teeth."</li></ol>`,
  food: 'Food', foodSub: 'Your hand is the measuring tool', plateT: 'The simple plate', veg: 'Veg', protein: 'Protein', carbs: 'Carbs', fat: 'Fat',
  portions: [['🖐️', 'Protein', '1–2 palms per meal', 'Eggs, chicken, fish, tuna, meat, plain yogurt'], ['✊✊', 'Vegetables', '2 fists, half the plate', 'Anything green or colourful. Seasonal is cheapest.'], ['✊', 'Carbs', '1 fist', 'Rice, beans, potatoes, bread'], ['👍', 'Fats', '1 thumb', 'Olive oil, nuts, cheese']],
  orderT: 'Same food, better order', orderB: 'Eat veg and protein first, carbs last. Many people get a gentler rise in blood sugar.',
  menuT: 'Your rotating menu', menuB: 'Pick two of each and repeat them for 14 days. Fewer choices, fewer slips.',
  meals: [['Breakfast', ['Eggs with bread and fruit', 'Yogurt with oats and fruit']], ['Lunch', ['Rice, beans, chicken and salad', 'Ground beef with vegetables and potatoes']], ['Dinner', ['Vegetable omelette', 'Fish with rice and salad']]],
  extras: [['💧', 'Drinks', 'Water by default. Sparkling with lime if you miss the fizz. Coffee and tea without sugar. Whole fruit yes, juice no.'], ['🌙', 'Hungry after dinner?', 'A glass of water, wait 15 minutes. Still hungry? Plain yogurt or a boiled egg.'], ['🛒', 'Cheap and good', 'Eggs, chicken, canned sardines, beans, seasonal vegetables, rice.'], ['⚠️', 'Skip the crash diet', 'Eating almost nothing backfires by evening. A moderate cut you can hold for two weeks wins.']],
  hello: ['Good morning,', 'Good afternoon,', 'Good evening,'],
  challenge: 'Challenge', app: 'App', privacy: 'Privacy',
  whenStart: 'When do you start?', startToday: 'Today', startTomorrow: 'Tomorrow', startPick: 'Pick a date', startDate: 'Start date',
  startsIn: 'Starts in', daysWord: 'days', dayWord: 'day', startsOn: 'Day 1 is {d}', getReady: 'Get ready',
  readyList: ['Get a tape measure if you do not have one.', 'Clear the sugary drinks out of the fridge.', 'Pick two breakfasts, two lunches and two dinners.', 'Choose your fixed wake-up time.'],
  startNow: 'Start today instead',
  video: 'Video', how: 'How to do it',
  androidNote: 'On Android, enter your steps by hand from your watch or Google Fit app. Automatic sync needs a native app.',
};

const it = {
  locale: 'it-IT',
  habits: {
    drinks: ['Niente bibite né alcol', 'Acqua, frizzante col lime, caffè senza zucchero'],
    plate: ['Piatto semplice', 'Proteine e verdure prima, carboidrati alla fine'],
    walk: ['Camminata dopo il pasto', '10–15 min entro mezz\'ora dal pasto principale'],
    steps: ['Obiettivo passi', ''],
    circuit: ['Circuito a corpo libero', '3 giri, circa 20–25 min'],
    wake: ['Sveglia sempre alla stessa ora', 'Luce naturale nella prima mezz\'ora'],
    kitchen: ['Cucina chiusa dopo cena', 'Fame? Acqua, aspetta 15 min, poi yogurt o uovo'],
    waist: ['Misura il girovita', 'Al mattino, pancia rilassata, all\'ombelico'],
  },
  tips: [
    'Si parte: misura il girovita, togli le bevande zuccherate e chiudi la cucina dopo cena.',
    'Oggi conta solo i passi. Non cambiare nulla: è il tuo punto di partenza.',
    'Da oggi +2000 passi, il piatto semplice e il primo circuito. Verdura prima dei carboidrati.',
    'Scendi dal bus una fermata prima o parcheggia lontano. I passi si accumulano.',
    'Circuito: scendi lento per 2–3 secondi, risali controllato. Non è una gara.',
    'Altri +1000 passi. Le telefonate falle in piedi.',
    'Misura di metà sfida. La bilancia mente, il metro molto meno.',
    'Di nuovo circuito. Se i piegamenti sono duri, appoggia le mani al divano.',
    'Dormi male? Inspira contando fino a 4, espira fino a 6–8, per cinque minuti.',
    'Ultimo aumento: +1000 passi. Circuito oggi.',
    'Caffeina solo fino al primo pomeriggio. Il sonno ringrazia.',
    'Ultimo circuito. Se gli squat sono facili, prova gli split squat.',
    'Quasi finito. Noioso? Bene, vuol dire che funziona.',
    'Giorno 14: misura finale. Confrontala con il giorno 1.',
  ],
  circuit: [
    ['Squat', 'Troppo facili? Split squat con il piede dietro su una sedia.', ['Piedi alla larghezza delle spalle, punte leggermente in fuori.', 'Scendi indietro come per sederti, petto alto, cosce almeno parallele.', 'Spingi sui talloni e torna in piedi.']],
    ['Piegamenti', 'Troppo duri? Mani sul divano, su un tavolo o al muro.', ['Mani sotto le spalle, corpo in linea retta.', 'Porta il petto verso il pavimento, gomiti a circa 45°.', 'Risali senza far cedere i fianchi.']],
    ['Affondi alternati', 'Le ripetizioni sono per gamba.', ['In piedi, dritto, fai un passo avanti.', 'Scendi finché entrambe le ginocchia sono a circa 90°, quella dietro sfiora il pavimento.', 'Spingi sul piede davanti, torna su e cambia gamba.']],
    ['Rematore con asciugamano', 'Piedi più vicini alla porta = più difficile.', ['Passa un asciugamano attorno alla maniglia di una porta solida e chiusa.', 'Tieni i due capi, piedi vicino alla porta, inclinati indietro a braccia tese.', 'Tira il petto verso le mani stringendo le scapole.']],
    ['Plank', 'Parti da 20 s, arriva a 40 s.', ['Avambracci a terra, gomiti sotto le spalle.', 'Solleva i fianchi: testa, schiena e talloni in linea.', 'Resta lì respirando piano. Non far cadere i fianchi.']],
  ],
  cheer: ['Una spunta alla volta.', 'Bell\'inizio, continua così.', 'Ci sei quasi, non mollare.', 'Giornata perfetta. Domani si ripete.'],
  day: 'Giorno', of: 'di', today: 'Oggi', past: 'Giorno passato', doneOf: '{a} di {b} fatte', toGo: 'mancano {n} giorni', finish: 'Traguardo',
  steps: 'Passi', stepsUnit: 'passi', goal: 'Obiettivo {n}', observe: 'Giorni 1–2: conta e basta', goalHit: 'Obiettivo raggiunto', sync: 'Sincronizza', manual: 'A mano',
  plan: 'Le abitudini di oggi', note: 'La nota di oggi',
  synced: '⌚ {n} passi sincronizzati', noClip: 'Negli appunti non ci sono passi. Esegui prima il Comando Rapido.', dayDone: 'Giornata completa! 🔥',
  circuitT: 'Circuito', circuitToday: 'Oggi tocca a te', circuitNext: 'Prossimo: giorno {n}. Oggi cammina.', circuitOver: 'Circuiti finiti. Continua a camminare.',
  rounds: '3 giri', roundsSub: '5 esercizi, 90 s di riposo tra un giro e l\'altro', rest: 'Riposo', restSub: 'Respira, bevi un sorso d\'acqua.', skip: 'Salta',
  round: 'Giro', restBtn: 'Riposo 90 s, poi giro {n}', go: 'Via col giro {n}! 💪', logCircuit: 'Segna come fatto', circuitDone: 'Circuito fatto ✓',
  measure: 'Misure', measureSub: 'Metro, non bilancia', start: 'Inizio', target: 'Obiettivo', now: 'Ora', cm: 'cm',
  ratioNone: 'Inserisci la prima misura per vedere il rapporto girovita/altezza.', ratioGood: 'Girovita sotto la metà dell\'altezza 👏', ratioHigh: 'Sopra 0,5: obiettivo {n} cm o meno.',
  fromDay1: '{s}{n} cm dal giorno 1', entries: 'Misurazioni', tapToAdd: 'Tocca per inserire',
  howTo: 'Al mattino, dopo il bagno e prima di mangiare. Metro all\'ombelico, pancia rilassata, respiro normale.',
  settings: 'Impostazioni', height: 'Altezza', language: 'Lingua', watch: 'Apple Watch e promemoria', watchSub: 'Guida Comandi Rapidi',
  install: 'Aggiungi alla Home', installSub: 'Come installare l\'app', reset: 'Ricomincia', resetSub: 'Cancella i dati da questo telefono',
  resetQ: 'Ricominciare?', resetBody: 'Cancella tutti i dati della sfida da questo telefono. Non si può annullare.', del: 'Cancella', cancel: 'Annulla', save: 'Salva',
  progress: 'Progressi', progressT: 'Ogni giorno conta,<br>anche quelli noiosi.', spectrum: 'I tuoi 14 colori', streak: 'Di fila', complete: 'Completi', totalSteps: 'Passi',
  quote: 'Non ti serve qualcosa di interessante.<br>Ti servono 14 giorni noiosi.', back: 'Indietro',
  next: 'Avanti', begin: 'Inizia oggi', ready: 'Ci sto', heightPh: 'La tua altezza in cm',
  t1: ['14 giorni noiosi.', 'Sette abitudini semplici, due settimane, un metro da sarta. Tutto qui.'],
  t2: ['Piccole, apposta.', 'Niente di eccitante. Proprio per questo il giorno 14 le starai ancora facendo.'],
  t3: ['Solo tue.', 'Nessun account, nessun server, nessun tracciamento. Tutto resta su questo telefono.'],
  t4: ['Mettila nella Home.', 'Si apre a schermo intero, funziona offline e tiene al sicuro i tuoi dati.'],
  t5: ['Ultima cosa.', 'L\'altezza serve per l\'obiettivo: girovita sotto la metà dell\'altezza.'],
  iosSteps: ['Tocca <b>Condividi</b> in basso in Safari', 'Scorri e tocca <b>Aggiungi alla schermata Home</b>', 'Tocca <b>Aggiungi</b> e aprila dalla Home'],
  andSteps: ['Tocca il menu <b>⋮</b> di Chrome', 'Tocca <b>Installa app</b> o <b>Aggiungi a schermata Home</b>', 'Aprila dalla schermata Home'],
  installBtn: 'Installa ora', installed: 'Già installata ✓', iosSafari: 'Su iPhone funziona solo da Safari.',
  medical: 'Se hai diabete, pressione alta, prendi farmaci, sei in gravidanza o hai altre condizioni di salute, parla con il medico prima di cambiare alimentazione o attività fisica.',
  guideT: 'Apple Watch e promemoria',
  guide: `<p>Il Watch salva i passi nell'app Salute. Un Comando Rapido li legge e copia il numero, poi qui tocchi <b>Sincronizza</b>. Nessun server.</p>
    <h3>1. Crea il comando "Passi Boring 14"</h3>
    <ol><li>Apri <b>Comandi Rapidi</b> e tocca <b>+</b>.</li>
    <li>Aggiungi <b>Trova campioni salute</b>: Tipo <b>Passi</b>, Data di inizio <b>Oggi</b>, Raggruppa per <b>Giorno</b>.</li>
    <li>Aggiungi <b>Calcola statistiche</b>, impostato su <b>Somma</b>.</li>
    <li>Aggiungi <b>Arrotonda numero</b>.</li>
    <li>Aggiungi <b>Copia negli appunti</b>.</li>
    <li>Aggiungi <b>Mostra notifica</b>: "Oggi [Numero arrotondato] passi. Apri Boring 14 e tocca Sincronizza".</li></ol>
    <p class="muted">La prima volta confronta il numero con l'app Salute.</p>
    <h3>2. Fallo partire ogni sera</h3>
    <ol><li>Comandi Rapidi, <b>Automazione</b>, <b>+</b>, <b>Ora del giorno</b>: 21:30, ogni giorno.</li>
    <li>Scegli <b>Esegui immediatamente</b> e il comando "Passi Boring 14".</li></ol>
    <h3>3. Promemoria (facoltativi)</h3>
    <ol><li>Altre automazioni "Ora del giorno" con solo <b>Mostra notifica</b>:</li>
    <li>13:45 "🚶 10 minuti di camminata dopo pranzo"</li><li>20:45 "🚶 Camminata dopo cena"</li><li>21:30 "🌙 Cucina chiusa. Lavati i denti."</li></ol>`,
  food: 'Cibo', foodSub: 'La tua mano è il misurino', plateT: 'Il piatto semplice', veg: 'Verdure', protein: 'Proteine', carbs: 'Carboidrati', fat: 'Grassi',
  portions: [['🖐️', 'Proteine', '1–2 palmi a pasto', 'Uova, pollo, pesce, tonno, carne, yogurt bianco'], ['✊✊', 'Verdure', '2 pugni, metà piatto', 'Tutto ciò che è verde o colorato. Di stagione costa meno.'], ['✊', 'Carboidrati', '1 pugno', 'Riso, legumi, patate, pane'], ['👍', 'Grassi', '1 pollice', 'Olio d’oliva, frutta secca, formaggio']],
  orderT: 'Stesso cibo, ordine migliore', orderB: 'Prima verdure e proteine, carboidrati alla fine. In molti la glicemia sale più dolcemente.',
  menuT: 'Il tuo menù a rotazione', menuB: 'Scegline due per tipo e ripetili per 14 giorni. Meno scelte, meno scivoloni.',
  meals: [['Colazione', ['Uova con pane e frutta', 'Yogurt con avena e frutta']], ['Pranzo', ['Riso, legumi, pollo e insalata', 'Macinato con verdure e patate']], ['Cena', ['Frittata di verdure', 'Pesce con riso e insalata']]],
  extras: [['💧', 'Da bere', 'Acqua di base. Frizzante col lime se ti mancano le bollicine. Caffè e tè senza zucchero. Frutta intera sì, succhi no.'], ['🌙', 'Fame dopo cena?', 'Un bicchiere d’acqua, aspetta 15 minuti. Ancora fame? Yogurt bianco o un uovo sodo.'], ['🛒', 'Economico e buono', 'Uova, pollo, sardine in scatola, legumi, verdure di stagione, riso.'], ['⚠️', 'Niente dieta lampo', 'Mangiare quasi niente si paga la sera. Meglio un taglio moderato che regge due settimane.']],
  hello: ['Buongiorno,', 'Buon pomeriggio,', 'Buonasera,'],
  challenge: 'Sfida', app: 'App', privacy: 'Privacy',
  whenStart: 'Quando inizi?', startToday: 'Oggi', startTomorrow: 'Domani', startPick: 'Scegli una data', startDate: 'Data di inizio',
  startsIn: 'Si parte tra', daysWord: 'giorni', dayWord: 'giorno', startsOn: 'Il giorno 1 è {d}', getReady: 'Preparati',
  readyList: ['Procurati un metro da sarta se non ce l’hai.', 'Togli le bevande zuccherate dal frigo.', 'Scegli due colazioni, due pranzi e due cene.', 'Decidi la tua ora fissa di sveglia.'],
  startNow: 'Inizia oggi invece',
  video: 'Video', how: 'Come si fa',
  androidNote: 'Su Android inserisci i passi a mano dall\'app dell\'orologio o da Google Fit. La sincronizzazione automatica richiede un\'app nativa.',
};

export const STR = { en, it };
export const detectLang = () => (navigator.language || 'en').toLowerCase().startsWith('it') ? 'it' : 'en';
