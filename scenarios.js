const SCENARIOS = [
  {
    "id": "S01",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "Tom",
      "melden",
      "needsMonitoring"
    ],
    "title": "Tom ruft die Lösung hinein",
    "scene": "Tom ruft die Lösung laut in die Klasse, bevor andere reagieren können. Mehrere schauen irritiert zu ihm.",
    "answers": [
      {
        "delta": 1,
        "text": "Du beschreibst kurz das konkrete Verhalten und vereinbarst mit Tom ein Meldesignal für die nächsten Aufgaben.",
        "feedback": "Tom bekommt ein nachvollziehbares Ziel und bleibt beteiligt; die Interaktion wird nicht öffentlich eskaliert."
      },
      {
        "delta": 0,
        "text": "Du machst mit der Aufgabe weiter und beobachtest, ob es noch einmal passiert.",
        "feedback": "Der Unterricht läuft weiter, aber die Störung ist nicht bearbeitet und kann jederzeit erneut auftreten."
      },
      {
        "delta": -1,
        "text": "Du sagst vor der Klasse, dass Tom immer alles kaputt macht.",
        "feedback": "Tom wird als Problemträger markiert; die Beziehung verschlechtert sich und weitere Provokation wird wahrscheinlicher."
      }
    ]
  },
  {
    "id": "S02",
    "type": "Classroom Management",
    "focus": [
      "Regel melden"
    ],
    "title": "Melderegel wird übergangen",
    "scene": "Mehrere Schüler*innen rufen gleichzeitig Antworten hinein. Die Gesprächsstruktur kippt kurz.",
    "answers": [
      {
        "delta": 1,
        "text": "Du verweist knapp auf die vereinbarte Melderegel und gibst danach einer gemeldeten Person das Wort.",
        "feedback": "Die Regel wird aktiviert, ohne die Klasse lange zu unterbrechen."
      },
      {
        "delta": 0,
        "text": "Du nimmst eine der hineingerufenen Antworten auf und formulierst daraus die nächste Frage.",
        "feedback": "Inhaltlich geht es weiter, aber das ungeordnete Reinrufen bleibt als Muster bestehen."
      },
      {
        "delta": -1,
        "text": "Du drohst der ganzen Klasse mit Strafarbeit, wenn noch jemand ruft.",
        "feedback": "Die Reaktion ist pauschal und verschiebt das Problem in Richtung Machtkampf."
      }
    ]
  },
  {
    "id": "S03",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "Niklas",
      "handy",
      "blindspot"
    ],
    "title": "Niklas versteckt das Handy",
    "scene": "Niklas schaut wiederholt unter den Tisch. Aus deiner Position ist das nur schwer zu sehen.",
    "answers": [
      {
        "delta": 1,
        "text": "Du klärst nach der Phase mit Niklas, welches Ziel beim Handyverhalten gilt und welche Selbstkontrolle ihm hilft.",
        "feedback": "Das Verhalten wird konkret bearbeitet und Niklas wird in die Veränderung einbezogen."
      },
      {
        "delta": 0,
        "text": "Du gehst häufiger an seinem Tisch vorbei, ohne das Verhalten anzusprechen.",
        "feedback": "Die Präsenz kann kurzfristig bremsen, löst aber das zugrunde liegende Muster nicht."
      },
      {
        "delta": -1,
        "text": "Du nimmst das Handy kommentarlos weg und diskutierst öffentlich darüber.",
        "feedback": "Der Konflikt rückt vor die Klasse und Niklas kann in eine Verteidigungshaltung gehen."
      }
    ]
  },
  {
    "id": "S04",
    "type": "Classroom Management",
    "focus": [
      "Regel handy"
    ],
    "title": "Handyregel wird relevant",
    "scene": "Ein leises Vibrieren ist zu hören. Einige Blicke gehen zu Niklas' Tisch.",
    "answers": [
      {
        "delta": 1,
        "text": "Du erinnerst ruhig an die vereinbarte Handyregel und lässt die Geräte sichtbar in der Tasche bleiben.",
        "feedback": "Die Regel ist klar, kurz und für alle gleich nachvollziehbar."
      },
      {
        "delta": 0,
        "text": "Du wartest ab, ob das Geräusch wiederkommt.",
        "feedback": "Die Situation beruhigt sich kurz, aber die Regelklarheit wird nicht gestärkt."
      },
      {
        "delta": -1,
        "text": "Du suchst sofort alle Taschen der Klasse ab.",
        "feedback": "Die Maßnahme ist unverhältnismäßig und erzeugt Misstrauen."
      }
    ]
  },
  {
    "id": "S05",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "Petra",
      "distractor"
    ],
    "title": "Petra lenkt den Sitznachbarn ab",
    "scene": "Petra kommentiert leise die Aufgabe und ihr Nachbar verliert den Arbeitsfokus.",
    "answers": [
      {
        "delta": 1,
        "text": "Du vereinbarst mit Petra ein kurzes Arbeitsziel und lässt sie selbst markieren, wann sie fokussiert geblieben ist.",
        "feedback": "Selbstbeobachtung und Zielklarheit unterstützen eine konkrete Verhaltensänderung."
      },
      {
        "delta": 0,
        "text": "Du stellst dich kurz neben den Tisch und wartest, bis beide weiterarbeiten.",
        "feedback": "Die Störung stoppt kurz, bleibt aber als Muster im Hintergrund bestehen."
      },
      {
        "delta": -1,
        "text": "Du setzt Petra sofort allein und kündigst an, dass sie nicht gruppenfähig sei.",
        "feedback": "Die Reaktion beschämt und verhindert eine kooperative Bearbeitung."
      }
    ]
  },
  {
    "id": "S06",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "Petra",
      "Sara",
      "Mehmet",
      "stabilizer"
    ],
    "title": "Stabilisierende Nachbarschaft nutzen",
    "scene": "Petra wird unruhig, sitzt aber neben einer stabil arbeitenden Person. Die Arbeit könnte noch aufgefangen werden.",
    "answers": [
      {
        "delta": 1,
        "text": "Du gibst beiden eine klare Mini-Aufgabe und bittest die stabilere Person um eine kurze strukturierende Unterstützung.",
        "feedback": "Die Ressource im Sitzplan wird genutzt, ohne die Verantwortung allein auf den Mitschüler zu schieben."
      },
      {
        "delta": 0,
        "text": "Du lässt die Nachbarschaft unverändert und wartest, ob sich das von selbst stabilisiert.",
        "feedback": "Die Ressource bleibt ungenutzt; die Situation kann sich beruhigen oder wieder kippen."
      },
      {
        "delta": -1,
        "text": "Du erklärst der stabilen Person, sie sei jetzt für Petras Verhalten verantwortlich.",
        "feedback": "Das überfordert die Mitschülerin oder den Mitschüler und verschiebt pädagogische Verantwortung weg von dir."
      }
    ]
  },
  {
    "id": "S07",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "Ben",
      "boundaryTesting"
    ],
    "title": "Ben testet eine Grenze",
    "scene": "Ben grinst und macht bewusst etwas anderes als vereinbart. Er beobachtet, wie du reagierst.",
    "answers": [
      {
        "delta": 1,
        "text": "Du benennst ruhig die Abweichung, fragst nach dem Hindernis und vereinbarst den nächsten machbaren Arbeitsschritt.",
        "feedback": "Die Grenze bleibt klar, während Ben eine lösbare Rückkehr in die Aufgabe bekommt."
      },
      {
        "delta": 0,
        "text": "Du ignorierst es, solange Ben niemanden stört.",
        "feedback": "Die Stunde läuft weiter, aber Ben erhält keine Orientierung zur Grenze."
      },
      {
        "delta": -1,
        "text": "Du gehst auf die Provokation ein und diskutierst vor der Klasse ausführlich mit ihm.",
        "feedback": "Ben bekommt Bühne; das Grenztesten wird verstärkt."
      }
    ]
  },
  {
    "id": "S08",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "Julius",
      "conflictWithBoys"
    ],
    "title": "Julius reagiert auf einen Jungen gereizt",
    "scene": "Julius kommentiert die Antwort eines Mitschülers scharf. Die Stimmung am Tisch wird angespannter.",
    "answers": [
      {
        "delta": 1,
        "text": "Du stoppst den Kommentar kurz und klärst später mit Julius ein konkretes Ziel für respektvolle Reaktionen.",
        "feedback": "Der Konflikt wird begrenzt und in ein bearbeitbares Ziel übersetzt."
      },
      {
        "delta": 0,
        "text": "Du wechselst schnell das Thema und beobachtest den Tisch weiter.",
        "feedback": "Die Spannung wird nicht größer, aber die Beziehung zwischen den Schülern bleibt belastet."
      },
      {
        "delta": -1,
        "text": "Du sagst, Julius solle sich nicht so anstellen und einfach normal sein.",
        "feedback": "Die Abwertung kann die Reizbarkeit verstärken und verhindert Verständigung."
      }
    ]
  },
  {
    "id": "S09",
    "type": "Classroom Management",
    "focus": [
      "Regel respekt",
      "Lina"
    ],
    "title": "Lina wird ausgelacht",
    "scene": "Lina gibt eine unsichere Antwort. Zwei Schüler*innen kichern hörbar.",
    "answers": [
      {
        "delta": 1,
        "text": "Du verweist auf die Respektregel und sicherst Linas Beitrag fachlich wertschätzend ab.",
        "feedback": "Die Regel schützt die Lernatmosphäre und Lina bleibt handlungsfähig."
      },
      {
        "delta": 0,
        "text": "Du übergehst das Kichern und stellst direkt die nächste Fachfrage.",
        "feedback": "Die Stunde geht weiter, aber Linas Unsicherheit bleibt wahrscheinlich bestehen."
      },
      {
        "delta": -1,
        "text": "Du sagst Lina, sie müsse Kritik eben aushalten lernen.",
        "feedback": "Die Verantwortung wird einseitig auf Lina verschoben; Schutz und Regelklarheit fehlen."
      }
    ]
  },
  {
    "id": "S10",
    "type": "Classroom Management",
    "focus": [
      "Regel kommentar"
    ],
    "title": "Kommentar über Mitschüler*innen",
    "scene": "Ein Schüler kommentiert leise: „War ja klar, dass du das nicht kannst.“ Einige hören es.",
    "answers": [
      {
        "delta": 1,
        "text": "Du stoppst den Kommentar und verweist kurz auf die Regel, dass Kommentare über Mitschüler*innen unterlassen werden.",
        "feedback": "Die soziale Grenze wird klar, ohne den Unterricht unnötig zu verlängern."
      },
      {
        "delta": 0,
        "text": "Du schaust streng in die Richtung und machst weiter.",
        "feedback": "Das Signal kann reichen, aber die Norm wird nicht ausdrücklich geklärt."
      },
      {
        "delta": -1,
        "text": "Du lässt die Klasse darüber abstimmen, ob der Kommentar schlimm war.",
        "feedback": "Die betroffene Person wird ausgestellt und die Situation kann sich verschärfen."
      }
    ]
  },
  {
    "id": "S11",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "Emily",
      "transitions"
    ],
    "title": "Emily verliert beim Übergang den Anschluss",
    "scene": "Beim Wechsel in Partnerarbeit bleibt Emily sitzen und schaut suchend auf ihr Material.",
    "answers": [
      {
        "delta": 1,
        "text": "Du klärst mit Emily, welcher erste Übergangsschritt ihr hilft, und vereinbarst ein sichtbares Startsignal.",
        "feedback": "Das Problem wird konkretisiert und Emily bekommt eine wiederholbare Orientierung."
      },
      {
        "delta": 0,
        "text": "Du gibst ihr den Arbeitsauftrag noch einmal leise.",
        "feedback": "Das hilft im Moment, verändert aber die Übergangsstruktur noch nicht."
      },
      {
        "delta": -1,
        "text": "Du sagst, sie müsse endlich lernen, schneller zu sein.",
        "feedback": "Die Ursache bleibt ungeklärt und Emily wird zusätzlich verunsichert."
      }
    ]
  },
  {
    "id": "S12",
    "type": "Classroom Management",
    "focus": [
      "Regel material"
    ],
    "title": "Materialholen wird unruhig",
    "scene": "Mehrere stehen gleichzeitig auf, um Material zu holen. Der Laufweg wird eng.",
    "answers": [
      {
        "delta": 1,
        "text": "Du stoppst kurz, verweist auf den Materialablauf und lässt die Gruppen nacheinander starten.",
        "feedback": "Der Ablauf wird wieder steuerbar und unnötige Bewegung nimmt ab."
      },
      {
        "delta": 0,
        "text": "Du wartest, bis alle wieder sitzen.",
        "feedback": "Die Unruhe endet irgendwann, aber der Ablauf bleibt unklar."
      },
      {
        "delta": -1,
        "text": "Du verbietest Materialholen für den Rest der Stunde komplett.",
        "feedback": "Die Maßnahme löst den Ablauf nicht und behindert die Arbeitsfähigkeit."
      }
    ]
  },
  {
    "id": "S13",
    "type": "Classroom Management",
    "focus": [
      "Regel rollen"
    ],
    "title": "Gruppenarbeit ohne Rollen",
    "scene": "In einer Gruppe arbeiten zwei, während zwei andere nur zusehen.",
    "answers": [
      {
        "delta": 1,
        "text": "Du aktivierst die Regel zu klaren Rollen und lässt jede Person eine konkrete Teilaufgabe übernehmen.",
        "feedback": "Die Verantwortlichkeit steigt und Leerlauf wird reduziert."
      },
      {
        "delta": 0,
        "text": "Du lobst die zwei arbeitenden Schüler*innen und gehst weiter.",
        "feedback": "Die Gruppe produziert etwas, aber die passive Beteiligung bleibt bestehen."
      },
      {
        "delta": -1,
        "text": "Du brichst die Gruppenarbeit für die ganze Klasse ab.",
        "feedback": "Die Reaktion ist pauschal und nimmt auch funktionierenden Gruppen die Arbeitsform."
      }
    ]
  },
  {
    "id": "S14",
    "type": "Classroom Management",
    "focus": [
      "Regel hilfezeichen"
    ],
    "title": "Hilfe wird hineingerufen",
    "scene": "Mehrere Schüler*innen rufen gleichzeitig nach Hilfe. Du kannst nicht erkennen, wer wirklich blockiert ist.",
    "answers": [
      {
        "delta": 1,
        "text": "Du erinnerst an das Hilfesignal und arbeitest die sichtbaren Signale der Reihe nach ab.",
        "feedback": "Die Hilfesituation wird geordnet und die Klasse muss nicht lauter werden."
      },
      {
        "delta": 0,
        "text": "Du gehst zu der lautesten Person zuerst.",
        "feedback": "Die akute Lautstärke sinkt, aber lautes Rufen wird eher belohnt."
      },
      {
        "delta": -1,
        "text": "Du sagst, wer ruft, bekommt heute keine Hilfe mehr.",
        "feedback": "Die Regel wird durch Strafe ersetzt; blockierte Schüler*innen bleiben ohne Unterstützung."
      }
    ]
  },
  {
    "id": "S15",
    "type": "Classroom Management",
    "focus": [
      "Regel stoppsignal"
    ],
    "title": "Ruhezeichen greift nicht sofort",
    "scene": "Nach dem Ruhezeichen sprechen einige weiter. Die Arbeitsphase soll ins Plenum zurückgeführt werden.",
    "answers": [
      {
        "delta": 1,
        "text": "Du wartest sichtbar, wiederholst das Signal knapp und startest erst, als die Aufmerksamkeit vorne ist.",
        "feedback": "Das Ritual wird stabilisiert und bleibt für alle berechenbar."
      },
      {
        "delta": 0,
        "text": "Du beginnst trotz Restgeräuschen mit der Erklärung.",
        "feedback": "Ein Teil hört zu, aber die Steuerbarkeit bleibt eingeschränkt."
      },
      {
        "delta": -1,
        "text": "Du wirst lauter als die Klasse und schimpfst über fehlenden Respekt.",
        "feedback": "Die Lautstärke steigt und das Ruhezeichen verliert an Funktion."
      }
    ]
  },
  {
    "id": "S16",
    "type": "Classroom Management",
    "focus": [
      "Regel lautstaerke"
    ],
    "title": "Lautstärke steigt in Arbeitsphase",
    "scene": "Die Lautstärke wächst langsam. Fachliche Gespräche und private Gespräche mischen sich.",
    "answers": [
      {
        "delta": 1,
        "text": "Du erinnerst an die Lautstärkeregel und gibst einen kurzen Lautstärke-Check für alle Gruppen.",
        "feedback": "Die Klasse erhält eine konkrete Rückmeldung und kann sich selbst nachsteuern."
      },
      {
        "delta": 0,
        "text": "Du schließt die Tür und arbeitest mit einer einzelnen Gruppe weiter.",
        "feedback": "Die Außenwirkung sinkt, aber die Arbeitslautstärke bleibt ungeklärt."
      },
      {
        "delta": -1,
        "text": "Du erklärst die ganze Gruppe für unreif und untersagst künftig Gruppenarbeit.",
        "feedback": "Die Abwertung verhindert Lernen am Gruppenarbeitsprozess."
      }
    ]
  },
  {
    "id": "S17",
    "type": "Classroom Management",
    "focus": [
      "Regel platz"
    ],
    "title": "Umherlaufen ohne Auftrag",
    "scene": "Ein Schüler steht wiederholt auf und läuft an mehreren Tischen vorbei.",
    "answers": [
      {
        "delta": 1,
        "text": "Du verweist knapp auf die Platzregel und gibst ihm eine konkrete Alternative, wie er Hilfe bekommt.",
        "feedback": "Die Bewegung wird begrenzt und gleichzeitig ein legitimer Weg für Bedarf eröffnet."
      },
      {
        "delta": 0,
        "text": "Du lässt ihn laufen, solange er niemanden direkt anspricht.",
        "feedback": "Die Störung bleibt moderat, aber andere können das Verhalten übernehmen."
      },
      {
        "delta": -1,
        "text": "Du stellst ihn für den Rest der Stunde vor die Tür.",
        "feedback": "Die Maßnahme ist unverhältnismäßig und unterbricht die pädagogische Bearbeitung."
      }
    ]
  },
  {
    "id": "S18",
    "type": "Classroom Management",
    "focus": [
      "Regel ausreden"
    ],
    "title": "Ausreden klappt nicht",
    "scene": "Beim Sammeln von Ideen fallen sich mehrere gegenseitig ins Wort.",
    "answers": [
      {
        "delta": 1,
        "text": "Du stoppst kurz und aktivierst die Regel, dass Beiträge nacheinander beendet werden.",
        "feedback": "Die Gesprächsstruktur wird wieder hergestellt."
      },
      {
        "delta": 0,
        "text": "Du notierst nur die lautesten Beiträge an der Tafel.",
        "feedback": "Es entsteht ein Ergebnis, aber ruhige Schüler*innen werden weniger beteiligt."
      },
      {
        "delta": -1,
        "text": "Du lässt die Klasse weiter durcheinanderreden und bewertest dann die Beiträge.",
        "feedback": "Unklare Gesprächsbedingungen verstärken Frust und Konkurrenz."
      }
    ]
  },
  {
    "id": "S19",
    "type": "Classroom Management",
    "focus": [
      "Regel start"
    ],
    "title": "Stundenbeginn wird unruhig",
    "scene": "Einige haben Material bereit, andere suchen noch im Rucksack. Der Start verzögert sich.",
    "answers": [
      {
        "delta": 1,
        "text": "Du nutzt die Startregel und gibst eine kurze sichtbare Startaufgabe für alle.",
        "feedback": "Der Beginn wird strukturiert und Wartezeiten werden reduziert."
      },
      {
        "delta": 0,
        "text": "Du wartest, bis alle von selbst fertig sind.",
        "feedback": "Es wird irgendwann ruhig, aber Leerlauf entsteht."
      },
      {
        "delta": -1,
        "text": "Du startest sofort mit einer Abfrage und wertest fehlendes Material als Leistungsverweigerung.",
        "feedback": "Die Situation wird unnötig zugespitzt und die Startstruktur bleibt ungeklärt."
      }
    ]
  },
  {
    "id": "S20",
    "type": "Classroom Management",
    "focus": [
      "Regel wechsel"
    ],
    "title": "Wechsel der Sozialform stockt",
    "scene": "Beim Wechsel in Partnerarbeit reden viele durcheinander und einige wissen nicht, wann sie beginnen sollen.",
    "answers": [
      {
        "delta": 1,
        "text": "Du verweist auf das Startsignal und lässt erst nach einer klaren Ansage wechseln.",
        "feedback": "Der Übergang bekommt Struktur und die Klasse kann geordnet starten."
      },
      {
        "delta": 0,
        "text": "Du hilfst einzelnen Paaren nacheinander.",
        "feedback": "Einzelne kommen weiter, aber die Gesamtstruktur bleibt unklar."
      },
      {
        "delta": -1,
        "text": "Du lässt alle sofort zurück in Einzelarbeit wechseln.",
        "feedback": "Das Problem wird umgangen, nicht bearbeitet."
      }
    ]
  },
  {
    "id": "S21",
    "type": "Classroom Management",
    "focus": [
      "Regel pausen"
    ],
    "title": "Private Gespräche ziehen Aufmerksamkeit",
    "scene": "Zwei Schüler*innen sprechen über ein privates Thema. Andere hören mit.",
    "answers": [
      {
        "delta": 1,
        "text": "Du erinnerst kurz daran, private Gespräche in die Pause zu verschieben, und lenkst auf die Aufgabe zurück.",
        "feedback": "Die Arbeitsnorm wird klar, ohne das private Thema großzumachen."
      },
      {
        "delta": 0,
        "text": "Du stellst dich in die Nähe und wartest, bis sie aufhören.",
        "feedback": "Die Nähe wirkt kurzfristig, aber die Regel wird nicht bewusst gemacht."
      },
      {
        "delta": -1,
        "text": "Du fragst laut nach, worüber sie reden, damit alle es hören.",
        "feedback": "Die Situation wird bloßgestellt und lenkt die Klasse stärker ab."
      }
    ]
  },
  {
    "id": "S22",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "blindspot",
      "needsMonitoring"
    ],
    "title": "Störung im blinden Bereich",
    "scene": "Aus einem schlecht einsehbaren Bereich kommen Geräusche. Du erkennst nicht sofort, wer beteiligt ist.",
    "answers": [
      {
        "delta": 1,
        "text": "Du beobachtest kurz systematisch, klärst danach mit den Beteiligten das Muster und vereinbarst ein sichtbares Arbeitsziel.",
        "feedback": "Die Intervention basiert auf Beobachtung statt Verdacht und eröffnet kooperative Veränderung."
      },
      {
        "delta": 0,
        "text": "Du gehst in die Nähe und bleibst dort einige Minuten stehen.",
        "feedback": "Die Präsenz stabilisiert kurzfristig, aber das Muster wird nicht aufgearbeitet."
      },
      {
        "delta": -1,
        "text": "Du beschuldigst sofort den auffälligsten Schüler in diesem Bereich.",
        "feedback": "Ohne Klärung wird ein Schüler etikettiert; das kann Widerstand verstärken."
      }
    ]
  },
  {
    "id": "S23",
    "type": "Classroom Management",
    "focus": [
      "trash"
    ],
    "title": "Müll wird zum Störreiz",
    "scene": "Ein Müllfeld liegt noch im Raum. Zwei Schüler*innen tippen es an und lachen.",
    "answers": [
      {
        "delta": 1,
        "text": "Du lässt den Störreiz kurz entfernen und kehrst ohne großes Aufsehen zur Aufgabe zurück.",
        "feedback": "Der Raum wird als Lernumgebung geordnet, ohne die Ablenkung aufzuwerten."
      },
      {
        "delta": 0,
        "text": "Du ignorierst es, weil die Aufgabe fachlich wichtiger ist.",
        "feedback": "Die Stunde läuft weiter, aber der Störreiz bleibt verfügbar."
      },
      {
        "delta": -1,
        "text": "Du hältst eine lange Standpauke über Sauberkeit.",
        "feedback": "Der Unterrichtsfokus geht verloren und die Ablenkung bekommt viel Aufmerksamkeit."
      }
    ]
  },
  {
    "id": "S24",
    "type": "Classroom Management",
    "focus": [
      "spacing"
    ],
    "title": "Laufweg ist blockiert",
    "scene": "Du möchtest einer Gruppe helfen, kommst aber kaum zwischen zwei Tischreihen hindurch.",
    "answers": [
      {
        "delta": 1,
        "text": "Du organisierst kurz einen freien Gang und erklärst, dass Unterstützung erreichbar bleiben muss.",
        "feedback": "Die Raumstruktur wird funktional nachgesteuert."
      },
      {
        "delta": 0,
        "text": "Du hilfst nur von vorne durch Zuruf.",
        "feedback": "Ein Teil der Hilfe kommt an, aber die räumliche Barriere bleibt bestehen."
      },
      {
        "delta": -1,
        "text": "Du lässt die Gruppe ohne Hilfe weiterarbeiten, weil der Weg unbequem ist.",
        "feedback": "Die Gruppe bleibt blockiert und die Sitzordnung wird nicht als Bedingung reflektiert."
      }
    ]
  },
  {
    "id": "S25",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "backrow",
      "phoneRisk"
    ],
    "title": "Rückzug in der hinteren Reihe",
    "scene": "Ein Schüler in einer hinteren Position beteiligt sich kaum und wirkt mit etwas anderem beschäftigt.",
    "answers": [
      {
        "delta": 1,
        "text": "Du klärst nach der Phase, woran er arbeiten soll, und vereinbarst eine kurze Selbstkontrolle nach zehn Minuten.",
        "feedback": "Rückzug wird nicht nur kontrolliert, sondern in ein überprüfbares Ziel überführt."
      },
      {
        "delta": 0,
        "text": "Du stellst ihm zwischendurch eine einfache Frage.",
        "feedback": "Er wird kurz aktiviert, aber das Rückzugsmuster bleibt möglich."
      },
      {
        "delta": -1,
        "text": "Du kündigst an, dass hintere Plätze nur für unzuverlässige Schüler seien.",
        "feedback": "Die Platzierung wird stigmatisiert und kann Widerstand erzeugen."
      }
    ]
  },
  {
    "id": "S26",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "Sara",
      "stabilizer"
    ],
    "title": "Sara kann eine Gruppe stabilisieren",
    "scene": "Saras Gruppe gerät kurz ins Stocken, obwohl sie selbst ruhig weiterarbeitet.",
    "answers": [
      {
        "delta": 1,
        "text": "Du gibst Sara eine begrenzte Moderationsrolle und prüfst später, ob die Gruppe dadurch besser arbeiten konnte.",
        "feedback": "Die Ressource wird gezielt genutzt und anschließend ausgewertet."
      },
      {
        "delta": 0,
        "text": "Du lässt Sara einfach weiterarbeiten und kümmerst dich um eine andere Gruppe.",
        "feedback": "Die Gruppe bleibt eventuell stabil, aber die Ressource wird nicht bewusst eingebunden."
      },
      {
        "delta": -1,
        "text": "Du übergibst Sara dauerhaft die Verantwortung für die Gruppe.",
        "feedback": "Die Verantwortung wird überdehnt und kann Sara belasten."
      }
    ]
  },
  {
    "id": "S27",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "Amira",
      "mediator"
    ],
    "title": "Amira vermittelt informell",
    "scene": "Amira versucht, einen kleinen Streit am Tisch zu beruhigen. Die anderen hören teilweise auf sie.",
    "answers": [
      {
        "delta": 1,
        "text": "Du bestätigst die deeskalierende Rolle kurz und klärst danach mit der Gruppe ein gemeinsames Arbeitsziel.",
        "feedback": "Peer-Ressourcen werden anerkannt und in Gruppenverantwortung übersetzt."
      },
      {
        "delta": 0,
        "text": "Du lässt Amira erst einmal machen.",
        "feedback": "Das kann funktionieren, bleibt aber ungeplant und unsicher."
      },
      {
        "delta": -1,
        "text": "Du sagst Amira, sie solle sich nicht einmischen.",
        "feedback": "Eine stabilisierende Ressource wird blockiert."
      }
    ]
  },
  {
    "id": "S28",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "Mehmet",
      "stabilizer"
    ],
    "title": "Mehmet hält die Aufgabe zusammen",
    "scene": "Mehmet arbeitet ruhig und erklärt einem Nachbarn den nächsten Schritt.",
    "answers": [
      {
        "delta": 1,
        "text": "Du verstärkst das hilfreiche Verhalten konkret und vereinbarst mit der Gruppe, wie sie Hilfe fair nutzt.",
        "feedback": "Positives Modellverhalten wird sichtbar und in eine Gruppenroutine überführt."
      },
      {
        "delta": 0,
        "text": "Du nimmst es zur Kenntnis und lässt die Gruppe weiterarbeiten.",
        "feedback": "Das Verhalten bleibt hilfreich, wird aber nicht für die Klasse nutzbar gemacht."
      },
      {
        "delta": -1,
        "text": "Du gibst Mehmet alle schwierigen Erklärungen, weil er es gut kann.",
        "feedback": "Mehmet wird überlastet und die Verantwortung der anderen sinkt."
      }
    ]
  },
  {
    "id": "S29",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "goalSetting"
    ],
    "title": "Ein Verhalten tritt wiederholt auf",
    "scene": "Dasselbe störende Verhalten ist bereits zum dritten Mal aufgetreten. Eine kurze Erinnerung reicht nicht mehr.",
    "answers": [
      {
        "delta": 1,
        "text": "Du formulierst mit dem Schüler ein konkretes Zielverhalten und planst eine kurze Überprüfung am Stundenende.",
        "feedback": "Das wiederkehrende Problem wird in einen kooperativen Veränderungsprozess überführt."
      },
      {
        "delta": 0,
        "text": "Du erinnerst noch einmal an die allgemeine Ordnung.",
        "feedback": "Das kann kurzfristig bremsen, bleibt aber zu unspezifisch."
      },
      {
        "delta": -1,
        "text": "Du sammelst die Vorfälle als Beweis, ohne mit dem Schüler darüber zu sprechen.",
        "feedback": "Die Transparenz fehlt und der Schüler wird nicht zum Beteiligten der Veränderung."
      }
    ]
  },
  {
    "id": "S30",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "diagnosis"
    ],
    "title": "Unklarer Auslöser",
    "scene": "Eine Störung entsteht immer in ähnlichen Momenten, aber der Auslöser ist noch unklar.",
    "answers": [
      {
        "delta": 1,
        "text": "Du beobachtest die Bedingungen gezielt und besprichst mit den Beteiligten, wann das Problem beginnt.",
        "feedback": "Die Diagnose bleibt vorläufig und wird kooperativ präzisiert."
      },
      {
        "delta": 0,
        "text": "Du reduzierst die Aufgabe, damit weniger passieren kann.",
        "feedback": "Die Stunde wird ruhiger, aber der Auslöser bleibt ungeklärt."
      },
      {
        "delta": -1,
        "text": "Du legst sofort fest, dass ein bestimmter Schüler die Ursache ist.",
        "feedback": "Das widerspricht der systemischen Sicht und kann die Situation verengen."
      }
    ]
  },
  {
    "id": "S31",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "selfObservation"
    ],
    "title": "Selbstbeobachtung als nächster Schritt",
    "scene": "Ein Schüler sagt: „Ich merke gar nicht, wann ich störe.“",
    "answers": [
      {
        "delta": 1,
        "text": "Du vereinbarst eine einfache Selbstbeobachtung mit zwei Zeitpunkten und einem klaren Zielverhalten.",
        "feedback": "Der Schüler wird Experte für die eigene Selbststeuerung."
      },
      {
        "delta": 0,
        "text": "Du sagst ihm, dass du ihm künftig ein Zeichen gibst.",
        "feedback": "Das kann helfen, bleibt aber stärker fremdgesteuert."
      },
      {
        "delta": -1,
        "text": "Du erklärst, dass er das sehr wohl merken müsse.",
        "feedback": "Die Aussage wird abgewertet und die Chance zur Selbststeuerung sinkt."
      }
    ]
  },
  {
    "id": "S32",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "reinforcement"
    ],
    "title": "Erste Verbesserung sichtbar",
    "scene": "Ein Schüler schafft es in einer Phase deutlich besser, die vereinbarte Regel einzuhalten.",
    "answers": [
      {
        "delta": 1,
        "text": "Du gibst konkrete Rückmeldung zum Zielverhalten und lässt ihn kurz einschätzen, was geholfen hat.",
        "feedback": "Die Verbesserung wird verstärkt und mit Selbstbewertung verbunden."
      },
      {
        "delta": 0,
        "text": "Du sagst nur: „Heute war es besser.“",
        "feedback": "Die Rückmeldung ist positiv, aber wenig konkret."
      },
      {
        "delta": -1,
        "text": "Du betonst, dass es ja wohl auch höchste Zeit war.",
        "feedback": "Die Verbesserung wird entwertet."
      }
    ]
  },
  {
    "id": "S33",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "evaluation"
    ],
    "title": "Maßnahme auswerten",
    "scene": "Die vereinbarte Unterstützung hat in zwei Stunden teilweise funktioniert.",
    "answers": [
      {
        "delta": 1,
        "text": "Du wertest mit dem Schüler aus, was funktioniert hat, und passt das Ziel für die nächste Stunde an.",
        "feedback": "Planung und Intervention bleiben veränderbar und lernorientiert."
      },
      {
        "delta": 0,
        "text": "Du behältst die Maßnahme unverändert bei.",
        "feedback": "Stabilität bleibt möglich, aber Anpassungsbedarf wird nicht genutzt."
      },
      {
        "delta": -1,
        "text": "Du erklärst die Maßnahme für gescheitert und brichst sie ohne Gespräch ab.",
        "feedback": "Der Prozess wird beendet, bevor Ursachen und Anpassungen geklärt sind."
      }
    ]
  },
  {
    "id": "S34",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "classSystem"
    ],
    "title": "Die Klasse verstärkt die Störung",
    "scene": "Ein Schüler stört kurz, und mehrere lachen. Dadurch wird das Verhalten attraktiver.",
    "answers": [
      {
        "delta": 1,
        "text": "Du bearbeitest nicht nur den Schüler, sondern klärst mit der Gruppe, welche Reaktion das Lernen unterstützt.",
        "feedback": "Das Klassensystem wird als Teil der Problembedingung einbezogen."
      },
      {
        "delta": 0,
        "text": "Du konzentrierst dich nur auf den störenden Schüler.",
        "feedback": "Ein Teil des Problems wird angesprochen, aber die Verstärkung durch die Gruppe bleibt bestehen."
      },
      {
        "delta": -1,
        "text": "Du beschuldigst die ganze Klasse, absichtlich gegen dich zu arbeiten.",
        "feedback": "Die Systemperspektive wird zur pauschalen Schuldzuweisung."
      }
    ]
  },
  {
    "id": "S35",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "teacherStudentInteraction"
    ],
    "title": "Interaktion kippt in Machtkampf",
    "scene": "Eine Ermahnung führt sofort zu Widerrede. Die Situation droht persönlich zu werden.",
    "answers": [
      {
        "delta": 1,
        "text": "Du unterbrichst den Machtkampf, sicherst die Aufgabe und klärst das Problem später in einem kurzen Gespräch.",
        "feedback": "Die akute Eskalation wird begrenzt und die Interaktion bleibt bearbeitbar."
      },
      {
        "delta": 0,
        "text": "Du beendest die Diskussion mit einem knappen „später“.",
        "feedback": "Das kann deeskalieren, braucht aber später eine echte Klärung."
      },
      {
        "delta": -1,
        "text": "Du bestehst darauf, die Diskussion sofort vor allen zu gewinnen.",
        "feedback": "Die Beziehungsebene verschärft sich und die Klasse wird Publikum."
      }
    ]
  },
  {
    "id": "S36",
    "type": "Classroom Management",
    "focus": [
      "chosenRules"
    ],
    "title": "Passende Regel ist vorhanden",
    "scene": "Eine Störung passt genau zu einer vorher ausgewählten Klassenregel. Einige Schüler*innen schauen, ob du konsequent bleibst.",
    "answers": [
      {
        "delta": 1,
        "text": "Du verweist kurz auf die passende Regel und verbindest sie mit dem nächsten konkreten Arbeitsschritt.",
        "feedback": "Die Regel wird funktional genutzt und bleibt Teil des Unterrichtsflusses."
      },
      {
        "delta": 0,
        "text": "Du lässt die Situation laufen, weil sie gerade noch nicht eskaliert.",
        "feedback": "Die Störung bleibt klein, aber die Regel verliert etwas an Verbindlichkeit."
      },
      {
        "delta": -1,
        "text": "Du formulierst spontan eine neue Regel, statt die vereinbarte zu nutzen.",
        "feedback": "Die Regelstruktur wird unübersichtlich."
      }
    ]
  },
  {
    "id": "S37",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "noMatchingRule"
    ],
    "title": "Keine passende Regel gewählt",
    "scene": "Ein Problem tritt auf, zu dem keine direkt passende Klassenregel festgelegt wurde.",
    "answers": [
      {
        "delta": 1,
        "text": "Du klärst mit den Beteiligten das Zielverhalten und ergänzt später eine passende Routine oder Regelidee.",
        "feedback": "Die Lücke wird als Lernanlass genutzt und nicht improvisiert zugedeckt."
      },
      {
        "delta": 0,
        "text": "Du nutzt eine allgemeine Erinnerung an konzentriertes Arbeiten.",
        "feedback": "Das kann kurz reichen, bleibt aber ungenau."
      },
      {
        "delta": -1,
        "text": "Du behauptest, die Regel sei schon immer klar gewesen.",
        "feedback": "Unklare Erwartungen werden nachträglich als Schuld der Schüler*innen ausgelegt."
      }
    ]
  },
  {
    "id": "S38",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "refusal"
    ],
    "title": "Arbeitsverweigerung in der Aufgabe",
    "scene": "Ein Schüler schiebt das Material weg und sagt: „Ich mach das nicht.“",
    "answers": [
      {
        "delta": 1,
        "text": "Du klärst leise, welcher Teil gerade blockiert, und vereinbarst einen machbaren ersten Schritt.",
        "feedback": "Die Verweigerung wird als Problem im Lernprozess bearbeitet."
      },
      {
        "delta": 0,
        "text": "Du gibst ihm kurz Zeit und kommst später wieder.",
        "feedback": "Der Druck sinkt, aber ohne Klärung bleibt der Einstieg offen."
      },
      {
        "delta": -1,
        "text": "Du wertest die Aussage als reine Faulheit und gibst eine Strafe.",
        "feedback": "Die Blockade wird personalisiert und kann sich verfestigen."
      }
    ]
  },
  {
    "id": "S39",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "peerConflict"
    ],
    "title": "Konflikt in Partnerarbeit",
    "scene": "Zwei Partner*innen schieben sich gegenseitig die Schuld zu, dass nichts fertig wird.",
    "answers": [
      {
        "delta": 1,
        "text": "Du lässt beide kurz ihre Sicht schildern und vereinbarst zwei getrennte, überprüfbare Beiträge.",
        "feedback": "Beide Perspektiven werden einbezogen und die Aufgabe wird wieder handhabbar."
      },
      {
        "delta": 0,
        "text": "Du teilst die Aufgabe schnell selbst auf.",
        "feedback": "Die Arbeit kommt voran, aber die Konfliktklärung bleibt außen vor."
      },
      {
        "delta": -1,
        "text": "Du entscheidest sofort, wer schuld ist.",
        "feedback": "Die Zuschreibung verstärkt den Konflikt und verhindert Kooperation."
      }
    ]
  },
  {
    "id": "S40",
    "type": "Kooperative Verhaltensmodifikation",
    "focus": [
      "lessonReflection"
    ],
    "title": "Stunde endet mit Restspannung",
    "scene": "Die Stunde endet, aber ein wiederkehrendes Problem ist noch nicht abschließend gelöst.",
    "answers": [
      {
        "delta": 1,
        "text": "Du hältst mit der Klasse kurz fest, was geholfen hat und welches Ziel in der nächsten Stunde weiter gilt.",
        "feedback": "Die Auswertung macht den Prozess transparent und anschlussfähig."
      },
      {
        "delta": 0,
        "text": "Du beendest die Stunde pünktlich und nimmst dir vor, es später zu beobachten.",
        "feedback": "Die Spannung bleibt bestehen, ohne sofort weiter zu eskalieren."
      },
      {
        "delta": -1,
        "text": "Du beendest die Stunde mit einer pauschalen Drohung für das nächste Mal.",
        "feedback": "Die nächste Stunde startet mit Druck statt mit geklärtem Ziel."
      }
    ]
  }
];

const fallbackStudents = [
  { id: 'julius', name: 'Julius', age: 12, note: 'verträgt sich schlecht mit anderen Jungs' },
  { id: 'petra', name: 'Petra', age: 15, note: 'lenkt häufig Sitznachbar*innen ab' },
  { id: 'mehmet', name: 'Mehmet', age: 13, note: 'arbeitet ruhig und stabilisiert Gruppen' },
  { id: 'lina', name: 'Lina', age: 12, note: 'reagiert empfindlich auf Kritik und Spott' },
  { id: 'ben', name: 'Ben', age: 14, note: 'testet gerne Grenzen aus' },
  { id: 'sara', name: 'Sara', age: 13, note: 'arbeitet zuverlässig und hilft anderen' },
  { id: 'tom', name: 'Tom', age: 12, note: 'sucht Aufmerksamkeit durch Zwischenrufe' },
  { id: 'emily', name: 'Emily', age: 13, note: 'braucht klare Orientierung bei Übergängen' },
  { id: 'niklas', name: 'Niklas', age: 14, note: 'versteckt gern das Handy unter dem Tisch' },
  { id: 'amira', name: 'Amira', age: 12, note: 'vermittelt oft zwischen Mitschüler*innen' }
];

const scenarioList = document.getElementById('scenarioList');
const scenarioCount = document.getElementById('scenarioCount');
const scenarioDrawer = document.getElementById('scenarioDrawer');
const openScenarioBtn = document.getElementById('openScenarioBtn');
const closeScenarioBtn = document.getElementById('closeScenarioBtn');
const stepSummary = document.getElementById('stepSummary');
const ruleSummary = document.getElementById('ruleSummary');
const selectedRulesList = document.getElementById('selectedRulesList');
const studentContextList = document.getElementById('studentContextList');

function readJson(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn('Daten konnten nicht gelesen werden:', key, error);
    return fallback;
  }
}

const step1 = readJson('classroomGame.step1', {});
const rulesData = readJson('classroomGame.step2.rules', { acceptedRules: [] });

function init() {
  renderContext();
  renderScenarioCatalog();
  bindEvents();
}

function bindEvents() {
  if (openScenarioBtn) openScenarioBtn.addEventListener('click', () => scenarioDrawer.hidden = false);
  if (closeScenarioBtn) closeScenarioBtn.addEventListener('click', () => scenarioDrawer.hidden = true);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && scenarioDrawer && !scenarioDrawer.hidden) scenarioDrawer.hidden = true;
  });
}

function renderContext() {
  const score = step1?.rawPreparationScore ?? step1?.preparationScore ?? '–';
  const hooks = Array.isArray(step1?.suggestedScenarioHooks) ? step1.suggestedScenarioHooks : [];
  if (stepSummary) {
    stepSummary.innerHTML = `<strong>Startstabilität:</strong> ${score} · <strong>gespeicherte Classroom-Management-Hooks:</strong> ${hooks.length ? hooks.join(', ') : 'keine expliziten Hooks'}`;
  }

  const acceptedRules = Array.isArray(rulesData?.acceptedRules) ? rulesData.acceptedRules : [];
  if (ruleSummary) ruleSummary.textContent = `${acceptedRules.length} verbindliche Klassenregeln gespeichert`;
  if (selectedRulesList) {
    selectedRulesList.innerHTML = acceptedRules.length
      ? acceptedRules.map(rule => `<li>${escapeHtml(rule.text || rule.id)}</li>`).join('')
      : '<li>Keine Regeln gespeichert. Die Szenarien zeigen trotzdem den vollständigen Katalog.</li>';
  }

  const students = Array.isArray(step1?.students) ? step1.students : fallbackStudents;
  const assignments = step1?.assignments || {};
  const desks = Array.isArray(step1?.desks) ? step1.desks : [];
  if (studentContextList) {
    studentContextList.innerHTML = students.map(student => {
      const deskId = Object.keys(assignments).find(id => assignments[id] === student.id);
      const desk = desks.find(item => item.id === deskId);
      const place = desk ? `Reihe ${desk.row + 1}, Feld ${desk.col + 1}` : 'ohne gespeicherten Platz';
      return `<li><strong>${escapeHtml(student.name)} (${student.age})</strong><span>${escapeHtml(student.note || '')}</span><small>${place}</small></li>`;
    }).join('');
  }
}

function scenarioFitLabel(scenario) {
  const f = new Set(scenario.focus || []);
  const acceptedIds = new Set((rulesData?.acceptedRuleIds || []).filter(Boolean));
  const hooks = new Set(step1?.suggestedScenarioHooks || []);
  let hits = 0;
  f.forEach(item => {
    if (acceptedIds.has(item) || hooks.has(item)) hits += 1;
  });
  if ([...f].some(item => ['Tom','Petra','Niklas','Ben','Julius','Lina','Emily','Sara','Mehmet','Amira'].includes(item))) hits += 1;
  if (hits >= 2) return 'passt gut zur Runde';
  if (hits === 1) return 'potenziell passend';
  return 'Katalog-Szenario';
}

function renderScenarioCatalog() {
  if (!scenarioList) return;
  if (scenarioCount) scenarioCount.textContent = `${SCENARIOS.length} Szenarien`;
  scenarioList.innerHTML = SCENARIOS.map((scenario, index) => `
    <article class="scenario-card" data-type="${escapeHtml(scenario.type)}">
      <div class="scenario-card-head">
        <span class="scenario-number">${String(index + 1).padStart(2, '0')}</span>
        <div>
          <p class="eyebrow">${escapeHtml(scenario.type)}</p>
          <h3>${escapeHtml(scenario.title)}</h3>
        </div>
        <span class="scenario-fit">${scenarioFitLabel(scenario)}</span>
      </div>
      <p class="scenario-scene">${escapeHtml(scenario.scene)}</p>
      <div class="scenario-focus">${(scenario.focus || []).map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>
      <div class="scenario-answers">
        ${scenario.answers.map(answer => `
          <div class="scenario-answer delta-${answer.delta > 0 ? 'plus' : answer.delta < 0 ? 'minus' : 'zero'}">
            <strong>${answer.delta > 0 ? '+1' : answer.delta < 0 ? '-1' : '0'}</strong>
            <p>${escapeHtml(answer.text)}</p>
            <small>${escapeHtml(answer.feedback)}</small>
          </div>
        `).join('')}
      </div>
    </article>
  `).join('');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

init();
