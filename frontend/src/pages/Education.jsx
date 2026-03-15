import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Education = () => {
    return (
        <div className="bg-background-light font-display text-slate-900 min-h-screen">
            <Navbar />
            <div className="layout-container flex h-full grow flex-col">

                {/* Main Content */}
                <main className="max-w-[1400px] mx-auto w-full px-6 py-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 px-4">
                        <div className="max-w-xl">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-bubblegum/20 text-deep-pink text-xs font-black uppercase tracking-widest mb-4">Teen Education Hub</span>
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6">Learn your rhythm. <span className="text-bubblegum">Live your flow.</span></h1>
                            <p className="text-lg text-slate-600 font-medium leading-relaxed">No taboos, just the real talk you need about your body and health.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="size-16 rounded-full border-4 border-bubblegum p-1 bg-white">
                                <img alt="Profile" className="rounded-full bg-soft-pink" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy4N83RSnVWU0Ot2tkUZs4XbTw2EQWN2jH7RzdxF5uVQRQirwFfZYbQyHaV3lNG9q4pIj4aUJ7C8epqdUUGGkq4CrLzfMQzwPjrBIMeyx_d40UFH4R4ieDKEl5VAZqCJ-rRGfu0d_Mybn69jDXTEwYwcNS1fiVC0oixAFcGo-TXr1oK7XMl_wRAXEzBrBaTH_V1nY37n2NsfeWbt9EAzfwubV3TNBGySopCmROdyQiWlGNGy96-H0-qxeLtMaFHoTs8TT_ssDsFJQ" />
                            </div>
                            <div className="size-16 rounded-full border-4 border-slate-200 p-1 bg-white">
                                <img alt="Profile" className="rounded-full bg-slate-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_KL7B_1x3kH1sQHJK0TWGELsms8O_Wb9GpAwwXmrRAWiNSxY7b-qv--RLxEVku8V5iJsJFNdvX3RqwjgClFWnggWqeHDqyIk98SZKJwQI6vOyKfdQc4UDQKaaQDefxacVu2YO3352v3bt8_fW4gPHWRIQIi5326IshRMAzLdxFDcUbLLSZBaZo7UyYGZP09xA6m7pLrPiPKkI5ldQLvEceyL19Gz1_aD3U7zzVtllXo58vrgxqKXPHE2nZVDrKARqym4ZMdhMV1k" />
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="flex items-center justify-between mb-8 px-2">
                            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-deep-pink">bolt</span>
                                Trending Stories
                            </h3>
                            <div className="flex gap-2">
                                <button className="size-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-400 hover:text-deep-pink transition-colors">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button className="size-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-400 hover:text-deep-pink transition-colors">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-8">
                            <div className="min-w-[320px] md:min-w-[380px] h-[580px] relative rounded-3xl overflow-hidden shadow-2xl snap-start group cursor-pointer transition-all hover:-translate-y-2">
                                <img alt="Cycle Basics" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHudZgGPfsfi3nqoVcHWFUZyUf8VLD1MXlGFSqVh_uLa6cp6pAfHHYJkuSk5kZigNrJLJcysDgk5HRN0EwG-eW3kiGAt-d6Vz_IwkVOKI2Hbd13nQ6x-dfQHu_szmOQ-ojp3_HXd0HVcH6kM4ightpwzXrWARFfd0iX4KZt4EHnMr838NgWQXvI4Amf67S6IHWlid9ltG8ItUuqbxARiLZJzX7c6PIBrjGiqWLMolORsv9puPNCB5zbRtp4h5wZxyPacuWuyhgfVI" />
                                <div className="absolute inset-0 story-gradient"></div>
                                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-bubblegum text-white text-[10px] font-black uppercase tracking-tighter shadow-lg">Basics</span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <h4 className="text-3xl font-black text-white mb-3 leading-tight uppercase italic tracking-tighter">Cycle <br />Regularity</h4>
                                    <p className="text-white/90 text-sm font-medium mb-6 line-clamp-2">Is a 28-day cycle a myth? Let's break down what's actually "normal" for you.</p>
                                    <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-bubblegum hover:text-white transition-all shadow-xl">
                                        Watch Lesson
                                    </button>
                                </div>
                            </div>

                            <div className="min-w-[320px] md:min-w-[380px] h-[580px] relative rounded-3xl overflow-hidden shadow-2xl snap-start group cursor-pointer transition-all hover:-translate-y-2 border-4 border-bubblegum">
                                <img alt="Risk Insight" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXfjLT8moY6b3KHOpfJADUV6vpzdXeZYtudHNHS8_WnQqZM4KRaEStVIeQjVJQFUB9uVQiGsJSEAXSfgUEUtt5ZWjizAXBCCUgGrFwlKUgxsh6aruZj5fRa8alU8268rEHf9uR5p8D_lsWja_Mh_SUg6iFtjd28IZXLBqQXoUVcS2HXPN1cVBFCpnBhtz9ixBOZEPkqB7ymOAnJNmDxEa2b2DJrxe2SrQiFXlGVao9R6RP3IIaRUcloRVftqk2QgDmXlkTx0BdpOY" />
                                <div className="absolute inset-0 story-gradient"></div>
                                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-white text-deep-pink text-[10px] font-black uppercase tracking-tighter shadow-lg">Important</span>
                                    <span className="px-3 py-1 rounded-full bg-bubblegum text-white text-[10px] font-black uppercase tracking-tighter shadow-lg">Risk Insight</span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <h4 className="text-3xl font-black text-white mb-3 leading-tight uppercase italic tracking-tighter">When to <br />Speak Up</h4>
                                    <p className="text-white/90 text-sm font-medium mb-6 line-clamp-2">Spotting the signals that mean it's time to chat with a professional.</p>
                                    <button className="w-full py-4 bg-deep-pink text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-bubblegum transition-all shadow-xl">
                                        Watch Story
                                    </button>
                                </div>
                            </div>

                            <div className="min-w-[320px] md:min-w-[380px] h-[580px] relative rounded-3xl overflow-hidden shadow-2xl snap-start group cursor-pointer transition-all hover:-translate-y-2">
                                <img alt="Lifestyle" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAM3QCLt7WfMH0H-LzEhVFvC0IXraeQO0z7XhVnfsF8iGLJIplqOg1XV_pwM31TkDG7RwRVZL2PvJr-3gF4a-CamnPrxIQzXDF3NYm8nNKzYgLHx0ZGnEtE0SJ-ri1-eB-bWrdyR_ke3DFxcI5SHQC7y4ZDV7jxskh-8lXCWi8jMU3hk4ZGyiCBGAYI9YrwfwcvoM2V5si7EmAFPxE1dkLj-mIOj1Ox1M5dR8xXpw0Ik5oiHHevjpfK4ZC1JPEvlV6_Sbjm1cVwMY" />
                                <div className="absolute inset-0 story-gradient"></div>
                                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-bubblegum text-white text-[10px] font-black uppercase tracking-tighter shadow-lg">Wellness</span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <h4 className="text-3xl font-black text-white mb-3 leading-tight uppercase italic tracking-tighter">Lifestyle <br />Vibes</h4>
                                    <p className="text-white/90 text-sm font-medium mb-6 line-clamp-2">How stress, sleep, and food change your period game. Level up your health.</p>
                                    <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-bubblegum hover:text-white transition-all shadow-xl">
                                        Explore More
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 bg-white rounded-3xl p-8 border-2 border-soft-pink flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex flex-col gap-2">
                            <h5 className="text-lg font-black text-slate-900">Accessibility First</h5>
                            <p className="text-sm text-slate-500 font-medium">Customize your reading experience for maximum comfort.</p>
                        </div>
                        <div className="flex flex-wrap gap-4 items-center">
                            <label className="inline-flex items-center cursor-pointer group px-4 py-2 rounded-2xl bg-slate-50 hover:bg-soft-pink transition-colors">
                                <input defaultChecked className="sr-only peer" type="checkbox" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bubblegum relative"></div>
                                <span className="ms-3 text-sm font-bold text-slate-700">High Contrast</span>
                            </label>
                            <button className="text-slate-400 hover:text-deep-pink font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
                                Skip Intro <span className="material-symbols-outlined text-sm">fast_forward</span>
                            </button>
                            <button className="bg-bubblegum text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-bubblegum/20 hover:scale-105 transition-all">
                                Finish Onboarding
                            </button>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Education;
