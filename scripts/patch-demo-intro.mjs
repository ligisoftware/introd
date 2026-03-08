/**
 * patch-demo-intro.mjs
 * Applies incremental fixes to the seeded Luminary AI demo intro.
 * Safe to re-run — all operations are idempotent updates.
 * Run: node scripts/patch-demo-intro.mjs
 */

import { createServiceClient } from "./lib.mjs";

const sb = createServiceClient();

const INTRO_ID = "beb2ae0d-8321-49d3-9593-07a4c8da4b35";

// ---------------------------------------------------------------------------
// 1. Update all four founder avatars in parallel
// ---------------------------------------------------------------------------
console.log("🖼️  Updating avatars…");

await Promise.all([
  sb.from("users").update({ avatar_url: "https://randomuser.me/api/portraits/men/32.jpg" }).eq("email", "alex.rivera@demo.luminary.ai"),
  sb.from("users").update({ avatar_url: "https://randomuser.me/api/portraits/women/44.jpg" }).eq("email", "sarah.chen@demo.luminary.ai"),
  sb.from("users").update({ avatar_url: "https://randomuser.me/api/portraits/men/52.jpg" }).eq("email", "marcus.webb@demo.luminary.ai"),
  sb.from("users").update({ avatar_url: "https://randomuser.me/api/portraits/women/61.jpg" }).eq("email", "amara.osei@demo.luminary.ai"),
].map((p) => p.then(({ error }) => { if (error) throw error; })));

console.log("  ✅ All avatars updated");

// ---------------------------------------------------------------------------
// 2. Update intro: logo, funding formatting, owner fields, and sections
// ---------------------------------------------------------------------------
console.log("\n📋 Patching intro…");

const { error: introErr } = await sb
  .from("intros")
  .update({
    logo_url: "https://ui-avatars.com/api/?name=Luminary+AI&background=6d28d9&color=ffffff&size=256&bold=true",
    title: "CEO & Co-Founder",
    owner_start_date: "2024-09-01",
    owner_bio: "Former VP of Product at Adobe Creative Cloud and founding PM at Figma. Stanford MBA. Built design tools used by 30M+ creatives across two acquisitions. Now bringing 12 years of product intuition to the intelligence layer behind media.",
    show_owner_email: false,
    intro_text: `Luminary AI is the content intelligence platform for publishers.

Media companies invest millions in editorial production but make decisions on gut feel — disconnected tools, no attribution model, no unified intelligence layer. Luminary sits across your existing stack and applies semantic AI to every piece of content, surfacing actionable signals: which stories to commission, when to publish, which formats drive subscriptions, what converts readers into subscribers.

Not another analytics dashboard. The intelligence layer behind every editorial decision.`,
    funding_rounds: [
      { type: "safe", roundName: "Pre-Seed", amount: "$1.5M", date: "2025-01-15", valuationCap: "$8M" },
      { type: "round", roundName: "Seed", amount: "$4M", date: "2025-11-01", postValuation: "$18M" },
    ],
    custom_fields: [
      {
        id: "2390231b-f18e-4ee8-b430-8fd35063f6da",
        title: "Traction",
        value: `Launched March 2025. $1.1M ARR in nine months, 14 paying customers including 3 top-50 US publishers. NPS 72. Customers average 30% content efficiency gains and 2x subscriber conversion improvement within 90 days. $3.2M in pipeline.

Reference customers: The Atlantic, Vox Media, Axios. Our closest competitor took 3 years to reach $1M ARR.`,
      },
      {
        id: "8d6fdbfd-c6e1-4afd-8c11-fc1ba1a6d07d",
        title: "Market & Competition",
        value: `$12B TAM across media analytics, content intelligence, and editorial AI (Gartner, 2025). Beachhead: $2.4B in English-language publishers with 1M+ monthly readers.

Existing tools are fragmented — Chartbeat for real-time analytics, Parse.ly on a legacy stack, scattered AI point solutions — none providing unified intelligence.

Our moat: proprietary content embeddings trained on 500M+ articles, deep integration breadth, and network effects where each new customer improves our models.`,
      },
    ],
    updated_at: new Date().toISOString(),
  })
  .eq("id", INTRO_ID);

if (introErr) {
  console.error("❌ Intro patch failed:", introErr.message);
  process.exit(1);
}
console.log("  ✅ Intro patched");

console.log(`
🎉 Done!

  Share URL: https://introd.me/i/luminary-ai-seed
  Editor:    /intro/${INTRO_ID}
`);
