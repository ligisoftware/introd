import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import BeamsWrapper from "@/app/components/BeamsWrapper";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (user) redirect("/intro");

  return (
    <main className="lp-page">
      <style>{`
        .lp-page {
          background: #080909;
          color: #F4F6F5;
          font-family: 'Figtree', ui-sans-serif, sans-serif;
          overflow-x: hidden;
        }
        .lp-page h1, .lp-page h2, .lp-page h3, .lp-page h4 {
          font-family: 'Sora', ui-sans-serif, sans-serif;
        }
        .lp-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .lp-glass {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .lp-btn-primary {
          background: linear-gradient(135deg, #0D9488, #0F766E);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
          cursor: pointer;
          border: none;
        }
        .lp-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(13,148,136,0.4);
        }
        .lp-btn-outline {
          background: transparent;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          border: 1px solid rgba(255,255,255,0.2);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: border-color 0.2s, background 0.2s;
          text-decoration: none;
          cursor: pointer;
        }
        .lp-btn-outline:hover { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.05); }
        .lp-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(13,148,136,0.12);
          border: 1px solid rgba(13,148,136,0.3);
          color: #5EEAD4;
          padding: 5px 14px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: 'Sora', sans-serif;
        }
        .lp-progress { height: 4px; border-radius: 2px; background: rgba(255,255,255,0.1); overflow: hidden; }
        .lp-progress-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #0D9488, #2DD4BF); }
        .lp-stars { color: #C9A84C; font-size: 14px; letter-spacing: 2px; }
        @keyframes lp-float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes lp-pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 0.8; } }
        @keyframes lp-spin-slow { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
        .lp-float { animation: lp-float 7s ease-in-out infinite; }
        .lp-pulse { animation: lp-pulse 5s ease-in-out infinite; }
        .lp-spin { animation: lp-spin-slow 20s linear infinite; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #080909; }
        ::-webkit-scrollbar-thumb { background: rgba(13,148,136,0.4); border-radius: 3px; }
        .lp-nav-pill-link { display:inline-block; padding:7px 18px; border-radius:100px; font-size:13px; font-weight:500; color:rgba(255,255,255,0.8); text-decoration:none; font-family:'Sora',sans-serif; transition:background 0.18s, color 0.18s; }
        .lp-nav-pill-link:hover { background:rgba(255,255,255,0.1); color:white; }
        .lp-nav-cta { display:inline-flex; align-items:center; gap:6px; padding:9px 22px; font-size:13px; border-radius:100px; background:white; color:#080909; text-decoration:none; font-family:'Sora',sans-serif; font-weight:600; transition:transform 0.18s, box-shadow 0.18s; }
        .lp-nav-cta:hover { transform:translateY(-1px); box-shadow:0 4px 20px rgba(255,255,255,0.2); }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:68}}>
          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:32,height:32,background:'linear-gradient(135deg,#0D9488,#0F766E)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 16px rgba(13,148,136,0.4)'}}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 8.5L6 12L13.5 4.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:17,letterSpacing:'-0.02em',color:'white'}}>INTROD</span>
          </div>

          {/* Glassmorphic pill nav */}
          <div style={{display:'flex',alignItems:'center',gap:2,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:100,padding:'4px',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)'}}>
            <a href="#features" className="lp-nav-pill-link">Features</a>
            <a href="#how-it-works" className="lp-nav-pill-link">How It Works</a>
            <a href="#pricing" className="lp-nav-pill-link">Pricing</a>
          </div>

          {/* CTA */}
          <Link href="/login" className="lp-nav-cta">
            Get Started →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',paddingTop:80,position:'relative',overflow:'hidden',background:'#080909'}}>
        {/* Beams 3D background */}
        <BeamsWrapper
          beamWidth={2.5}
          beamHeight={18}
          beamNumber={15}
          lightColor="#ffffff"
          speed={2.5}
          noiseIntensity={2}
          scale={0.15}
          rotation={43}
        />
        {/* Gradient overlay for text readability */}
        <div style={{position:'absolute',inset:0,zIndex:1,background:'linear-gradient(to top,rgba(8,9,9,0.75) 0%,rgba(8,9,9,0.35) 40%,rgba(8,9,9,0.2) 100%)',pointerEvents:'none'}}></div>
        {/* Radial darkening behind text center */}
        <div style={{position:'absolute',inset:0,zIndex:2,background:'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(8,9,9,0.45) 0%,transparent 100%)',pointerEvents:'none'}}></div>
        {/* Teal accent glow */}
        <div className="lp-blob lp-pulse" style={{width:700,height:350,background:'radial-gradient(ellipse,rgba(13,148,136,0.12),transparent 70%)',top:0,left:'50%',transform:'translateX(-50%)',zIndex:2}}></div>

        <div style={{position:'relative',zIndex:10,textAlign:'center',padding:'0 24px',maxWidth:900,margin:'0 auto'}}>
          {/* Badge */}
          <div style={{display:'inline-flex',alignItems:'center',gap:8,marginBottom:24,background:'rgba(13,148,136,0.12)',border:'1px solid rgba(13,148,136,0.3)',borderRadius:100,padding:'5px 16px 5px 6px'}}>
            <span style={{background:'#0D9488',color:'white',fontSize:10,fontWeight:700,padding:'2px 9px',borderRadius:100,fontFamily:"'Sora',sans-serif"}}>NEW</span>
            <span style={{color:'#5EEAD4',fontSize:12,fontFamily:"'Sora',sans-serif",fontWeight:500}}>AI-Powered Introduction Scoring Platform</span>
          </div>

          {/* Headline */}
          <h1 style={{fontSize:'clamp(44px,6.5vw,78px)',fontWeight:900,lineHeight:1.08,letterSpacing:'-0.04em',marginBottom:20}}>
            <span style={{background:'linear-gradient(160deg,#ffffff 0%,#5EEAD4 80%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Raise Faster With</span><br/>
            <span style={{color:'white'}}>Warm Introductions</span>
          </h1>

          <p style={{fontSize:18,color:'#566666',lineHeight:1.7,marginBottom:36,maxWidth:520,marginLeft:'auto',marginRight:'auto'}}>
            A single shareable page with your background, startup, and team — AI-scored for the investors and connectors who matter.
          </p>

          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,marginBottom:72,flexWrap:'wrap'}}>
            <Link href="/login" className="lp-btn-primary" style={{padding:'14px 30px',fontSize:15,borderRadius:10,boxShadow:'0 0 50px rgba(13,148,136,0.35)'}}>
              Create Your Intro Page
            </Link>
            <a href="#how-it-works" className="lp-btn-outline" style={{padding:'14px 30px',fontSize:15,borderRadius:10}}>
              ▶ See How It Works
            </a>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="lp-float" style={{position:'relative',zIndex:10,width:'100%',maxWidth:1000,padding:'0 24px'}}>
          <div className="lp-glass" style={{padding:0,overflow:'hidden',boxShadow:'0 40px 120px rgba(0,0,0,0.7),0 0 80px rgba(13,148,136,0.1)',border:'1px solid rgba(255,255,255,0.1)'}}>
            {/* Window chrome */}
            <div style={{background:'rgba(12,14,14,0.98)',padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:10,height:10,borderRadius:'50%',background:'#FF5F57'}}></div>
              <div style={{width:10,height:10,borderRadius:'50%',background:'#FEBC2E'}}></div>
              <div style={{width:10,height:10,borderRadius:'50%',background:'#28C840'}}></div>
              <div style={{flex:1,background:'rgba(255,255,255,0.04)',borderRadius:4,padding:'3px 12px',fontSize:11,color:'#334155',maxWidth:280,margin:'0 auto',textAlign:'center',fontFamily:"'Figtree',sans-serif"}}>app.introd.io/dashboard</div>
            </div>
            {/* Dashboard layout */}
            <div style={{display:'grid',gridTemplateColumns:'175px 1fr',minHeight:320,background:'rgba(9,10,10,0.99)'}}>
              {/* Sidebar */}
              <div style={{borderRight:'1px solid rgba(255,255,255,0.05)',padding:16}}>
                <div style={{fontSize:9,color:'#334155',fontWeight:700,letterSpacing:'0.1em',marginBottom:12,fontFamily:"'Sora',sans-serif"}}>NAVIGATION</div>
                <div style={{display:'flex',flexDirection:'column',gap:3,marginBottom:20}}>
                  {[{label:'Dashboard',active:true},{label:'My Intros',active:false},{label:'Connections',active:false},{label:'AI Scores',active:false},{label:'Analytics',active:false}].map(item => (
                    <div key={item.label} style={{background:item.active?'rgba(13,148,136,0.18)':'',borderRadius:7,padding:'7px 10px',display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:5,height:5,borderRadius:'50%',background:item.active?'#0D9488':'#334155'}}></div>
                      <span style={{fontSize:12,color:item.active?'#E2E8F0':'#475569',fontWeight:item.active?500:400}}>{item.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{background:'rgba(13,148,136,0.1)',border:'1px solid rgba(13,148,136,0.2)',borderRadius:10,padding:12}}>
                  <div style={{fontSize:9,color:'#0D9488',fontWeight:700,marginBottom:4,fontFamily:"'Sora',sans-serif"}}>SCORE AVG</div>
                  <div style={{fontSize:26,fontWeight:900,color:'white',fontFamily:"'Sora',sans-serif",lineHeight:1}}>8.7</div>
                  <div style={{fontSize:9,color:'#475569',marginTop:2}}>This month</div>
                </div>
              </div>
              {/* Main */}
              <div style={{padding:16,display:'flex',flexDirection:'column',gap:12}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
                  <div style={{background:'rgba(13,148,136,0.12)',border:'1px solid rgba(13,148,136,0.2)',borderRadius:10,padding:12}}>
                    <div style={{fontSize:9,color:'#0D9488',fontWeight:700,fontFamily:"'Sora',sans-serif",marginBottom:4}}>INTRO VIEWS</div>
                    <div style={{fontSize:18,fontWeight:900,color:'white',fontFamily:"'Sora',sans-serif"}}>1,247</div>
                    <div style={{fontSize:9,color:'#16A34A',marginTop:3}}>↑ 18% this week</div>
                  </div>
                  <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:12,position:'relative',overflow:'hidden'}}>
                    <div style={{position:'absolute',right:-10,top:-10,width:70,height:70,background:'radial-gradient(circle,rgba(13,148,136,0.6),rgba(15,118,110,0.4))',borderRadius:'50%',filter:'blur(18px)'}}></div>
                    <div style={{fontSize:9,color:'#8FA3A0',fontWeight:700,fontFamily:"'Sora',sans-serif",marginBottom:4}}>INTRO REQUESTS</div>
                    <div style={{fontSize:18,fontWeight:900,color:'white',fontFamily:"'Sora',sans-serif"}}>48</div>
                    <div style={{fontSize:9,color:'#16A34A',marginTop:3}}>+5 this week</div>
                  </div>
                  <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:12}}>
                    <div style={{fontSize:9,color:'#8FA3A0',fontWeight:700,fontFamily:"'Sora',sans-serif",marginBottom:4}}>AI SCORE AVG</div>
                    <div style={{fontSize:18,fontWeight:900,color:'white',fontFamily:"'Sora',sans-serif"}}>8.7 / 10</div>
                    <div style={{fontSize:9,color:'#16A34A',marginTop:3}}>↑ 0.3 pts</div>
                  </div>
                </div>
                {/* Chart */}
                <div style={{background:'rgba(255,255,255,0.015)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:10,padding:12,flex:1}}>
                  <div style={{fontSize:10,color:'#475569',fontWeight:700,fontFamily:"'Sora',sans-serif",marginBottom:10}}>INTRODUCTION ACTIVITY</div>
                  <div style={{display:'flex',alignItems:'flex-end',gap:5,height:70}}>
                    {[45,68,52,88,62,47,75,92,58,72,82,100].map((h, i) => (
                      <div key={i} style={{flex:1,background:h>=88?'linear-gradient(180deg,rgba(13,148,136,0.9),rgba(13,148,136,0.25))':'linear-gradient(180deg,rgba(13,148,136,0.55),rgba(13,148,136,0.12))',borderRadius:'3px 3px 0 0',height:`${h}%`}}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pills */}
        <div style={{position:'relative',zIndex:10,display:'flex',flexWrap:'wrap',justifyContent:'center',gap:10,marginTop:28,padding:'0 24px',maxWidth:900}}>
          {[
            {icon:'/icons/rocket.svg', label:'AI-Powered Scoring'},
            {icon:'/icons/bolt.svg', label:'Automated Workflows'},
            {icon:'/icons/chart-bar.svg', label:'Real-Time Analytics'},
            {icon:'/icons/link.svg', label:'Shareable Intro Pages'},
            {icon:'/icons/shield.svg', label:'Enterprise Security'},
            {icon:'/icons/target.svg', label:'Investor Matching'},
          ].map(pill => (
            <div key={pill.label} className="lp-glass" style={{padding:'9px 16px',display:'flex',alignItems:'center',gap:8,borderRadius:100}}>
              <img src={pill.icon} alt="" width={16} height={16} style={{opacity:0.7,filter:'invert(1)'}} />
              <span style={{fontSize:12,fontWeight:600,fontFamily:"'Sora',sans-serif"}}>{pill.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{padding:'120px 0',background:'#0C0E0E',position:'relative',overflow:'hidden'}}>
        <div className="lp-blob lp-pulse" style={{width:500,height:500,background:'radial-gradient(circle,rgba(13,148,136,0.1),transparent 70%)',top:0,right:-100}}></div>
        <div className="lp-blob lp-pulse" style={{width:400,height:400,background:'radial-gradient(circle,rgba(15,118,110,0.08),transparent 70%)',bottom:0,left:-100,animationDelay:'2s'}}></div>

        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <div className="lp-badge" style={{marginBottom:16}}>
              <img src="/icons/bolt.svg" alt="" width={12} height={12} style={{filter:'invert(1)',opacity:0.8}} />
              MOST POWERFUL FEATURES
            </div>
            <h2 style={{fontSize:'clamp(32px,4vw,52px)',fontWeight:800,lineHeight:1.15,letterSpacing:'-0.03em',marginBottom:16}}>
              Everything You Need to<br/>Win the Intro
            </h2>
            <p style={{color:'#566666',fontSize:16,maxWidth:480,margin:'0 auto',lineHeight:1.6}}>Built for founders who are serious about fundraising. Every feature exists to help you make a stronger first impression.</p>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginBottom:20}}>
            {[
              {
                icon: '/icons/cpu.svg',
                title: 'AI Intro Scoring',
                desc: 'Every intro page gets an AI quality score — so connectors and investors can instantly gauge fit before reaching out.',
                metric: 'AVG SCORE', value: '8.7 / 10', delta: '↑ Top 12% of founders',
              },
              {
                icon: '/icons/document-text.svg',
                title: 'Standardized Pages',
                desc: 'One canonical page with your background, startup, team, and pitch deck. No more scattered PDFs or outdated bios.',
                metric: 'COMPLETION', value: '94%', delta: '↑ vs 61% avg',
              },
              {
                icon: '/icons/users.svg',
                title: 'Connector Network',
                desc: 'Warm intro requests flow through verified connectors. Every request is tracked, timestamped, and accountable.',
                metric: 'INTROS SENT', value: '3,812', delta: '↑ 24% this month',
              },
            ].map(card => (
              <div key={card.title} className="lp-glass" style={{padding:24}}>
                <div style={{width:42,height:42,background:'rgba(13,148,136,0.18)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16}}>
                  <img src={card.icon} alt="" width={20} height={20} style={{filter:'invert(1)',opacity:0.9}} />
                </div>
                <h3 style={{fontSize:17,fontWeight:700,marginBottom:8}}>{card.title}</h3>
                <p style={{color:'#566666',fontSize:13,lineHeight:1.6,marginBottom:16}}>{card.desc}</p>
                <div style={{background:'rgba(13,148,136,0.07)',borderRadius:8,padding:12}}>
                  <div style={{fontSize:9,color:'#0D9488',fontWeight:700,marginBottom:4,fontFamily:"'Sora',sans-serif"}}>{card.metric}</div>
                  <div style={{fontSize:20,fontWeight:800,color:'white',fontFamily:"'Sora',sans-serif"}}>{card.value}</div>
                  <div style={{fontSize:9,color:'#16A34A',marginTop:3}}>{card.delta}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:20}}>
            <div className="lp-glass" style={{padding:24}}>
              <div style={{width:42,height:42,background:'rgba(13,148,136,0.18)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16}}>
                <img src="/icons/document.svg" alt="" width={20} height={20} style={{filter:'invert(1)',opacity:0.9}} />
              </div>
              <h3 style={{fontSize:17,fontWeight:700,marginBottom:8}}>Pitch Deck Attachments</h3>
              <p style={{color:'#566666',fontSize:13,lineHeight:1.6,marginBottom:16}}>Attach your pitch deck directly to your intro page. Investors get everything in one place — no follow-up email needed.</p>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {[{label:'Deck View Rate',pct:78},{label:'Full Read Rate',pct:52},{label:'Follow-up Rate',pct:34}].map(bar => (
                  <div key={bar.label}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'#566666',marginBottom:4}}>
                      <span>{bar.label}</span><span style={{color:'#F4F6F5'}}>{bar.pct}%</span>
                    </div>
                    <div className="lp-progress"><div className="lp-progress-fill" style={{width:`${bar.pct}%`}}></div></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lp-glass" style={{padding:24}}>
              <div style={{width:42,height:42,background:'rgba(13,148,136,0.18)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16}}>
                <img src="/icons/arrow-up-right.svg" alt="" width={20} height={20} style={{filter:'invert(1)',opacity:0.9}} />
              </div>
              <h3 style={{fontSize:17,fontWeight:700,marginBottom:8}}>Shareable Intro Links</h3>
              <p style={{color:'#566666',fontSize:13,lineHeight:1.6,marginBottom:16}}>Share one link. Anyone with it can view your intro page, request a warm intro through a verified connector, and see your AI score.</p>
              <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:12,display:'flex',alignItems:'center',gap:12}}>
                <div style={{flex:1,fontSize:12,color:'#566666',fontFamily:"'Figtree',monospace"}}>introd.io/u/sarah-chen</div>
                <div style={{background:'rgba(13,148,136,0.18)',borderRadius:6,padding:'4px 10px',fontSize:11,color:'#5EEAD4',fontWeight:600,fontFamily:"'Sora',sans-serif"}}>COPY</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{padding:'120px 0',background:'#080909',position:'relative',overflow:'hidden'}}>
        <div className="lp-blob lp-pulse" style={{width:600,height:600,background:'radial-gradient(circle,rgba(13,148,136,0.08),transparent 70%)',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}></div>

        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <div className="lp-badge" style={{marginBottom:16}}>
              <img src="/icons/rocket.svg" alt="" width={12} height={12} style={{filter:'invert(1)',opacity:0.8}} />
              HOW IT WORKS
            </div>
            <h2 style={{fontSize:'clamp(32px,4vw,52px)',fontWeight:800,lineHeight:1.15,letterSpacing:'-0.03em',marginBottom:16}}>
              From Profile to First Meeting<br/>in Four Steps
            </h2>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20}}>
            {[
              {step:'01',icon:'/icons/document-text.svg',title:'Build Your Page',desc:"Fill out your background, startup overview, team bios, and attach your pitch deck. Takes 15 minutes."},
              {step:'02',icon:'/icons/cpu.svg',title:'Get AI Scored',desc:"Our AI scores your intro for completeness, clarity, and investor-readiness. Scores update as you improve."},
              {step:'03',icon:'/icons/link.svg',title:'Share the Link',desc:"Send one link to connectors, AngelList, accelerators, or post it publicly. Everything they need is there."},
              {step:'04',icon:'/icons/users.svg',title:'Receive Warm Intros',desc:"Qualified connectors route your intro to the right investors. Every request is tracked and accountable."},
            ].map((s, i) => (
              <div key={s.step} style={{position:'relative'}}>
                {i < 3 && <div style={{position:'absolute',top:20,right:-10,width:'calc(100% - 40px)',height:1,background:'linear-gradient(90deg,rgba(13,148,136,0.4),transparent)',left:60,zIndex:0}}></div>}
                <div className="lp-glass" style={{padding:24,position:'relative',zIndex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                    <div style={{width:36,height:36,background:'rgba(13,148,136,0.18)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <img src={s.icon} alt="" width={18} height={18} style={{filter:'invert(1)',opacity:0.9}} />
                    </div>
                    <span style={{fontSize:11,fontWeight:700,color:'#0D9488',fontFamily:"'Sora',sans-serif"}}>STEP {s.step}</span>
                  </div>
                  <h3 style={{fontSize:16,fontWeight:700,marginBottom:8}}>{s.title}</h3>
                  <p style={{color:'#566666',fontSize:13,lineHeight:1.6}}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{padding:'120px 0',background:'#0C0E0E',position:'relative',overflow:'hidden'}}>
        <div className="lp-blob lp-pulse" style={{width:600,height:600,background:'radial-gradient(circle,rgba(13,148,136,0.1),transparent 70%)',top:-200,right:-200}}></div>

        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <div className="lp-badge" style={{marginBottom:16}}>
              <img src="/icons/star.svg" alt="" width={12} height={12} style={{filter:'invert(1)',opacity:0.8}} />
              PRICING
            </div>
            <h2 style={{fontSize:'clamp(32px,4vw,52px)',fontWeight:800,lineHeight:1.15,letterSpacing:'-0.03em',marginBottom:16}}>
              Simple, Transparent Pricing
            </h2>
            <p style={{color:'#566666',fontSize:16,maxWidth:480,margin:'0 auto',lineHeight:1.6}}>Start free. Upgrade when you need more intros, deeper analytics, or team features.</p>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {[
              {
                name:'Free', price:'$0', period:'/month',
                desc:'Perfect for founders just starting to fundraise.',
                features:['1 intro page','AI quality score','Shareable link','Basic analytics'],
                cta:'Get Started Free', highlight: false,
              },
              {
                name:'Pro', price:'$29', period:'/month',
                desc:'For active fundraisers who need full visibility.',
                features:['Unlimited intro pages','Advanced AI scoring','Pitch deck attachments','Detailed analytics','Priority connector access','Custom domain'],
                cta:'Start Pro Trial', highlight: true,
              },
              {
                name:'Team', price:'$99', period:'/month',
                desc:'For studios, accelerators, and cohorts.',
                features:['Everything in Pro','Up to 20 team members','Bulk intro management','White-label pages','API access','Dedicated support'],
                cta:'Contact Sales', highlight: false,
              },
            ].map(plan => (
              <div key={plan.name} className="lp-glass" style={{padding:32,position:'relative',border:plan.highlight?'1px solid rgba(13,148,136,0.4)':'1px solid rgba(255,255,255,0.08)',boxShadow:plan.highlight?'0 0 60px rgba(13,148,136,0.12)':'none'}}>
                {plan.highlight && <div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'#0D9488',color:'white',fontSize:10,fontWeight:700,padding:'3px 16px',borderRadius:100,fontFamily:"'Sora',sans-serif",letterSpacing:'0.08em',whiteSpace:'nowrap'}}>MOST POPULAR</div>}
                <div style={{marginBottom:24}}>
                  <div style={{fontSize:13,fontWeight:700,color:'#8FA3A0',fontFamily:"'Sora',sans-serif",letterSpacing:'0.06em',marginBottom:8}}>{plan.name.toUpperCase()}</div>
                  <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:8}}>
                    <span style={{fontSize:40,fontWeight:900,fontFamily:"'Sora',sans-serif",color:plan.highlight?'#0D9488':'white'}}>{plan.price}</span>
                    <span style={{fontSize:14,color:'#566666'}}>{plan.period}</span>
                  </div>
                  <p style={{fontSize:13,color:'#566666',lineHeight:1.5}}>{plan.desc}</p>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:28}}>
                  {plan.features.map(f => (
                    <div key={f} style={{display:'flex',alignItems:'center',gap:10}}>
                      <img src="/icons/check.svg" alt="" width={14} height={14} style={{filter:plan.highlight?'invert(58%) sepia(74%) saturate(480%) hue-rotate(139deg)':'invert(1)',opacity:0.9,flexShrink:0}} />
                      <span style={{fontSize:13,color:'#8FA3A0'}}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/login" className={plan.highlight ? 'lp-btn-primary' : 'lp-btn-outline'} style={{width:'100%',justifyContent:'center',borderRadius:8}}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{padding:'120px 0',background:'#080909',position:'relative',overflow:'hidden'}}>
        <div className="lp-blob lp-pulse" style={{width:500,height:500,background:'radial-gradient(circle,rgba(201,168,76,0.08),transparent 70%)',bottom:0,left:-100,animationDelay:'1s'}}></div>

        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <div className="lp-badge" style={{marginBottom:16}}>
              <img src="/icons/star.svg" alt="" width={12} height={12} style={{filter:'invert(1)',opacity:0.8}} />
              TESTIMONIALS
            </div>
            <h2 style={{fontSize:'clamp(32px,4vw,48px)',fontWeight:800,lineHeight:1.15,letterSpacing:'-0.03em'}}>
              Founders Closing Rounds<br/>With Introd
            </h2>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {[
              {name:'Sarah Chen', role:'Co-founder, Meridian Labs', raised:'Raised $2.1M Seed', quote:"I sent my Introd link to three connectors and had four VC meetings booked within a week. The AI score gave them instant confidence in reaching out.", score:'9.2/10'},
              {name:'Marcus Rivera', role:'CEO, Arca Health', raised:'Raised $850K Pre-Seed', quote:"Before Introd, every intro request was a back-and-forth nightmare. Now I send one link and investors have everything they need to say yes to a meeting.", score:'8.8/10'},
              {name:'Priya Nair', role:'Founder, Vela AI', raised:'Raised $3.5M Seed', quote:"The pitch deck attachment feature alone was worth it. Investors who saw my Introd page had a 3× higher show-up rate to initial calls.", score:'9.5/10'},
            ].map(t => (
              <div key={t.name} className="lp-glass" style={{padding:28,display:'flex',flexDirection:'column',gap:16}}>
                <div className="lp-stars">★★★★★</div>
                <p style={{color:'#8FA3A0',fontSize:14,lineHeight:1.7,flex:1}}>"{t.quote}"</p>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:'white'}}>{t.name}</div>
                    <div style={{fontSize:12,color:'#566666'}}>{t.role}</div>
                    <div style={{fontSize:11,color:'#0D9488',fontWeight:600,marginTop:2}}>{t.raised}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:9,color:'#566666',fontFamily:"'Sora',sans-serif",fontWeight:700,marginBottom:2}}>AI SCORE</div>
                    <div style={{fontSize:18,fontWeight:900,color:'#0D9488',fontFamily:"'Sora',sans-serif"}}>{t.score}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{padding:'100px 0',background:'#0C0E0E',position:'relative',overflow:'hidden'}}>
        <div className="lp-blob lp-pulse" style={{width:800,height:800,background:'radial-gradient(circle,rgba(13,148,136,0.15),transparent 70%)',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}></div>

        <div style={{maxWidth:640,margin:'0 auto',padding:'0 24px',textAlign:'center',position:'relative',zIndex:10}}>
          <h2 style={{fontSize:'clamp(36px,5vw,60px)',fontWeight:900,lineHeight:1.1,letterSpacing:'-0.04em',marginBottom:20}}>
            <span style={{background:'linear-gradient(160deg,#ffffff 0%,#5EEAD4 80%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Ready to Raise Faster?</span>
          </h2>
          <p style={{color:'#566666',fontSize:16,lineHeight:1.7,marginBottom:40,maxWidth:440,margin:'0 auto 40px'}}>
            Build your intro page in 15 minutes. Get AI-scored. Start receiving warm introductions from verified connectors.
          </p>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,flexWrap:'wrap'}}>
            <Link href="/login" className="lp-btn-primary" style={{padding:'16px 36px',fontSize:16,borderRadius:10,boxShadow:'0 0 60px rgba(13,148,136,0.4)'}}>
              Create Your Intro Page →
            </Link>
            <span style={{fontSize:13,color:'#566666'}}>Free to start · No credit card</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{borderTop:'1px solid rgba(255,255,255,0.06)',padding:'60px 24px',background:'#080909'}}>
        <div style={{maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:24}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:28,height:28,background:'linear-gradient(135deg,#0D9488,#0F766E)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2.5 8.5L6 12L13.5 4.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:15,letterSpacing:'-0.02em'}}>INTROD</span>
          </div>
          <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
            <Link href="/feedback" style={{fontSize:13,color:'#566666',textDecoration:'none',transition:'color 0.2s'}}>Feedback</Link>
            <Link href="/login" style={{fontSize:13,color:'#566666',textDecoration:'none',transition:'color 0.2s'}}>Log In</Link>
            <a href="mailto:hello@introd.io" style={{fontSize:13,color:'#566666',textDecoration:'none',transition:'color 0.2s'}}>Contact</a>
          </div>
          <div style={{fontSize:12,color:'#566666'}}>© 2026 Introd. All rights reserved.</div>
        </div>

        {/* Watermark */}
        <div style={{textAlign:'center',marginTop:48,userSelect:'none',pointerEvents:'none'}}>
          <span style={{fontSize:'clamp(60px,12vw,140px)',fontWeight:900,fontFamily:"'Sora',sans-serif",color:'rgba(255,255,255,0.02)',letterSpacing:'-0.04em'}}>INTROD</span>
        </div>
      </footer>
    </main>
  );
}
