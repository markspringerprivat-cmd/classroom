const FALLBACK_SCENARIOS = [
  {
    "id": "S01",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Störanfällige Schüler*in sitzt außerhalb des wirksamen Sichtfeldes.",
    "title": "Blinder Bereich",
    "situation": "{riskStudent} arbeitet in einem kaum sichtbaren Bereich. Während du an der Tafel bist, entsteht dort wiederholt Unruhe.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich kläre mit {riskStudent} kurz, was beim Arbeiten hilft, und vereinbare ein sichtbares Zielsignal.",
        "feedback": "Die Situation wird als gemeinsames Problem bearbeitet; {riskStudent} erhält Orientierung ohne bloßgestellt zu werden."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich gehe näher an den Bereich und beobachte erst einmal weiter.",
        "feedback": "Die Präsenz kann kurzfristig stabilisieren, aber das wiederkehrende Muster wird noch nicht kooperativ bearbeitet."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich rufe durch den Raum, dass {riskStudent} sofort aufhören soll.",
        "feedback": "Die öffentliche Korrektur erhöht den Druck und kann die Störung für die Gruppe noch sichtbarer machen."
      }
    ],
    "keys": [
      "blindRiskStudents",
      "needsMonitoring"
    ]
  },
  {
    "id": "S02",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Störanfällige Schüler*in sitzt im stärksten Sichtfeld.",
    "title": "Gute Sicht als Ressource",
    "situation": "{riskStudent} beginnt unruhig zu werden, sitzt aber gut sichtbar. Du kannst früh reagieren, bevor andere einsteigen.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich nutze ein vorher vereinbartes nonverbales Signal und bespreche später kurz, ob es geholfen hat.",
        "feedback": "Die Ressource Sichtfeld wird mit Selbststeuerung verbunden; die Intervention bleibt ruhig und kooperativ."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich warte ab, weil ich die Situation gut im Blick habe.",
        "feedback": "Die Lage eskaliert nicht sofort, aber die Chance zur frühen Unterstützung bleibt ungenutzt."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich kommentiere vor der Klasse, dass ich {riskStudent} sowieso im Blick habe.",
        "feedback": "Das wirkt kontrollierend und kann Widerstand oder Gesichtsverlust auslösen."
      }
    ],
    "keys": [
      "visionRiskStudents",
      "teacherVision"
    ]
  },
  {
    "id": "S03",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Ablenkende Sitznachbarschaft.",
    "title": "Seitliche Ablenkung",
    "situation": "{distractor} spricht den Sitznachbarn immer wieder an. Die Aufgabe rückt für beide in den Hintergrund.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich beschreibe das Verhalten konkret und vereinbare mit {distractor} ein kurzes Selbstbeobachtungsziel für die Arbeitsphase.",
        "feedback": "Die Störung wird beobachtbar gemacht; {distractor} übernimmt Mitverantwortung für die Veränderung."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich erinnere allgemein daran, leise weiterzuarbeiten.",
        "feedback": "Die Klasse hört die Erinnerung, aber das konkrete Muster zwischen den Sitznachbarn bleibt bestehen."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich setze {distractor} sofort strafend weg, ohne die Situation zu klären.",
        "feedback": "Das kann kurzfristig Ruhe bringen, verhindert aber eine kooperative Bearbeitung der Ursache."
      }
    ],
    "keys": [
      "distractor",
      "riskyPairs"
    ]
  },
  {
    "id": "S04",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Stabilisierende Sitznachbarschaft neben riskanter Schüler*in.",
    "title": "Hilfe als Ressource",
    "situation": "{stabilizer} sitzt neben {riskStudent}. {riskStudent} verliert den Überblick und fragt immer wieder laut in die Runde.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich binde {stabilizer} als freiwillige Lernstütze ein und kläre mit beiden eine begrenzte Hilferoutine.",
        "feedback": "Die Ressource wird genutzt, ohne Verantwortung unkontrolliert auf Mitschüler*innen abzuwälzen."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich beantworte die Fragen selbst und lasse die Sitzordnung unverändert.",
        "feedback": "Das Problem wird kurzfristig aufgefangen, aber {riskStudent} bleibt abhängig von deiner Hilfe."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich sage {stabilizer}, dass er oder sie ab jetzt für {riskStudent} verantwortlich ist.",
        "feedback": "Das überlastet die helfende Person und verschiebt pädagogische Verantwortung unangemessen."
      }
    ],
    "keys": [
      "stabilizer",
      "riskResource"
    ]
  },
  {
    "id": "S05",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Grenzen testende Schüler*in.",
    "title": "Grenzen testen",
    "situation": "{boundaryStudent} kommentiert deine Anweisung mit einem Grinsen. Einige Schüler*innen schauen erwartungsvoll zu.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich bleibe knapp, sichere den Unterricht und kläre später mit {boundaryStudent} Ziel, Auslöser und Konsequenzen.",
        "feedback": "Du schützt den Unterrichtsfluss und verschiebst die vertiefte Klärung in einen kooperativen Rahmen."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich übergehe den Kommentar und mache weiter.",
        "feedback": "Die Stunde läuft weiter, aber das Grenztestverhalten bleibt unbesprochen im Raum."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich beginne vor der Klasse eine längere Diskussion über Respekt.",
        "feedback": "Die Bühne wird größer; das Verhalten erhält Aufmerksamkeit und kann sich verstärken."
      }
    ],
    "keys": [
      "boundaryTesting"
    ]
  },
  {
    "id": "S06",
    "area": "Classroom Management",
    "trigger": "Melde-Regel vorhanden.",
    "title": "Antwort hineinrufen",
    "situation": "{callsOutStudent} ruft eine Lösung in die Klasse. Die Regel „{rule_melden}“ wurde vorher festgelegt.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich verweise ruhig auf die Regel und gebe {callsOutStudent} nach Meldung die Möglichkeit, die Antwort einzubringen.",
        "feedback": "Die Regel wird fair aktiviert, ohne den Beitrag abzuwerten."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich nehme die richtige Antwort an und gehe weiter.",
        "feedback": "Fachlich geht es weiter, aber das Reinrufen wird indirekt mit Aufmerksamkeit belohnt."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich schließe {callsOutStudent} für den Rest der Stunde vom Gespräch aus.",
        "feedback": "Die Reaktion ist unverhältnismäßig und erschwert eine kooperative Veränderung."
      }
    ],
    "keys": [
      "rule:melden",
      "callsOut"
    ]
  },
  {
    "id": "S07",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Keine passende Melde-Regel oder wiederholtes Reinrufen.",
    "title": "Reinrufen wiederholt sich",
    "situation": "Das Reinrufen von {callsOutStudent} tritt mehrfach auf. Eine einzelne Ermahnung reicht nicht mehr.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich vereinbare mit {callsOutStudent} ein konkretes Ziel: zweimal melden, bevor gesprochen wird, und danach kurze Rückmeldung.",
        "feedback": "Aus der Störung wird ein überprüfbares Veränderungsziel mit Rückmeldung."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich ignoriere das Reinrufen, solange die Antworten fachlich passen.",
        "feedback": "Die Stunde bleibt inhaltlich beweglich, aber das soziale Problem stabilisiert sich."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich drohe bei jedem Reinrufen sofort mit Ausschluss aus dem Raum.",
        "feedback": "Die Drohung verschärft die Lage und ersetzt keine Diagnose des Auslösers."
      }
    ],
    "keys": [
      "callsOut",
      "kvm"
    ]
  },
  {
    "id": "S08",
    "area": "Classroom Management",
    "trigger": "Handy-Regel vorhanden.",
    "title": "Handy unter dem Tisch",
    "situation": "{phoneStudent} schaut unter dem Tisch aufs Handy. Die Regel „{rule_handy}“ gehört zu euren Klassenregeln.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich erinnere knapp an die Handy-Regel und bespreche nach der Phase mit {phoneStudent} eine Selbstkontrollhilfe.",
        "feedback": "Die Regel klärt den Moment; die anschließende Selbstkontrolle zielt auf nachhaltige Veränderung."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich gehe näher an den Platz, ohne etwas zu sagen.",
        "feedback": "Das kann das Handy kurzfristig verschwinden lassen, löst aber das Muster nicht."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich nehme das Handy demonstrativ vor der Klasse weg und kommentiere es ausführlich.",
        "feedback": "Die Bloßstellung kann Widerstand erzeugen und lenkt die Klasse zusätzlich ab."
      }
    ],
    "keys": [
      "rule:handy",
      "phoneRisk"
    ]
  },
  {
    "id": "S09",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Handyrisiko ohne gute Sicht.",
    "title": "Verdecktes Off-Task-Verhalten",
    "situation": "{phoneStudent} sitzt in einem schwach kontrollierten Bereich. Mehrere Hinweise deuten auf verdecktes Off-Task-Verhalten.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich kläre mit {phoneStudent} Auslöser und Ziel und vereinbare eine kurze Selbstbeobachtung für die nächste Arbeitsphase.",
        "feedback": "Das Verhalten wird nicht nur kontrolliert, sondern mit Selbststeuerung bearbeitet."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich sammle am Stundenbeginn alle Handys ein.",
        "feedback": "Das reduziert das Symptom, bearbeitet aber nicht die individuelle Steuerungsschwierigkeit."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich unterstelle {phoneStudent} vor der Klasse absichtliche Arbeitsverweigerung.",
        "feedback": "Die Zuschreibung verengt den Blick auf Schuld und schwächt Kooperation."
      }
    ],
    "keys": [
      "phoneRisk",
      "blindRiskStudents"
    ]
  },
  {
    "id": "S10",
    "area": "Classroom Management",
    "trigger": "Regel gegen Kommentare vorhanden.",
    "title": "Spöttischer Kommentar",
    "situation": "Ein Kommentar über {sensitiveStudent} fällt, und die Person zieht sich sichtbar zurück. Die Regel „{rule_kommentar}“ kann aufgegriffen werden.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich stoppe den Kommentar knapp, verweise auf die Regel und sichere {sensitiveStudent} ohne großes Aufsehen ab.",
        "feedback": "Die Norm wird geschützt und die betroffene Person wird nicht zusätzlich exponiert."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich lenke sofort auf die Aufgabe zurück.",
        "feedback": "Die Aufmerksamkeit geht zur Sache zurück, aber die Verletzung bleibt sozial ungeklärt."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich frage laut, ob {sensitiveStudent} jetzt schon wieder beleidigt ist.",
        "feedback": "Das verstärkt Beschämung und kann Rückzug oder Konflikt auslösen."
      }
    ],
    "keys": [
      "rule:kommentar",
      "sensitive"
    ]
  },
  {
    "id": "S11",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Kritikempfindlichkeit oder Rückzug.",
    "title": "Rückzug nach Kritik",
    "situation": "{sensitiveStudent} reagiert nach einer Korrektur still und arbeitet nicht weiter. Die Stimmung am Tisch wird angespannt.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich frage leise nach der Wahrnehmung und vereinbare eine Form von Rückmeldung, die für {sensitiveStudent} besser bearbeitbar ist.",
        "feedback": "Die Schülersicht wird einbezogen; Korrektur bleibt möglich, aber weniger eskalierend."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich lasse {sensitiveStudent} kurz in Ruhe und beobachte weiter.",
        "feedback": "Das verhindert Druck, aber die wiederkehrende Reaktion wird noch nicht bearbeitet."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich erkläre vor der Klasse, dass Kritik ausgehalten werden muss.",
        "feedback": "Die öffentliche Belehrung verschärft die emotionale Lage."
      }
    ],
    "keys": [
      "sensitive",
      "kvm"
    ]
  },
  {
    "id": "S12",
    "area": "Classroom Management",
    "trigger": "Arbeitsplatz-Regel vorhanden.",
    "title": "Umherlaufen",
    "situation": "Während der Arbeitsphase steht {boundaryStudent} mehrfach auf. Die Regel „{rule_platz}“ ist festgelegt.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich verweise kurz auf die Platz-Regel und kläre danach, welche Funktion das Aufstehen für {boundaryStudent} hat.",
        "feedback": "Die Situation wird reguliert und anschließend als veränderbares Muster untersucht."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich lasse das Aufstehen zu, solange niemand direkt gestört wird.",
        "feedback": "Kurzfristig bleibt es ruhig, aber die Arbeitsstruktur wird unschärfer."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich verbiete {boundaryStudent} jede Bewegung bis Stundenende.",
        "feedback": "Das ist starr und kann Gegenreaktionen provozieren."
      }
    ],
    "keys": [
      "rule:platz",
      "boundaryTesting"
    ]
  },
  {
    "id": "S13",
    "area": "Classroom Management",
    "trigger": "Materialregel vorhanden.",
    "title": "Material holen",
    "situation": "Mehrere Schüler*innen stehen gleichzeitig auf, um Material zu holen. Die Regel „{rule_material}“ wurde gewählt.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich stoppe den Ablauf kurz, aktiviere die Material-Regel und starte die Phase neu geordnet.",
        "feedback": "Der Übergang wird wieder steuerbar; Unruhe wird über Struktur reduziert."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich warte, bis alle zurück am Platz sind.",
        "feedback": "Die Unruhe klingt ab, aber der Ablauf bleibt für die nächste Situation unklar."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich erkläre die Arbeitsphase für gescheitert und breche sie ab.",
        "feedback": "Das bestraft die ganze Gruppe und verhindert Lernen aus dem Ablaufproblem."
      }
    ],
    "keys": [
      "rule:material",
      "transition"
    ]
  },
  {
    "id": "S14",
    "area": "Classroom Management",
    "trigger": "Rollenregel vorhanden.",
    "title": "Unklare Gruppenarbeit",
    "situation": "In einer Gruppe übernehmen zwei alles, während andere stören oder warten. Die Regel „{rule_rollen}“ passt zur Situation.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich lasse Rollen verteilen und formuliere für jede Person einen sichtbaren Beitrag zur Aufgabe.",
        "feedback": "Verantwortlichkeit wird verteilt; Leerlauf und Störungspotenzial sinken."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich erinnere allgemein daran, dass alle mitarbeiten sollen.",
        "feedback": "Die Absicht ist richtig, aber ohne Rollen bleibt unklar, wer was tun soll."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich gebe die Aufgabe nur noch den zwei leistungsstarken Schüler*innen.",
        "feedback": "Das verstärkt Ausschluss und lässt Störungen bei den anderen wahrscheinlicher werden."
      }
    ],
    "keys": [
      "rule:rollen",
      "groupWork"
    ]
  },
  {
    "id": "S15",
    "area": "Classroom Management",
    "trigger": "Lautstärke-Regel vorhanden.",
    "title": "Lautstärke steigt",
    "situation": "Die Arbeitslautstärke steigt schrittweise. Die Regel „{rule_lautstaerke}“ wurde als verbindlich ausgewählt.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich stoppe kurz, benenne die Ziellautstärke und lasse die Gruppen mit einem leisen Neustart beginnen.",
        "feedback": "Die Regel wird konkretisiert und in Verhalten übersetzt."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich spreche selbst lauter, um die Klasse zu übertönen.",
        "feedback": "Du bleibst hörbar, aber das Lärmniveau wird nicht pädagogisch reguliert."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich drohe der ganzen Klasse mit Zusatzaufgaben.",
        "feedback": "Die Drohung kann Ärger erzeugen und klärt nicht, wie leise Arbeit praktisch gelingen soll."
      }
    ],
    "keys": [
      "rule:lautstaerke",
      "noise"
    ]
  },
  {
    "id": "S16",
    "area": "Classroom Management",
    "trigger": "Hilfesignal-Regel vorhanden.",
    "title": "Hilfe-Rufe",
    "situation": "{callsOutStudent} ruft wiederholt nach Hilfe. Die Regel „{rule_hilfezeichen}“ wurde vorher festgelegt.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich erinnere an das Hilfesignal und vereinbare mit {callsOutStudent} eine kurze Warte-Strategie.",
        "feedback": "Das Verhalten wird in eine klare Routine überführt und fördert Selbststeuerung."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich beantworte die Hilfe-Rufe, damit die Aufgabe weitergeht.",
        "feedback": "Die Aufgabe läuft weiter, aber das Reinrufen wird funktional belohnt."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich antworte gar nicht mehr auf Fragen von {callsOutStudent}.",
        "feedback": "Das entzieht Unterstützung und kann Frustration oder Eskalation erhöhen."
      }
    ],
    "keys": [
      "rule:hilfezeichen",
      "callsOut"
    ]
  },
  {
    "id": "S17",
    "area": "Classroom Management",
    "trigger": "Stoppsignal-Regel vorhanden.",
    "title": "Ruhezeichen verpufft",
    "situation": "Beim Ruhezeichen reagieren einige nicht. Die Regel „{rule_stoppsignal}“ ist Teil eurer Auswahl.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich wiederhole das Signal ruhig, warte sichtbar ab und bestätige die Gruppen, die es umsetzen.",
        "feedback": "Das Signal gewinnt Verbindlichkeit, ohne in einen Machtkampf zu kippen."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich beginne trotzdem mit der Erklärung.",
        "feedback": "Ein Teil hört zu, aber die Regel verliert an Verbindlichkeit."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich schimpfe laut über die fehlende Disziplin.",
        "feedback": "Die Lautstärke steigt weiter und das Stoppsignal wird mit Ärger verknüpft."
      }
    ],
    "keys": [
      "rule:stoppsignal",
      "signal"
    ]
  },
  {
    "id": "S18",
    "area": "Classroom Management",
    "trigger": "Startregel vorhanden.",
    "title": "Unruhiger Stundenbeginn",
    "situation": "Zu Beginn suchen mehrere noch Material. Die Regel „{rule_start}“ wurde vereinbart.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich aktiviere die Startaufgabe sichtbar und gebe eine kurze Rückmeldung zur vorbereiteten Arbeitsbereitschaft.",
        "feedback": "Der Stundenbeginn wird strukturiert; vorbereitendes Verhalten wird verstärkt."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich warte, bis sich die Klasse selbst sortiert.",
        "feedback": "Die Klasse findet eventuell hinein, aber der Start bleibt zufällig."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich beginne mit einem langen Vorwurf über fehlende Vorbereitung.",
        "feedback": "Der Einstieg wird emotional belastet und die Arbeitszeit geht verloren."
      }
    ],
    "keys": [
      "rule:start",
      "startRoutine"
    ]
  },
  {
    "id": "S19",
    "area": "Classroom Management",
    "trigger": "Wechsel-Regel vorhanden.",
    "title": "Sozialformwechsel",
    "situation": "Beim Wechsel in Partnerarbeit entsteht Bewegung und Gerede. Die Regel „{rule_wechsel}“ passt genau.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich halte den Wechsel an, erinnere an das Startsignal und lasse den Ablauf in klaren Schritten neu beginnen.",
        "feedback": "Der Übergang wird wieder vorhersehbar und reduziert Anschlussstörungen."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich lasse den Wechsel laufen und beobachte, ob es sich beruhigt.",
        "feedback": "Die Situation kann sich setzen, aber die Routine wird nicht stabiler."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich streiche Partnerarbeit dauerhaft für die Klasse.",
        "feedback": "Das entzieht eine Lernform, statt den Übergang zu trainieren."
      }
    ],
    "keys": [
      "rule:wechsel",
      "transition"
    ]
  },
  {
    "id": "S20",
    "area": "Classroom Management",
    "trigger": "Regel zu privaten Gesprächen vorhanden.",
    "title": "Nebengespräche",
    "situation": "Am Rand der Klasse entstehen private Gespräche. Die Regel „{rule_pausen}“ wurde ausgewählt.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich erinnere leise an die Regel und gebe eine konkrete Rückkehr zur Aufgabe vor.",
        "feedback": "Die Störung wird knapp reguliert, ohne sie groß zu machen."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich platziere mich näher an die Gruppe.",
        "feedback": "Nähe kann wirken, aber die inhaltliche Erwartung bleibt unausgesprochen."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich lasse die Gesprächsinhalte vor der Klasse wiederholen.",
        "feedback": "Das beschämt und macht das Private erst recht zum Gruppenthema."
      }
    ],
    "keys": [
      "rule:pausen",
      "distractor"
    ]
  },
  {
    "id": "S21",
    "area": "Classroom Management",
    "trigger": "Ausreden-Regel vorhanden.",
    "title": "Unterbrechungen im Gespräch",
    "situation": "Mehrere unterbrechen sich im Plenum. Die Regel „{rule_ausreden}“ wurde festgelegt.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich stoppe kurz und lasse die letzte Sprecherin den Gedanken zu Ende führen.",
        "feedback": "Die Gesprächsnorm wird direkt geübt und nicht nur abstrakt eingefordert."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich fasse selbst zusammen und gehe zur nächsten Frage.",
        "feedback": "Das Gespräch bleibt fachlich geordnet, aber die Schüler*innen üben das Ausreden nicht."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich werte die Unterbrechenden als respektlos ab.",
        "feedback": "Die Abwertung kann neue Gegenreaktionen auslösen und klärt kein Gesprächsverfahren."
      }
    ],
    "keys": [
      "rule:ausreden",
      "plenum"
    ]
  },
  {
    "id": "S22",
    "area": "Classroom Management",
    "trigger": "Respekt-Regel vorhanden.",
    "title": "Fehlerkultur kippt",
    "situation": "Nach einer falschen Antwort lachen einige. Die Regel „{rule_respekt}“ kann aufgegriffen werden.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich stoppe das Lachen, sichere die Fehlerkultur und knüpfe fachlich an den Beitrag an.",
        "feedback": "Der Schutz der Person und der Lernprozess werden gleichzeitig gesichert."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich ignoriere das Lachen und erkläre die richtige Lösung.",
        "feedback": "Die Sache wird geklärt, aber die soziale Unsicherheit bleibt bestehen."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich lache kurz mit, damit es lockerer wird.",
        "feedback": "Das normalisiert Bloßstellung und kann Beteiligung hemmen."
      }
    ],
    "keys": [
      "rule:respekt",
      "sensitive"
    ]
  },
  {
    "id": "S23",
    "area": "Classroom Management",
    "trigger": "Redundante Melde-Regel gewählt.",
    "title": "Doppelte Melde-Norm",
    "situation": "Die Klasse fragt, ob „{rule_meldenplus}“ dasselbe bedeutet wie die andere Melde-Regel. Die Unklarheit stört den Ablauf.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich fasse die Regeln zusammen und formuliere eine eindeutige Melde-Erwartung für das Plenum.",
        "feedback": "Unklarheit wird reduziert; die Regel wird für später nutzbar."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich sage, dass beide Regeln ungefähr dasselbe meinen.",
        "feedback": "Die Klasse versteht die Richtung, aber die Formulierung bleibt unscharf."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich erkläre, dass Nachfragen zu Regeln jetzt stören.",
        "feedback": "Das schwächt Beteiligung und verhindert gemeinsame Klärung."
      }
    ],
    "keys": [
      "rule:meldenplus",
      "ruleClarity"
    ]
  },
  {
    "id": "S24",
    "area": "Classroom Management",
    "trigger": "Müll wurde nicht entfernt.",
    "title": "Störreiz im Raum",
    "situation": "In der Nähe eines Platzes liegt noch Müll. Mehrere Blicke wandern dorthin und die Aufmerksamkeit bricht ab.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich lasse den Störreiz ruhig entfernen und stelle danach den Arbeitsfokus wieder her.",
        "feedback": "Der Umweltfaktor wird verändert, statt Verhalten vorschnell einer Person zuzuschreiben."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich ignoriere den Müll und fahre mit der Erklärung fort.",
        "feedback": "Der Unterricht läuft weiter, aber der Störreiz bleibt verfügbar."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich beschuldige die nächstsitzende Person ohne Klärung.",
        "feedback": "Das erzeugt Abwehr und verfehlt den eigentlichen Umweltfaktor."
      }
    ],
    "keys": [
      "trashRemaining",
      "environment"
    ]
  },
  {
    "id": "S25",
    "area": "Classroom Management",
    "trigger": "Raum wurde von Müll befreit.",
    "title": "Aufgeräumter Raum",
    "situation": "Die vorbereitete Lernumgebung ist sauber. Eine Gruppe kommt schnell in die Arbeitsphase hinein.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich verstärke die ruhige Arbeitsaufnahme und mache die klare Umgebung als Ressource sichtbar.",
        "feedback": "Positives Verhalten wird markiert; die präventive Vorbereitung zahlt sich aus."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich beginne ohne Kommentar mit der Aufgabe.",
        "feedback": "Der Unterricht läuft, aber die gelungene Struktur wird nicht bewusst verstärkt."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich suche trotzdem nach einem Anlass für Kritik.",
        "feedback": "Unnötige Kritik kann das positive Arbeitsklima schwächen."
      }
    ],
    "keys": [
      "trashCleaned",
      "resource"
    ]
  },
  {
    "id": "S26",
    "area": "Classroom Management",
    "trigger": "Blockierte Laufwege.",
    "title": "Kein Gang frei",
    "situation": "Zwischen zwei Tischreihen ist kaum Durchkommen. Eine Schülerin braucht Hilfe, aber du kommst nicht schnell zum Platz.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich organisiere einen kurzen sicheren Laufweg und halte für die nächste Stunde eine Tischkorrektur fest.",
        "feedback": "Das aktuelle Problem wird gelöst und als Planungsdaten für die nächste Vorbereitung genutzt."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich gebe die Hilfe aus der Entfernung.",
        "feedback": "Die Aufgabe kann weitergehen, aber Nähe und genaue Unterstützung fehlen."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich schiebe während der Arbeitsphase hektisch mehrere Tische um.",
        "feedback": "Die Bewegung erzeugt neue Unruhe und unterbricht die Arbeitsphase stark."
      }
    ],
    "keys": [
      "blockedWalkways",
      "roomLayout"
    ]
  },
  {
    "id": "S27",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Vermittelnde Schüler*in sitzt zwischen Konfliktpotenzialen.",
    "title": "Vermittlung nutzen",
    "situation": "{mediator} sitzt in der Nähe zweier unruhiger Plätze. Ein kleiner Konflikt zeichnet sich ab.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich bitte {mediator} nur freiwillig um eine kurze sachliche Rollenhilfe und begleite die Klärung selbst.",
        "feedback": "Die Ressource wird genutzt, ohne Verantwortung abzugeben."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich beobachte, ob die Gruppe es selbst regelt.",
        "feedback": "Selbstregulation ist möglich, aber der Konflikt kann wieder aufflammen."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich erkläre {mediator} zur zuständigen Streitschlichtung für den Tisch.",
        "feedback": "Das überfordert die Rolle und entlastet die Lehrkraft zu stark."
      }
    ],
    "keys": [
      "mediator",
      "conflict"
    ]
  },
  {
    "id": "S28",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Riskante diagonale Nachbarschaft.",
    "title": "Diagonaler Konflikt",
    "situation": "{conflictStudent} und ein störanfälliger Nachbar reagieren diagonal aufeinander. Die Kommentare sind leise, aber dauerhaft.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich beschreibe das Muster mit beiden kurz und vereinbare, welches konkrete Verhalten in der Phase unterlassen wird.",
        "feedback": "Das diagonale Muster wird sichtbar und als gemeinsames Ziel bearbeitet."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich trenne die Blicke, indem ich mich zwischen die Tische stelle.",
        "feedback": "Die Präsenz hilft im Moment, ersetzt aber keine Veränderungsvereinbarung."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich stelle beide vor der Klasse als Problemduo dar.",
        "feedback": "Die Etikettierung kann die Rolle verfestigen und neue Provokation auslösen."
      }
    ],
    "keys": [
      "diagonalRisk",
      "conflictWithBoys"
    ]
  },
  {
    "id": "S29",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Schwaches Sichtfeld.",
    "title": "Nur schwach sichtbar",
    "situation": "{riskStudent} sitzt nicht völlig blind, aber nur in einem schwachen Sichtbereich. Kleine Störungen bleiben lange unbemerkt.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich vereinbare ein diskretes Rückmeldesignal und prüfe nach zehn Minuten kurz den Zielstand.",
        "feedback": "Das schwache Sichtfeld wird durch kooperative Rückmeldung ergänzt."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich schaue gelegentlich in die Richtung.",
        "feedback": "Das kann helfen, bleibt aber unsystematisch."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich sage, dass {riskStudent} nun besonders streng beobachtet wird.",
        "feedback": "Kontrolldruck ersetzt keine Selbststeuerung und kann Widerstand erhöhen."
      }
    ],
    "keys": [
      "weaklyVisibleRiskStudents",
      "vision"
    ]
  },
  {
    "id": "S30",
    "area": "Classroom Management",
    "trigger": "Lehrkraftblickrichtung ungünstig.",
    "title": "Blickrichtung passt nicht",
    "situation": "Ein relevanter Tisch liegt seitlich außerhalb deines Blickfächers. Dort entsteht Unruhe, während du vorne erklärst.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich ändere meine Position kurz und sichere danach die Erklärung mit Blickkontakt zum kritischen Bereich.",
        "feedback": "Die Steuerung wird über Präsenz und Wahrnehmung verbessert."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich erkläre weiter und hoffe, dass die Gruppe ruhig bleibt.",
        "feedback": "Das kann funktionieren, aber die Schwachstelle bleibt bestehen."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich beschuldige die gesamte letzte Reihe, ohne zu sehen, was passiert ist.",
        "feedback": "Unpräzise Zuschreibung senkt Fairness und kann Widerstand auslösen."
      }
    ],
    "keys": [
      "teacherPosition",
      "blindspot"
    ]
  },
  {
    "id": "S31",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Niedrige Startstabilität.",
    "title": "Vorbelasteter Start",
    "situation": "Die Vorbereitung hat viele Risiken erzeugt. Schon zu Beginn wirkt die Klasse angespannt.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich mache eine kurze kooperative Bestandsaufnahme: Was braucht die Gruppe jetzt, um arbeitsfähig zu werden?",
        "feedback": "Die Klasse wird als System angesprochen; Stabilität wird gemeinsam hergestellt."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich beginne direkt mit dem Fachinhalt.",
        "feedback": "Das kann Zeit sparen, aber die Spannung bleibt im Hintergrund."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich starte mit der Ankündigung harter Konsequenzen.",
        "feedback": "Die Vorbelastung wird verschärft und die Kooperation sinkt."
      }
    ],
    "keys": [
      "lowPreparationScore",
      "system"
    ]
  },
  {
    "id": "S32",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Hohe Startstabilität.",
    "title": "Stabile Ausgangslage",
    "situation": "Die Vorbereitung war tragfähig. Eine kleine Störung tritt auf, ohne dass die Klasse sofort mitzieht.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich reagiere knapp, bestätige die stabile Arbeitsweise und kläre das Einzelmuster später kurz.",
        "feedback": "Die vorhandene Stabilität wird genutzt, ohne die Situation aufzublähen."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich lasse die kleine Störung vorbeigehen.",
        "feedback": "Die Klasse bleibt stabil, aber das Muster wird nicht beobachtet."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich unterbreche die Stunde für eine lange Grundsatzrede.",
        "feedback": "Die stabile Arbeitslage wird unnötig gestört."
      }
    ],
    "keys": [
      "highPreparationScore",
      "resource"
    ]
  },
  {
    "id": "S33",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Wiederkehrendes Muster an einem Tisch.",
    "title": "Muster statt Einzelfall",
    "situation": "Am selben Tisch entstehen wiederholt kleine Störungen. Es wirkt nicht wie ein einmaliger Vorfall.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich sammle mit den Beteiligten kurz Auslöser, Zielverhalten und eine überprüfbare Vereinbarung.",
        "feedback": "Diagnose, Planung und Intervention werden miteinander verbunden."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich wechsle das Thema und beobachte später weiter.",
        "feedback": "Das nimmt Druck heraus, aber der Problemlöseprozess beginnt noch nicht."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich erkläre eine Person am Tisch zum alleinigen Problem.",
        "feedback": "Das widerspricht der systemischen Sicht und verengt die Lösungsmöglichkeiten."
      }
    ],
    "keys": [
      "kvm",
      "system"
    ]
  },
  {
    "id": "S34",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Verstärkung positiven Verhaltens.",
    "title": "Kurzer Fortschritt",
    "situation": "{riskStudent} schafft es einige Minuten, die vereinbarte Arbeitsweise einzuhalten. Der Fortschritt ist noch fragil.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich gebe eine kurze konkrete Rückmeldung und verknüpfe sie mit dem vereinbarten Ziel.",
        "feedback": "Erwünschtes Verhalten wird präzise verstärkt und bleibt an Selbststeuerung gebunden."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich sage nichts, damit es nicht auffällt.",
        "feedback": "Das vermeidet Aufmerksamkeit, aber der Fortschritt wird nicht stabilisiert."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich sage, dass es ja endlich einmal funktioniert.",
        "feedback": "Die ironische Färbung schwächt die Verstärkung und kann beschämen."
      }
    ],
    "keys": [
      "reinforcement",
      "riskStudent"
    ]
  },
  {
    "id": "S35",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Selbstbewertung.",
    "title": "Selbst einschätzen",
    "situation": "Nach der Arbeitsphase soll {riskStudent} einschätzen, ob das Ziel erreicht wurde. Die Einschätzung weicht von deiner Beobachtung ab.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich vergleiche ruhig Selbst- und Fremdwahrnehmung anhand konkreter Beobachtungen.",
        "feedback": "Selbstbewertung wird aufgebaut, ohne die Schülersicht abzuwerten."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich akzeptiere die Selbsteinschätzung kommentarlos.",
        "feedback": "Die Kooperation bleibt freundlich, aber die Einschätzung wird nicht geschärft."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich erkläre die Selbsteinschätzung für falsch und beende das Gespräch.",
        "feedback": "Das schwächt Selbstbewertung und macht die Rückmeldung zum Machtakt."
      }
    ],
    "keys": [
      "selfEvaluation",
      "kvm"
    ]
  },
  {
    "id": "S36",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Zielvereinbarung zu unklar.",
    "title": "Unklares Ziel",
    "situation": "Die Vereinbarung „besser mitmachen“ bleibt zu allgemein. Beim nächsten Versuch weiß {riskStudent} nicht genau, was gemeint ist.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich formuliere das Ziel beobachtbar: Material bereit, leise starten und bei Hilfe das Signal nutzen.",
        "feedback": "Das Ziel wird überprüfbar und anschlussfähig für Rückmeldung."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich erinnere daran, sich mehr Mühe zu geben.",
        "feedback": "Die Richtung ist positiv, aber weiterhin schwer messbar."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich werte das Scheitern als fehlenden Willen.",
        "feedback": "Die Zuschreibung verhindert eine präzise Anpassung des Plans."
      }
    ],
    "keys": [
      "goalSetting",
      "kvm"
    ]
  },
  {
    "id": "S37",
    "area": "Classroom Management",
    "trigger": "Keine passende Regel ausgewählt.",
    "title": "Regellücke",
    "situation": "Ein Verhalten tritt auf, zu dem keine eurer sechs Klassenregeln direkt passt. Die Klasse fragt nach Orientierung.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich benenne die Erwartung situativ und notiere, dass die Regelstruktur später ergänzt werden muss.",
        "feedback": "Du hältst die Situation handlungsfähig und nutzt sie für die Weiterentwicklung der Struktur."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich entscheide spontan, ohne die Regelstruktur zu erwähnen.",
        "feedback": "Die Situation wird gelöst, aber die Klasse erkennt keine verlässliche Logik."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich behaupte, dass die Regel schon irgendwo steht.",
        "feedback": "Unklare Regeln verlieren Glaubwürdigkeit und Vorhersagbarkeit."
      }
    ],
    "keys": [
      "ruleGap",
      "classroomManagement"
    ]
  },
  {
    "id": "S38",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Beobachtungslernen in der Gruppe.",
    "title": "Andere steigen ein",
    "situation": "Eine kleine Störung von {riskStudent} wird von zwei anderen aufgegriffen. Das Verhalten droht sich als Gruppenmuster auszubreiten.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich stoppe knapp, sichere die Gruppe und bespreche später mit {riskStudent} sowie der Gruppe das beobachtete Muster.",
        "feedback": "Die Intervention nimmt das System in den Blick und reduziert Nachahmung."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich fokussiere nur auf die fachliche Aufgabe.",
        "feedback": "Der Unterricht geht weiter, aber das Gruppenmuster bleibt ungeklärt."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich bestrafe nur {riskStudent} öffentlich als Auslöser.",
        "feedback": "Das blendet die Gruppenwirkung aus und kann Solidarität gegen die Lehrkraft erzeugen."
      }
    ],
    "keys": [
      "observationalLearning",
      "system"
    ]
  },
  {
    "id": "S39",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Plan muss angepasst werden.",
    "title": "Intervention passt nicht",
    "situation": "Die vereinbarte Strategie wirkt bei {riskStudent} heute nicht. Die Störung nimmt trotz Erinnerung zu.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich passe den Plan nach kurzer Rücksprache an und prüfe, welcher Auslöser heute anders ist.",
        "feedback": "Die Intervention bleibt flexibel und wird nicht als starres Programm behandelt."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich halte am Plan fest und warte die Stunde ab.",
        "feedback": "Das wahrt Kontinuität, kann aber am aktuellen Auslöser vorbeigehen."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich erkläre die Vereinbarung für gescheitert und breche sie ab.",
        "feedback": "Das schwächt Verlässlichkeit und verhindert eine lernende Anpassung."
      }
    ],
    "keys": [
      "planAdjustment",
      "kvm"
    ]
  },
  {
    "id": "S40",
    "area": "Kooperative Verhaltensmodifikation",
    "trigger": "Abschlussbewertung.",
    "title": "Kurze Auswertung",
    "situation": "Am Ende der Stunde soll entschieden werden, ob die Intervention fortgesetzt wird. Die Beobachtungen sind gemischt.",
    "answers": [
      {
        "score": 1,
        "type": "positive",
        "text": "Ich werte mit {riskStudent} kurz aus, was funktioniert hat, was nicht, und welches Ziel als Nächstes realistisch ist.",
        "feedback": "Die Veränderung wird als Prozess verstanden und mit neuer Planung verbunden."
      },
      {
        "score": 0,
        "type": "neutral",
        "text": "Ich verschiebe die Auswertung auf irgendwann später.",
        "feedback": "Das vermeidet Eile, aber die Lernchance der Stunde geht verloren."
      },
      {
        "score": -1,
        "type": "negative",
        "text": "Ich bewerte allein und teile {riskStudent} nur das Ergebnis mit.",
        "feedback": "Die Kooperation wird reduziert und Selbststeuerung bleibt außen vor."
      }
    ],
    "keys": [
      "evaluation",
      "kvm"
    ]
  }
];

const fallbackStudents = [
  { id: 'julius', name: 'Julius', age: 12, note: 'verträgt sich schlecht mit anderen Jungs', hidden: { gender: 'm', risk: 3, conflictWithBoys: true, needsMonitoring: true } },
  { id: 'petra', name: 'Petra', age: 15, note: 'lenkt häufig Sitznachbar*innen ab', hidden: { gender: 'f', risk: 3, distractor: true, needsMonitoring: true } },
  { id: 'mehmet', name: 'Mehmet', age: 13, note: 'arbeitet ruhig und stabilisiert Gruppen', hidden: { gender: 'm', risk: 1, stabilizer: true } },
  { id: 'lina', name: 'Lina', age: 12, note: 'reagiert empfindlich auf Kritik und Spott', hidden: { gender: 'f', risk: 2, sensitive: true, needsSafety: true } },
  { id: 'ben', name: 'Ben', age: 14, note: 'testet gerne Grenzen aus', hidden: { gender: 'm', risk: 3, boundaryTesting: true, needsMonitoring: true } },
  { id: 'sara', name: 'Sara', age: 13, note: 'arbeitet zuverlässig und hilft anderen', hidden: { gender: 'f', risk: 1, stabilizer: true } },
  { id: 'tom', name: 'Tom', age: 12, note: 'sucht Aufmerksamkeit durch Zwischenrufe', hidden: { gender: 'm', risk: 3, callsOut: true, needsMonitoring: true } },
  { id: 'emily', name: 'Emily', age: 13, note: 'braucht klare Orientierung bei Übergängen', hidden: { gender: 'f', risk: 2, transitionNeeds: true } },
  { id: 'niklas', name: 'Niklas', age: 14, note: 'versteckt gern das Handy unter dem Tisch', hidden: { gender: 'm', risk: 3, phoneRisk: true, needsMonitoring: true } },
  { id: 'amira', name: 'Amira', age: 12, note: 'vermittelt oft zwischen Mitschüler*innen', hidden: { gender: 'f', risk: 1, mediator: true } }
];

const RULE_LABELS = {
  melden: 'Wir melden uns, bevor wir sprechen.',
  ausreden: 'Wir hören einander ausreden.',
  handy: 'Handys bleiben während des Unterrichts in der Tasche.',
  platz: 'Während Arbeitsphasen bleiben wir am Platz, außer es gibt einen Auftrag.',
  lautstaerke: 'Wir sprechen in Arbeitsphasen in angemessener Lautstärke.',
  respekt: 'Wir gehen respektvoll mit Fehlern und Beiträgen anderer um.',
  hilfezeichen: 'Wenn wir Hilfe brauchen, nutzen wir zuerst das vereinbarte Hilfesignal.',
  rollen: 'Bei Gruppenarbeit hat jede Person eine klare Aufgabe.',
  material: 'Material wird nur nach dem vereinbarten Ablauf geholt.',
  stoppsignal: 'Beim Ruhezeichen stoppen wir Gespräche und richten den Blick nach vorne.',
  start: 'Zu Beginn liegt das Arbeitsmaterial bereit und die Startaufgabe wird bearbeitet.',
  wechsel: 'Beim Wechsel der Sozialform warten wir auf das Startsignal.',
  kommentar: 'Kommentare über Mitschüler*innen werden unterlassen.',
  meldenplus: 'Wer sprechen möchte, meldet sich und wartet, bis er oder sie aufgerufen wird.',
  pausen: 'Private Gespräche werden auf Pausen verschoben.'
};

const scenarioPanel = document.getElementById('scenarioPanel');
const scenarioList = document.getElementById('scenarioList');
const scenarioBtn = document.getElementById('showScenariosBtn');
const closePanelBtn = document.getElementById('closeScenarioPanel');
const scenarioSearch = document.getElementById('scenarioSearch');
const activeCount = document.getElementById('activeScenarioCount');
const totalCount = document.getElementById('totalScenarioCount');
const overviewGrid = document.getElementById('scenarioOverviewGrid');
const acceptedRulesBox = document.getElementById('acceptedRulesBox');

const step1 = loadJson('classroomGame.step1') || {};
const step2 = loadJson('classroomGame.step2.rules') || {};
const students = Array.isArray(step1.students) ? step1.students : fallbackStudents;
const acceptedRuleIds = Array.isArray(step2.acceptedRuleIds) ? step2.acceptedRuleIds : [];
const metrics = step1.metrics || {};

function loadJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('Konnte Daten nicht lesen:', key, err);
    return null;
  }
}

function studentByTrait(trait, fallbackId) {
  const found = students.find(s => s.hidden && s.hidden[trait]);
  return found || students.find(s => s.id === fallbackId) || students[0] || { name: 'ein*e Schüler*in', id: 'unknown' };
}

function riskStudent() {
  const blindId = (metrics.blindRiskStudents || [])[0];
  if (blindId) return students.find(s => s.id === blindId) || studentByTrait('needsMonitoring', 'ben');
  return studentByTrait('needsMonitoring', 'ben');
}

function getRule(id) {
  const fromSaved = (step2.acceptedRules || []).find(rule => rule && rule.id === id);
  return fromSaved?.text || RULE_LABELS[id] || `Regel $<built-in function id>`;
}

function replacements() {
  return {
    riskStudent: riskStudent().name,
    distractor: studentByTrait('distractor', 'petra').name,
    stabilizer: studentByTrait('stabilizer', 'sara').name,
    boundaryStudent: studentByTrait('boundaryTesting', 'ben').name,
    callsOutStudent: studentByTrait('callsOut', 'tom').name,
    phoneStudent: studentByTrait('phoneRisk', 'niklas').name,
    sensitiveStudent: studentByTrait('sensitive', 'lina').name,
    mediator: studentByTrait('mediator', 'amira').name,
    conflictStudent: studentByTrait('conflictWithBoys', 'julius').name,
    rule_melden: getRule('melden'),
    rule_handy: getRule('handy'),
    rule_kommentar: getRule('kommentar'),
    rule_platz: getRule('platz'),
    rule_material: getRule('material'),
    rule_rollen: getRule('rollen'),
    rule_lautstaerke: getRule('lautstaerke'),
    rule_hilfezeichen: getRule('hilfezeichen'),
    rule_stoppsignal: getRule('stoppsignal'),
    rule_start: getRule('start'),
    rule_wechsel: getRule('wechsel'),
    rule_pausen: getRule('pausen'),
    rule_ausreden: getRule('ausreden'),
    rule_respekt: getRule('respekt'),
    rule_meldenplus: getRule('meldenplus')
  };
}

function fillTemplate(text) {
  const data = replacements();
  return String(text || '').replace(/\{(.*?)\}/g, (_, key) => data[key] ?? key);
}

function isScenarioActive(scenario) {
  const keys = scenario.keys || [];
  if (!keys.length) return true;
  let score = 0;
  keys.forEach(key => {
    if (key.startsWith('rule:')) {
      if (acceptedRuleIds.includes(key.slice(5))) score += 2;
      return;
    }
    if (key === 'blindRiskStudents' && (metrics.blindRiskStudents || []).length) score += 2;
    if (key === 'visionRiskStudents' && (metrics.visionRiskStudents || []).length) score += 2;
    if (key === 'weaklyVisibleRiskStudents' && (metrics.weaklyVisibleRiskStudents || []).length) score += 2;
    if (key === 'riskyPairs' && (metrics.riskyPairs || []).length) score += 2;
    if (key === 'blockedWalkways' && (metrics.spacing?.blockedWalkways || 0) > 0) score += 2;
    if (key === 'trashRemaining' && (metrics.roomObjects?.remainingTrash || 0) > 0) score += 2;
    if (key === 'trashCleaned' && (metrics.roomObjects?.removedTrash || 0) > 0) score += 2;
    if (key === 'lowPreparationScore' && Number(step1.rawPreparationScore ?? step1.preparationScore ?? 5) < 4) score += 2;
    if (key === 'highPreparationScore' && Number(step1.rawPreparationScore ?? step1.preparationScore ?? 0) >= 7) score += 2;
    if (['distractor','stabilizer','boundaryTesting','callsOut','phoneRisk','sensitive','mediator','conflictWithBoys','needsMonitoring'].includes(key) && students.some(s => s.hidden && s.hidden[key])) score += 1;
    if (['kvm','system','classroomManagement','resource','transition','groupWork','noise','signal','plenum','environment','teacherPosition','blindspot','vision','selfEvaluation','goalSetting','planAdjustment','evaluation','observationalLearning','reinforcement','ruleGap','ruleClarity','diagonalRisk','conflict','riskResource','startRoutine'].includes(key)) score += 1;
  });
  return score >= 2;
}

function renderOverview() {
  const prep = step1.rawPreparationScore ?? step1.preparationScore ?? '–';
  const chosen = acceptedRuleIds.length;
  const blind = (metrics.blindRiskStudents || []).length;
  const risky = (metrics.riskyPairs || []).length;
  overviewGrid.innerHTML = `
    <article><strong>${prep}</strong><span>Startstabilität</span></article>
    <article><strong>${chosen}/6</strong><span>verbindliche Regeln</span></article>
    <article><strong>${blind}</strong><span>blinde Risikoplätze</span></article>
    <article><strong>${risky}</strong><span>riskante Nachbarschaften</span></article>
  `;
  acceptedRulesBox.innerHTML = acceptedRuleIds.length
    ? acceptedRuleIds.map(id => `<span>${escapeHtml(getRule(id))}</span>`).join('')
    : '<span>Keine Regeln gespeichert.</span>';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
}

function renderScenarios() {
  const query = (scenarioSearch?.value || '').toLowerCase().trim();
  const cards = FALLBACK_SCENARIOS
    .map(s => ({ ...s, active: isScenarioActive(s) }))
    .filter(s => {
      if (!query) return true;
      return [s.id, s.title, s.area, s.trigger, s.situation, ...(s.keys || [])].join(' ').toLowerCase().includes(query);
    });
  const active = FALLBACK_SCENARIOS.filter(isScenarioActive).length;
  if (activeCount) activeCount.textContent = String(active);
  if (totalCount) totalCount.textContent = String(FALLBACK_SCENARIOS.length);
  scenarioList.innerHTML = cards.map(renderScenarioCard).join('');
}

function renderScenarioCard(scenario) {
  const answers = [...scenario.answers].sort((a,b) => b.score - a.score);
  return `<article class="scenario-card ${scenario.active ? 'active' : 'inactive'}">
    <div class="scenario-card-head">
      <span class="scenario-id">${scenario.id}</span>
      <span class="scenario-area">${escapeHtml(scenario.area)}</span>
      <span class="scenario-state">${scenario.active ? 'passt zur aktuellen Klasse' : 'Reserve-Szenario'}</span>
    </div>
    <h3>${escapeHtml(scenario.title)}</h3>
    <p class="scenario-trigger">Auslöser: ${escapeHtml(fillTemplate(scenario.trigger))}</p>
    <p class="scenario-situation">${escapeHtml(fillTemplate(scenario.situation))}</p>
    <div class="scenario-answers">
      ${answers.map(answer => `<div class="scenario-answer score-${answer.score}">
        <b>${answer.score > 0 ? '+1' : answer.score < 0 ? '-1' : '0'}</b>
        <span>${escapeHtml(fillTemplate(answer.text))}</span>
        <small>${escapeHtml(fillTemplate(answer.feedback))}</small>
      </div>`).join('')}
    </div>
    <div class="scenario-tags">${(scenario.keys || []).map(key => `<span>${escapeHtml(key)}</span>`).join('')}</div>
  </article>`;
}

function openPanel() {
  scenarioPanel.hidden = false;
  document.body.classList.add('scenario-panel-open');
  renderScenarios();
}

function closePanel() {
  scenarioPanel.hidden = true;
  document.body.classList.remove('scenario-panel-open');
}

if (scenarioBtn) scenarioBtn.addEventListener('click', openPanel);
if (closePanelBtn) closePanelBtn.addEventListener('click', closePanel);
if (scenarioSearch) scenarioSearch.addEventListener('input', renderScenarios);

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && scenarioPanel && !scenarioPanel.hidden) closePanel();
});

renderOverview();
renderScenarios();
