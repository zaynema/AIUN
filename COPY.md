# AIUN Site Copy

Single source for editing all visible text. Edit this file and send it back —
each item below maps to a specific place in `index.html` or `app.js` (noted in
parentheses) so updates can be applied consistently.

Dynamic copy already lives in objects in `app.js` (`storyStates`,
`organizations`, role generators); static copy lives in `index.html`.

---

## Meta (`index.html` <head>)

Page title:
AIUN | Weekly UN role matches

Meta description:
AIUN matches your resume to fresh UN and international organization roles every week.

---

## Hero / Landing (`index.html` .intro-hero)

Eyebrow / Logo:
AIUN

Headline:
Built by people looking for the right fit.

Body:
Zayne and Nina, we were once on the same side of the match — tracking tabs, deadlines, long job descriptions, and late-night updates. Now we keep the right roles moving toward you.

Founder links (inline in body):
- Zayne → https://www.linkedin.com/in/zonghema/
- Nina → https://www.linkedin.com/in/nina-zuo-8a801a237/

Emphasized clause (semibold):
Now we keep the right roles moving toward you.

---

## Upload Section (`app.js` storyStates[0] + `index.html` device mockup)

Headline:
Upload once, privately.

Body:
Upload your resume once. We keep only the useful competency signals, then delete the file.

CTA Primary (story actions):
Show me my UN matches

CTA Secondary (story actions):
Who do you track?

In-device microcopy:
- Private resume intake
- Resume.pdf
- Your profile
- One file
- Parsing privately
- Competency bubbles: Policy / Languages / M&E / Data / GIS / Research
- Resume file deleted
- We keep your competencies, not your resume.

---

## Fresh Matches Section (`app.js` storyStates[1] + `index.html` rank board)

Headline:
Fresh UN matches, less noise.

Body:
We surface new UN-system roles, compare them with your signals, and bring the strongest fits forward.

Ranked example cards (signal · title · org · location · fit):
- Policy · Programme Analyst · UNDP · New York · 94% fit
- Data · Data Research Intern · UNICEF · Copenhagen · 91% fit
- Protection · Protection Associate · UNHCR · Budapest · 89% fit
- GIS · GIS Programme Officer · UNOPS · Geneva · 87% fit
- Climate · Climate Programme Officer · UNEP · Nairobi · 85% fit
- M&E · Monitoring Specialist · UNICEF · Copenhagen · 84% fit
- Languages · Communications Fellow · UNESCO · Paris · 80% fit
- Research · Policy Research Assistant · ILO · Bangkok · 76% fit

Caption:
Ranked by fit, deadline, and your competency signals.

---

## Email Shortlist Section (`app.js` storyStates[2] + `index.html` email mockup)

Headline:
Your next step finds you.

Body:
Each week, new matches arrive with the reason they fit — so you can apply, not search.

Email mockup content:
- Subject: Your weekly shortlist is ready
- Title: Your weekly shortlist is ready
- Timestamp: Monday 9:04 AM
- Greeting: Hi,
- Intro: Your strongest recommendations for this week are below. Each card includes the reason to review it and a direct application link.
- Section label: Top Matched Positions
- Primary job card: Programme Analyst — UNDP · New York, United States — 94%
  - Deadline: 2026-06-23
  - Level: P1
  - Why you: Policy, GIS, and programme data line up cleanly.
  - Tags: Programme support / Policy analysis / Results reporting
  - Button: Apply now — Application page + notes
- Secondary card: Data Research Intern — UNICEF · Copenhagen — 91% — Apply now — Deadline: 2026-06-28
- Secondary card: GIS Programme Officer — UNOPS · Geneva — 87% — Apply now — Deadline: 2026-07-02

---

## Coverage Section (`index.html` #coverage + `app.js` organizations)

Headline:
Organizations we cover

Subtitle:
AIUN monitors new openings across UN agencies, development banks, and major international bodies.

Stats:
- 38+ organizations
- 2,000+ live openings monitored
- Weekly fresh-match email

Toolbar (role-preview mode):
- Back control: All organizations
- Context: Roles at {organization}

Organization marks (grouped: UN system, then finance, then regional/intl):
UN, UNICEF, UNDP, UNHCR, WFP, WHO, FAO, UNESCO, ILO, UNFPA, UN Women, UNIDO, IAEA, WMO, ITU, IMO, ICAO, WIPO, UNOPS, UNV, UNICC, UNU, UNITAR, IOM, World Bank, IMF, ADB, AIIB, EBRD, IDB, NDB, EU, African Union, ASEAN, OECD, OSCE, Council of Europe, IEA, IUCN, ICC

Role detail labels:
- Level
- Location
- Deadline
- Button: Check

"In development" cell:
Developing
(image: assets/dev-horse.png)

---

## Final CTA Section (`index.html` #signin)

Eyebrow:
Get started

Headline:
Ready to find your seat?

Subtitle:
Have a question, an idea, or just want to say hi? Join us in the groups below.

Primary CTA:
Log in

Community Label:
Community

Community links (placeholder URLs):
- Xiaohongshu → #xiaohongshu
- WeChat → #wechat
- WhatsApp → #whatsapp

Technical note (full-width footnote, low emphasis):
We match your profile signals against role requirements, deadlines, locations, and levels. Your resume is used to extract competencies, then removed from the workflow. Fresh roles are ranked by fit and relevance before they reach your inbox. You decide what to review, save, or apply for.

---

## Footer (`index.html` .site-footer)

Brand:
AIUN

Disclaimer:
AIUN is an independent matching tool and is not affiliated with the United Nations.

Links:
- Privacy Policy → #privacy
- Terms of Service → #terms
