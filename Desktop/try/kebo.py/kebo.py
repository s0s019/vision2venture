<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAU Impact Hub - Dynamic & Luxurious Design</title>
    <!-- Load Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    <style>
        /* --- 1. Custom Colors (Warm Palette) --- */
        :root {
            /* Light Brown (Primary Dark Accent, used for borders and main text) */
            --color-brown: #79430c; 
            /* Soft Gold / Light Yellow (Secondary Accent/Highlight, used for shine and luxury) */
            --color-yellow: #FFD799; 
            /* Soft Cream/Off-White (Section Background - increases white ratio) */
            --color-cream: #FFFBF5; 
            /* White (Main Background - 60% ratio) */
            --color-white: #ffffff;
        }
        
        /* Basic Utility Classes */
        .bg-brown { background-color: var(--color-brown); }
        .text-brown { color: var(--color-brown); }
        .bg-yellow-light { background-color: var(--color-yellow); }
        .text-yellow-light { color: var(--color-yellow); }

        body {
            font-family: 'Inter', sans-serif;
            scroll-behavior: smooth;
        }

        /* --- 2. Shining Text Effect for Title and Nav Hover --- */
        .shining-text {
            /* Create a metallic gradient effect combining yellow and white */
            background: linear-gradient(90deg, 
                #ffffff 0%, 
                var(--color-yellow) 10%, 
                #ffffff 20%, 
                var(--color-yellow) 40%, 
                #ffffff 50%,
                var(--color-yellow) 60%,
                #ffffff 80%,
                var(--color-yellow) 90%,
                #ffffff 100%
            );
            /* This is the magic: Clip the background to the text area */
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            /* Animation for the shine */
            animation: shine 5s linear infinite;
            background-size: 200% auto; /* Ensures the gradient is larger than the text area */
        }

        /* Apply the shining effect on hover for navigation links */
        .nav-link:hover {
            /* Apply the shining animation and clips defined in .shining-text */
            background: linear-gradient(90deg, 
                #ffffff 0%, 
                var(--color-yellow) 10%, 
                #ffffff 20%, 
                var(--color-yellow) 40%, 
                #ffffff 50%,
                var(--color-yellow) 60%,
                #ffffff 80%,
                var(--color-yellow) 90%,
                #ffffff 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shine 5s linear infinite;
            background-size: 200% auto;
        }
        
        @keyframes shine {
            to {
                /* Move the background gradient position to create the shimmer effect */
                background-position: -200% center; 
            }
        }

        /* --- 3. Moving Grounding Effect for Secondary Text --- */
        .moving-grounding {
            position: relative;
            overflow: hidden;
            display: inline-block;
            padding: 2px 4px; 
            border-radius: 4px;
        }
        
        .moving-grounding::before {
            content: '';
            position: absolute;
            top: 0;
            left: -150%;
            width: 300%;
            height: 100%;
            background: linear-gradient(
                90deg, 
                transparent 0%, 
                rgba(255, 255, 255, 0.4) 30%, 
                rgba(255, 255, 255, 0.7) 50%, 
                rgba(255, 255, 255, 0.4) 70%, 
                transparent 100%
            );
            animation: moveShine 8s linear infinite;
            z-index: 0;
            opacity: 0.5; 
        }
        
        @keyframes moveShine {
            0% { left: -150%; }
            100% { left: 150%; }
        }
        
        /* Ensure text stays on top of the moving background */
        .moving-grounding span {
            position: relative;
            z-index: 10;
        }
        
        /* --- 4. Interactive Elements & Transitions (Luxurious Feel) --- */
        
        /* Primary Button Style */
        .btn-primary {
            background-color: var(--color-brown);
            color: white;
            transition: all 0.4s ease-in-out;
            box-shadow: 0 4px 15px rgba(121, 67, 12, 0.2);
        }
        .btn-primary:hover {
            background-color: var(--color-yellow);
            color: var(--color-brown);
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 20px rgba(255, 215, 153, 0.5);
            border: 1px solid var(--color-brown); 
        }

        /* Card Hover Effect */
        .interactive-card {
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
            border: 1px solid transparent;
        }
        .interactive-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border-color: var(--color-yellow);
        }
        
        /* --- 5. Timeline Styling (Enhanced for Flow and Arrows) --- */
        
        .timeline {
            position: relative;
            max-width: 1200px;
            margin: 0 auto;
        }

        /* The vertical line */
        .timeline::after {
            content: '';
            position: absolute;
            width: 6px;
            background-color: var(--color-brown);
            top: 0;
            bottom: 0;
            left: 50%;
            margin-left: -3px;
            border-radius: 3px;
        }

        /* Container around content */
        .timeline-item {
            padding: 10px 40px;
            position: relative;
            background-color: inherit;
            width: 50%;
        }

        /* The circles/dots on the timeline */
        .timeline-item::after {
            content: '';
            position: absolute;
            width: 25px;
            height: 25px;
            right: -17px;
            background-color: var(--color-white);
            border: 4px solid var(--color-brown);
            top: 15px;
            border-radius: 50%;
            z-index: 1;
            transition: background-color 0.3s;
        }
        .timeline-item:hover::after {
            background-color: var(--color-yellow);
        }

        /* Place the container to the left */
        .left {
            left: 0;
        }

        /* Place the container to the right */
        .right {
            left: 50%;
        }

        /* Fix the circle for containers on the right side */
        .right::after {
            left: -16px;
        }

        /* Add ARROWS to the left container (pointing right to the line) */
        .left::before {
            content: " ";
            height: 0;
            position: absolute;
            top: 22px;
            width: 0;
            z-index: 1;
            right: 30px;
            /* Creates a triangle pointing right, matching the card background */
            border: medium solid var(--color-cream);
            border-width: 10px 0 10px 10px;
            border-color: transparent transparent transparent var(--color-cream);
        }
        /* Add ARROWS to the right container (pointing left to the line) */
        .right::before {
            content: " ";
            height: 0;
            position: absolute;
            top: 22px;
            width: 0;
            z-index: 1;
            left: 30px;
            /* Creates a triangle pointing left, matching the card background */
            border: medium solid var(--color-cream);
            border-width: 10px 10px 10px 0;
            border-color: transparent var(--color-cream) transparent transparent;
        }

        /* Media queries for responsiveness (makes timeline vertical on small screens) */
        @media screen and (max-width: 600px) {
            .timeline::after {
                left: 31px;
            }
            .timeline-item {
                width: 100%;
                padding-left: 70px;
                padding-right: 25px;
            }
            .timeline-item::before {
                left: 60px;
                border: medium solid var(--color-cream);
                border-width: 10px 10px 10px 0;
                border-color: transparent var(--color-cream) transparent transparent;
            }
            .left::after, .right::after {
                left: 15px;
            }
            .right {
                left: 0%;
            }
            .left::before { /* Adjust arrow position for mobile view to point left */
                right: auto;
                left: 60px;
                border-width: 10px 10px 10px 0;
                border-color: transparent var(--color-cream) transparent transparent;
            }
        }
        
    </style>
</head>
<body class="bg-white text-gray-800">

    <!-- Message Box (Instead of alert()) -->
    <div id="messageBox" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 items-center justify-center p-4" onclick="hideMessage()">
        <div class="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-95" onclick="event.stopPropagation()">
            <h3 class="text-xl font-bold text-brown mb-3" id="messageTitle"></h3>
            <p id="messageContent" class="text-gray-700 mb-4"></p>
            <button onclick="hideMessage()" class="w-full btn-primary py-2 rounded-lg transition duration-200">Close</button>
        </div>
    </div>

    <!-- Header / Navigation Bar (Light Brown Background) -->
    <header id="navbar" class="header-fixed sticky top-0 bg-brown text-white z-40 shadow-xl">
        <nav class="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <a href="#home" class="text-3xl font-extrabold tracking-wider shining-text p-1 transition duration-300">MAU Impact Hub</a>
            <div class="hidden md:flex space-x-6">
                <!-- Added nav-link for glow effect on hover/touch -->
                <a href="#about" class="nav-link hover:text-yellow-light transition duration-300 text-lg font-medium">About</a>
                <a href="#activities" class="nav-link hover:text-yellow-light transition duration-300 text-lg font-medium">Activities</a>
                <a href="#programs" class="nav-link hover:text-yellow-light transition duration-300 text-lg font-medium">Programs</a>
                <!-- News/Blog Link (Placeholder for content) -->
                <a href="#blog" class="nav-link hover:text-yellow-light transition duration-300 text-lg font-medium">News</a> 
                <!-- Contact Link (Now links to contact info in footer) -->
                <a href="#contact-info" class="nav-link hover:text-yellow-light transition duration-300 text-lg font-medium">Contact</a>
                <a href="#join-form" class="nav-link bg-yellow-light text-brown px-6 py-2 rounded-full font-bold hover:bg-white transition duration-300 shadow-md transform hover:scale-105">Apply</a>
            </div>
            <!-- Mobile Menu Button -->
            <button id="menu-button" class="md:hidden text-white focus:outline-none p-2 rounded-lg hover:bg-yellow-light hover:text-brown transition duration-200">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
        </nav>
        <!-- Mobile Menu Dropdown -->
        <div id="mobile-menu" class="hidden md:hidden bg-brown shadow-xl">
            <a href="#about" class="block px-4 py-3 text-white text-base hover:bg-gray-700 transition duration-200">About</a>
            <a href="#activities" class="block px-4 py-3 text-white text-base hover:bg-gray-700 transition duration-200">Activities</a>
            <a href="#programs" class="block px-4 py-3 text-white text-base hover:bg-gray-700 transition duration-200">Programs</a>
            <a href="#blog" class="block px-4 py-3 text-white text-base hover:bg-gray-700 transition duration-200">News</a>
            <a href="#contact-info" class="block px-4 py-3 text-white text-base hover:bg-gray-700 transition duration-200">Contact</a>
            <a href="#join-form" class="block px-4 py-3 text-base bg-yellow-light text-brown font-bold hover:bg-white transition duration-200">Apply to Join</a>
        </div>
    </header>

    <main>
        <!-- 1. Home / Landing Page (Brown/Yellow Focus) -->
        <section id="home" class="bg-brown min-h-screen flex items-center justify-center text-center relative overflow-hidden p-6">
            <!-- Subtle Texture/Pattern Background -->
            <div class="absolute inset-0 opacity-15 bg-repeat" style="background-image: url('data:image/svg+xml;utf8,<svg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'><g fill=\'#FFFFFF\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'><circle cx=\'3\' cy=\'3\' r=\'3\'/></g></svg>');"></div>
            
            <div class="relative z-10 p-6 md:p-12 max-w-5xl mx-auto">
                
                <!-- Shining Text for Title -->
                <h1 class="text-6xl md:text-8xl font-extrabold mb-4 leading-tight tracking-tighter">
                    <span class="shining-text">MAU Impact Hub</span>
                </h1>
                
                <!-- Moving Grounding Effect for Subtitle -->
                <div class="moving-grounding inline-block bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 mb-10 border border-yellow-light border-opacity-50 shadow-lg">
                    <p class="text-xl md:text-4xl text-white italic font-light">
                        <span class="text-yellow-light shadow-text">Shaping the Next Generation of Leaders</span>
                    </p>
                </div>

                <!-- Call to Action -->
                <div class="flex flex-col sm:flex-row justify-center items-center gap-6">
                    <a href="#join-form" class="btn-primary text-lg md:text-xl font-bold px-10 py-3 rounded-full shadow-2xl">
                        Start Your Leadership Journey
                    </a>
                    <a href="#programs" class="text-white text-lg font-medium hover:text-yellow-light transition duration-300 underline underline-offset-4">
                        Explore Our Programs &rarr;
                    </a>
                </div>
                
                <!-- Animated Mouse Scroll Indicator (Pure CSS/SVG) -->
                <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-75">
                    <svg class="w-8 h-12" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="22" height="38" rx="11" stroke="white" stroke-width="2"/>
                        <circle cx="12" cy="10" r="3" fill="white">
                            <animate attributeName="cy" from="10" to="28" dur="1.5s" repeatCount="indefinite"/>
                        </circle>
                    </svg>
                </div>

            </div>
        </section>

        <!-- 2. About the Club (60% White Background) -->
        <section id="about" class="py-16 md:py-24 bg-white">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-4xl font-extrabold text-center text-brown mb-16 relative">
                    About the Club & Our Journey
                    <span class="block h-1 w-20 bg-yellow-light mx-auto mt-2 rounded-full"></span>
                </h2>

                <!-- Core Pillars (Interactive Cards) -->
                <div class="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
                    <!-- Pillar 1 -->
                    <div class="interactive-card p-6 bg-cream rounded-xl shadow-lg border-t-4 border-yellow-light text-center">
                        <span class="text-brown text-5xl mb-3 block">🏛️</span>
                        <h3 class="text-xl font-bold text-brown mb-2">Diplomacy</h3>
                        <p class="text-gray-600 text-sm">Mastering negotiation and policy formulation in high-stakes simulations.</p>
                    </div>
                    <!-- Pillar 2 -->
                    <div class="interactive-card p-6 bg-cream rounded-xl shadow-lg border-t-4 border-yellow-light text-center">
                        <span class="text-brown text-5xl mb-3 block">🌟</span>
                        <h3 class="text-xl font-bold text-brown mb-2">Leadership</h3>
                        <p class="text-gray-600 text-sm">Cultivating ethical, confident, and effective leadership qualities for impact.</p>
                    </div>
                    <!-- Pillar 3 -->
                    <div class="interactive-card p-6 bg-cream rounded-xl shadow-lg border-t-4 border-yellow-light text-center">
                        <span class="text-brown text-5xl mb-3 block">🤝</span>
                        <h3 class="text-xl font-bold text-brown mb-2">Collaboration</h3>
                        <p class="text-gray-600 text-sm">Working together across schools to build strong, impactful networks.</p>
                    </div>
                </div>

                <!-- Founder’s Journey and Leadership Progression (Timeline) -->
                <h3 class="text-3xl font-bold text-brown text-center mb-8">The Leadership Progression Timeline</h3>
                
                <!-- Timeline Structure -->
                <div class="max-w-6xl mx-auto timeline">
                    
                    <div class="timeline-item left">
                        <div class="p-6 bg-cream rounded-xl shadow-md border-t-4 border-brown interactive-card">
                            <h4 class="text-xl font-semibold text-brown">Grade 10: Observation & Inspiration</h4>
                            <p class="text-sm text-gray-500 mb-2">The Seed is Planted</p>
                            <p class="text-gray-700 leading-relaxed">
                                The Model African Union was introduced at our school by our history teacher. I didn’t participate yet but observed older students in debates. 
                                Watching them planted the seed of interest in diplomacy and leadership. I joined other clubs but decided I would join MAU in the future.
                                Seeing the program inspired me to develop skills in communication and negotiation. This year marked the start of my leadership journey.
                            </p>
                        </div>
                    </div>

                    <div class="timeline-item right">
                        <div class="p-6 bg-cream rounded-xl shadow-md border-t-4 border-brown interactive-card">
                            <h4 class="text-xl font-semibold text-brown">Grade 11: Delegate & Diplomacy</h4>
                            <p class="text-sm text-gray-500 mb-2">Learning the Ropes</p>
                            <p class="text-gray-700 leading-relaxed">
                                I became a delegate representing Burkina Faso in MAU. It was my first active participation, and I discovered a passion for diplomacy. 
                                My communication and negotiation skills improved through debates. I learned to articulate ideas, collaborate, and understand global perspectives.
                                Participating solidified my interest in MAU and leadership.
                            </p>
                        </div>
                    </div>

                    <div class="timeline-item left">
                        <div class="p-6 bg-cream rounded-xl shadow-md border-t-4 border-brown interactive-card">
                            <h4 class="text-xl font-semibold text-brown">Grade 12: High School President & Recognition</h4>
                            <p class="text-sm text-gray-500 mb-2">Demonstrating Leadership</p>
                            <p class="text-gray-700 leading-relaxed">
                                I became first-term president of our MAU club and represented Gambia as a delegate. I was awarded Best Delegate and recognized as President.
                                I was invited to a special African Union program, interacting with other young leaders. My leadership, diplomacy, and mentorship skills grew.
                                Grade 12 shaped my confidence, global perspective, and ability to guide others.
                            </p>
                        </div>
                    </div>
                    
                    <div class="timeline-item right">
                        <div class="p-6 bg-cream rounded-xl shadow-md border-t-4 border-brown interactive-card">
                            <h4 class="text-xl font-semibold text-brown">University: Founding the Hub & Legacy</h4>
                            <p class="text-sm text-gray-500 mb-2">Creating Structured Impact</p>
                            <p class="text-gray-700 leading-relaxed">
                                I founded the Model African Union Impact Hub at university and became president. I lead members in debates, workshops, and simulations focused on diplomacy, leadership, and problem-solving.
                                The club emphasizes mentorship, teamwork, and ethical leadership. I guide new delegates and cultivate leadership skills.
                                The MAU Impact Hub continues my journey from observer to leader.
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Testimonial/Quote Block (Light Yellow/Brown Accent) -->
                <div class="max-w-4xl mx-auto mt-16 p-8 rounded-xl bg-yellow-light text-brown shadow-xl text-center border-b-4 border-brown">
                    <blockquote class="italic text-xl">
                        "The Hub taught me that true leadership is not about power, but about the ethical influence you have on your community."
                    </blockquote>
                    <p class="font-semibold mt-4">- Former Delegate, Class of 2024</p>
                </div>
            </div>
        </section>

        <!-- 3. Past Activities / Gallery (Soft Cream Background) -->
        <section id="activities" class="py-16 md:py-24 bg-cream">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-4xl font-extrabold text-center text-brown mb-12">Past Activities & Gallery</h2>

                <!-- Category Filtering (Simplified to one button as requested) -->
                <div class="flex justify-center flex-wrap gap-4 mb-10">
                    <button class="filter-btn bg-brown text-white px-5 py-2 rounded-full text-base font-medium transition duration-300 hover:bg-yellow-light hover:text-brown shadow-lg">High School Modern African Union</button>
                </div>

                <!-- Image Gallery (Grid Layout with Interactive Cards) -->
                <div id="gallery" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- Gallery Item 1 -->
                    <div class="interactive-card bg-white rounded-xl shadow-2xl overflow-hidden transform">
                        <img src="https://placehold.co/600x400/79430c/FFD799?text=Delegate+Training" alt="Delegate Training Session" class="w-full h-64 object-cover">
                        <div class="p-5">
                            <h4 class="text-xl font-bold text-brown mb-1">Delegate Training Session</h4>
                            <p class="text-sm text-gray-600">Intensive training on rules of procedure and mandate analysis.</p>
                            <button class="text-xs mt-3 text-yellow-light font-semibold hover:text-brown transition duration-200" onclick="showMessage('Event Detail', 'Date: Sept 2024. Focused on crisis communication skills.')">View Details &rarr;</button>
                        </div>
                    </div>
                    <!-- Gallery Item 2 -->
                    <div class="interactive-card bg-white rounded-xl shadow-2xl overflow-hidden transform">
                        <img src="https://placehold.co/600x400/a16f40/fef3c7?text=University+Summit" alt="University MAU Summit" class="w-full h-64 object-cover">
                        <div class="p-5">
                            <h4 class="text-xl font-bold text-brown mb-1">University MAU Summit</h4>
                            <p class="text-sm text-gray-600">Our annual flagship event debating continental policy reforms.</p>
                            <button class="text-xs mt-3 text-yellow-light font-semibold hover:text-brown transition duration-200" onclick="showMessage('Event Detail', 'Date: Nov 2024. Key issue: Climate Migration.')">View Details &rarr;</button>
                        </div>
                    </div>
                    <!-- Gallery Item 3 -->
                    <div class="interactive-card bg-white rounded-xl shadow-2xl overflow-hidden transform">
                        <img src="https://placehold.co/600x400/b17c50/ffffff?text=Mentorship+Circle" alt="Mentorship Circle" class="w-full h-64 object-cover">
                        <div class="p-5">
                            <h4 class="text-xl font-bold text-brown mb-1">Peer Mentorship Circle</h4>
                            <p class="text-sm text-gray-600">Grade 12 mentors guiding younger students in research methodologies.</p>
                            <button class="text-xs mt-3 text-yellow-light font-semibold hover:text-brown transition duration-200" onclick="showMessage('Event Detail', 'Date: Oct 2024. Focus: Research & Public Speaking.')">View Details &rarr;</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 4. Programs & How to Join (60% White Background) -->
        <section id="programs" class="py-16 md:py-24 bg-white">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-4xl font-extrabold text-center text-brown mb-12">Our Elite Programs</h2>

                <!-- Program Cards (Interactive and Detailed) -->
                <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
                    
                    <!-- Program Card 1 -->
                    <div class="interactive-card p-6 bg-cream rounded-xl shadow-xl border-l-8 border-brown">
                        <h3 class="text-2xl font-bold text-brown mb-2">The Diplomatic Track</h3>
                        <p class="text-sm text-yellow-light font-semibold mb-4">Core MAU Simulation</p>
                        <p class="text-gray-700 leading-relaxed">Focuses on high-fidelity Model African Union simulations, perfecting debate, resolution drafting, and cross-cultural negotiation.</p>
                        <ul class="list-disc list-inside mt-4 text-sm text-gray-600">
                            <li>Weekly Debate Sessions</li>
                            <li>Annual Inter-School Conference</li>
                            <li>Expert Speaker Series</li>
                        </ul>
                    </div>
                    
                    <!-- Program Card 2 -->
                    <div class="interactive-card p-6 bg-cream rounded-xl shadow-xl border-l-8 border-yellow-light">
                        <h3 class="text-2xl font-bold text-brown mb-2">The Impact Accelerator</h3>
                        <p class="text-sm text-brown font-semibold mb-4">Leadership & Community Action</p>
                        <p class="text-gray-700 leading-relaxed">A specialized track for implementing policy ideas from MAU into tangible, local community development projects and initiatives.</p>
                        <ul class="list-disc list-inside mt-4 text-sm text-gray-600">
                            <li>Mentorship with Alumni</li>
                            <li>Project Management Training</li>
                            <li>Social Impact Funding Access</li>
                        </ul>
                    </div>
                </div>
                
                <!-- Application Form Section (Yellow/Brown Accent) -->
                <div id="join-form" class="max-w-2xl mx-auto p-8 md:p-12 bg-yellow-light rounded-xl shadow-2xl border-b-8 border-brown">
                    <h3 class="text-3xl font-extrabold text-brown text-center mb-6">Ready to Lead? Apply Now.</h3>
                    <p class="text-center text-gray-700 mb-8">Take the first step towards ethical, impactful leadership. Join our next cohort.</p>
                    
                    <form id="application-form" class="space-y-6">
                        <!-- Full Name & Email (Existing) -->
                        <div>
                            <label for="fullName" class="block text-sm font-medium text-brown">Full Name</label>
                            <input type="text" id="fullName" name="fullName" required class="mt-1 block w-full px-4 py-2 border border-brown rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-brown">
                        </div>
                        <div>
                            <label for="email" class="block text-sm font-medium text-brown">Email Address</label>
                            <input type="email" id="email" name="email" required class="mt-1 block w-full px-4 py-2 border border-brown rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-brown">
                        </div>

                        <!-- NEW: School or University Selection -->
                        <div>
                            <label for="school" class="block text-sm font-medium text-brown">School or University</label>
                            <!-- Dropdown for Ethiopian Universities -->
                            <select id="universitySelect" name="universitySelect" class="mt-1 block w-full px-4 py-2 border border-brown rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-brown mb-2">
                                <option value="">--- Select your University/School (Optional) ---</option>
                                <option value="Addis Ababa University">Addis Ababa University</option>
                                <option value="Jimma University">Jimma University</option>
                                <option value="Bahir Dar University">Bahir Dar University</option>
                                <option value="Hawassa University">Hawassa University</option>
                                <option value="Mekelle University">Mekelle University</option>
                                <option value="Gondar University">Gondar University</option>
                                <option value="Haramaya University">Haramaya University</option>
                                <option value="Arba Minch University">Arba Minch University</option>
                                <option value="Wollega University">Wollega University</option>
                                <option value="Aksum University">Aksum University</option>
                                <option value="Adama Science and Technology University">Adama Science and Technology University</option>
                                <option value="Debre Markos University">Debre Markos University</option>
                                <option value="Debre Birhan University">Debre Birhan University</option>
                                <option value="Jijiga University">Jijiga University</option>
                                <option value="Kotebe Metropolitan University">Kotebe Metropolitan University</option>
                                <option value="Mizan-Tepi University">Mizan-Tepi University</option>
                                <option value="Samara University">Samara University</option>
                                <option value="Wolkite University">Wolkite University</option>
                                <option value="Madawalabu University">Madawalabu University</option>
                                <option value="Metu University">Metu University</option>
                                <option value="Dire Dawa University">Dire Dawa University</option>
                                <option value="Woldia University">Woldia University</option>
                                <option value="Bule Hora University">Bule Hora University</option>
                                <option value="Gambella University">Gambella University</option>
                                <option value="Injibara University">Injibara University</option>
                                <option value="Salale University">Salale University</option>
                                <option value="Unity University (Private)">Unity University (Private)</option>
                                <option value="St. Mary's University (Private)">St. Mary's University (Private)</option>
                                <option value="Adigrat University">Adigrat University</option>
                                <option value="Ambo University">Ambo University</option>
                                <option value="Dilla University">Dilla University</option>
                                <option value="Assosa University">Assosa University</option>
                                <option value="Oda Bultum University">Oda Bultum University</option>
                                <option value="Rift Valley University (Private)">Rift Valley University (Private)</option>
                                <option value="Ethiopian Civil Service University">Ethiopian Civil Service University</option>
                                <option value="Bonga University">Bonga University</option>
                                <option value="Dabat University">Dabat University</option>
                                <option value="Gode University">Gode University</option>
                                <option value="Selale University">Selale University</option>
                                <option value="Sheger University">Sheger University</option>
                                <option value="Adama University">Adama University</option>
                                <option value="Assela University">Assela University</option>
                            </select>

                            <p class="text-xs text-gray-500 italic mb-1">If your school is not listed, please type it below:</p>
                            <!-- Text Input for manual entry -->
                            <input type="text" id="schoolManual" name="schoolManual" placeholder="Type your high school or university name here" class="mt-1 block w-full px-4 py-2 border border-brown rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-brown">
                        </div>

                        <!-- Motivation Summary (Max 500 words) -->
                        <div>
                            <label for="motivation" class="block text-sm font-medium text-brown">Motivation Summary (Max ~500 words)</label>
                            <textarea id="motivation" name="motivation" rows="8" required class="mt-1 block w-full px-4 py-2 border border-brown rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-brown"></textarea>
                        </div>

                        <!-- NEW: CV/Resume Text Area -->
                        <div>
                            <label for="cvResume" class="block text-sm font-medium text-brown">Write/Paste CV or Resume</label>
                            <textarea id="cvResume" name="cvResume" rows="10" placeholder="Please write or paste your current CV/Resume here (Max 1500 words)" class="mt-1 block w-full px-4 py-2 border border-brown rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-brown"></textarea>
                        </div>
                        
                        <button type="submit" class="w-full btn-primary text-lg font-bold py-3 rounded-xl transform hover:shadow-lg">
                            Submit Application
                        </button>
                    </form>
                </div>

            </div>
        </section>

    </main>

    <!-- Footer (Light Brown Background) -->
    <footer id="contact-info" class="bg-brown text-white py-10">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h4 class="text-3xl font-extrabold shining-text mb-2">MAU Impact Hub</h4>
            <p class="text-base text-yellow-light mb-6">Ethical Leaders, Global Impact.</p>
            
            <!-- Contact Details -->
            <div class="mb-6">
                <p class="text-xl font-bold mb-2">Get in Touch</p>
                <!-- Phone Numbers -->
                <p class="text-lg">
                    <a href="tel:+251900123456" class="hover:text-yellow-light transition duration-200">+251 900 123 456</a> | 
                    <a href="tel:+251900654321" class="hover:text-yellow-light transition duration-200">+251 900 654 321</a>
                </p>
                <!-- Email Placeholder -->
                <p class="text-lg mt-1">
                    <a href="mailto:contact@mauimpacthub.et" class="hover:text-yellow-light transition duration-200">Email: contact@mauimpacthub.et (Placeholder)</a>
                </p>
            </div>
            
            <!-- Footer Navigation -->
            <div class="flex justify-center space-x-8 mb-6">
                <a href="#about" class="hover:text-yellow-light transition duration-200">About</a>
                <a href="#programs" class="hover:text-yellow-light transition duration-200">Programs</a>
                <a href="#blog" class="hover:text-yellow-light transition duration-200">News</a>
                <a href="#contact-info" class="hover:text-yellow-light transition duration-200">Contact</a>
            </div>
            
            <!-- Social Icons (Interactive) -->
            <div class="flex justify-center space-x-4 mb-4">
                <a href="#" class="text-yellow-light hover:text-white transition duration-200 transform hover:scale-110" aria-label="Instagram">
                    <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.074 1.27.063 1.885.253 2.322.427.48.196.874.456 1.222.804.347.348.607.742.803 1.222.174.437.364 1.053.427 2.322.062 1.267.073 1.647.073 4.85s-.011 3.584-.073 4.85c-.063 1.27-.253 1.885-.427 2.322-.196.48-.456.874-.804 1.222-.348.347-.742.607-1.222.803-.437.174-1.053.364-2.322.427-1.267.062-1.647.073-4.85.073s-3.584-.011-4.85-.073c-1.27-.063-1.885-.253-2.322-.427-.48-.196-.874-.456-1.222-.804-.347-.348-.607-.742-.803-1.222-.174-.437-.364-1.053-.427-2.322-.062-1.267-.073-1.647-.073-4.85s.011-3.584.073-4.85c.063-1.27.253-1.885.427-2.322.196-.48.456-.874.804-1.222.348-.347.742-.607 1.222-.803.437-.174 1.053-.364 2.322-.427 1.267-.062 1.647-.073 4.85-.073zm0 2.946c-2.457 0-4.163 1.706-4.163 4.163s1.706 4.163 4.163 4.163 4.163-1.706 4.163-4.163-1.706-4.163-4.163-4.163zm7.142-.254c0 .647-.525 1.171-1.172 1.171s-1.171-.524-1.171-1.171c0-.647.525-1.171 1.171-1.171s1.172.524 1.172 1.171z"/></svg>
                </a>
                <a href="#" class="text-yellow-light hover:text-white transition duration-200 transform hover:scale-110" aria-label="LinkedIn">
                    <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.13-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.339 7 3.548v5.687z"/></svg>
                </a>
            </div>

            <p class="text-sm text-gray-400 mt-6">&copy; 2024 MAU Impact Hub. All rights reserved.</p>
        </div>
    </footer>

    <script>
        // --- 1. Message Box Functions (Standard for all apps) ---
        const messageBox = document.getElementById('messageBox');
        const messageTitle = document.getElementById('messageTitle');
        const messageContent = document.getElementById('messageContent');

        function showMessage(title, content) {
            messageTitle.textContent = title;
            messageContent.textContent = content;
            messageBox.classList.remove('hidden');
            messageBox.classList.add('flex');
        }

        function hideMessage() {
            messageBox.classList.add('hidden');
            messageBox.classList.remove('flex');
        }

        // --- 2. Navigation / Smooth Scroll ---
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.getElementById('navbar').offsetHeight;
                    const offsetTop = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Hide mobile menu after selection
                    if (window.innerWidth < 768) {
                        document.getElementById('mobile-menu').classList.add('hidden');
                    }
                }
            });
        });

        // --- 3. Mobile Menu Toggle ---
        document.getElementById('menu-button').addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });

        // --- 4. Form Submission Handlers (Interactive Feedback) ---

        // Application Form
        document.getElementById('application-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const fullName = document.getElementById('fullName').value;
            
            showMessage(
                "Application Submitted!",
                `Thank you, ${fullName}! Your application has been submitted successfully, including your School/University, Motivation Summary, and CV/Resume text. We will review your materials and be in touch soon.`
            );
            
            this.reset();
        });

        // --- 5. Observer for Glow Effect on Touch Devices (optional enhancement) ---
        
        // This makes sure the glow effect works reliably on touch screens where :hover is tricky
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('touchstart', () => {
                link.classList.add('nav-link-touch-active');
            });
            link.addEventListener('touchend', () => {
                // Wait briefly before removing the class to show the effect
                setTimeout(() => {
                    link.classList.remove('nav-link-touch-active');
                }, 300);
            });
        });

    </script>

</body>
</html>
    






