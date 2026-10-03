// Real, original content for the Insights / Strategic Intelligence page
// (item 12 of the correction list). No fictional authors, publishers, or
// bylines -- everything here is published under the agency itself, and
// every claim is general, defensible advice rather than an invented,
// client-specific metric.

export type InsightFormat = "read" | "download" | "listen";

export interface InsightResource {
  id: string;
  format: InsightFormat;
  tag: string;
  title: string;
  readTime: string; // also used for "length" on download/listen formats
  date: string;
  excerpt: string;
  /** Full article body, as an array of paragraphs. Only used for format "read". */
  body?: string[];
  /** File to download/stream. Only used for "download" / "listen". */
  fileUrl?: string;
  fileSizeLabel?: string;
}

export const INSIGHTS_RESOURCES: InsightResource[] = [
  {
    id: "insight-scope-before-quote",
    format: "read",
    tag: "Project Strategy",
    readTime: "6 min read",
    date: "October 2026",
    title: "How to Scope a Software Project Before You Request a Quote",
    excerpt:
      "Vague briefs produce vague quotes. A practical framework for turning a rough idea into a scope that any agency (not just NDH) can price accurately on the first pass.",
    body: [
      "Most project delays don't start in development — they start in scoping. A brief that says \"I want an app like Uber but for X\" forces whoever is quoting it to guess at dozens of decisions, and every guess either inflates the price (to cover the unknowns) or sets up a painful renegotiation later. The fix isn't a longer document; it's answering a small number of specific questions before you ever get on a call.",
      'Start with the problem, not the feature list. What exactly breaks today without this software — a manual spreadsheet, a missed customer, a compliance gap? Naming the problem in one sentence forces clarity that a feature wishlist never does, and it gives whoever builds the product a way to judge trade-offs later ("does this feature actually solve the problem we named, or is it just nice to have?").',
      "Separate day-one features from day-two features. Every product idea grows in the telling. A practical trick: list every feature you can think of, then mark each one M (must exist to launch), S (should exist soon after), or L (later / nice to have). Agencies and freelancers alike will quote the M list much more accurately than an undifferentiated feature list, because the M list is what actually determines architecture decisions.",
      'Define your user roles before your screens. "Admin", "customer", and "staff" might sound obvious, but the permissions boundary between them is usually where unplanned work hides. If a customer can see pricing an admin set, if a staff member can refund an order without approval — these are product decisions, not engineering details, and they belong in the brief.',
      'Name your real integrations, not your wish list. If you need to accept payments, send WhatsApp notifications, sync with an accounting tool, or pull from a government verification API, say so specifically, and mention whether you already have developer/sandbox access to that system. "Needs to integrate with Paystack" is a very different scope item from "needs to integrate with Paystack, and we already have live API keys."',
      'Bring a number, even if it\'s a range. Teams quote more accurately, not less, when a client states a budget range up front — it tells the team which architecture decisions are even worth proposing. A $5,000 MVP and a $50,000 platform are different products built with different tools; asking for "your best quote" without a range usually produces either an unusably broad estimate or several rounds of back-and-forth before the real number appears.',
      "None of this requires hiring a business analyst first. A single page covering the problem statement, the M/S/L feature split, the user roles, the named integrations, and a budget range will get you a faster, more accurate quote from any serious software team — because you've already done the part of scoping that normally eats the first two weeks of a project.",
    ],
  },
  {
    id: "insight-fixed-vs-tm",
    format: "read",
    tag: "Engagement Models",
    readTime: "7 min read",
    date: "September 2026",
    title: "Fixed-Price vs. Time & Materials: Choosing the Right Model for Your Project",
    excerpt:
      "Both pricing models are legitimate — they just protect against different risks. Here's how to tell which one actually fits your project, and why milestone structure matters more than the label.",
    body: [
      '"Fixed price or time and materials?" is one of the first questions any serious vendor conversation runs into, and most explanations stop at the surface: fixed price means a set number, time & materials (T&M) means you pay for hours worked. That\'s true, but it skips the part that actually matters — which risks each model shifts onto which party, and when that shift makes sense.',
      "Fixed price works when the scope is genuinely knowable in advance: a landing page, a well-specified internal tool, a v1 of a product with a locked feature list. The agency absorbs the risk of underestimating effort, which is exactly why agencies pad fixed-price quotes for anything with ambiguity — that padding is the cost of certainty. If your brief is tight (see: scoping before you request a quote), fixed price gets you a number you can plan a budget around.",
      "Time & materials works when the scope is expected to change — ongoing product development, a team augmenting your in-house engineers, or genuine R&D where nobody knows the answer until it's built. Here the client absorbs the schedule/cost risk, but gains the ability to change direction without renegotiating a contract every time priorities shift. The failure mode of T&M isn't dishonesty, it's drift: without discipline, a T&M engagement can run long simply because there's no forcing function to stop.",
      "The honest answer for most client-facing agency work is a hybrid: fixed-price milestones inside a larger T&M-shaped relationship. You agree on a scope for Milestone 1 (say, authentication + core data model) at a fixed price, ship it, review it, and then scope Milestone 2 with the knowledge gained from Milestone 1. This gives you fixed-price certainty at every individual checkpoint, while keeping the flexibility to adjust direction between checkpoints — which is how NDH structures client engagements, and it's a pattern you can ask any agency to adopt even if they don't offer it by default.",
      'Whatever model you choose, the real protection isn\'t the pricing label — it\'s whether payment is tied to a specific, inspectable deliverable or just to time passing. A milestone that isn\'t accepted until it has been reviewed against an agreed specification protects you regardless of whether the underlying contract says "fixed price" or "time & materials". Ask any vendor, agency or freelancer, one question before signing: "What exactly do I get to inspect before this milestone payment is released?" The quality of their answer tells you more than the pricing model does.',
    ],
  },
  {
    id: "insight-escrow-trust",
    format: "read",
    tag: "Payments & Trust",
    readTime: "5 min read",
    date: "August 2026",
    title: "Why Milestone-Based Escrow Protects Both Clients and Talent",
    excerpt:
      "Remote software work has a trust problem in both directions. Milestone escrow isn't a buzzword — it's a specific mechanism for fixing it. Here's how it actually works and why it matters to both sides of the table.",
    body: [
      'Remote software engagements have a trust problem that runs in both directions, and most explanations of "escrow" only address one side of it. Clients worry about paying up front for work that\'s late, low-quality, or never delivered. Talent — developers, designers, specialists — worry about delivering work and then chasing an invoice that never gets paid, or getting ghosted after the first milestone. Milestone-based escrow is a specific mechanism for reducing both risks at once, not just marketing language for "trust us."',
      "The structure is simple: instead of paying the full project value up front, or paying nothing until final delivery, the client funds each milestone into escrow before work on it begins. The agency or talent only gets paid out once that specific milestone has been reviewed and accepted against an agreed specification. Nobody is working purely on faith that payment will show up, and nobody is paying purely on faith that the work will show up.",
      "This matters more the less you know the people you're working with. If you're hiring a development team you've worked with for five years, informal trust already does this job. If you're hiring anyone — an agency, a freelancer, a marketplace contractor — for the first time, milestone escrow replaces reputation you haven't built yet with a structural guarantee that does the same job: nobody loses everything if the relationship doesn't work out after milestone one.",
      'It also changes incentives for quality, not just payment timing. When a milestone payout depends on passing a review against a written specification, that specification becomes the thing both sides refer back to when there\'s a disagreement about whether something is "done." Without it, "done" is whatever the builder says it is, and disputes become arguments about intent instead of arguments about a document both parties already agreed to.',
      'The honest caveat: escrow structure only protects you if the milestones themselves are specific enough to be inspected objectively. "Milestone 1: backend work" protects no one. "Milestone 1: user authentication (email + OAuth), core data model for X and Y, and an admin panel to manage both, deployed to a staging environment for review" protects both sides, because there\'s something concrete to check. If a vendor offers escrow but won\'t commit to specific, inspectable milestones, the escrow is mostly theater — ask for both together.',
    ],
  },
  {
    id: "insight-kickoff-checklist",
    format: "download",
    tag: "Template",
    readTime: "1-page PDF",
    date: "October 2026",
    title: "NDH Project Kickoff Checklist",
    excerpt:
      "A practical, printable one-pager covering the six things worth nailing down before your discovery call — problem, scope boundaries, user roles, integrations, budget reality, and what to bring to the call.",
    fileUrl: "/downloads/ndh-project-kickoff-checklist.pdf",
    fileSizeLabel: "PDF · ~4 KB",
  },
  {
    id: "insight-pm-audio",
    format: "listen",
    tag: "Audio Explainer",
    readTime: "~1.5 min listen",
    date: "October 2026",
    title: "What Your Project Manager Actually Does, in Plain Terms",
    excerpt:
      "A short audio walkthrough of the five things a PM is actually responsible for on a managed engagement — triage, scoping, talent matching, delivery oversight, and communication — and why that structure moves risk away from you.",
    fileUrl: "/downloads/ndh-what-your-pm-actually-does.mp3",
    fileSizeLabel: "MP3 · ~1.5 min",
  },
];
