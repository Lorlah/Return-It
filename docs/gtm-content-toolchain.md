# GTM Content Toolchain — Solo Founder, UK

**Date:** 2026-08-26
**Context:** The strategic bet is that brand, UX and storytelling are the moat. This is the tooling research for running a high-volume, brand-led organic social operation as one person.
**Confidence key:** ✅ verified at primary source · ⚠️ weak or secondary · ❓ unconfirmed · 💭 inference

> **Binding constraint is hours, not budget.** Every recommendation below is ranked by time-per-asset first, cost second.

---

## The finding that reframes the brief

💭 **AI video generation is mostly the wrong tool for this content.**

The bet is relatability — the Temu couch, the ASOS pile, the parcel by the door for three weeks. That genre depends on texture that reads as *real*: a genuinely messy hallway, a real face doing a real sigh, a phone camera at a bad angle. Current AI video's failure mode is that it looks expensive and slightly uncanny — the precise opposite of the register wanted. Meme-literate UK audiences in 2026 are also AI-literate, and read gloss as inauthenticity.

Where AI video *does* earn its place: the **physically impossible gag** — a parcel mountain reaching the ceiling, a sofa slowly consuming a living room — where uncanny *is* the joke. Budget it at ~10–20% of output, not the backbone.

---

## Phased recommendation

### Phase 1 — Weeks 1–4 · ~£25/month
Prove the content works before buying anything clever.

| Tool | Cost | Why |
|---|---|---|
| **iPhone + real props + the actual hallway** | £0 | Fits the brief better than anything below. The backbone. |
| **CapCut Pro** | ~£16/mo | ⚠️ The free tier's ToS restricts commercial use. Note CapCut's terms grant ByteDance a broad licence over uploads — nothing confidential through it. |
| **Buffer Essentials** | ✅ $5/channel/mo | TikTok + IG direct publishing. The free plan (3 channels, 10 scheduled posts) may be enough at first. |
| **TikTok Symphony** | ❓ Free with TikTok for Business | Assistant is grounded in live Creative Center data. Worth an hour for ideation alone. |
| **Trial Reels + native analytics** | £0 | Test every Reel on non-followers before it touches the audience. |

💭 45–90 min per filmed piece, end to end. Target 4–5/week.

### Phase 2 — Weeks 4–10 · ~£45/month
Add leverage where there's already skill.

| Tool | Cost | Why |
|---|---|---|
| **Remotion** | ✅ **£0** (free licence, ≤3 people) | 4–6 branded compositions. ~2–3 days up front, then 15–25 videos per 2–3 hr batch. **The single biggest volume unlock.** |
| **Figma Buzz** | ✅ £0 on Starter | CSV → hundreds of on-brand statics. Beta. |
| **Nano Banana Pro** | ⚠️ ~$0.13/image | Meme stills, product heroes, consistent recurring characters. |
| **Metricool Starter** *(optional)* | ✅ $20/mo | Only if Buffer's analytics stop answering questions. |

💭 8–15 min per video once templates exist.

### Phase 3 — Month 3+ · ~£90–160/month
Only once formats are proven.

| Tool | Cost | Why |
|---|---|---|
| **UGC creators via Influee** | ⚠️ £50–250/video | Real humans, real homes, full usage rights. Better *and* cheaper than AI avatars. |
| **Veo 3.1** | ✅ $0.05–0.40/sec, or ❓ ~£19/mo via Google AI Pro | Strictly the physically-impossible gag. Lite tier by default. |
| **Nano-tier UK creators** | ⚠️ £20–150/post | Only after formats are proven. Give them a proven format, not a blank brief. |

### What to ignore

| Ignore | Why |
|---|---|
| **Sora and anything built on it** | ✅ API shuts down **24 Sep 2026**. OpenAI's "recommended replacement" field is blank. |
| **Local video generation** | 18 GB unified memory is below the floor. A 64 GB M1 Max took ⚠️ **82 minutes per 2-second clip**. |
| **AI avatar tools (HeyGen, Arcads, Creatify) for organic** | Built for paid-ad variant testing. Wrong register entirely. |
| **Canva Connect API / Autofill** | ✅ Enterprise-only (30+ seats). Structurally unavailable. Ignore blog posts claiming otherwise. |
| **"All-in-one AI GTM platforms"** | Search results were ~100% affiliate SEO for products that could not be verified as real businesses. |
| **Listicle pricing** | HeyGen's live page contradicts the listicles by 2× on credits and Pro price. |

### ⏱ Time budget — the real constraint

| Approach | Time/asset | Per 3-hr session |
|---|---|---|
| Remotion templated (post-setup) | 8–15 min | **15–25** |
| Figma Buzz bulk statics | 3–8 min | 25–40 |
| Nano Banana Pro still + caption | 10–20 min | 10–15 |
| Filmed phone video + CapCut | 45–90 min | 2–4 |
| AI video (Veo) + edit | 30–60 min | 3–5 |
| Commissioned UGC (own time only) | 15–25 min brief | 7–10 briefed |

💭 **Sustainable week for one person: ~6 hours production → 5–7 posts.** One filmed hero, 2–3 Remotion templated, 1–2 statics, one reactive/community post.

---

## Remotion is the unfair advantage

✅ **Free for a solo founder.** The licence covers "an individual, whether for personal or commercial use" and teams up to 3. ⚠️ **Watch the 4-person threshold** — it aggregates contractors and agencies on the same project. A freelance editor + VA + dev would tip it over (then $25/seat/mo).

✅ Rendering: free locally; Remotion Lambda is **$0.001–$0.021 per render**. Effectively free at this volume.

Where it beats AI generation outright:

| Format | Why |
|---|---|
| "Return of the week" — real numbers (days waiting, miles driven, £ wasted) | Numbers must be accurate. AI can't do this. |
| Kinetic-type meme cards in the brand's type system | Perfect typography every time; AI text rendering is still inconsistent |
| Price comparisons vs Royal Mail / Evri / InPost | Templated, data-fed, dozens of variants |
| Templated "POV:" series | One template → 20 videos from a CSV |

Pipeline: 4–6 compositions matched to `BRAND-KIT.md` → driven from a Google Sheet or Airtable (already wired into this project) → `npx remotion render` in a loop.

💭 **The catch:** templated video is *consistent*, not *funny*. It carries the volume floor and the brand system. The jokes still have to come from a person.

---

## Design → asset pipeline

| Option | Verdict |
|---|---|
| **Figma Buzz** | ✅ **Best fit — start here.** Available on all seats including free Starter. Bulk-create accepts CSV/XLSX: one template + one spreadsheet → hundreds of assets. Enforces the design system via locked template elements. Beta, expect rough edges. |
| **Google Stitch** | ❓ Free in Google Labs. Best for screens and layout exploration; weaker as a finished-social-asset factory. Keep upstream. MCP already wired. |
| **Nano Banana Pro** | ⚠️ ~$0.13/image. Identity preservation across up to 5 subjects — **this is how a recurring mascot stays consistent across dozens of posts.** |
| **Canva Connect API** | ✅ **Dead end.** Autofill and Brand Template APIs are Enterprise-gated. |

---

## The stack (there is no all-in-one)

Searched specifically. Results were near-100% affiliate-driven SEO promoting unverifiable products. **Every result being a vendor blog naming itself the winner is itself the finding.**

```
IDEATION   Claude/ChatGPT + Symphony + the inbox of real returns horror stories
              ↓ written format brief (hook / beat / payoff / caption / on-screen text)
CAPTURE    iPhone, real props, real hallway ──┐
GENERATE   Remotion (templated series)         ├─→ raw clips + rendered MP4s
           Veo 3.1 (impossible gags only)     ─┘
           Nano Banana Pro (stills/memes)
ASSEMBLE   CapCut Pro — captions, sound, pacing
SCHEDULE   Buffer or Metricool → native publish
ANALYSE    Native analytics (authoritative) + cross-platform tool
              ↓ loop back
```

💭 **The two handoffs that break:** generate → assemble (file wrangling, no automation) and analyse → ideate (nothing tells you *why* a video worked). Both manual. Nobody has solved either.

---

## UK platform specifics

💭 **TikTok** has shifted from virality lottery toward a **search-and-community engine**. It transcribes audio and indexes captions and on-screen text — **TikTok SEO is real and underexploited.** Say and caption the phrases people actually search: *"how to return ASOS," "Evri drop off," "return without printer."* Ranking is watch time, completion and shares — not follower count. Expect 60–90 days before reliable results.

💭 **Instagram Reels:** total watch time *including replays* is the top signal — a 15s Reel watched 3× beats a 60s watched once.

> ⭐ **The most actionable fact in this report: sends per reach (DM shares) carry roughly 3–5× the weight of likes** for unconnected reach. Design for *"send this to your flatmate who has four parcels by the door."* That is exactly the content thesis, and it is what the algorithm pays for most.

Hook within ~1.7 seconds. Original content gets 40–60% more distribution than reposts.

---

## 🇬🇧 ASA / CAP — read this properly

✅ Verified against ASA primary guidance.

1. **Own-brand content is in scope.** Content promoting your own brand on your own channels "amounts to marketing content by the brand in non-paid for space online" and falls under the CAP Code. **The Return-It TikTok is regulated advertising.** Jokes are fine; **any claim about price, speed, coverage, or comparison to Evri/Royal Mail must be substantiable** with evidence on file.
2. **Every incentivised creator post needs upfront disclosure** — payment, gifting, free service, affiliate commission. `#ad` prominent and upfront.
3. ✅ **`#affiliate` / `#aff` alone is explicitly insufficient.** ASA has ruled on this. So is disclosure in a bio or a different post.
4. 💭 Platform-native "Paid Partnership" labels alone are not enough — pair with caption text.
5. 💭 ASA is scaling AI-driven Active Ad Monitoring in 2026; undisclosed influencer content is a named priority.

**Cost of compliance is near zero. Cost of non-compliance is an ASA ruling published under the brand name** — a disproportionate own-goal for a brand whose entire moat is trust and personality. Put `#ad` in the brief template and stop thinking about it.

⚠️ **Claim substantiation matters here more than it looks.** The competitive teardown recommends comparing against Royal Mail's 30p and Evri's windows. Under the CAP Code, every one of those comparisons needs evidence on file before it goes in a video.

---

## Comparable brands

⚠️ Operational detail is scarce — brands describe philosophy in interviews and almost never disclose team size, cadence or tooling. One hard number was found.

**Ryanair — the closest analogue.** ⚠️ (2023 figure, under a head of social who has since left.) **8 people**, split into two functions: **"always-on"** (planned content) and **"react and community"** (newsjacking + comment replies). Explicit frame: low cost, high reach — being talked about *is* the media buy. Grew to ~1.9M TikTok followers.

Right analogue because it's the same emotional territory: making light of a miserable category experience, self-aware, meme-native, zero brand preciousness.

> 💭 **The one structural thing to copy:** batch the "always-on" (Remotion templates, 2–3 hrs/week) so that **"react and community" — the part that can't be automated, and the part that actually drove Ryanair's reach — gets daily attention.**

**Surreal — the UK case study.** 💭 Deliberately **avoids generic meme formats**, reasoning that generic memes build no recall. **The most important lesson here: don't do the returns-misery version of whatever's trending — build formats only Return-It could run.** Also notable: 110k LinkedIn followers vs 69k Instagram, because they aimed at marketers, who share the work and become both customers and unpaid distribution.

💭 **The transferable move:** Surreal picked a *secondary* audience that amplifies. The Return-It equivalent is UK e-commerce/retail/logistics people and the r/UKPersonalFinance-adjacent internet — they'll share a good joke about Evri, and they're also customers.

💭 **Pattern worth noting:** brands with the strongest funny-social reputations (Surreal, Ryanair, PerfectTed) are founder- or in-house-creative-led. The one that outsourced to an agency (Trainline) is not known for it. An argument for keeping this in-house.

---

## Confidence summary

✅ **Verified at primary source:** Sora deprecation dates; Veo 3.1 pricing; Runway, Pika, HeyGen, Buffer, Metricool, Figma pricing; Canva Autofill Enterprise gate; Remotion licence thresholds and Lambda costs; ASA affiliate and own-brand rules.

❓ **Not verified — check before acting:** Kling pricing (site returned HTTP 446); Google AI Pro GBP pricing and Flow credits; TikTok Symphony being free; Arcads / Creatify / Influee / Billo pricing; Stitch's current credit limits.

⚠️ **Weak evidence, flagged:** UK influencer rate card (aggregated secondary, no primary sample, self-described as "adjusted upward" international benchmarks — treat as an opening-offer anchor, not market rate); the Mac local-generation benchmark (single blog); Surreal's operations (philosophy only); Ryanair's 8-person team (2023).

💭 **Judgement calls:** that AI video is the wrong backbone; all time-per-asset estimates; the phased ordering; the Ryanair two-function split as the operating model.

---
---

# Second pass — corrections (2026-08-26)

The first pass got three things wrong. All three were challenged and all three
corrections stand. This section supersedes the relevant parts above; everything
not mentioned here still holds.

## 0. Two findings that reframe the brief

### The pilot target right-sizes the whole spend

`CONTEXT.md` sets **V1 as a manually-fulfilled pilot of 20–100 UK users.** That
is a **recruitment** problem, not a volume-content problem. Most tooling in the
first pass is right-sized for the wrong target. **Build the Remotion template
library because it's cheap and permanent — but don't buy Phase 3 tools until the
pilot is running.**

### ASA does not block AI avatars. The platforms label them regardless.

⚠️ **Correction to the first pass, which implied regulatory risk here.**

✅ **There is no blanket UK requirement to disclose AI use in ads.** The test is
misleadingness: *"Is the audience likely to be misled if the use of AI is not
disclosed?"* CAP explicitly says making clear *"that an influencer is
AI-generated, could well help to negate an otherwise misleading impression."*
([ASA, 29 May 2025](https://www.asa.org.uk/news/disclosure-of-ai-in-advertising-striking-the-balance-between-creativity-and-responsibility.html))

💭 **The real constraint is platform labelling, and it is automatic.** TikTok
labels AI video via C2PA Content Credentials, invisible watermarking and
detection models — **even when creators do not self-disclose**. Meta applies an
"AI info" label on metadata detection and mandates disclosure for photorealistic
video and realistic audio.

> **The operative rule: an AI presenter will be labelled whether or not you
> disclose it.** The question is not "will anyone know" but "does the label cost
> me anything in this placement."

## 1. AI avatars — reopened

**The casting argument was right and the first pass under-weighted it.** One
person cannot be the face for every segment; matching presenter demographics to
audience is casting, not deception.

**On UK credibility, only two tools qualify.** ⚠️ Pricing unverified for both:
**Synthesia** (~£17/mo Starter; 240+ presenters filterable by gender, age and
**accent**, incl. London and Scottish) and **Arcads** (1,000+ actors, regional
accents incl. UK, best-in-class micro-expressions). ❌ Not HeyGen or Creatify for
this job — no filterable British accents, and inconsistent roster quality. A
US-accented avatar selling a UK returns service is a dead giveaway.

### The cost crossover, shown rather than asserted

| | Real UGC creator | AI avatar (HeyGen Creator ✅) |
|---|---|---|
| Cost per 30s video | £50–250 | **~$0.48** (60/mo at $29) |
| Your time per asset | 15–25 min | 20–35 min first cut; **8–12 min per variant** |
| Turnaround | 3–7 days | Minutes |
| Platform label | None | **Yes, automatic** |

💭 **Crossover is ~8–12 variants of one proven script.** Below it, real creators
win outright — 5 creators × £150 buys 5 genuinely different humans, homes and
accents, with no label. Above it, avatars are the only affordable option: 20
segment variants costs **£3,000** with creators and **$29** on HeyGen.

⭐ **The finding that validates this:** Meta's 2026 algorithm treats *"same image
with text variants" as the SAME image* — repetitive visuals raise CPMs and
trigger fatigue. **Swapping the presenter IS changing the base creative**, which
is exactly what the algorithm rewards, and exactly what caption-swap tools fail
to do. (From the `marketing-visual-design` skill.)

**Revised verdict — avatars are a variant engine, not the backbone:**
1. Use them **where the label costs least** — paid placements, where the creative
   already reads as an ad. Far cheaper than on an organic Reel trying to feel
   like a mate's video.
2. **Second, not first.** Prove the script with a real human, then fan out across
   demographics. You learn nothing about whether a joke lands from a synthetic
   delivery of it.
3. **Always self-label.** Proactive labelling costs less reach than retroactive
   detection, and it's free ASA insurance.
4. **~£20–50/mo, entering at Phase 3.**

## 2. Dynamic ad generation — missed first time

**Platform-native, free, and where to start.** 💭 **Meta Advantage+ Creative**
generates background fill, 9:16 expansion, image animation, and variations
tailored per audience persona. 💭 **Google Ads Asset Studio has Veo 3 built in —
free AI video generation inside an ads account**, a materially cheaper path than
the £19/mo AI Pro subscription recommended above.

❌ **Skip Bannerbear ($49/mo), Templated ($29/mo) and Creatopy ($39/mo).** They
solve what Remotion already solves for £0, with better brand control, in a
language you write.

**Remotion feeds variant generation directly** — compositions take typed props:

```
Airtable row (hook, payoff, stat, segment, presenter clip)
  → JSON props per row → npx remotion render --props='{...}'
  → N MP4s, each a genuinely different base creative
```

Airtable is already wired into this project. 💭 **Half a day of work, and it
replaces the entire creative-automation category.**

⭐ **Hard spec for every template** — ✅ **TikTok safe zones: top 130px, bottom
440px on 1080×1920.** The bottom no-fly zone is **23% of the frame**. Build it in
as a guide layer once. Also ✅ **Meta 4:5 (1080×1350) beats 1:1 by ~15% feed
CTR** — square is the wrong default.

## 3. Google Stitch — re-assessed against the actual project

✅ Inspected `projects/15157202840333412512` directly via the API. **The access
assumption was wrong — credits aren't the constraint** (`TEXT_TO_UI_PRO`). Four
harder constraints are.

**The layout quality is genuinely strong** — the banner brief alone is
well-specified art direction. But:

1. ✅ **The social assets are flat images, not templates.** Every generated
   marketing asset returns **`htmlCode: {}`** — empty. No editable layers, no
   text fields. Changing a headline means regenerating, which yields a
   *different layout*. **Stitch is a one-shot art director, not an asset factory.**
2. ✅ **Not a single 9:16 asset exists in the project.** Everything is 1:1
   (1024×1024) or 16:9 (1376×768). For a TikTok/Reels-first strategy the entire
   vertical format is missing.
3. ⭐ ✅ **Stitch cannot render Fraunces — it isn't in the supported font enum at
   all.** The project's `headlineFont` has silently resolved to **NEWSREADER**,
   and the generated briefs literally say *"in Newsreader serif."* **This
   explains the Fraunces-vs-Newsreader conflict noted earlier in `CONTEXT.md`:
   it was never a design decision, it was a tool limitation.**
4. And per the reopened brand direction, the palette it's consistent with has
   been rejected anyway.

**Verdict: keep Stitch upstream as art direction; don't use it as a pipeline.**
Generate 3–5 directions, pick one, rebuild the winner as a locked Figma Buzz
template with real text fields — which *can* use Fraunces.

💭 **Worth salvaging regardless:** the `designMd` rules are mostly brand-agnostic
— no 1px borders, tonal layering over shadows, 0.35rem spacing base, never pure
black, avoid generic success-green. **Those survive a palette change.** Port them
into whatever the new direction becomes.

## 4. HyperFrames — missed first time, and it earns a spot

✅ [github.com/heygen-com/hyperframes](https://github.com/heygen-com/hyperframes)
— **Apache 2.0, "no per-render fees or commercial-use thresholds."** Built by
HeyGen, 42.7k stars. Node 22 + FFmpeg, **no GPU**. Plain HTML/CSS/JS →
deterministic MP4, timeline via data attributes. Named use cases include
*"social videos with kinetic captions."*

⭐ **Why it matters: it removes the licence cliff.** Remotion is free only up to
**3 people, counting contractors and agencies.** A freelance editor + VA + dev
tips you over into $25/seat/mo. HyperFrames has no threshold, ever.

💭 **Recommendation: stay on Remotion now, document HyperFrames as the exit.**
Don't migrate a working pipeline — but if building the template library from
scratch this week, HyperFrames is the lower-risk long-term bet on licensing
alone.

## 5. What the marketing skills changed

⭐ **`designing-growth-loops` — the most important finding in either pass.**

> Uri Levine: *"Word-of-mouth you can only have if you have high frequency of
> use."*

**Returns are low-frequency — a few times a year.** That is a structural ceiling
on product-led virality, and it means **the content loop must be dominant because
the product loop is weak by construction.** That is a far stronger argument for
investing in content than "brand is the moat" — it identifies content as the
*answer to a specific structural weakness*, not a general preference.

❌ **It also flags a mistake to avoid: don't build a referral programme yet.**
*"Referrals amplify existing word-of-mouth; they can't create it."* The
post-pickup £2/£2 referral in `BRAND-KIT.md` is premature until organic WOM
exists.

**`marketing-cro` — changed the testing plan outright.** ✅ At a 3% baseline and
20% MDE you need **~5,200 visitors per variant (~10,400 total)**; at 1% baseline,
**~31,600**. A pre-launch site won't see that for months. ❌ **So do not A/B test
the landing page yet.** Your test lab is the social feed — Trial Reels and TikTok
give thousands of impressions in hours, free. Winning hooks from social then
become the landing-page headline. **That handoff runs the opposite direction to
the usual one.**

**`marketing-ideas`** — ⭐ tactic **#93 Calculator Marketing** meets the unbuilt
**Return Cost Calculator**: it is simultaneously a lead magnet, an SEO asset,
**and the data source feeding the Remotion data-driven series** ("this week
Britain wasted £X returning things"). **One build, three channels.** Also **#4
Marketing Jiu-Jitsu** — Evri's public reputation is the richest comedic seam
available — and **#76 Reddit Keyword Research** for real customer phrasing.

**`marketing-visual-design`** — the hard specs above, plus: **80%+ of social video
is watched muted** (large black-on-white captions mandatory) while **93% of top
TikTok videos use audio** — you need both. 2026's named creative trends are
**"unhinged" absurdist humour** and **lo-fi UGC-style**, both independent support
for the brand bet.

**`marketing-social-media`** — track **saves, shares, comment quality, profile
visits**; ignore follower count and impressions without engagement.

**Added nothing:** `marketing-seo-complete`, `marketing-email-automation`,
`marketing-leads-generation` (B2B), `marketing-ai-search-optimization`,
`marketing-paid-advertising` (revisit when paid starts).

## 6. Revised additions

| Phase | Add | Cost |
|---|---|---|
| 1 | TikTok safe-zone + 4:5 guide layers in every template | £0 |
| 1 | **Trial Reels as the A/B lab**, replacing landing-page testing | £0 |
| 2 | **Build the Return Cost Calculator** — lead magnet + SEO + video data source | £0 |
| 2 | Remotion props-driven variant pipeline from Airtable | £0 |
| 2 | Evaluate HyperFrames for one composition | £0 |
| 3 | Synthesia or Arcads — UK accents only, always self-labelled | ~£20–50/mo |
| 3 | Meta Advantage+ / Google Asset Studio | £0 with an ads account |

**Added to the ignore list:** Bannerbear / Templated / Creatopy · Stitch as a
volume pipeline · HeyGen and Creatify for UK organic · **a referral programme,
for now** · **landing-page A/B tests, for now**.

## Open question

⚠️ Whether the reopened brand direction lands somewhere Figma Buzz and Remotion
can both express cleanly. **If the new direction leans on a display face outside
Google Fonts, the Stitch typography problem recurs in Buzz.** Worth checking
before committing to either as the template home.

---
---

# Third pass — Facebook as a channel (2026-08-28)

**Verdict: Facebook belongs in the plan, but not as a broadcast channel.** Value
order: **Groups (free, geographically precise) → Reels cross-post (free) → ads
(cheap *testing*, not cheap recruitment) → Marketplace (product feature, not a
channel).**

## 1. The reach gap we'd been ignoring

⚠️ **Strong but secondary** — Ofcom **Online Nation 2025** (10 Dec 2025); the PDF
wouldn't parse, so figures come from several independent reports of it that agree
exactly.

| Platform | UK reach | Time/day | Skew |
|---|---|---|---|
| YouTube | 94% of online adults | 88 min (18–34) | Younger |
| **Facebook + Messenger** | **93%** | **42 min** | **35+** |
| **TikTok** | **46%** of smartphone adults | 49 min (18–34) | 65% reach among 18–34 |

**93% vs 46%.** ⚠️ Directional only: **25–34 is the largest UK Facebook cohort**
(~23–26%), 35–44 adds ~16% — so **25–44 is roughly half the platform**. 52.9% of
UK Facebook users are women, which matters because returns skew female in
fashion, the highest-return UK category.

**Three caveats that matter:**
1. The 93% **bundles Messenger**, a utility not a feed. Facebook-the-feed's real
   reach is lower and Ofcom's bundling hides how much.
2. **Reach ≠ attention.** Facebook gets 42 min/day across *all* ages; TikTok gets
   49 min/day from 18–34 *alone*. Broader vs deeper — different jobs.
3. ❌ **Do not quote "57.1m UK Facebook users / 82.1% of population."** It's an
   ad-reach estimate inflated by duplicate and inactive accounts; UK population
   is ~68m. Ofcom's 93%-of-online-adults is the credible figure.

💭 **We had been optimising for the narrower platform.** The 28–45-year-old with
parcels in the hallway is on both, but Facebook reaches about twice as many of
them and skews to the higher-disposable-income, more-likely-to-have-kids end.

## 2. Groups — the only geographically precise free surface

⭐ **The strongest finding in this pass.** TikTok and Reels cannot target a London
postcode organically. **Groups can, because the group *is* the postcode.** For a
London-catchment pilot that is decisive.

⚠️ Scale (secondary): ~80% of Facebook users are active in a group monthly; UK
users are ~20% more likely than global average to join a *local* community group.

### The rules — a human gatekeeping problem, not a policy one

⚠️ **There is no platform-wide self-promotion rule.** Each group's pinned rules
govern and admins enforce them personally. **That absence is itself the finding.**

❌ **What gets you removed, in order of frequency:** identical content posted
across multiple groups · pure promotion with no contribution · posting too often ·
cold pitches and unsolicited links.

> 🚨 **The thing that gets you banned is exactly what a content-automation
> pipeline makes easy.** Do not point Remotion output at 20 London groups. That
> is the fastest way to lose the channel permanently, and bans are per-group and
> effectively unappealable.

**Early warning you're being throttled:** posts start going to "pending" when they
didn't before, or reach drops sharply. The admin has restricted you without
removing you.

### What works instead

1. **Ask the admin first.** A short honest message — solo founder, local, small
   pilot, is this OK and where would you like it — converts far better than
   posting and apologising, and buys an ally.
2. **Contribute for a fortnight before posting.** You have genuinely useful
   knowledge: which retailers accept returns without a printer, deadlines, which
   carriers are least awful. Real value, not a pretext.
3. **Use the sanctioned promo thread** where one exists — many large local groups
   run weekly/monthly pinned slots.
4. **Vary every post.** Identical content is the #1 removal trigger.
5. **Post as a person, not a page.** Local groups are hostile to brand pages.

| Group type | Why it fits |
|---|---|
| **London area/postcode** ("SE22 Community", "Hackney Mums") | The pilot catchment itself. Strictest on promotion — ask first. |
| **Parenting** | Highest return volume: kids' clothes, wrong sizes, unopened baby kit. Time-poor by definition. |
| **Money-saving / "skint"** | Returns friction is *money* friction here. The Return Cost Calculator is native content. |
| **Buy-sell-swap** | Explicitly permit commerce, lowest gatekeeping, and the natural bridge to §3. |

💭 **Time cost: 20–30 min/day, not automatable.** It competes directly with
content production hours and is the thing most likely to slip. **This is the
Ryanair "react and community" function — Groups are where it lives.**

## 3. Marketplace — strategic adjacency, not a channel

✅ Grounded in `docs/competitive-teardown.md`: we'd be the only product that
*knows* an item just became un-returnable — a qualified resale lead nobody else
can generate.

💭 **Poshmark is weak in the UK.** Facebook Marketplace, Vinted and eBay are where
Britons actually resell — so the ReturnQueen-style one-tap resale mechanic points
at **Marketplace, not Poshmark**.

❌ **But not now:** Marketplace has no organic marketing surface, and this is a
**product feature, not a channel**. Log it as the strongest post-pilot
monetisation hypothesis.

⭐ **One cheap thing to do now:** while you're in buy-sell-swap groups (§2), you'll
see the expired-return behaviour in the wild — *"bought this, too late to send
back, £10 ono."* **That's free qualitative validation of the white space.**
Screenshot it.

## 4. Format — the pipeline ports unchanged, with one spec change

✅ **Facebook Reels is 1080×1920, 9:16 — identical to Instagram and TikTok.** No
new renders. Meta unified Stories and Reels into a single 9:16 safe zone in March
2026.

⚠️ **The spec change that matters:**

| | Top | **Bottom** | Sides |
|---|---|---|---|
| TikTok | 130px | **440px (23%)** | — |
| **Meta Reels/Stories** | ~269px (14%) | **~670px (35%)** | ~65px |

🚨 **Meta's bottom no-fly zone is 670px — 230px deeper than TikTok's.** **Build
every Remotion composition to the union: top 269 / bottom 670 / sides 65.** That
leaves a 981px safe band, still over half the frame. **Keeping the TikTok-only
440px guide puts your captions under Facebook's UI.**

Reels cap at 90s paid; organic Facebook Reels have no hard limit. Facebook Reels
behaves like Instagram Reels — same algorithm scaffold, same penalty triggers.

## 5. Cross-posting — no penalty, two real traps

✅ **There is no cross-platform duplicate-content penalty.** Platforms can't see
each other's content.

⚠️ **Correction to the first pass:** the Instagram penalty cited there — 10+
reposts in 30 days excluding you from recommendations, and [reposted photos and
carousels facing reach penalties from May 2026](https://dataconomy.com/2026/05/04/reposted-photos-and-carousels-now-face-reach-penalties-on-instagram/)
— is **within-platform unoriginal content**. It does **not** apply to publishing
your own original video natively to two different platforms. Different
mechanisms; they were conflated.

❌ **The two traps that do cost reach:**
1. **Watermarks.** A TikTok watermark on a file uploaded to Meta is actively
   suppressed. **Always export clean from Remotion/CapCut, never re-download
   from TikTok.**
2. **Identical captions.** Facebook tolerates longer explanatory copy; TikTok
   wants the hook and searchable keywords.

💭 Use Meta's native IG→FB cross-post for volume, but hand-write the Facebook
caption on your best 1–2 pieces a week. **Total cost of adding Facebook: ~10
minutes per week** — the cheapest addition in any of these reports.

## 6. Paid — and a correction to the recruitment hypothesis

⚠️ **Facebook is NOT cheaper than TikTok per impression in the UK.** Meta
£8–18 CPM vs TikTok £3–8. **But TikTok's CPCs run higher than its CPMs suggest** —
fast-scroll means high impressions, low intentional clicks. **Meta wins on intent
per pound, not price per impression.** That's the better argument.

⚠️ London adds +20–35% CPM, and narrow audiences add more again. Meta's minimum
radius is 1 mile but delivery **penalises radii under 5 miles** — start at 5–15.
Conversion likelihood drops ~45% after four exposures; **watch frequency, and
above 3 refresh creative or widen.**

### 🚨 Correcting the "£100–200 recruits 100 users" hypothesis

💭 All arithmetic below is inference on unverified CPM benchmarks:

| Step | Assumption | Result |
|---|---|---|
| Reach 5,000 Londoners | freq 2–3, London CPM £12–25 | £120–375 |
| CTR | ~1% | 50–150 clicks |
| Landing CVR | 10–20% (free pilot signup, not a purchase) | **~10–30 signups** |

**£100–200 buys the bottom of the 20–100 target, not the top.** Reaching 100
signups is realistically **£500–1,500**.

⭐ **But the spend is still right, for a different reason.** The £150 isn't buying
users — **it's buying an answer to "does the offer convert?" in 72 hours instead
of three months.** That connects directly to the `marketing-cro` finding: you need
10,000–32,000 visitors to A/B test the landing page and organic won't deliver
that for months. **A £150 London ad test is the cheapest traffic you will ever buy
to validate the offer, the price point and the headline.**

💭 **Concrete first test:** £50 × 3 creatives, 10-mile radius on the pilot
catchment, one week, optimising for landing-page views. Start broad and let
Advantage+ find the buyers — manual interest stacking in a small geography
compounds the narrow-audience CPM penalty.

## 7. Where it slots in

| Phase | Add | Cost | Time/week |
|---|---|---|---|
| **1** | **Rebuild the safe-zone guide to the Meta union** (269/670/65) | £0 | 15 min one-off |
| **1** | **Cross-post every Reel to Facebook** — clean export, hand-written caption on the best 1–2 | £0 | **~10 min** |
| **1** | **Join 5–8 London-local, parenting and money-saving groups. Contribute only, no posting, for two weeks** | £0 | **20–30 min/day** |
| **2** | **Start posting in groups** — admin permission first, sanctioned threads, every post varied | £0 | (included) |
| **2** | **£150 Facebook ad test** — 3 creatives, 10-mile radius, one week | £150 one-off | ~1 hr setup |
| **3** | Scale ads only if the test converts | £500–1,500 for ~100 signups | — |
| **Backlog** | Marketplace resale integration — product feature, post-pilot | — | — |

💭 **Against the 20–100 pilot target, Groups are the single best-fit surface in
the entire stack.** Free, geographically precise, audience demonstrably there.
Groups plus a £150 ad test should beat three months of TikTok compounding —
**because TikTok gives you national reach when you need one city.**

❌ **What to deprioritise to make room: the Phase 3 avatar spend.** Segment-variant
testing matters when scaling reach; it does nothing for finding 100 people in
south London. Push it past the pilot.

## Confidence

⚠️ **Not verified — directional only:** every UK Facebook age breakdown; all
Marketplace and Groups statistics; **every CPM benchmark** and the London
premiums; Meta's radius penalties; Group promotion norms (no single Facebook
policy exists to cite); Meta safe-zone percentages.

> **No CPM figure could be confirmed at a primary source — Meta doesn't publish
> them, and every number is an agency blog. The £150 test will give you your own
> real CPM in a week, which is worth more than any benchmark. Treat the £60–375
> range as a hypothesis the test replaces.**
