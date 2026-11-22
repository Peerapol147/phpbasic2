# Developer Platform / Marketplace Income Streams for a Solo Developer in Thailand (2025-2026)

Research method note: Direct page fetches were blocked in this session (apify.com, docs.apify.com, help.apify.com and dev.to could not be resolved), so every finding below comes from web search results, which include snippets from the cited pages. Treat exact numbers as "reported by the cited page"; re-check them on the live pages before acting. Research date: 2026-11-22.

## Q1. Apify Store: monetization mechanics, earnings evidence, best categories, legal risk

### Takeaway
Apify is the most clearly paying marketplace in this set. It publishes aggregate payout data: more than $4M paid out in total as of Nov 2025, and about $563k in September 2025 alone. Creators keep 80% of revenue after platform costs, payouts go out monthly via PayPal or Wise with a $20 minimum, and rental pricing is being retired in favour of pay-per-event in 2026. Demand is dominated by Google Maps and social-media scrapers, which is also where the legal and personal-data risk is highest.

### Cited Findings
**Mechanics (2026)**
- Pay-per-event (PPE) creator profit is "(80% of revenue) - (platform costs)": Apify deducts the platform compute costs used to run the Actor, then takes a 20% commission. — [Apify help: how does actor monetization work](https://help.apify.com/en/articles/8684010-how-does-actor-monetization-work); [Apify docs: pay-per-event](https://docs.apify.com/platform/actors/monetize/pay-per-event)
- A Czech press report also gives a 20% commission. — [Lupa.cz](https://www.lupa.cz/aktuality/scrapuji-vsichni-na-svete-cesky-obchod-s-roboty-pro-stahovani-dat-loni-vyvojarum-vyplatil-24-milionu/)
- Rental Actors are being retired. Per third-party reports, no new rental listings have been allowed since April 1, 2026, and full retirement comes on October 1, 2026. Actors their developers have not migrated move to pay-per-usage, so the creator earns nothing on them ("The Default Exit Pays Nothing"). One other third-party post gives Sept 30 instead, so the exact date is unconfirmed by an official page in my results. — [imisofts: Apify retires rental Actors](https://imisofts.com/blog/apify-rental-actors-retired/); [AFFStudio, Oct 2026](https://affstudio.org/2026/10/23/how-much-can-you-earn-selling-apify-actors/)
- Pay-per-result is described as a per-result event inside PPE rather than a standalone model (third-party framing, not confirmed on an official page). — [use-apify.com (unofficial)](https://use-apify.com/docs/apify-for-developers/monetize-actors)
- Significant pricing changes can be submitted only once per month per Actor. — [Apify docs: set up monetization](https://docs.apify.com/actors/monetize/set-up-monetization)
- Payout invoices are generated automatically on the 11th of each month. — [Apify docs: manage payouts](https://docs.apify.com/platform/actors/publishing/monetize/monthly-payouts)
- Minimum payout is $20 for PayPal and Wise and $100 for other methods. A balance below the minimum carries over to the next month. — [Apify docs: manage payouts](https://docs.apify.com/platform/actors/publishing/monetize/monthly-payouts)
- Under the Store terms, a balance that stays below the minimum for 12 continuous months is forfeited to Apify. — [Apify Store Publishing Terms](https://docs.apify.com/legal/store-publishing-terms-and-conditions)
- To be paid, a developer must complete billing details, choose a payment method and pass identity verification (KYC). Actors are not eligible until KYC is done. — [Apify docs: manage payouts](https://docs.apify.com/platform/actors/publishing/monetize/monthly-payouts); [Apify help: how developer payouts work](https://help.apify.com/en/articles/10057167-how-developer-payouts-work)
- The Apify affiliate program is separate from developer payouts and has a $100 minimum monthly commission. — [Apify Affiliate T&C](https://docs.apify.com/legal/affiliate-program-terms-and-conditions)
- Apify also markets MCP-server hosting and monetization through the same Store and payout rails. — [Apify: build and monetize MCP servers](https://apify.com/mcp/developers)

**Earnings evidence**
- VERIFIED-ish (company press release): Apify had paid more than $4M to independent developers since launching the Store as of Nov 2025. The Store has 8,000+ Actors and 25,000 customers. — [NatLawReview press release, "Apify Bets $1M on Independent Developers"](https://natlawreview.com/press-releases/apify-bets-1m-independent-developers-building-ais-missing-tools)
- Company statement: more than $563k went to community developers in September 2025, about 6x the previous year. — same press release ([EIN News copy](https://www.einnews.com/pr_news/863598206/apify-bets-1m-on-independent-developers-building-ai-s-missing-tools))
- Conflicting marketing figures:
  - The Apify partner page cites "$100k+ monthly".
  - An Indie Hackers listing claims "$1M monthly".
  - Another Apify page says "$500k+ every month".
  - A third-party guide says "$1.2M every month".

  The $563k for Sept 2025 is the most specific dated figure. — [Apify partners page](https://apify.com/partners/actor-developers); [Indie Hackers Apify listing](https://www.indiehackers.com/product/apify)
- SELF-REPORTED (platform): the most successful independent creators make more than $10,000 in monthly recurring revenue, and "many others" make more than $1,000/month. Apify says it cannot share names or numbers. — [Apify help](https://help.apify.com/en/articles/8684010-how-does-actor-monetization-work)
- The Apify $1M Challenge ran Nov 3, 2025 to Jan 31, 2026, with prizes paid in Feb-Mar 2026. It is now over. — [Apify $1M Challenge](https://securitybyobscurity.apify.com/challenge)
- I found no independent blog or Reddit post with verifiable per-developer monthly income. One community listing projects "$500-$2,000/month in months 7-12", but this is an unverified projection.

**What sells (demand signals)**
- Store snapshot of 2026-09-09 (third-party site using the Store API). Users ≠ revenue.

  | Actor | Users |
  |---|---|
  | Google Maps Scraper (compass/crawler-google-places) | 596K |
  | Instagram Scraper (Apify official) | 388K |
  | TikTok Scraper (Clockworks) | 275K |
  | Instagram Profile Scraper | 214K |
  | Google Search Results Scraper | 179K |

  — [use-apify.com: most popular actors](https://use-apify.com/docs/best-apify-actors/most-popular-actors)
- Many Google Maps scraper clones compete on price, with listings like "$0.40/1K results", which signals a crowded, price-competitive category. — [Apify Store example listing](https://apify.com/scraperlink/google-maps-scraper); [Best Google Maps scrapers on Apify (2026)](https://apify.com/johnvc/store-actor-intelligence-api/examples/best-google-maps-scrapers)

**Legal risk**
- Apify's own position: scraping non-personal data is legal, while personal data falls under GDPR and similar laws and needs a legitimate basis. — [Apify blog: is web scraping legal](https://blog.apify.com/is-web-scraping-legal/); [Apify Web Scraper FAQ](https://apify.com/apify/web-scraper)
- Apify's DPA treats the customer as controller or processor and Apify as (sub)processor. Apify's servers are in the US, so EU personal data needs transfer safeguards (unofficial guide). — [use-apify.com legal guide](https://use-apify.com/docs/what-is-apify/is-apify-legal)
- US position per secondary commentary: scraping public data without bypassing authentication is generally legal (hiQ v. LinkedIn). — [use-apify.com compliance 2026](https://use-apify.com/blog/web-scraping-legal-compliance-framework-2026)
- Enforcement precedent: the Polish DPA fined Bisnode €220,000 in 2019 over scraped personal data. — [Wikipedia: GDPR fines](https://en.wikipedia.org/wiki/GDPR_fines_and_notices)
- A creator's write-up describes GDPR-compliant lead-generation Actor design. — [Medium](https://medium.com/@tuguidragos/the-legal-tightrope-how-i-build-gdpr-compliant-lead-generation-actors-on-apify-41393066470d)

### Inferences
- For a Thai seller, Apify is the most practical option on this list. The payout rails are explicit (PayPal or Wise, low $20 minimum), the platform handles billing, tax invoicing to customers and hosting, and an AI coding agent can write Actors with the Apify SDK.
- Rental is gone, so new Actors must be priced per event or result. Margins depend on keeping compute cost per event well below price.
- The high-traffic categories (Maps, Instagram, TikTok) are saturated with clones and also carry the most personal-data and ToS risk. Niche B2B or non-personal data sources (public registries, e-commerce prices, job boards, AI/MCP tools) are likely less contested. This is an inference, not measured.
- Thailand's PDPA (modelled on GDPR) would apply to Thai personal data. I did not research this.

### Gaps
- I could not fetch official Apify docs directly, so the exact current PPE rules, the rental retirement date and the payout-country list need checking on docs.apify.com.
- I found no official statement on whether Thai residents can pass Apify KYC and receive Wise or PayPal payouts. Both services operate in Thailand, but this is not verified against Apify's country list.
- I found no verified per-category revenue data and no named creator income disclosures.
- Meta v. Bright Data (N.D. Cal., Jan 2024): background knowledge says the court ruled that Meta's terms did not bar logged-off scraping of public data. This was not surfaced in my searches, so verify it before citing.

## Q2. RapidAPI and API marketplaces in 2025-2026

### Takeaway
RapidAPI (now "Rapid") was bought by Nokia in Nov 2024 and refocused on telco network APIs. Its fee appears to have risen from 20% to 25%, and providers in 2025-2026 complain about late or missing payouts. No earnings data exists, so it is a weak primary channel and at best a secondary listing.

### Cited Findings
- Nokia acquired Rapid's technology and R&D unit in Nov 2024 to strengthen its network-API platform for 5G operators. RapidAPI had been valued at $1B in 2022. — [TechCrunch](https://techcrunch.com/2024/11/13/nokia-acquires-rapid-the-api-company-once-valued-at-1b/); [Nokia press release](https://www.nokia.com/about-us/news/releases/2024/11/13/nokia-acquires-rapid-technology-and-rd-unit-to-strengthen-development-of-network-api-solutions-and-ecosystem/); [Fierce Network](https://www.fierce-network.com/wireless/nokia-doubles-down-network-apis-rapid-buy)
- Fees:
  - The old docs list a flat 20% marketplace fee.
  - A later docs version lists 25% and says the fee does not cover PayPal payout fees.

  — [RapidAPI docs v1 payouts](https://docs.rapidapi.com/v1.0/docs/payouts-and-finance); [RapidAPI docs current](https://docs.rapidapi.com/docs/payouts-and-finance)
- SELF-REPORTED (Trustpilot, 2025-2026): providers complain the fee went from 20% to 25% "without any warning", that payouts are late, and that PayPal fees come on top. RapidAPI's replies cite "platform sustainability". — [Trustpilot](https://www.trustpilot.com/review/rapidapi.com?page=2); [Trustpilot CA](https://ca.trustpilot.com/review/rapidapi.com)
- A community post reports that vendor payments stopped after the Nokia acquisition (unverified, date unclear). — [Latenode community](https://community.latenode.com/t/rapid-api-payments-to-vendors-have-ceased-following-nokias-acquisition-important-update/2888)
- A Hashnode post notes the docs don't say which PayPal fee applies to provider payouts. — [Hashnode](https://hashnode.com/posts/paypal-withdrawal-cost-api-micro-margins/6ad0f50f850bc3051bf6e2f9)

### Inferences
- The marketplace is in maintenance mode under a telco owner. Selling APIs directly with Stripe or a merchant of record, or listing them as Apify Actors/MCP servers, is likely the better route.

### Gaps
- I found no published provider-earnings data and no official dated announcement of the 25% fee.
- I found no confirmed shutdown. A jobs-aggregator claim about Nokia possibly shutting the marketplace is speculation.
- Other API marketplaces (Zyla, APILayer and others) were not researched.

## Q3. MCP servers, Claude Code skills/plugins, GPT Store and AI agent marketplaces: any real payouts?

### Takeaway
Neither Anthropic nor OpenAI runs a paid marketplace that pays developers. Anthropic's Claude Code plugin directory is free and curated. The GPT Store revenue share was promised in 2024, but no official evidence shows broad payouts. Paid MCP marketplaces exist (MCP Marketplace, MCPize, MCPRush, Universal API, Apify), but they are small, mostly vendor-promoted, and lack verified earnings. Apify is the only one with audited-scale payout volume.

### Cited Findings
- The Anthropic Claude Code plugin directory is a GitHub repo, "an official, Anthropic-managed directory of high quality Claude Code Plugins". Third parties submit through a form and must meet quality and security standards. Neither the README nor the results mention pricing or revenue share. — [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- Independent directories are explicitly "not affiliated with Anthropic" and are catalogs, not payment rails. — [claudemarketplaces.com](https://claudemarketplaces.com/plugins/anthropics-claude-plugins-official)
- GPT Store:
  - OpenAI promised a builder revenue program for Q1 2024.
  - Sources conflict on what happened next. A tax guide says it "never broadly launched". Others claim it is limited to US builders, or open to the US, UK and some EU countries. One claims a broad rollout.
  - I found no official OpenAI page confirming an active program.

  — [Monaco CPA tax guide 2026](https://www.monacocpa.cpa/post/openai-gpt-store-ai-agent-taxes); [Lightspeed Technology, Mar 2026](https://lightspeed-technology.com/2026/03/17/openai-introduces-gpt-store-revenue-sharing-plans-remain-pending/); [Geeky Gadgets](https://www.geeky-gadgets.com/custom-gpt-revenue-program/)
- OPINION (X post, Aakash Gupta): the GPT Store revenue sharing "never materialized... Zero developers got paid". OpenAI pivoted to ChatGPT Apps, which had about 300 integrations six months in, citing Bloomberg on a "lackluster debut". — [X post](https://x.com/aakashgupta/status/2038714642487533679)
- Another source frames the GPT Store as heading toward "retirement" in 2026. — [upGrowth](https://upgrowth.in/the-launch-of-gpt-store-open-ais-library-of-custom-gpts/)
- Paid MCP marketplaces (vendor-sourced terms):

  | Platform | Creator share / fee | Payouts |
  |---|---|---|
  | MCP Marketplace | 85% (15% fee) | Stripe Connect |
  | MCPize | 80% (85% for founding members who joined before June 10, 2026) | Monthly, on the 15th |
  | MCPRush | — | Weekly via Stripe Connect |
  | Universal API | 80% (20% fee) | Per-invocation pricing |

  — [mcp-marketplace.io](https://mcp-marketplace.io/for-creators); [MCPize](https://mcpize.com/blog/mcp-business-models); [MCPRush](https://mcprush.com/); [Universal API blog](https://blog.universalapi.co/posts/earn-money-building-mcp-servers.html)
- Smithery, Glama, mcp.so and PulseMCP are free directories. Claims of Smithery creator payouts are inconsistent, and one independent 2026 review found no working creator payouts. One article estimates that fewer than 5% of listed MCP servers use any monetization path. — [DEV: State of MCP Monetization 2026](https://dev.to/kirothebot/the-state-of-mcp-monetization-in-2026-where-builders-actually-get-paid-34k9); [SEOSiri, Sep 2026](https://www.seosiri.com/2026/09/mcp-monetization-gap-glama-smithery-developer-losses.html)

### Inferences
- The realistic way to earn from MCP or agent tooling is either Apify (with its PayPal/Wise rails) or your own billing. Free directories serve only as distribution.
- Stripe-Connect-only marketplaces depend on whether Stripe Connect supports a Thai individual account, which I did not verify.
- Selling Claude skills or plugins directly (for example on Gumroad or Lemon Squeezy) is possible, but I found no evidence of meaningful sales.

### Gaps
- I found no verified earnings figures for any MCP marketplace.
- OpenAI Apps SDK monetization terms (for example, in-chat checkout) were not covered in the results.
- Anthropic marketplace payment terms: none found. As of these results, the directory appears to be free only.

## Q4. n8n / Make template marketplaces and "automation agency" income

### Takeaway
n8n lets verified creators (three approved templates) sell paid templates, but it publishes no sales data. Most-viewed paid templates are priced around $5, and the evidence points to template sales being negligible. Automation-agency income claims ($47k in 90 days, $100k/year) are self-reported and mostly come from course sellers. Service work, such as Upwork gigs and retainers, is the real money channel, not template sales.

### Cited Findings
- n8n gating: after three approved templates a creator becomes verified, can submit four at a time, and can publish paid templates. — [thomas.partners guide](https://thomas.partners/guides/sell-n8n-workflow-templates)
- A guide found no verified figures for template creator income. — [thomas.partners](https://thomas.partners/guides/sell-n8n-workflow-templates)
- Price and attention data (views only; n8n does not publish sales):
  - About 12% of roughly 2,484 AI templates were paid.
  - The most-viewed paid templates cost $5.
  - One seller's Gumroad kit had zero sales but a stream of setup requests.

  — [DEV: 300 paid n8n AI templates](https://dev.to/druveai/i-looked-at-300-paid-n8n-ai-templates-here-is-what-people-charge-and-what-gets-looked-at-13i4)
- n8n Cloud affiliate program: 30% of n8n's net earnings for 12 months per referral (third-party review). — [CamAffiliateHub](https://camaffiliatehub.com/posts/n8n-review/)
- Blog price suggestions of $29-$299+ are unverified. — [ritz7.ai](https://ritz7.ai/blog/monetize-n8n-automation-skills)
- Agency claims (SELF-REPORTED, often attached to paid courses):
  - "$100K this year from a 1-hr n8n gig" — [Skool post](https://www.skool.com/ai-automation-society/how-i-made-over-100k-this-year-by-accepting-a-1-hr-n8n-gig)
  - 50 projects and 20 regular clients in year one — [Skool](https://www.skool.com/ai-automation-society/my-learnings-after-1-year-50-projects-20-regular-clients-with-n8n)
  - "$47,000 in 90 days, 14 SMB clients at $800-3,500/mo", plus warnings that basic chatbot and blog-post automations are "commoditised to zero" — [DEV playbook](https://dev.to/aioperator2026/the-lean-ai-agency-playbook-how-to-land-2k-5kmonth-clients-with-just-claude-and-a-browser-3e91); [DEV one-person agency 2026](https://dev.to/krisying/how-im-building-a-one-person-ai-automation-agency-in-2026-tools-stack-revenue-3712)

### Inferences
- Templates work as lead magnets for services, not as a revenue stream in themselves.
- A Thai developer can sell n8n services on Upwork or Fiverr, which pay out via PayPal, Payoneer or bank. Upwork and Fiverr payout terms were not researched here.

### Gaps
- I found nothing on Make's or Zapier's template marketplace payout terms. Make and Zapier have partner and affiliate programs, but those weren't covered.
- How n8n pays creators (payout method, fee split) for paid templates was not found.

## Q5. Shopify App Store, WordPress plugins, VS Code, Chrome Web Store, GitHub Sponsors

### Takeaway
Shopify has the best economics (0% revenue share on the first $1M lifetime) and supports PayPal, bank and wire payouts through Hyperwallet. Building and getting approval is a heavy lift, and I found no solo-earnings data. WordPress plugins can reach low four figures a month for a solo developer (a $12k/month case exists), but the median is modest. The Chrome Web Store and VS Code Marketplace have no built-in payments, so payment must happen off-store. GitHub Sponsors officially supports Thailand but is donation-based.

### Cited Findings
**Shopify**
- Revenue share: 0% on the first $1,000,000 lifetime gross app revenue, then 15%. This changed in 2025 from an annual reset to a lifetime threshold; revenue before Jan 1, 2025 does not count. There is a one-time $19 registration fee, and billing carries a 2.9% processing fee. — [Shopify dev: revenue share](https://shopify.dev/docs/apps/launch/distribution/revenue-share); [Shopify changelog: update to revenue share](https://shopify.dev/changelog/update-to-shopifys-app-developer-revenue-share)
- Some older Shopify help pages still show the previous framing ("100% of the first $1M"), so those pages are outdated. — [Shopify Partner earnings](https://help.shopify.com/en/partners/how-to-earn)
- Payouts: PayPal, bank account or wire via Hyperwallet. Available methods depend on the country and currency selected, and Hyperwallet does the currency conversion. A Thai-language help page exists, which suggests Thai partners are served, but Thailand-specific methods are not confirmed. — [Shopify Partner getting paid](https://help.shopify.com/partners/getting-started/getting-paid); [Shopify payout methods blog](https://www.shopify.com/partners/blog/payout-methods); [Shopify TH help](https://help.shopify.com/th/partners/partner-program/getting-paid)
- PayPal's payouts docs list Thailand among countries without currency conversion for payouts; recipients withdraw in local currency. This comes from a different PayPal product, so its applicability is uncertain. — [PayPal countries/features](https://docs.paypal.ai/growth/payouts/reference/countries-supported-features)

**WordPress**
- Freemius says no reliable "average plugin income" exists. Its examples are businesses, not solo developers: WP Fusion at about $776k net in 2024 and Barn2 at about $1.7M. — [Freemius blog 2026](https://freemius.com/blog/how-wordpress-plugin-developers-make-money/)
- Acquisition-marketplace sample: median TTM revenue of $57k for plugin/theme products, and only 10% of WP products clear $1,000/month. The sample is tiny (n=11) and comes from a vendor site. — [BigIdeasDB](https://bigideasdb.com/how-to-sell-a-wordpress-plugin)
- SELF-REPORTED: Patrick Posner made about $12k/month from WordPress plugins (podcast). — [IndieBites #79](https://indiebites.transistor.fm/79)
- SELF-REPORTED: an Indie Hackers founder gets "a couple thousand dollars" a month from renewals. — [Indie Hackers](https://www.indiehackers.com/post/building-a-sustainable-wordpress-plugin-business-28b02d55ef)

**Chrome Web Store**
- Google deprecated Chrome Web Store payments over 2020-2021: new paid items stopped Sept 21, 2020, and the system was fully shut down by Feb 1, 2021. Paid extensions are allowed if billed off-store (ExtensionPay, Stripe, Paddle, Lemon Squeezy, Polar), and the developer must disclose that they, not Google, are the seller. — [crxbase FAQ 2026](https://crxbase.com/blog/are-paid-chrome-extensions-allowed/); [MicroGaps](https://www.microgaps.com/gaps/chrome-extension-monetization-sdk-gap); [ExtensionStart](https://extensionstart.com/blog/how-to-monetize-chrome-extension/)

**GitHub Sponsors**
- Thailand is a supported region and was among the 30 regions added in July 2022. Recipients must reside in a supported region and have a bank account there. — [GitHub docs: about Sponsors](https://docs.github.com/en/sponsors/getting-started-with-github-sponsors/about-github-sponsors); [GitHub blog, 2022](https://github.blog/news-insights/company-news/github-sponsors-available-in-30-new-regions-2/)

### Inferences
- An AI agent can build a Shopify app, but approval review, support load, and the need for marketing and reviews make it a months-long project, not a quick win.
- WordPress plugins (freemium via Freemius, or Lemon Squeezy as merchant of record) are a proven but slow-compounding solo model.
- For Chrome and VS Code extensions, a merchant of record such as Lemon Squeezy or Paddle (which pay out to Thailand via PayPal or bank, per background knowledge, unverified here) removes tax complexity.
- GitHub Sponsors is realistic for Thai developers but rarely meaningful without an already-popular open-source project.

### Gaps
- I found no solo-developer Shopify app MRR examples in the results.
- VS Code Marketplace: background knowledge says it has no paid-extension support, so off-store licensing is needed. Not confirmed by search.
- I found no GitHub Sponsors earnings distribution data. GitHub charges no fee on personal sponsorships (background knowledge, not verified here).

## Q6. Realistic options for a Thailand-based seller (payout methods)

### Takeaway
Payout methods are confirmed only for some platforms:
- **Apify:** PayPal or Wise, $20 minimum, KYC required.
- **GitHub Sponsors:** Thailand explicitly supported.
- **Shopify:** PayPal, bank or wire via Hyperwallet, with country-dependent options.

Marketplaces built only on Stripe Connect (several MCP stores) need checking against Stripe's Thailand support.

### Cited Findings
- Apify: PayPal or Wise ($20 minimum), other methods ($100 minimum), KYC required. — [Apify docs: manage payouts](https://docs.apify.com/platform/actors/publishing/monetize/monthly-payouts)
- GitHub Sponsors: Thailand is a supported region. — [GitHub docs](https://docs.github.com/en/sponsors/getting-started-with-github-sponsors/about-github-sponsors)
- Shopify: methods depend on the country and currency chosen in the partner dashboard. — [Shopify getting paid](https://help.shopify.com/partners/getting-started/getting-paid)
- RapidAPI: pays via PayPal, and PayPal fees appear to fall on the provider on top of the 20-25% fee. — [RapidAPI docs](https://docs.rapidapi.com/docs/payouts-and-finance); [Trustpilot](https://www.trustpilot.com/review/rapidapi.com?page=2)
- MCP Marketplace and MCPRush pay out through Stripe Connect. — [mcp-marketplace.io](https://mcp-marketplace.io/for-creators); [MCPRush](https://mcprush.com/)

### Inferences
Suggested priority for a Thai solo developer using an AI coding agent:
1. **Apify Actors (PPE):** clear rails and proven payout volume. Pick niche, non-personal data sources.
2. **n8n/AI automation services** via Upwork and similar platforms: real money, but it is trading time for money.
3. **WordPress plugin or Chrome extension** with a merchant of record: slower compounding.
4. **Shopify app:** best economics, highest effort.
5. **RapidAPI or MCP-only marketplaces:** low priority.
6. **GPT Store and Claude plugin directory:** zero direct income.

### Gaps
- Stripe Connect support for Thai individuals: I believe Stripe operates in Thailand (background knowledge), but it was not verified in this research.
- Thai tax treatment of foreign platform income (personal income tax on foreign-sourced income remitted into Thailand, a rule change from 2024) was not researched and should be checked separately.
- Payoneer support on these platforms was not researched.
