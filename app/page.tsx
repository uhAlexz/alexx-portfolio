"use client";
import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ArrowDown, Copy } from 'lucide-react';

export default function Home() {
  const navbarRef = useRef<HTMLElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null); // For GSAP Context

  useEffect(() => {
    // 1. Lenis Setup
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // @ts-expect-error Lenis types mismatch in some versions
      smooth: true, 
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. GSAP Context (Fixes the navigation bug)
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Navbar Trigger
      ScrollTrigger.create({
        trigger: ".content-layer",
        start: "top 90%",
        onEnter: () => navbarRef.current?.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0'),
        onLeaveBack: () => navbarRef.current?.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0')
      });

      // Arrow Fade
      ScrollTrigger.create({
        trigger: ".content-layer",
        start: "top 100%",
        onEnter: () => gsap.to(arrowRef.current, { opacity: 0, duration: 0.3 }),
        onLeaveBack: () => gsap.to(arrowRef.current, { opacity: 0.7, duration: 0.3 })
      });

      // Scroll Animations
      // Cast to HTMLElement[] to fix lint error
      const elements = gsap.utils.toArray('.anim-scroll') as HTMLElement[];
      elements.forEach((element) => {
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          y: 30, opacity: 0, duration: 0.6, ease: "power3.out"
        });
      });
    }, wrapperRef); // Scope to wrapper

    // Cleanup
    return () => {
      lenis.destroy();
      ctx.revert(); // This kills all ScrollTriggers and animations created in this context
    };
  }, []);

  const copyDiscord = () => {
    navigator.clipboard.writeText("uhalexz_");
    alert("Discord ID copied!");
  };

  return (
    <main className="text-white" ref={wrapperRef}>
      {/* Header */}
      <header 
        ref={navbarRef}
        className="fixed top-6 left-1/2 -translate-x-1/2 -translate-y-5 opacity-0 pointer-events-none z-[999] flex gap-10 items-center px-8 py-3 rounded-full bg-black/85 backdrop-blur-md border border-white/10 transition-all duration-300 w-[calc(100%-40px)] md:w-auto justify-between md:justify-start"
      >
        <div className="flex items-center gap-3">
          <Image src="/assets/PFP.png" alt="Profile" width={32} height={32} className="rounded-full" />
          <span className="font-bold text-sm hidden md:block">Alexx</span>
        </div>
        <nav>
          <ul className="flex gap-6 md:gap-8 text-sm font-medium text-[#A0A0A0]">
            <li><a href="#work" className="hover:text-white transition-colors">Work</a></li>
            <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Video */}
      <div className="hero-wrapper">
        <video className="w-full h-full object-cover object-center" autoPlay loop muted playsInline>
          <source src="/assets/portfoliovid.mp4" type="video/mp4" />
        </video>
        <div ref={arrowRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-black/70 animate-bounce">
          <ArrowDown size={32} strokeWidth={2.5} />
        </div>
      </div>

      {/* Content Layer */}
      <div className="content-layer">
        
        {/* About Section */}
        <section className="relative w-full min-h-[80vh] flex items-center justify-center text-center px-5 pt-32 pb-20 overflow-hidden">
          {/* Collage BG */}
          <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] grid grid-cols-2 md:grid-cols-4 gap-5 opacity-25 blur-sm grayscale-[40%] -rotate-[5deg] z-[1] pointer-events-none">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="w-full h-[200px] md:h-[300px] rounded-xl overflow-hidden bg-[#222]">
                <Image 
                   src={`/assets/${i % 2 === 0 ? 'FiveGuys.png' : 'McDonalds.png'}`} 
                   alt="collage" width={500} height={500} className="w-full h-full object-cover opacity-80" 
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,8,8,0.4)_0%,rgba(8,8,8,1)_80%)] z-[2]" />
          
          <div className="relative z-[3] max-w-3xl flex flex-col items-center gap-6 anim-scroll">
            <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300 backdrop-blur-md">
              <span className="text-white tracking-widest text-xs">★★★★★</span>
              <span>5+ Satisfied Customers</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent leading-[1.1]">
              Hobbiest Designer:<br/>Making with Love
            </h1>
            <p className="text-lg text-[#A0A0A0] max-w-xl leading-relaxed">
              Hey! I&apos;m Alexx, a UI designer who is ready to LEVEL UP your Roblox game&apos;s aesthetics.
            </p>
            <Link href="/commission" className="mt-4 bg-white text-black px-8 py-4 rounded-full font-bold text-base hover:scale-105 transition-transform">
              Commission Me
            </Link>
          </div>
        </section>

        <div className="max-w-[1300px] mx-auto px-6 md:px-10">
          
          <div className="text-2xl font-semibold mb-8 mt-10" id="work">Selected Works</div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 mb-20">
            {/* Card 1 */}
            <div className="group relative bg-[#141414] border border-white/10 rounded-3xl overflow-hidden aspect-video md:col-span-7 md:aspect-[16/10] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 anim-scroll">
              <Image src="/assets/FiveGuys.png" alt="Five Guys" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-transparent flex flex-col justify-end p-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-5 md:group-hover:translate-y-0 transition-all duration-300">
                <span className="text-blue-500 text-xs font-bold uppercase tracking-wider mb-1">Food Menu</span>
                <h3 className="text-2xl font-semibold">Five Guys</h3>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-[#141414] border border-white/10 rounded-3xl overflow-hidden aspect-video md:col-span-5 md:aspect-[1/0.89] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 anim-scroll">
              <Image src="/assets/BopIT.png" alt="PS99" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-transparent flex flex-col justify-end p-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-5 md:group-hover:translate-y-0 transition-all duration-300">
                <span className="text-blue-500 text-xs font-bold uppercase tracking-wider mb-1">For Fun</span>
                <h3 className="text-2xl font-semibold">PS99 Updates</h3>
              </div>
            </div>

             {/* Card 3 */}
             <div className="group relative bg-[#141414] border border-white/10 rounded-3xl overflow-hidden aspect-video md:col-span-5 md:aspect-[1/0.89] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 anim-scroll">
              <Image src="/assets/McDonalds.png" alt="McDonalds" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-transparent flex flex-col justify-end p-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-5 md:group-hover:translate-y-0 transition-all duration-300">
                <span className="text-blue-500 text-xs font-bold uppercase tracking-wider mb-1">Game Shop</span>
                <h3 className="text-2xl font-semibold">McDonald&apos;s</h3>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative bg-[#141414] border border-white/10 rounded-3xl overflow-hidden aspect-video md:col-span-7 md:aspect-[16/10] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 anim-scroll">
              <Image src="/assets/TacoBell.png" alt="Taco Bell" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-transparent flex flex-col justify-end p-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-5 md:group-hover:translate-y-0 transition-all duration-300">
                <span className="text-blue-500 text-xs font-bold uppercase tracking-wider mb-1">Information</span>
                <h3 className="text-2xl font-semibold">Taco Bell</h3>
              </div>
            </div>
          </div>

          <div className="text-2xl font-semibold mb-8" id="pricing">Services & Pricing</div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {/* Standard */}
            <div className="bg-[#141414] border border-white/10 rounded-3xl p-8 flex flex-col h-full anim-scroll hover:border-white/20 transition-colors">
              <div className="bg-white/10 text-xs font-bold px-3 py-1.5 rounded-full w-fit mb-4">Standard Creation</div>
              <div className="text-5xl font-bold mb-4">2,500<span className="text-base font-normal text-gray-500 ml-2">/ frame</span></div>
              <p className="text-gray-400 mb-6">For simple, static interface needs.</p>
              <div className="flex flex-col gap-4 mt-auto">
                <div className="flex items-center gap-3 text-sm text-gray-300"><Check className="text-blue-500 w-5 h-5"/> Image Assets Included</div>
                <div className="flex items-center gap-3 text-sm text-gray-300"><Check className="text-blue-500 w-5 h-5"/> .fig (Figma) File Included</div>
                <div className="flex items-center gap-3 text-sm text-gray-300"><Check className="text-blue-500 w-5 h-5"/> High Quality Design</div>
              </div>
            </div>

            {/* Premium */}
            <div className="relative bg-gradient-to-br from-[#181818] to-[#101010] border border-blue-500/30 rounded-3xl p-8 flex flex-col h-full shadow-[0_0_30px_rgba(59,130,246,0.05)] anim-scroll">
              <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full w-fit mb-4">Premium Creation</div>
              <div className="text-5xl font-bold mb-4">5,000<span className="text-base font-normal text-gray-500 ml-2">/ frame</span></div>
              <p className="text-gray-400 mb-6">Full implementation and motion.</p>
              <div className="flex flex-col gap-4 mt-auto">
                <div className="flex items-center gap-3 text-sm text-gray-300"><Check className="text-blue-500 w-5 h-5"/> Image Assets Included</div>
                <div className="flex items-center gap-3 text-sm text-gray-300"><Check className="text-blue-500 w-5 h-5"/> .fig (Figma) File Included</div>
                <div className="flex items-center gap-3 text-sm text-gray-300"><Check className="text-blue-500 w-5 h-5"/> <strong className="text-white">.rbxl File Included</strong></div>
                <div className="flex items-center gap-3 text-sm text-gray-300"><Check className="text-blue-500 w-5 h-5"/> Imported to Studio for you</div>
                <div className="flex items-center gap-3 text-sm text-gray-300"><Check className="text-blue-500 w-5 h-5"/> <strong className="text-white">Basic Animations</strong></div>
              </div>
            </div>
          </div>

          <div className="text-2xl font-semibold mb-8" id="faq">Frequently Asked Questions</div>

          {/* FAQ Accordion */}
          <div className="flex flex-col gap-4 max-w-4xl anim-scroll">
             <details className="group bg-[#141414] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all open:border-blue-500 open:bg-[#111]">
                <summary className="flex justify-between items-center p-6 cursor-pointer font-semibold text-lg list-none">
                  What is your Terms of Service?
                  <span className="text-2xl font-light text-gray-500 group-open:rotate-45 transition-transform duration-300">+</span>
                </summary>
                <div className="accordion-content">
                  <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">
                    <p className="mb-4">By commissioning me (uhalexz_) for UI design, you agree to the following terms:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Payments are <strong className="text-white">non-refundable</strong> once payment is received.</li>
                      <li>Changes requested after completion will have additional fees.</li>
                      <li>I reserve the right to refuse service at any time.</li>
                      <li>You are responsible for providing <strong className="text-white">accurate references</strong>.</li>
                      <li>Final product is owned by you, but I may use it in my portfolio.</li>
                      <li><strong className="text-white">Reselling is prohibited</strong> unless permitted.</li>
                      <li>Work begins <strong className="text-white">only after upfront payment</strong>.</li>
                      <li>Complexities may incur additional charges.</li>
                    </ol>
                  </div>
                </div>
             </details>

             <details className="group bg-[#141414] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all open:border-blue-500 open:bg-[#111]">
                <summary className="flex justify-between items-center p-6 cursor-pointer font-semibold text-lg list-none">
                  What is your Current Schedule?
                  <span className="text-2xl font-light text-gray-500 group-open:rotate-45 transition-transform duration-300">+</span>
                </summary>
                <div className="accordion-content">
                  <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">
                    My schedule varies. Typically, I aim to complete standard commissions within <strong className="text-white">3-5 days</strong> and premium commissions within <strong className="text-white">1 week</strong>.
                  </div>
                </div>
             </details>

             <details className="group bg-[#141414] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all open:border-blue-500 open:bg-[#111]">
                <summary className="flex justify-between items-center p-6 cursor-pointer font-semibold text-lg list-none">
                  What is the Process?
                  <span className="text-2xl font-light text-gray-500 group-open:rotate-45 transition-transform duration-300">+</span>
                </summary>
                <div className="accordion-content">
                  <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong className="text-white">Palette:</strong> Provide a coolors.co link.</li>
                      <li><strong className="text-white">Requirements:</strong> Detailed explanation of features.</li>
                      <li><strong className="text-white">New Only:</strong> I do not fix existing UI.</li>
                    </ul>
                  </div>
                </div>
             </details>

             <details className="group bg-[#141414] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all open:border-blue-500 open:bg-[#111]">
                <summary className="flex justify-between items-center p-6 cursor-pointer font-semibold text-lg list-none">
                  Payment Methods?
                  <span className="text-2xl font-light text-gray-500 group-open:rotate-45 transition-transform duration-300">+</span>
                </summary>
                <div className="accordion-content">
                  <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">
                    I currently accept <strong className="text-white">Robux</strong>. PayPal is coming soon.
                  </div>
                </div>
             </details>
          </div>

          {/* Contact */}
          <section className="text-center py-32 anim-scroll" id="contact">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Let&apos;s design something.</h2>
            <button 
              onClick={copyDiscord}
              className="bg-[#5865F2] text-white px-10 py-4 rounded-full inline-flex items-center gap-3 font-semibold text-lg hover:-translate-y-1 hover:shadow-lg hover:shadow-[#5865F2]/40 transition-all"
            >
              <Copy size={20} />
              uhalexz_
            </button>
          </section>

        </div>
      </div>
    </main>
  );
}