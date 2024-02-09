const translationDeDE = {
    "menu.classifications": "Klassifizierungen",
    "menu.history": "Verlauf",
    "menu.regions": "Regionen",
    "error.image":  `Bild konnte nicht geladen werden\n\nÜberprüfen Sie, ob ihr Bild funktioniert, indem Sie ${imageSrc || videoSrc
    } in einem Webbrowswer aufrufen. Wenn diese URL funktioniert, kann es sein, dass der Server, der die URL hostet, Ihnen kein Zugriff auf das Bild von Ihrer aktuellen Domain nicht erlaubt. Passen Sie die Servereinstellungen an, damit das Bild angezeigt werden kann.${!useCrossOrigin
      ? ""
      : `\n\nIhr Bild wird möglicherweise blockiert, weil es nicht mit CORs-Headern gesendet wird. Für die Pixel-Segmentierung benötigt die Browser-Web-Sicherheit CORs-Header, damit der Algorithmius die Pixeldatenaus dem Bild lesen kann. CORs-Header lassen sich leicht hinzufügen, wenn Sie einen S3-Bucket verwenden oder den Server besitzen auf dem die Bilder gehostet werden.`
    }\n\n Wenn Sie Hilfe benötigen, wenden Sie sich an die Community unter universaldatatool.slack.com`
};

export default translationDeDE;