# Validation — October 31, 2026

## Delivered version: Gemma + Render static hosting

- Nine automated tests pass: four lesson commands, argument consumption, ranges, malformed input, unsupported flags, incompatible options, IPv6, grounded Gemma prompt formatting, and local preview file boundaries.
- Application JavaScript passes Node's syntax check.
- Downloaded and ran **Gemma 2 2B** using WebLLM in the in-app browser. Verified generated answers and a subsequent cached load. The delivered UI buffers the streamed output until its narrow reference check completes.
- A live answer correctly stated that `-p 22,80,443` selects those ports to scan and does not open them.
- A live host-discovery answer incorrectly mentioned operating-system detection; a targeted guard now replaces that class of reply with the correct referenced definition, covered by an automated regression test.
- A live answer correctly stated that an open port alone does not prove compromise. Its initial unlocked-door analogy was imprecise; the final prompt explicitly tells the model that open ports may require authentication and disallows that analogy.
- Wide and narrow browser layouts were visually inspected after the atmosphere update. At the narrow test size, measured document width equaled viewport width (354 px), with no horizontal overflow.
- Previous browser checks verified all four quiz answers, progress persistence and Reset field notes.
- The static app and local preview have no cloud-memory feature, backend account, API key or remote quiz-data storage.
- Render deployment settings are included in `render.yaml` and `DEPLOYMENT.md`. Live Render publication has not been performed; the user has not yet created a repository or connected it to Render.

## Limits

Model smoke tests are not a full factual-accuracy evaluation. Answers and analogies can still be wrong; official referenced notes remain visible. WebGPU compatibility, downloads and memory pressure vary by device. Offline operation has not been tested. No public repository, public deployment or DEV challenge entry has been published.
