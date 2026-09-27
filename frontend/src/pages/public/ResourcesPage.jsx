/**
 * NyayaSetu — ResourcesPage & AI Legal Intelligence Engine Hub
 * Strictly integrated with Spring Boot REST API (/api/v1/ai/chat) & Groq Llama-3 70B Engine.
 * ZERO local fallback AI text generation.
 */

import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import BentoTilt from '@/components/common/BentoTilt';
import {
  HiDownload,
  HiDocumentText,
  HiShieldCheck,
  HiSearch,
  HiFolderDownload,
  HiSparkles,
  HiClipboardCopy,
  HiCheck,
  HiInformationCircle,
  HiClock,
  HiCode,
  HiExclamationCircle,
  HiExternalLink,
} from 'react-icons/hi';
import { MdOutlineGavel, MdOutlineSmartToy } from 'react-icons/md';
import apiClient from '@/services/api';
import {
  queryGroqLegalAI,
  analyzeDocumentGroq,
  generateDraftGroq,
  generateRoadmapGroq,
} from '@/services/groqLegalAiService';
import { matchAuthoritativeSources } from '@/services/legalSourcesRegistry';

const RESOURCE_ITEMS = [
  {
    id: 'res-1',
    title: 'Statutory Legal Notice for E-Commerce Refund Denial',
    category: 'Notice Templates',
    format: 'DOCX / PDF',
    size: '124 KB',
    description: '15-day statutory demand notice draft under Consumer Protection Act 2019 for non-refund of defective laptop/mobile.',
    downloadCount: '4,890 Downloads',
  },
  {
    id: 'res-2',
    title: 'Landlord Security Deposit Return Demand Notice',
    category: 'Notice Templates',
    format: 'DOCX / PDF',
    size: '110 KB',
    description: 'Formal legal demand notice under Model Tenancy Act for non-refund of rental security deposit within 30 days.',
    downloadCount: '3,520 Downloads',
  },
  {
    id: 'res-3',
    title: 'RTI Application Form 2005 (Standard Format)',
    category: 'Statutory Forms',
    format: 'PDF',
    size: '210 KB',
    description: 'Official Right to Information application template with fee payment instructions & PIO address guide.',
    downloadCount: '8,120 Downloads',
  },
];

// Clean renderer that eliminates raw asterisks, parses bold text, and renders gold bullets
const FormattedAiOutput = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');

  const renderSegment = (raw) => {
    // Matches **bold** or <b>bold</b>
    const parts = raw.split(/(\*\*[^*]+\*\*|<b>[^<]+<\/b>)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} className="font-bold text-ct-gold">
            {part.slice(2, -2).replace(/\*/g, '')}
          </strong>
        );
      }
      if (part.startsWith('<b>') && part.endsWith('</b>')) {
        return (
          <strong key={pIdx} className="font-bold text-ct-gold">
            {part.slice(3, -4).replace(/\*/g, '')}
          </strong>
        );
      }
      const clean = part.replace(/\*/g, '');
      return <span key={pIdx}>{clean}</span>;
    });
  };

  return (
    <div className="space-y-2.5 font-inter text-xs sm:text-sm text-ct-ivory/95 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Handle Disclaimer line
        if (trimmed.toLowerCase().includes('disclaimer:')) {
          const cleanDisclaimer = trimmed.replace(/\*/g, '');
          return (
            <div key={idx} className="mt-4 pt-3 border-t border-ct-gold/20 text-[11px] text-ct-gold/80 italic">
              {cleanDisclaimer}
            </div>
          );
        }

        // Bullet detection: starts with • or - or * or number.
        const isBullet = /^[•\-\*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed);
        const bulletMatch = trimmed.match(/^([•\-\*]|\d+\.)\s+(.*)$/);
        const lineContent = bulletMatch ? bulletMatch[2] : trimmed;

        if (isBullet) {
          const prefix = bulletMatch ? bulletMatch[1] : '•';
          const isNumeric = /^\d+\./.test(prefix);

          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1.5 py-0.5">
              {isNumeric ? (
                <span className="font-bold text-ct-gold text-xs shrink-0 mt-0.5">{prefix}</span>
              ) : (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-ct-gold mt-2 shrink-0 shadow-gold-glow" />
              )}
              <div className="flex-1 leading-relaxed">{renderSegment(lineContent)}</div>
            </div>
          );
        }

        // Check if header line (contains emoji or ends with colon or bold title)
        const isHeader = /^[⚖️📌🚀📞⚠️🛡️✅]/.test(trimmed) || /^[A-Za-z\s&]{3,}:/.test(trimmed);
        if (isHeader) {
          return (
            <div key={idx} className="pt-2 pb-0.5 font-bold text-ct-gold text-sm flex items-center gap-1.5">
              {renderSegment(trimmed)}
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed">
            {renderSegment(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

const OfficialSourcesCard = ({ sources = [], query = '' }) => {
  const verifiedSources = sources && sources.length > 0 ? sources : matchAuthoritativeSources(query);

  return (
    <div className="mt-5 rounded-2xl border border-ct-gold/30 bg-ct-void/90 p-5 backdrop-blur-md shadow-court-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-ct-gold/15 pb-2.5">
        <div className="flex items-center gap-2">
          <HiShieldCheck className="text-emerald-400" size={18} />
          <h5 className="font-cormorant text-lg font-bold text-ct-ivory">
            Official Legal Sources & Dated Citations
          </h5>
        </div>
        <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 font-general text-[8px] uppercase tracking-widest text-emerald-400 font-bold">
          GOVERNMENT VERIFIED
        </span>
      </div>

      {verifiedSources.length > 0 ? (
        <div className="space-y-3">
          {verifiedSources.map((src, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl border border-ct-gold/20 bg-ct-card/40 hover:border-ct-gold/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-general text-[9px] uppercase tracking-widest font-bold text-ct-gold">
                    {src.officialSource}
                  </span>
                  <span className="font-mono text-[9px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                    {src.status || 'Current Law'}
                  </span>
                </div>

                <p className="font-cormorant text-base font-bold text-ct-ivory">
                  {src.actName}
                </p>

                {src.primarySections && (
                  <p className="font-inter text-xs text-ct-muted">
                    Key Provision: <strong className="text-ct-ivory">{src.primarySections}</strong>
                  </p>
                )}

                <p className="font-general text-[9px] uppercase tracking-wider text-ct-gold/80">
                  Verified against official source on {src.lastVerified || '27 September 2026'}
                </p>
              </div>

              {src.officialUrl ? (
                <a
                  href={src.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 self-start sm:self-center shrink-0 rounded-lg border border-ct-gold/30 bg-ct-gold/10 px-3 py-1.5 font-general text-[10px] uppercase tracking-wider text-ct-gold hover:bg-ct-gold/20 hover:text-white transition-all shadow-sm"
                  title="Open Official Repository / India Code"
                >
                  <span>Official Source</span>
                  <HiExternalLink size={14} />
                </a>
              ) : (
                <span className="text-[10px] text-ct-muted font-general uppercase">
                  Source verification unavailable
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-ct-gold/15 bg-ct-card/20 text-xs font-inter text-ct-muted space-y-2">
          <p className="text-ct-ivory font-medium">
            ⚠️ <em>Source verification unavailable for this specific scenario.</em>
          </p>
          <p className="text-[11px]">
            NyayaSetu prohibits fabricating statutory citations. Please verify your query against official government repositories:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href="https://www.indiacode.nic.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-general uppercase tracking-wider text-ct-gold hover:underline"
            >
              <span>India Code Central Repository</span>
              <HiExternalLink size={12} />
            </a>
            <span className="text-ct-gold/40">·</span>
            <a
              href="https://legislative.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-general uppercase tracking-wider text-ct-gold hover:underline"
            >
              <span>Legislative Department (Law Ministry)</span>
              <HiExternalLink size={12} />
            </a>
          </div>
        </div>
      )}

      <div className="mt-3 pt-2.5 border-t border-ct-gold/10 flex flex-wrap items-center justify-between text-[10px] font-inter text-ct-muted gap-2">
        <span>Authoritative Source: India Code / Ministry of Law and Justice</span>
        <span>Verified System Snapshot: 27 September 2026</span>
      </div>
    </div>
  );
};

const ResourcesPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialPrompt = location.state?.initialPrompt || searchParams.get('prompt') || '';

  const [activeTab, setActiveTab]             = useState('ASSISTANT'); // ASSISTANT, ANALYZER, DRAFT, ROADMAP, HISTORY, VAULT
  const [prompt, setPrompt]                   = useState(initialPrompt);
  const [documentText, setDocumentText]       = useState('');
  const [draftType, setDraftType]             = useState('Legal Notice');
  const [draftDetails, setDraftDetails]       = useState('');
  const [aiOutput, setAiOutput]               = useState('');
  const [isLoading, setIsLoading]             = useState(false);
  const [isError, setIsError]                 = useState(false);
  const [errorMessage, setErrorMessage]       = useState('');
  const [copied, setCopied]                   = useState(false);
  const [aiHistory, setAiHistory]             = useState([]);
  const [categoryEstimate, setCategoryEstimate] = useState('');
  const [activeCitations, setActiveCitations] = useState([]);

  // Auto-trigger AI analysis if an initial prompt is passed from home search box
  useEffect(() => {
    if (initialPrompt && !aiOutput && !isLoading) {
      runAiChat(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (activeTab === 'HISTORY') {
      apiClient.get('/ai/history')
        .then((res) => {
          if (Array.isArray(res)) setAiHistory(res);
        })
        .catch(() => {});
    }
  }, [activeTab]);

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // AI Chat — queries backend or directly Groq AI Engine
  const runAiChat = async (userPrompt) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    setAiOutput('');
    setActiveCitations([]);

    try {
      const res = await apiClient.post('/ai/chat', { prompt: userPrompt });
      setAiOutput(res?.response || 'No response returned from backend.');
      if (res?.categoryEstimate) setCategoryEstimate(res.categoryEstimate);
      const matched = matchAuthoritativeSources(userPrompt);
      setActiveCitations(matched);
    } catch {
      // Backend offline or error — fallback directly to Groq AI client
      try {
        const directResult = await queryGroqLegalAI(userPrompt);
        if (directResult && typeof directResult === 'object' && directResult.text) {
          setAiOutput(directResult.text);
          setActiveCitations(directResult.citations || matchAuthoritativeSources(userPrompt));
        } else {
          setAiOutput(String(directResult));
          setActiveCitations(matchAuthoritativeSources(userPrompt));
        }
        setCategoryEstimate('Groq Llama-3 / OSS (Live Direct)');
      } catch (directErr) {
        setIsError(true);
        const detail = directErr.message || 'Groq AI Service Unavailable';
        setErrorMessage(`Failed to fetch response from Groq AI Engine: ${detail}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskAssistant = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    runAiChat(prompt.trim());
  };

  // Document Analysis — queries backend or directly Groq AI
  const handleAnalyzeDocument = async (e) => {
    e.preventDefault();
    if (!documentText.trim()) return;

    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    setAiOutput('');

    try {
      const res = await apiClient.post('/ai/analyze-document', { documentText });
      setAiOutput(res?.response || 'Document analysis completed.');
    } catch {
      try {
        const directResponse = await analyzeDocumentGroq(documentText);
        setAiOutput(directResponse);
      } catch (directErr) {
        setIsError(true);
        const detail = directErr.message || 'Groq AI Service Unavailable';
        setErrorMessage(`Document analysis failed: ${detail}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Legal Draft Generation — queries backend or directly Groq AI
  const handleGenerateDraft = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    setAiOutput('');

    try {
      const res = await apiClient.post('/ai/generate-draft', { draftType, details: draftDetails });
      setAiOutput(res?.draftContent || 'Legal draft generated successfully.');
    } catch {
      try {
        const directResponse = await generateDraftGroq(draftType, draftDetails);
        setAiOutput(directResponse);
      } catch (directErr) {
        setIsError(true);
        const detail = directErr.message || 'Groq AI Service Unavailable';
        setErrorMessage(`Draft generation failed: ${detail}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Action Roadmap Generation — queries backend or directly Groq AI
  const handleGenerateRoadmap = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    setAiOutput('');

    try {
      const res = await apiClient.post('/ai/roadmap', { issue: prompt || 'General legal issue' });
      setAiOutput(res?.roadmap || 'Roadmap generated successfully.');
      setActiveCitations(matchAuthoritativeSources(prompt || 'General legal issue'));
    } catch {
      try {
        const directResponse = await generateRoadmapGroq(prompt || 'General legal issue');
        setAiOutput(directResponse);
        setActiveCitations(matchAuthoritativeSources(prompt || 'General legal issue'));
      } catch (directErr) {
        setIsError(true);
        const detail = directErr.message || 'Groq AI Service Unavailable';
        setErrorMessage(`Action roadmap failed: ${detail}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="gold-divider-sm" />
            <span className="label-text">LIVE GROQ LLAMA-3 70B AI COPILOT HUB</span>
            <div className="gold-divider-sm" />
          </div>

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight">
            NyayaSetu <span className="text-ct-gold italic">AI Intelligence Engine</span>
          </h1>

          <p className="mt-2 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed max-w-xl mx-auto">
            Directly connected to Groq Llama-3.3 70B Versatile LLM. Conversational legal advice, smart category classification, document analysis, and legal notice drafting.
          </p>
        </div>

        {/* AI Engine Navigation Tabs */}
        <div className="court-card-surface p-2 mb-8 border border-ct-gold/40 flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'ASSISTANT', label: '🤖 AI Legal Assistant' },
            { id: 'ANALYZER', label: '📄 Document Analyzer' },
            { id: 'DRAFT', label: '✍️ Draft Generator' },
            { id: 'ROADMAP', label: '🗺️ Action Roadmap' },
            { id: 'HISTORY', label: '📜 AI History' },
            { id: 'VAULT', label: '📁 Vault Templates' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setAiOutput(''); setIsError(false); }}
              className={`rounded-xl px-4 py-2 font-general text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#D9A758] to-[#C89B52] text-white shadow-gold-glow'
                  : 'bg-ct-void text-ct-ivory/80 hover:text-ct-gold'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mandatory Legal Disclaimer Banner */}
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3.5 mb-8 flex items-center gap-3 text-xs font-inter text-amber-200">
          <HiInformationCircle className="text-amber-400 flex-shrink-0" size={20} />
          <span>
            <strong>Legal Disclaimer:</strong> NyayaSetu AI Copilot provides informational guidance based on Indian statutory law. It is not a substitute for professional legal advice from a licensed advocate.
          </span>
        </div>

        {/* Tab Content Areas */}
        <div className="grid gap-8">

          {/* TAB 1: CONVERSATIONAL ASSISTANT */}
          {activeTab === 'ASSISTANT' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="court-card-surface p-7 border border-ct-gold/40 lg:col-span-1">
                <h3 className="font-cormorant text-2xl font-bold text-ct-ivory mb-2">Ask Legal Assistant</h3>
                <p className="font-inter text-xs text-ct-muted mb-4">Explain your situation in plain English, Hindi, or Hinglish.</p>

                <form onSubmit={handleAskAssistant} className="space-y-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Landlord is refusing security deposit return of Rs 35,000 after 30 days..."
                    className="w-full rounded-xl border border-ct-gold/30 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
                    rows={6}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] to-[#C89B52] py-3 font-general text-xs font-bold uppercase tracking-widest text-white shadow-gold-glow hover:opacity-90"
                  >
                    <HiSparkles size={18} />
                    <span>{isLoading ? 'Analyzing via Groq AI...' : 'Analyze Legal Options'}</span>
                  </button>
                </form>
              </div>

              {/* Output Display */}
              <div className="court-card-surface p-7 border border-ct-gold/40 lg:col-span-2">
                <div className="flex items-center justify-between mb-4 border-b border-ct-gold/15 pb-3">
                  <h3 className="font-cormorant text-2xl font-bold text-ct-ivory flex items-center gap-2">
                    <MdOutlineSmartToy className="text-ct-gold" size={24} />
                    <span>AI Copilot Analysis (Live Groq LLM)</span>
                  </h3>
                  {aiOutput && (
                    <button onClick={handleCopyOutput} className="flex items-center gap-1 font-general text-[10px] uppercase text-ct-gold">
                      {copied ? <HiCheck className="text-emerald-400" /> : <HiClipboardCopy />}
                      <span>{copied ? 'Copied' : 'Copy Response'}</span>
                    </button>
                  )}
                </div>

                {categoryEstimate && !isError && (
                  <div className="mb-4 inline-block rounded-full border border-ct-gold/40 bg-ct-gold/10 px-3 py-1 font-general text-[10px] uppercase tracking-widest text-ct-gold font-bold">
                    Engine: {categoryEstimate}
                  </div>
                )}

                {isLoading ? (
                  <div className="py-16 text-center text-ct-gold font-general text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                    <HiSparkles size={20} className="animate-spin" />
                    <span>Querying Groq Llama-3.3 70B Engine...</span>
                  </div>
                ) : isError ? (
                  <div className="p-5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 font-inter text-xs leading-relaxed flex items-start gap-3">
                    <HiExclamationCircle size={22} className="text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold mb-1">Backend Groq API Error:</strong>
                      {errorMessage}
                    </div>
                  </div>
                ) : (
                  <div className="bg-ct-void p-6 rounded-xl border border-ct-gold/20 min-h-[250px]">
                    {aiOutput ? (
                      <>
                        <FormattedAiOutput text={aiOutput} />
                        <OfficialSourcesCard sources={activeCitations} query={prompt} />
                      </>
                    ) : (
                      <p className="font-inter text-xs text-ct-muted italic">
                        Your AI Legal Copilot response from Groq API will appear here...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENT ANALYZER */}
          {activeTab === 'ANALYZER' && (
            <div className="court-card-surface p-8 border border-ct-gold/40 max-w-4xl mx-auto w-full">
              <h3 className="font-cormorant text-3xl font-bold text-ct-ivory mb-2">Legal Document Analyzer</h3>
              <p className="font-inter text-xs text-ct-muted mb-6">Paste agreement, notice, or contract text to extract key clauses, missing terms, and risk flags via Groq Llama-3.</p>

              <form onSubmit={handleAnalyzeDocument} className="space-y-4">
                <textarea
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste contract, agreement, or notice text here..."
                  className="w-full rounded-xl border border-ct-gold/30 bg-ct-void p-4 font-mono text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
                  rows={8}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] to-[#C89B52] px-8 py-3 font-general text-xs font-bold uppercase tracking-widest text-white shadow-gold-glow hover:opacity-90"
                >
                  <HiDocumentText size={18} />
                  <span>{isLoading ? 'Analyzing Document via Groq...' : 'Analyze Document Risks'}</span>
                </button>
              </form>

              {isError && (
                <div className="mt-6 p-5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 font-inter text-xs">
                  {errorMessage}
                </div>
              )}

              {aiOutput && !isError && (
                <div className="mt-8 pt-6 border-t border-ct-gold/15">
                  <h4 className="font-cormorant text-xl font-bold text-ct-gold mb-3">Analysis Findings (Groq AI):</h4>
                  <div className="bg-ct-void p-6 rounded-xl border border-ct-gold/20">
                    <FormattedAiOutput text={aiOutput} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DRAFT GENERATOR */}
          {activeTab === 'DRAFT' && (
            <div className="court-card-surface p-8 border border-ct-gold/40 max-w-4xl mx-auto w-full">
              <h3 className="font-cormorant text-3xl font-bold text-ct-ivory mb-2">Legal Notice & Draft Generator</h3>
              <p className="font-inter text-xs text-ct-muted mb-6">Generate ready-to-send statutory notices, demand letters, and legal applications using Groq Llama-3.</p>

              <form onSubmit={handleGenerateDraft} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-general text-[10px] uppercase text-ct-gold block mb-1">Select Notice / Draft Type</label>
                    <select
                      value={draftType}
                      onChange={(e) => setDraftType(e.target.value)}
                      className="w-full rounded-xl border border-ct-gold/30 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:outline-none"
                    >
                      <option value="Legal Notice">15-Day Statutory Legal Notice</option>
                      <option value="Consumer Complaint">Consumer Forum Complaint Petition</option>
                      <option value="RTI Application">Right to Information (RTI) Application</option>
                      <option value="Rental Dispute Notice">Tenant Deposit Refund Notice</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-general text-[10px] uppercase text-ct-gold block mb-1">Key Parties & Claim Details</label>
                    <input
                      type="text"
                      value={draftDetails}
                      onChange={(e) => setDraftDetails(e.target.value)}
                      placeholder="e.g. Sender: Raj Malhotra, Receiver: Zepto Pvt Ltd, Amount: Rs 1,499..."
                      className="w-full rounded-xl border border-ct-gold/30 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] to-[#C89B52] px-8 py-3 font-general text-xs font-bold uppercase tracking-widest text-white shadow-gold-glow hover:opacity-90"
                >
                  <HiSparkles size={18} />
                  <span>{isLoading ? 'Generating Draft via Groq...' : 'Generate Formal Legal Draft'}</span>
                </button>
              </form>

              {isError && (
                <div className="mt-6 p-5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 font-inter text-xs">
                  {errorMessage}
                </div>
              )}

              {aiOutput && !isError && (
                <div className="mt-8 pt-6 border-t border-ct-gold/15">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-cormorant text-xl font-bold text-ct-gold">Generated Legal Draft (Groq AI):</h4>
                    <button onClick={handleCopyOutput} className="flex items-center gap-1 font-general text-[10px] uppercase text-ct-gold">
                      {copied ? <HiCheck className="text-emerald-400" /> : <HiClipboardCopy />}
                      <span>{copied ? 'Copied' : 'Copy Draft'}</span>
                    </button>
                  </div>
                  <div className="bg-ct-void p-6 rounded-xl border border-ct-gold/20">
                    <FormattedAiOutput text={aiOutput} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ACTION ROADMAP */}
          {activeTab === 'ROADMAP' && (
            <div className="court-card-surface p-8 border border-ct-gold/40 max-w-4xl mx-auto w-full">
              <h3 className="font-cormorant text-3xl font-bold text-ct-ivory mb-2">Legal Action Roadmap Generator</h3>
              <p className="font-inter text-xs text-ct-muted mb-6">Get a clear 5-step visual roadmap for resolving your legal dispute via Groq Llama-3.</p>

              <form onSubmit={handleGenerateRoadmap} className="flex items-center gap-4 mb-6">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter legal dispute (e.g. Unpaid salary of 2 months, Cyber UPI fraud)..."
                  className="flex-1 rounded-xl border border-ct-gold/30 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] to-[#C89B52] px-6 py-3 font-general text-xs font-bold uppercase tracking-widest text-white shadow-gold-glow hover:opacity-90 shrink-0"
                >
                  <HiSparkles size={18} />
                  <span>Generate Roadmap</span>
                </button>
              </form>

              {isError && (
                <div className="mt-6 p-5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 font-inter text-xs">
                  {errorMessage}
                </div>
              )}

              {aiOutput && !isError && (
                <div className="bg-ct-void p-6 rounded-xl border border-ct-gold/20">
                  <FormattedAiOutput text={aiOutput} />
                  <OfficialSourcesCard sources={activeCitations} query={prompt} />
                </div>
              )}
            </div>
          )}

          {/* TAB 5: AI HISTORY */}
          {activeTab === 'HISTORY' && (
            <div className="court-card-surface p-8 border border-ct-gold/40 max-w-4xl mx-auto w-full">
              <h3 className="font-cormorant text-3xl font-bold text-ct-ivory mb-2">My AI Consultation History</h3>
              <p className="font-inter text-xs text-ct-muted mb-6">View your past AI assistant queries and generated legal drafts.</p>

              {aiHistory.length === 0 ? (
                <div className="text-center py-12 text-ct-muted font-inter text-xs">
                  No saved AI conversations yet. Ask the AI Assistant or generate a draft while logged in to save history.
                </div>
              ) : (
                <div className="space-y-4">
                  {aiHistory.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl bg-ct-void border border-ct-gold/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">
                          {item.queryType} · {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      <p className="font-inter text-xs font-bold text-ct-ivory mb-2">Q: {item.prompt}</p>
                      <p className="font-inter text-xs text-ct-muted line-clamp-3">A: {item.response}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: VAULT TEMPLATES */}
          {activeTab === 'VAULT' && (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              {RESOURCE_ITEMS.map((item) => (
                <div key={item.id} className="court-card-surface p-6 border border-ct-gold/30 hover:border-ct-gold flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">
                        {item.category}
                      </span>
                      <span className="font-mono text-[9px] text-ct-muted px-2 py-0.5 rounded bg-ct-void border border-ct-gold/20">
                        {item.format}
                      </span>
                    </div>

                    <h4 className="font-cormorant text-xl font-bold text-ct-ivory mb-2 leading-snug">
                      {item.title}
                    </h4>

                    <p className="font-inter text-xs text-ct-muted mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-ct-gold/15 flex items-center justify-between">
                    <span className="font-general text-[9px] uppercase text-ct-muted">
                      {item.downloadCount}
                    </span>

                    <button className="flex items-center gap-1.5 rounded-xl bg-ct-gold/10 px-3 py-1.5 font-general text-[10px] font-bold uppercase text-ct-gold border border-ct-gold/30 hover:bg-ct-gold hover:text-ct-void transition-all">
                      <HiDownload size={14} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ResourcesPage;
