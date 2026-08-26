# Fixture corpus

One JSON file per real return email, anonymised.

Naming: `<retailer-slug>-<nnn>.json` (e.g. `asos-001.json`).

Shape — matches `RawReturnDocument` minus `userId`:

    {
      "source": "forward",
      "receivedAt": "2026-08-14T09:31:00Z",
      "senderDomain": "asos.com",
      "subject": "Your return is on its way",
      "body": "plain text body",
      "attachments": []
    }

## Anonymisation is mandatory

Before committing, replace every real name, street address, email address,
postcode and order number with a fake value of the SAME FORMAT AND LENGTH.
Format matters — the parser is being tested on shape, so `AB-123456789`
must not become `REDACTED`.

Never commit an un-anonymised fixture.
