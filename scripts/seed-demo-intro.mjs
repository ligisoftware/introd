/**
 * seed-demo-intro.mjs
 * Creates a fully-populated fictitious demo intro (Luminary AI) with 3 co-founders.
 * Run: node scripts/seed-demo-intro.mjs
 */

import { createServiceClient } from "./lib.mjs";

const supabase = createServiceClient();

// ---------------------------------------------------------------------------
// 1. Resolve the owner user
// ---------------------------------------------------------------------------
const { data: owner, error: ownerErr } = await supabase
  .from("users")
  .select("id, email, username")
  .eq("username", "user_cae2ff48")
  .single();

if (ownerErr || !owner) {
  console.error("❌ Could not find user @user_cae2ff48:", ownerErr?.message);
  process.exit(1);
}
console.log(`✅ Found owner: @${owner.username}  (id: ${owner.id})`);

// ---------------------------------------------------------------------------
// 2. Co-founder definitions
// ---------------------------------------------------------------------------
const coFounderDefs = [
  {
    email: "sarah.chen@demo.luminary.ai",
    name: "Sarah Chen",
    bio: "Former ML engineer at OpenAI and Google Brain. PhD in CS from MIT. Built and scaled AI infrastructure serving 100M+ daily active users. Passionate about making machine intelligence genuinely useful for everyday creators.",
    linkedinUrl: "https://linkedin.com/in/sarahchen-ai",
    twitterUrl: "https://twitter.com/sarahchen_ai",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    experience: [
      { company: "OpenAI", title: "Senior ML Engineer, Inference", logoUrl: "https://logo.clearbit.com/openai.com", startDate: "2021-03", endDate: "2024-09", current: false },
      { company: "Google Brain", title: "Research Engineer", logoUrl: "https://logo.clearbit.com/google.com", startDate: "2018-06", endDate: "2021-02", current: false },
      { company: "MIT CSAIL", title: "PhD Researcher, NLP", logoUrl: "https://logo.clearbit.com/mit.edu", startDate: "2014-09", endDate: "2018-05", current: false },
    ],
    collabTitle: "CTO & Co-Founder",
    collabStartDate: "2024-09-15",
    showEmail: false,
  },
  {
    email: "marcus.webb@demo.luminary.ai",
    name: "Marcus Webb",
    bio: "Previously led product at Netflix and Spotify, shipping features used by 500M+ people. Yale MBA. Built two products from zero to 10M users. Obsessed with the intersection of media, data, and great storytelling.",
    linkedinUrl: "https://linkedin.com/in/marcuswebb-product",
    twitterUrl: "https://twitter.com/marcus_webb",
    avatarUrl: "https://randomuser.me/api/portraits/men/52.jpg",
    experience: [
      { company: "Netflix", title: "Director of Product, Content Discovery", logoUrl: "https://logo.clearbit.com/netflix.com", startDate: "2020-01", endDate: "2024-08", current: false },
      { company: "Spotify", title: "Senior Product Manager, Personalization", logoUrl: "https://logo.clearbit.com/spotify.com", startDate: "2016-03", endDate: "2019-12", current: false },
      { company: "Yale School of Management", title: "MBA", logoUrl: "https://logo.clearbit.com/yale.edu", startDate: "2014-08", endDate: "2016-05", current: false },
    ],
    collabTitle: "CPO & Co-Founder",
    collabStartDate: "2024-09-15",
    showEmail: false,
  },
  {
    email: "amara.osei@demo.luminary.ai",
    name: "Amara Osei",
    bio: "Former VP of Strategic Partnerships at The New York Times. Harvard Business School alum. Closed $50M+ in enterprise deals across media, SaaS, and data licensing. Advisor to a dozen media-tech startups. Speaks fluent French and German.",
    linkedinUrl: "https://linkedin.com/in/amara-osei",
    twitterUrl: "https://twitter.com/amara_osei",
    avatarUrl: "https://randomuser.me/api/portraits/women/61.jpg",
    experience: [
      { company: "The New York Times", title: "VP of Strategic Partnerships", logoUrl: "https://logo.clearbit.com/nytimes.com", startDate: "2019-04", endDate: "2024-09", current: false },
      { company: "Bloomberg Media", title: "Director of Business Development", logoUrl: "https://logo.clearbit.com/bloomberg.com", startDate: "2015-06", endDate: "2019-03", current: false },
      { company: "Harvard Business School", title: "MBA", logoUrl: "https://logo.clearbit.com/hbs.edu", startDate: "2013-08", endDate: "2015-05", current: false },
    ],
    collabTitle: "Head of Business Development & Co-Founder",
    collabStartDate: "2024-10-01",
    showEmail: true,
  },
];

// ---------------------------------------------------------------------------
// 3. Create auth + public.users rows for all co-founders in parallel
// ---------------------------------------------------------------------------
console.log("\n👥 Creating co-founder users…");

const coFounderUserIds = await Promise.all(
  coFounderDefs.map(async (def) => {
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: def.email,
      email_confirm: true,
      user_metadata: { name: def.name },
    });

    if (authErr) {
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", def.email)
        .maybeSingle();
      if (existing) {
        console.log(`  ↩️  Reusing existing user for ${def.name}`);
        return existing.id;
      }
      console.error(`  ❌ Cannot resolve user for ${def.name}:`, authErr.message);
      process.exit(1);
    }

    const username = "user_" + def.name.toLowerCase().replace(/\s+/g, "").slice(0, 6) + Math.random().toString(36).slice(2, 6);

    const { data: pubUser, error: pubErr } = await supabase
      .from("users")
      .insert({ auth_user_id: authData.user.id, email: def.email, name: def.name, username, bio: def.bio, avatar_url: def.avatarUrl, linkedin_url: def.linkedinUrl, twitter_url: def.twitterUrl, experience: def.experience })
      .select("id")
      .single();

    if (pubErr) {
      console.error(`  ❌ Failed to insert public user for ${def.name}:`, pubErr.message);
      process.exit(1);
    }

    console.log(`  ✅ ${def.name}`);
    return pubUser.id;
  })
);

// ---------------------------------------------------------------------------
// 4. Create the intro
// ---------------------------------------------------------------------------
console.log("\n📋 Creating the intro…");

const { data: intro, error: introErr } = await supabase
  .from("intros")
  .insert({
    user_id: owner.id,
    share_slug: "luminary-ai-seed",
    startup_name: "Luminary AI",
    startup_one_liner: "The AI-native content intelligence platform that helps media companies understand, optimize, and monetize their editorial output.",
    website_url: "https://luminary.ai",
    logo_url: "https://ui-avatars.com/api/?name=Luminary+AI&background=6d28d9&color=ffffff&size=256&bold=true",
    founded_date: "2024-09-01",
    location: "San Francisco, CA",
    linkedin_url: "https://linkedin.com/company/luminary-ai",
    twitter_url: "https://twitter.com/luminaryai",
    title: "CEO & Co-Founder",
    owner_start_date: "2024-09-01",
    show_owner_email: false,
    owner_bio: "Former VP of Product at Adobe Creative Cloud and founding PM at Figma. Stanford MBA. Built design tools used by 30M+ creatives across two acquisitions. Now bringing 12 years of product intuition to the intelligence layer behind media.",
    intro_text: `Luminary AI is the content intelligence platform for publishers.

Media companies invest millions in editorial production but make decisions on gut feel — disconnected tools, no attribution model, no unified intelligence layer. Luminary sits across your existing stack and applies semantic AI to every piece of content, surfacing actionable signals: which stories to commission, when to publish, which formats drive subscriptions, what converts readers into subscribers.

Not another analytics dashboard. The intelligence layer behind every editorial decision.`,
    funding_rounds: [
      { type: "safe", roundName: "Pre-Seed", amount: "$1.5M", date: "2025-01-15", valuationCap: "$8M" },
      { type: "round", roundName: "Seed", amount: "$4M", date: "2025-11-01", postValuation: "$18M" },
    ],
    pitch_deck_source: "external",
    pitch_deck_external_url: "https://docsend.com/view/luminaryai-seed-deck",
    pitch_deck_file_name: "Luminary AI — Seed Deck 2025.pdf",
    attachments: [
      { id: crypto.randomUUID(), type: "image", storagePath: "demo/product-dashboard.png", url: "https://placehold.co/1200x800/0f1117/a78bfa?text=Luminary+Dashboard", fileName: "luminary-dashboard.png", title: "Product — Dashboard overview", mimeType: "image/png", fileSizeBytes: 248320, uploadedAt: new Date().toISOString() },
      { id: crypto.randomUUID(), type: "image", storagePath: "demo/content-intelligence.png", url: "https://placehold.co/1200x800/0f1117/34d399?text=Content+Intelligence+Graph", fileName: "content-intelligence-graph.png", title: "Content Intelligence — Semantic graph view", mimeType: "image/png", fileSizeBytes: 184512, uploadedAt: new Date().toISOString() },
      { id: crypto.randomUUID(), type: "image", storagePath: "demo/traction-chart.png", url: "https://placehold.co/1200x600/0f1117/f59e0b?text=ARR+Growth+Chart", fileName: "traction-arr-growth.png", title: "Traction — ARR growth Jan–Dec 2025", mimeType: "image/png", fileSizeBytes: 102400, uploadedAt: new Date().toISOString() },
    ],
    custom_fields: [
      { id: crypto.randomUUID(), title: "Traction", value: `Launched March 2025. $1.1M ARR in nine months, 14 paying customers including 3 top-50 US publishers. NPS 72. Customers average 30% content efficiency gains and 2x subscriber conversion improvement within 90 days. $3.2M in pipeline.\n\nReference customers: The Atlantic, Vox Media, Axios. Our closest competitor took 3 years to reach $1M ARR.` },
      { id: crypto.randomUUID(), title: "Market & Competition", value: `$12B TAM across media analytics, content intelligence, and editorial AI (Gartner, 2025). Beachhead: $2.4B in English-language publishers with 1M+ monthly readers.\n\nExisting tools are fragmented — Chartbeat for real-time analytics, Parse.ly on a legacy stack, scattered AI point solutions — none providing unified intelligence.\n\nOur moat: proprietary content embeddings trained on 500M+ articles, deep integration breadth, and network effects where each new customer improves our models.` },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
  .select("id, share_slug")
  .single();

if (introErr) {
  console.error("❌ Failed to create intro:", introErr.message);
  process.exit(1);
}
console.log(`✅ Intro created: id=${intro.id}  slug=${intro.share_slug}`);

// ---------------------------------------------------------------------------
// 5. Create accepted collaborator entries for all co-founders in parallel
// ---------------------------------------------------------------------------
console.log("\n🤝 Adding co-founders as collaborators…");

await Promise.all(
  coFounderDefs.map(async (def, i) => {
    const { error } = await supabase.from("intro_collaborators").insert({
      intro_id: intro.id,
      email: def.email,
      user_id: coFounderUserIds[i],
      invite_token: crypto.randomUUID(),
      status: "accepted",
      title: def.collabTitle,
      start_date: def.collabStartDate,
      bio: def.bio,
      show_email: def.showEmail,
      accepted_at: new Date().toISOString(),
    });
    if (error) {
      console.error(`  ❌ ${def.name}:`, error.message);
      process.exit(1);
    }
    console.log(`  ✅ ${def.name} (${def.collabTitle})`);
  })
);

console.log(`
🎉 Demo intro seeded!

  Intro ID:  ${intro.id}
  Share URL: https://introd.me/i/${intro.share_slug}
  Editor:    /intro/${intro.id}
`);
