"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Send,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  FileText,
  UserCheck,
  ShieldCheck,
  Printer,
  RotateCcw,
  Beaker,
  AlertCircle,
} from "lucide-react";

interface StepConfig {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
}

const STEPS: StepConfig[] = [
  {
    id: 1,
    title: "First Outreach",
    subtitle: "Confidential Initial Executive Approach",
    badge: "Step 1",
  },
  {
    id: 2,
    title: "Opportunity Overview",
    subtitle: "6-Part Mandate & Compensation Breakdown",
    badge: "Step 2",
  },
  {
    id: 3,
    title: "CV Request",
    subtitle: "Reply-Aware CV & Stakeholder Expectation",
    badge: "Step 3",
  },
  {
    id: 4,
    title: "Executive CV Review",
    subtitle: "Candid 7–9 Point Diagnostic Assessment",
    badge: "Step 4",
  },
  {
    id: 5,
    title: "Profile Submission",
    subtitle: "Formal Stakeholder Presentation Confirmation",
    badge: "Step 5",
  },
  {
    id: 6,
    title: "Document Verification",
    subtitle: "Progression & 4-Document Onboarding Request",
    badge: "Step 6",
  },
];

export default function ApexExecSuite() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [recruiterDetails, setRecruiterDetails] = useState<string>(
    "John Mercy\nIndependent Executive Recruiter"
  );
  const [candidateProfile, setCandidateProfile] = useState<string>("");
  const [opportunityDetails, setOpportunityDetails] = useState<string>("");
  const [candidateReply, setCandidateReply] = useState<string>("");
  const [targetCompany, setTargetCompany] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [reportingStructure, setReportingStructure] = useState<string>("");
  const [additionalDetails, setAdditionalDetails] = useState<string>("");

  const [generatedSubject, setGeneratedSubject] = useState<string>("");
  const [generatedBody, setGeneratedBody] = useState<string>("");
  const [modelUsed, setModelUsed] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string>("");

  // Load saved workspace on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("apex_clean_workspace_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.recruiterDetails) setRecruiterDetails(parsed.recruiterDetails);
        if (parsed.candidateProfile) setCandidateProfile(parsed.candidateProfile);
        if (parsed.opportunityDetails) setOpportunityDetails(parsed.opportunityDetails);
        if (parsed.targetCompany) setTargetCompany(parsed.targetCompany);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.reportingStructure) setReportingStructure(parsed.reportingStructure);
      }
    } catch {}
  }, []);

  // Save workspace automatically
  useEffect(() => {
    try {
      localStorage.setItem(
        "apex_clean_workspace_v2",
        JSON.stringify({
          recruiterDetails,
          candidateProfile,
          opportunityDetails,
          targetCompany,
          location,
          reportingStructure,
        })
      );
    } catch {}
  }, [
    recruiterDetails,
    candidateProfile,
    opportunityDetails,
    targetCompany,
    location,
    reportingStructure,
  ]);

  const loadMarcusVanceDemo = () => {
    setCandidateProfile(
      `Name: Marcus Vance\nCurrent Title: Global Supply Chain Director\nCompany: Danfoss Climate Solutions\nLocation: Frankfurt, Germany\nSummary: 16 years of international supply chain, procurement, and industrial manufacturing operations experience across Europe and North America. Progressed from plant logistics engineer at Schneider Electric into regional supply chain manager, then global sourcing director at Danfoss. Manages a €140M annual procurement budget and a cross-functional team of 42 across 4 manufacturing hubs. B.Sc. in Industrial Engineering and MBA from INSEAD. Known for driving supply chain resilience, automation, and supplier network optimization.`
    );
    setTargetCompany("Schneider Electric");
    setLocation("Munich, Germany (Global Headquarters / Hybrid)");
    setReportingStructure("Reporting to Chief Global Operations Officer");
    setOpportunityDetails(
      `Mandate: Vice President, Global Supply Chain & Operations\nTarget Company: Schneider Electric\nLocation: Munich, Germany (Global Headquarters)\nScope: Lead the global supply chain, procurement, manufacturing operations, and logistics strategy across 14 international markets. Direct P&L and operational transformation to scale enterprise throughput and sustainability.`
    );
    if (activeStep === 2) {
      setCandidateReply(
        "Hello John, thank you for reaching out. I am generally happy with my trajectory here at Danfoss, but a Munich-based global VP mandate sounds genuinely compelling. I'm open to seeing a concise overview."
      );
    } else if (activeStep === 3) {
      setCandidateReply(
        "Thank you for the detailed breakdown, John. The VP scope at Schneider Electric and the €700K–€1.3M+ package align well with what I would consider for a move. My notice period is 3 months."
      );
    } else if (activeStep === 6) {
      setAdditionalDetails(
        "Client stakeholders confirmed Marcus Vance has been selected for the Final Panel Interview with the Chief Global Operations Officer and Group CHRO next Tuesday."
      );
    }
    setErrorMsg("");
  };

  const handleGenerate = async () => {
    if (!candidateProfile.trim()) {
      setErrorMsg("Please enter a Candidate Profile (or click 'Load Marcus Vance Test Data' at the top).");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: activeStep,
          inputs: {
            recruiterDetails,
            candidateProfile,
            opportunityDetails,
            candidateReply,
            targetCompany,
            location,
            reportingStructure,
            additionalDetails,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setErrorMsg(data.error || `Error ${response.status}: Failed to generate.`);
      } else {
        setGeneratedSubject(data.subject || "");
        setGeneratedBody(data.body || "");
        setModelUsed(data.modelUsed || "Gemini Flash");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceStep = () => {
    if (activeStep < 6) {
      const next = activeStep + 1;
      setActiveStep(next);
      setErrorMsg("");
      if (next === 2 && !candidateReply.trim()) {
        setCandidateReply(
          "Thank you for reaching out. I would be open to reviewing a concise overview of the mandate and executive scope."
        );
      } else if (next === 3 && !candidateReply.trim()) {
        setCandidateReply(
          "The scope and indicative compensation align well with my expectations. My notice period is 3 months."
        );
      }
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(""), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-[#0d1322]/90 backdrop-blur sticky top-0 z-30 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base tracking-tight text-white">
                  ApexExec Suite
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Native Gemini Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                6-Stage Executive Search & Candidate Dossier Workflow
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadMarcusVanceDemo}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 transition"
            >
              <Beaker className="w-3.5 h-3.5" />
              Load Marcus Vance Test Data
            </button>
            <button
              onClick={() => {
                setCandidateProfile("");
                setOpportunityDetails("");
                setCandidateReply("");
                setGeneratedSubject("");
                setGeneratedBody("");
                setErrorMsg("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Fields
            </button>
          </div>
        </div>
      </header>

      {/* 6-Step Navigation Bar */}
      <div className="border-b border-slate-800/80 bg-[#0b101d] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {STEPS.map((s) => {
              const isActive = s.id === activeStep;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveStep(s.id);
                    setErrorMsg("");
                  }}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-left transition border ${
                    isActive
                      ? "bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-sm"
                      : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      isActive
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {s.id}
                  </span>
                  <div>
                    <div className="text-xs font-semibold leading-tight">
                      {s.title}
                    </div>
                    <div className="text-[10px] opacity-75 leading-tight mt-0.5">
                      {s.subtitle.slice(0, 28)}...
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Two-Column Workspace */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Column: Inputs */}
        <section className="lg:col-span-5 space-y-4 no-print">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                  {STEPS[activeStep - 1].badge} Configuration
                </span>
                <h2 className="text-base font-bold text-white mt-0.5">
                  {STEPS[activeStep - 1].title}
                </h2>
              </div>
              <UserCheck className="w-5 h-5 text-slate-400" />
            </div>

            {/* Recruiter Identity */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Recruiter Identity (Line 1: Name, Line 2: Title)
              </label>
              <textarea
                rows={2}
                value={recruiterDetails}
                onChange={(e) => setRecruiterDetails(e.target.value)}
                placeholder="John Mercy&#10;Independent Executive Recruiter"
                className="w-full rounded-lg bg-[#0b101d] border border-slate-700/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Candidate Profile */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Candidate Profile / CV Text *
              </label>
              <textarea
                rows={5}
                value={candidateProfile}
                onChange={(e) => setCandidateProfile(e.target.value)}
                placeholder="Paste the candidate's LinkedIn summary, career history, or CV text here..."
                className="w-full rounded-lg bg-[#0b101d] border border-slate-700/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Conditional Step Fields */}
            {(activeStep === 2 || activeStep === 3 || activeStep === 5 || activeStep === 6) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Target Company Name
                  </label>
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="e.g., Schneider Electric"
                    className="w-full rounded-lg bg-[#0b101d] border border-slate-700/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Location & Work Mode
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Munich, Germany (Hybrid)"
                    className="w-full rounded-lg bg-[#0b101d] border border-slate-700/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {(activeStep === 2 || activeStep === 3) && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Reporting Structure
                </label>
                <input
                  type="text"
                  value={reportingStructure}
                  onChange={(e) => setReportingStructure(e.target.value)}
                  placeholder="e.g., Reporting to Chief Global Operations Officer"
                  className="w-full rounded-lg bg-[#0b101d] border border-slate-700/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {(activeStep === 2 || activeStep === 3) && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Candidate&apos;s Latest Reply
                </label>
                <textarea
                  rows={3}
                  value={candidateReply}
                  onChange={(e) => setCandidateReply(e.target.value)}
                  placeholder="Paste the candidate's reply to the previous message..."
                  className="w-full rounded-lg bg-[#0b101d] border border-slate-700/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {/* Mandate / Opportunity Details */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Job Description / Executive Mandate Details
              </label>
              <textarea
                rows={4}
                value={opportunityDetails}
                onChange={(e) => setOpportunityDetails(e.target.value)}
                placeholder="Paste the target role title, strategic scope, and mandate requirements..."
                className="w-full rounded-lg bg-[#0b101d] border border-slate-700/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {activeStep === 6 && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Verified Progression / Interview Stage Details
                </label>
                <textarea
                  rows={2}
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Specify the confirmed next interview stage or onboarding milestone..."
                  className="w-full rounded-lg bg-[#0b101d] border border-slate-700/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Generating Step {activeStep} Executive Deliverable...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Generate {STEPS[activeStep - 1].badge} Deliverable
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Column: Generated Output */}
        <section className="lg:col-span-7 flex flex-col">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 flex-1 flex flex-col justify-between shadow-lg print-card">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 no-print">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    Executive Output Dossier
                  </h3>
                  {modelUsed && (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {modelUsed}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(generatedSubject, "subject")}
                    disabled={!generatedSubject}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 transition"
                  >
                    {copiedField === "subject" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    Copy Subject
                  </button>

                  <button
                    onClick={() => copyToClipboard(generatedBody, "body")}
                    disabled={!generatedBody}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 transition"
                  >
                    {copiedField === "body" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    Copy Body
                  </button>

                  <button
                    onClick={() => window.print()}
                    disabled={!generatedBody}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Export PDF
                  </button>
                </div>
              </div>

              {/* Subject Box */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={generatedSubject}
                  onChange={(e) => setGeneratedSubject(e.target.value)}
                  placeholder="Subject line will appear here..."
                  className="w-full rounded-lg bg-[#0b101d] border border-slate-700/80 px-3.5 py-2.5 text-sm font-semibold text-amber-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Body Box */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Executive Message / Assessment Body
                </label>
                <textarea
                  rows={18}
                  value={generatedBody}
                  onChange={(e) => setGeneratedBody(e.target.value)}
                  placeholder="Click 'Generate' on the left to produce your executive outreach or CV diagnostic..."
                  className="w-full rounded-lg bg-[#0b101d] border border-slate-700/80 p-4 text-sm leading-relaxed text-slate-100 focus:outline-none focus:border-amber-500 whitespace-pre-wrap"
                />
              </div>
            </div>

            {/* Bottom Advance Bar */}
            {generatedBody && activeStep < 6 && (
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between no-print">
                <span className="text-xs text-slate-400">
                  Ready to move this candidate to Step {activeStep + 1} ({STEPS[activeStep].title})?
                </span>
                <button
                  onClick={handleAdvanceStep}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition"
                >
                  Send & Advance to Step {activeStep + 1}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
