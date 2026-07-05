import React, { useState } from 'react';

// ===================================================
// CONFIGURATIONS, REGIONS, AND SEED DATABASES
// ===================================================
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";
const apiKey = ""; // Set your API Key here if using live Gemini integration
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mwvdybdl"; // Replace with your Formspree ID to process real signups!

const REGIONS = [
  "South Asia",
  "Southeast Asia",
  "Latin America",
  "Caribbean Islands",
  "Eastern Europe",
  "Eastern Africa",
  "Southern Africa",
  "Western Africa"
];

const INDUSTRIES = [
  "Agriculture & Food Systems",
  "Water Access & Sanitation",
  "Clean Energy & Climate Tools",
  "Offline Educational Kits",
  "Micro-Commerce & Crafts",
  "Community Waste Systems"
];

const LOCALIZED_SUGGESTIONS = {
  "South Asia": [
    {
      title: "Solar-Powered Silk & Yarn Spinners",
      problem: "Traditional hand-spinning is highly labor-intensive and yields low daily output, keeping rural weavers in a cycle of low income.",
      solution: "Equipping local textile family collectives with low-draw, solar-assisted spinning attachments constructed locally.",
      impact: "Triples daily yarn yield, allowing immediate micro-enterprise growth in rural craft hubs."
    },
    {
      title: "Rainwater Harvesting Filtration Kits",
      problem: "Heavy seasonal monsoon rains go uncollected, followed immediately by severe clean water scarcity in rural villages.",
      solution: "Deploying basic, low-maintenance gravity-fed sand and charcoal filtration setups for home-level collection tanks.",
      impact: "Supplies clean drinking water to multi-family clusters using simple local hardware."
    }
  ],
  "Southeast Asia": [
    {
      title: "Floating Hydro-Micro Generators",
      problem: "Remote river communities lack direct connection to the central electricity grid.",
      solution: "Assembling portable, floating water-wheel generators using recycled plastic drums and simple alternators.",
      impact: "Provides reliable low-voltage power for local household lighting and charging communication devices."
    }
  ],
  "Latin America": [
    {
      title: "Community Coffee Dry-Beds",
      problem: "Smallholder coffee growers lose high value by selling wet, unprocessed beans to large middle-distributors.",
      solution: "Erecting elevated, sun-shielded drying beds built from local timber and high-durability mesh.",
      impact: "Allows farmers to dry crop yields safely, commanding a 40 percent higher price in regional markets."
    }
  ],
  "Caribbean Islands": [
    {
      title: "Organic Seaweed Fertilizer Processing",
      problem: "Heavy seaweed accumulations on coastlines disrupt local fishing, while conventional fertilizers remain expensive.",
      solution: "Setting up small-scale composting and organic liquid extraction units to process harvested seaweed.",
      impact: "Provides coastal farmers with high-nutrient, low-cost fertilizer while restoring local beaches."
    }
  ],
  "Eastern Europe": [
    {
      title: "Micro-Greenhouse Thermal Foils",
      problem: "Extremely short growing seasons combined with high energy costs prevent off-season vegetable farming.",
      solution: "Distributing specialized, energy-trapping multi-layer insulation sheets for simple wooden tunnel beds.",
      impact: "Extends the cultivation calendar, allowing families to grow fresh cold-hardy greens through winter."
    }
  ],
  "Eastern Africa": [
    {
      title: "Gravity Drip Irrigation Sets",
      problem: "Irregular rainfall patterns in dry agricultural corridors cause sudden crop failure.",
      solution: "Distributing low-cost, gravity-assisted drip lines connected to simple elevated community barrels.",
      impact: "Enables dry-season vegetable farming, stabilizing food supplies and micro-income."
    }
  ],
  "Southern Africa": [
    {
      title: "Offline Mobile Learning Hubs",
      problem: "High internet data fees and cellular blackouts restrict rural school students from digital educational materials.",
      solution: "Loading comprehensive visual study courses and local language audiobooks onto robust microSD cards for older mobile phones.",
      impact: "Enables village student networks to study core academic subjects completely offline without connection charges."
    }
  ],
  "Western Africa": [
    {
      title: "Cassava Grating Stations",
      problem: "Processing raw cassava into staple food requires exhausting manual labor, limiting local trade volume.",
      solution: "Building simple, pedal-powered mechanical cassava grating equipment using bicycle frames and locally fabricated metal drums.",
      impact: "Reduces processing time by 80 percent, empowering women's self-help groups to sell larger batches."
    }
  ]
};

async function queryGeminiSuggestions(prompt, systemInstruction = "", maxRetries = 3) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [
      { parts: [{ text: prompt }] }
    ],
    systemInstruction: systemInstruction ? {
      parts: [{ text: systemInstruction }]
    } : undefined,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          ideas: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                problem: { type: "STRING" },
                solution: { type: "STRING" },
                impact: { type: "STRING" }
              },
              required: ["title", "problem", "solution", "impact"]
            }
          }
        },
        required: ["ideas"]
      }
    }
  };

  let delay = 1000;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return JSON.parse(text);
      }
      
      if (response.status === 429 || response.status >= 500) {
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
        continue;
      }
      throw new Error("Unable to parse API response");
    } catch (e) {
      if (i === maxRetries - 1) throw e;
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'suggestions', 'tiers'
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [newsEmail, setNewsEmail] = useState('');
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  // Ideas Engine States
  const [currentRegion, setCurrentRegion] = useState(REGIONS[0]);
  const [currentIndustry, setCurrentIndustry] = useState(INDUSTRIES[0]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [activeIdeas, setActiveIdeas] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsEmail) return;

    // Graceful fallback if the user has not replaced the default endpoint yet
    if (FORMSPREE_ENDPOINT.includes("YOUR_FORMSPREE_ID")) {
      setSubscriptionSuccess(true);
      triggerToast("Success simulation! Please remember to replace YOUR_FORMSPREE_ID in the code.");
      setNewsEmail('');
      setTimeout(() => setSubscriptionSuccess(false), 6000);
      return;
    }

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email: newsEmail })
      });

      if (response.ok) {
        setSubscriptionSuccess(true);
        triggerToast("Subscribed! You will now receive daily grassroots news updates.");
        setNewsEmail('');
        setTimeout(() => setSubscriptionSuccess(false), 6000);
      } else {
        triggerToast("Submission failed. Please verify your Formspree endpoint.");
      }
    } catch (err) {
      console.error("Formspree submission error:", err);
      triggerToast("An error occurred during subscription.");
    }
  };

  const fetchSuggestions = async () => {
    setIsLoadingIdeas(true);
    setActiveIdeas([]);
    
    const prompt = `Generate exactly 3 micro-venture project ideas in the ${currentIndustry} sector that can be successfully launched for under $1,000 USD within ${currentRegion}. 
    CRITICAL RULE: You must NOT mention any specific individual country names. Only address the wider geographic region framework of ${currentRegion} (e.g. South Asia, Southeast Asia, Eastern Europe).
    Make each idea highly detailed, practical, sustainable, and optimized for grassroots implementation.`;

    const systemInstruction = `You are the lead regional strategist for Vision2Venture, an elite global innovation fund. Your output must strictly match the JSON schema, offering real, executable ideas with high community benefit.`;

    try {
      if (!apiKey) {
        throw new Error("No API key"); // Force local beautiful suggestion load instantly
      }
      const response = await queryGeminiSuggestions(prompt, systemInstruction);
      if (response && response.ideas) {
        setActiveIdeas(response.ideas);
        triggerToast(`Loaded fresh AI recommendations for ${currentRegion}!`);
      } else {
        throw new Error("Empty response");
      }
    } catch (err) {
      // Elegant regional fallback matching rules: absolutely no country names or asterisks!
      const fallbackSet = LOCALIZED_SUGGESTIONS[currentRegion] || [
        {
          title: `Smart Localized ${currentIndustry} Systems`,
          problem: `Underdeveloped infrastructure in key pockets of the ${currentRegion} environment limits local production.`,
          solution: "Simple, hand-operated wooden tools and metal brackets engineered from local workshop components.",
          impact: "Saves hours of daily labor, enabling local micro-merchants to increase output."
        },
        {
          title: "Alternative Co-operative Clean Hub",
          problem: `High costs of initial materials and imported setups in rural sectors of the ${currentRegion} region.`,
          solution: "A joint village cooperative sharing robust entry-level tools purchased directly with the seed grant.",
          impact: "Drives community resilience and eliminates steep startup costs for independent families."
        }
      ];
      setActiveIdeas(fallbackSet);
      triggerToast(`Loaded curated suggestions for ${currentRegion}!`);
    } finally {
      setIsLoadingIdeas(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#062419] flex flex-col selection:bg-[#c9f2d6] selection:text-[#064e3b]">
      
      {}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        
        body, button, input, select, textarea, h1, h2, h3, h4, h5, h6, p, a, span, li, option {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-scaleUp {
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white border-2 border-[#10b981] p-4 rounded-2xl shadow-xl animate-bounce">
          <div className="h-2.5 w-2.5 rounded-full bg-[#10b981] animate-ping"></div>
          <p className="text-sm font-bold text-[#064e3b]">{toastMessage}</p>
        </div>
      )}

      {/* Premium State Banner */}
      <div className="bg-[#059669] text-white py-3 px-4 text-center text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#a7f3d0] animate-pulse"></span>
        <span>California Resilience Alliance Alliance</span>
        <span className="text-[#a7f3d0]">|</span>
        <span>$27,000 Global Grassroots Initiative Active</span>
      </div>

      {/* Modern High-End White Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#ecf5ef] px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="h-10 w-10 bg-gradient-to-tr from-[#059669] to-[#10b981] rounded-xl flex items-center justify-center font-extrabold text-white shadow-md shadow-[#10b981]/20 text-lg">
            V2V
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#064e3b]">
              Vision2Venture
            </h1>
            <p className="text-[10px] text-[#059669] font-bold tracking-widest uppercase">Global Grassroots Accelerator</p>
          </div>
        </div>

        {/* Beautiful Navigation Tabs */}
        <nav className="flex flex-wrap gap-1 bg-[#f0f7f2] p-1.5 rounded-xl border border-[#e2efe6]">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${activeTab === 'home' ? 'bg-[#059669] text-white shadow-sm' : 'text-[#2a5c46] hover:bg-white/60 hover:text-[#064e3b]'}`}
          >
            Mission and Overview
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${activeTab === 'suggestions' ? 'bg-[#059669] text-white shadow-sm' : 'text-[#2a5c46] hover:bg-white/60 hover:text-[#064e3b]'}`}
          >
            Venture Suggestions
          </button>
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${activeTab === 'tiers' ? 'bg-[#059669] text-white shadow-sm' : 'text-[#2a5c46] hover:bg-white/60 hover:text-[#064e3b]'}`}
          >
            Funding Structure
          </button>
        </nav>

        {/* Instant Apply Trigger */}
        <button
          onClick={() => setApplyModalOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-extrabold tracking-wider uppercase transition-all shadow-md shadow-[#059669]/15 hover:scale-[1.02]"
        >
          Apply Now
        </button>
      </header>

      {}
      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-16">

        {/* HOME / OVERVIEW TAB */}
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fadeIn">
            
            {/* Elegant Premium Hero Display */}
            <div className="relative overflow-hidden rounded-3xl border border-[#e2efe6] bg-gradient-to-br from-white to-[#f4fbf6] p-8 md:p-16 text-center shadow-lg">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                <span className="inline-block text-[11px] font-extrabold px-3 py-1.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] uppercase tracking-wider">
                  Partnering with California State Resilience Initiatives
                </span>
                
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#064e3b] leading-tight">
                  Funding Local Solutions <br/>
                  <span className="bg-gradient-to-r from-[#059669] to-[#10b981] bg-clip-text text-transparent">Where They Grow Best</span>
                </h2>
                
                <p className="text-[#3b604e] text-base leading-relaxed max-w-2xl mx-auto">
                  Vision2Venture is a focused micro-grant program designed to help local changemakers launch original business and community pilot runs. Backed by elite American resilience models, we deliver direct funding to 45 selected founders.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={() => setApplyModalOpen(true)}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#059669] text-white font-bold hover:bg-[#047857] hover:shadow-lg hover:shadow-[#059669]/15 transition-all"
                  >
                    Submit 2-Minute Pitch
                  </button>
                  <button 
                    onClick={() => setActiveTab('suggestions')}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-[#a7f3d0] bg-[#ecfdf5]/50 text-[#047857] font-bold hover:bg-[#ecfdf5] transition-all"
                  >
                    Get Seed Ideas
                  </button>
                </div>
              </div>

              {/* Program Dashboard Specs */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-[#e2efe6]">
                <div className="p-6 rounded-2xl bg-white border border-[#ecf5ef] text-center">
                  <h3 className="text-4xl font-extrabold text-[#059669]">$27,000</h3>
                  <p className="text-xs text-[#527d66] font-bold mt-2 uppercase tracking-wide">Total Allocation Pool</p>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-[#ecf5ef] text-center">
                  <h3 className="text-4xl font-extrabold text-[#059669]">45 Awards</h3>
                  <p className="text-xs text-[#527d66] font-bold mt-2 uppercase tracking-wide">Grassroots Founders Funded</p>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-[#ecf5ef] text-center">
                  <h3 className="text-4xl font-extrabold text-[#059669]">No Barriers</h3>
                  <p className="text-xs text-[#527d66] font-bold mt-2 uppercase tracking-wide">Teams or Solo Pitch Entries</p>
                </div>
              </div>
            </div>

            {}
            {/* Simplified Geographic Focus Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[#059669] text-sm font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-6 bg-[#059669] rounded-full"></span>
                  Local Communities, Global Resilience
                </div>
                <h3 className="text-3xl font-extrabold text-[#064e3b]">
                  Supporting Grassroots Innovation Internationally
                </h3>
                <p className="text-[#3b604e] leading-relaxed">
                  Our evaluation system looks at regional needs rather than strict national borders. Whether you are launching an crop storage pilot in <strong className="font-bold text-[#064e3b]">South Asia</strong>, distributing offline study guides in the <strong className="font-bold text-[#064e3b]">Caribbean Islands</strong>, or engineering solar pumps in <strong className="font-bold text-[#064e3b]">Latin America</strong>, we analyze feasibility based on the local resources you can access.
                </p>
                <p className="text-[#3b604e] leading-relaxed">
                  We look for solutions utilizing materials easily sourced near home workshops, community networks, or local craft hubs. No expensive tech setup is required—just an honest, viable 2-minute pitch explaining how your concept works.
                </p>
              </div>

              {/* Dynamic Video Instructions Graphics */}
              <div className="bg-white p-8 rounded-3xl border border-[#e2efe6] space-y-6 shadow-sm">
                <h4 className="text-lg font-extrabold text-[#064e3b] flex items-center justify-between">
                  <span>Standard 2-Minute Pitch Outline</span>
                  <span className="text-xs bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] px-3 py-1 rounded-md font-bold">Limit: 120s</span>
                </h4>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h5 className="font-bold text-[#064e3b] text-sm">Hook and Region (0s to 30s)</h5>
                      <p className="text-xs text-[#527d66] mt-0.5">Introduce your name, team, and your broad target region.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h5 className="font-bold text-[#064e3b] text-sm">Problem and Solution (30s to 90s)</h5>
                      <p className="text-xs text-[#527d66] mt-0.5">Detail what community equipment or micro-enterprise you will set up.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h5 className="font-bold text-[#064e3b] text-sm">Seed Deployment (90s to 120s)</h5>
                      <p className="text-xs text-[#527d66] mt-0.5">Describe how your specific seed tier ($300, $500, or $1,000) launches this pilot.</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#ecf5ef] pt-4 flex justify-between items-center">
                  <span className="text-xs text-[#527d66]">No application form is required.</span>
                  <button 
                    onClick={() => setApplyModalOpen(true)}
                    className="text-[#059669] font-extrabold text-xs hover:underline"
                  >
                    View Timelines &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {}
        {/* VENTURE SUGGESTIONS HUB */}
        {activeTab === 'suggestions' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-block text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-full bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]">
                Ideas Catalyst
              </span>
              <h2 className="text-3xl font-extrabold text-[#064e3b]">Venture Suggestion Engine</h2>
              <p className="text-[#3b604e] text-sm">
                Explore high-feasibility, small-scale startup concepts suited for broad regional environments. We evaluate practical viability over heavy country-specific constraints.
              </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#e2efe6] shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Region Select */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#064e3b] uppercase tracking-wider block">
                    1. Select Broad Geographic Environment
                  </label>
                  <select
                    value={currentRegion}
                    onChange={(e) => setCurrentRegion(e.target.value)}
                    className="w-full bg-[#fcfdfc] border border-[#e2efe6] rounded-xl px-4 py-3 text-sm text-[#062419] font-semibold focus:outline-none focus:ring-2 focus:ring-[#10b981]/40"
                  >
                    {REGIONS.map(reg => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>

                {/* Industry Select */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#064e3b] uppercase tracking-wider block">
                    2. Select Primary Field
                  </label>
                  <select
                    value={currentIndustry}
                    onChange={(e) => setCurrentIndustry(e.target.value)}
                    className="w-full bg-[#fcfdfc] border border-[#e2efe6] rounded-xl px-4 py-3 text-sm text-[#062419] font-semibold focus:outline-none focus:ring-2 focus:ring-[#10b981]/40"
                  >
                    {INDUSTRIES.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={fetchSuggestions}
                  disabled={isLoadingIdeas}
                  className="w-full md:w-auto px-10 py-4 rounded-xl bg-[#059669] hover:bg-[#047857] disabled:bg-slate-300 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-[#059669]/10"
                >
                  {isLoadingIdeas ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading Regional Options...
                    </>
                  ) : (
                    "View Suggestion Blueprints"
                  )}
                </button>
              </div>
            </div>

            {}
            {/* Suggestions Render Column */}
            {activeIdeas.length > 0 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-[#064e3b] flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-[#059669] rounded-full"></span>
                  Feasibility Outlines for {currentRegion}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeIdeas.map((idea, index) => (
                    <div key={index} className="p-6 rounded-2xl border border-[#e2efe6] bg-white space-y-4 hover:border-[#10b981]/50 transition-all shadow-sm">
                      <span className="inline-block text-[10px] uppercase font-extrabold px-2 py-1 rounded bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]">
                        Scenario {index + 1}
                      </span>
                      <h4 className="text-lg font-extrabold text-[#064e3b]">{idea.title}</h4>
                      
                      <div className="space-y-3 text-xs text-[#3b604e]">
                        <p>
                          <strong className="text-[#064e3b] block">Target Challenge:</strong>
                          {idea.problem}
                        </p>
                        <p>
                          <strong className="text-[#064e3b] block">Grassroots Setup Strategy:</strong>
                          {idea.solution}
                        </p>
                        <p>
                          <strong className="text-[#064e3b] block">Estimated Regional Impact:</strong>
                          {idea.impact}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#ecf5ef]">
                        <button
                          onClick={() => setApplyModalOpen(true)}
                          className="w-full py-2.5 bg-[#ecfdf5] hover:bg-[#059669] hover:text-white rounded-lg text-xs font-bold text-[#047857] border border-[#a7f3d0] transition-all"
                        >
                          Express Pitch Interest
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {}
        {/* FUNDING STRUCTURE TAB */}
        {activeTab === 'tiers' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-block text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-full bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]">
                $27,000 Global Budget Allocation
              </span>
              <h2 className="text-3xl font-extrabold text-[#064e3b]">45 Micro-Grants Ecosystem</h2>
              <p className="text-[#3b604e] text-sm font-medium">
                To maximize our localized reach, we split our capital across three tiers matching the scale of different grassroots efforts.
              </p>
            </div>

            {/* Visual Grid representing Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Tier 1 */}
              <div className="p-8 rounded-3xl border-2 border-[#10b981] bg-white relative space-y-6 shadow-md shadow-[#10b981]/5">
                <div className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 bg-[#10b981] text-white text-[10px] font-bold tracking-widest uppercase rounded-full">
                  Primary Scale
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#059669] font-bold uppercase tracking-wider">
                    <span>Tier 1</span>
                    <span>/</span>
                    <span>15 Awards</span>
                  </div>
                  <h3 className="text-5xl font-black text-[#064e3b]">$1,000</h3>
                  <p className="text-xs text-[#527d66] font-medium">To launch structured micro-cooperatives or acquire machinery.</p>
                </div>

                <div className="h-[1px] bg-[#ecf5ef]"></div>

                <div className="space-y-3 text-xs text-[#3b604e]">
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]"></span>
                    Ideal for localized solar grid solutions.
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]"></span>
                    Requires basic, low-power utility plan.
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]"></span>
                    Aimed at group or multi-family benefit.
                  </p>
                </div>

                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full py-3 bg-[#059669] hover:bg-[#047857] rounded-xl text-white text-xs font-bold transition-all"
                >
                  View Tier Eligibility
                </button>
              </div>

              {/* Tier 2 */}
              <div className="p-8 rounded-3xl border border-[#e2efe6] bg-white space-y-6 shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#059669] font-bold uppercase tracking-wider">
                    <span>Tier 2</span>
                    <span>/</span>
                    <span>15 Awards</span>
                  </div>
                  <h3 className="text-5xl font-black text-[#064e3b]">$500</h3>
                  <p className="text-xs text-[#527d66] font-medium">For mid-scale setup tools, supply acquisition, and distribution.</p>
                </div>

                <div className="h-[1px] bg-[#ecf5ef]"></div>

                <div className="space-y-3 text-xs text-[#3b604e]">
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]"></span>
                    Excellent for raw crop storage arrays.
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]"></span>
                    Supports hand-tool workshops.
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]"></span>
                    Aimed at regional merchant operations.
                  </p>
                </div>

                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full py-3 bg-[#ecfdf5] text-[#047857] hover:bg-[#059669] hover:text-white rounded-xl text-xs font-bold transition-all border border-[#a7f3d0]"
                >
                  View Tier Eligibility
                </button>
              </div>

              {/* Tier 3 */}
              <div className="p-8 rounded-3xl border border-[#e2efe6] bg-white space-y-6 shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#059669] font-bold uppercase tracking-wider">
                    <span>Tier 3</span>
                    <span>/</span>
                    <span>15 Awards</span>
                  </div>
                  <h3 className="text-5xl font-black text-[#064e3b]">$300</h3>
                  <p className="text-xs text-[#527d66] font-medium">To trial immediate prototypes, offline kits, or local crafts.</p>
                </div>

                <div className="h-[1px] bg-[#ecf5ef]"></div>

                <div className="space-y-3 text-xs text-[#3b604e]">
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]"></span>
                    Aimed at student and independent pilots.
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]"></span>
                    Covers microSD cards and materials.
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]"></span>
                    Designed for swift proof-of-concept.
                  </p>
                </div>

                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full py-3 bg-[#ecfdf5] text-[#047857] hover:bg-[#059669] hover:text-white rounded-xl text-xs font-bold transition-all border border-[#a7f3d0]"
                >
                  View Tier Eligibility
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {}
      {/* APPLICATION OVERLAY / MODAL */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#062419]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl border border-[#e2efe6] p-8 space-y-6 shadow-2xl relative animate-scaleUp">
            
            {/* Close Button */}
            <button
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#f0f7f2] hover:bg-[#e2efe6] text-[#064e3b] flex items-center justify-center font-bold text-sm transition-all"
            >
              &times;
            </button>

            <div className="space-y-2 text-center">
              <span className="inline-block text-[10px] font-extrabold px-3 py-1 bg-[#fdf2f2] text-[#b91c1c] rounded-full uppercase tracking-wider">
                System Announcement
              </span>
              <h3 className="text-2xl font-extrabold text-[#064e3b]">Applications Aren't Open Yet</h3>
              <p className="text-xs text-[#527d66] max-w-sm mx-auto">
                Our evaluation system is currently preparing the review frameworks. Please observe our official application phases below:
              </p>
            </div>

            {/* Phases Guide Grid */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#f4fbf6] border border-[#e2efe6] flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-extrabold text-[#064e3b]">Phase 1 Evaluation</h4>
                  <p className="text-[11px] text-[#527d66]">Submission window details</p>
                </div>
                <span className="text-xs font-bold bg-[#059669] text-white px-3 py-1 rounded-lg">
                  November to January
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f4fbf6] border border-[#e2efe6] flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-extrabold text-[#064e3b]">Phase 2 Evaluation</h4>
                  <p className="text-[11px] text-[#527d66]">Final selection pool</p>
                </div>
                <span className="text-xs font-bold bg-[#059669] text-white px-3 py-1 rounded-lg">
                  March to May
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-800 leading-relaxed flex items-start gap-2.5">
              <svg className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span><strong className="font-bold">Notice:</strong> No manual application forms are currently active. Once open, you will be able to launch our recording studio right here. Subscribe below to receive an automated notification.</span>
            </div>

            <button
              onClick={() => setApplyModalOpen(false)}
              className="w-full py-3 bg-[#059669] hover:bg-[#047857] rounded-xl text-white text-xs font-bold tracking-wider uppercase transition-all"
            >
              Acknowledge and Close
            </button>
          </div>
        </div>
      )}

      {/* PREMIUM WHITE FOOTER */}
      <footer className="border-t border-[#ecf5ef] bg-white mt-20 px-6 py-12">
        <div className="max-w-6xl w-full mx-auto space-y-12">
          
          {/* Main Footer Hub */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#ecf5ef]">
            
            {/* Logo/Summary Info */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-[#059669] rounded-lg flex items-center justify-center font-black text-white text-xs">V2V</div>
                <h3 className="font-extrabold text-[#064e3b] text-sm">Vision2Venture</h3>
              </div>
              <p className="text-xs text-[#527d66] leading-relaxed font-medium">
                An international seed deployment program modeled under California and American state resilience designs, bringing essential funding to underdeveloped areas globally.
              </p>
            </div>

            {}
            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-extrabold text-[#064e3b] uppercase tracking-wider">Geographic Scope</h4>
              <ul className="space-y-2 text-xs text-[#527d66] font-semibold">
                <li>South Asia Region</li>
                <li>Southeast Asia Cooperatives</li>
                <li>Latin America and Caribbean</li>
                <li>Eastern Europe and Western Africa</li>
              </ul>
            </div>

            {/* Daily News Newsletter Subscription Module */}
            <div className="md:col-span-5 space-y-4 font-medium">
              <h4 className="text-xs font-extrabold text-[#064e3b] uppercase tracking-wider">Subscribe to Daily Grassroots News</h4>
              <p className="text-xs text-[#527d66]">
                Provide your email below to receive daily impact news, grassroots project guides, and live program notifications.
              </p>

              {subscriptionSuccess ? (
                <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl text-xs text-[#047857] font-bold text-center animate-fadeIn">
                  <span>Thank you! Your daily news subscription is registered.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsEmail}
                    onChange={(e) => setNewsEmail(e.target.value)}
                    className="flex-1 bg-[#fcfdfc] border border-[#e2efe6] rounded-xl px-4 py-2.5 text-xs text-[#062419] font-semibold focus:outline-none focus:ring-2 focus:ring-[#10b981]/40"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Legal Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-[#527d66] font-semibold tracking-wide">
            <p>&copy; 2026 Vision2Venture Program. Sponsored by California State Resilience Alliances.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#059669]">Terms and Conditions</a>
              <a href="#" className="hover:text-[#059669]">Privacy Protocol</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}