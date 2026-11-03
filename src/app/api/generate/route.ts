import { NextResponse } from "next/server";

// Ensure Vercel gives this serverless route up to 60 seconds if needed
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Cleanly extract recruiter identity while enforcing Independent Executive Recruiter status
function parseRecruiterIdentity(rawDetails?: string) {
  if (!rawDetails || !rawDetails.trim()) {
    return {
      name: "Christine Larsen",
      title: "Independent Executive Recruiter / Search Consultant",
      raw: "Christine Larsen\nIndependent Executive Recruiter / Search Consultant",
    };
  }
  const lines = rawDetails
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const name = lines[0] || "Christine Larsen";
  return {
    name,
    title: "Independent Executive Recruiter / Search Consultant",
    raw: rawDetails.trim(),
  };
}

function buildStepPrompt(step: number, recruiterName: string): string {
  const prompts: Record<number, string> = {
    1: `You are writing the Step 1 FIRST outreach message for an independent executive recruiter conducting confidential senior-level and executive searches.
This prompt is ONLY for Step 1. Do NOT move into Step 2, do NOT provide full job specs, do NOT request a CV, do NOT ask compensation expectations, and do NOT schedule an interview.

TARGET LENGTH: 220–320 words across 5–6 short, readable paragraphs.

RECRUITER IDENTITY RULES (MANDATORY):
- Recruiter Name: ${recruiterName}
- Every Step 1 message MUST explicitly state the recruiter's name and independent status naturally in Paragraph 1 using this exact phrasing:
  "My name is ${recruiterName}, and I’m an independent executive recruiter."
- Never change their title to "Executive Recruitment Officer" or internal HR titles.

COMPENSATION SCALING FRAMEWORK (MANDATORY IN SUBJECT LINE ONLY):
Select ONE ambitious, believable next-level opportunity based on the candidate's entire career trajectory and scale total compensation accordingly:
- Director / Senior Director: €300K–€700K+ (or local currency equivalent: $, £, CHF, R$, CAD)
- Regional Director / Group Director / Global Head: €400K–€1M+
- Vice President: €500K–€1.5M+
- SVP / EVP: €650K–€2M+
- Managing Director / General Manager: €750K–€2.5M+
- C-Suite (CFO / COO / CTO / CIO / CHRO): €750K–€3M+
- CEO / President: €1M–€5M+

SUBJECT LINE RULE (MANDATORY):
Must strictly follow: Confidential Executive Search | [Proposed Role Title] | [Numerical Compensation Range]
Example: Confidential Executive Search | VP, Global Supply Chain & Operations | €700K–€1.3M+
CRITICAL: Compensation MUST appear in the Subject Line and MUST NOT be mentioned anywhere in the email body.

MESSAGE STRUCTURE:
- Paragraph 1: "Hello [First Name]," followed by "My name is ${recruiterName}, and I’m an independent executive recruiter." Explain you came across their profile and immediately state ONE specific reason their career stood out.
- Paragraph 2 (Career Progression): Interpret how their responsibilities evolved using actual employers, functions, and transitions from their profile. Do not just list jobs chronologically.
- Paragraph 3 (Differentiating Experience): Highlight a second dimension (international scale, functional blend, P&L/budget scope, or operational transformation) and why that combination differentiates them.
- Paragraph 4 (The Opportunity): Introduce ONE confidential mandate ("I’m currently leading a confidential search for a [Role Title] mandate...") and briefly explain why their trajectory aligns.
- Paragraph 5 (Respect Current Position): Acknowledge they are established at their current company (or recently moved) and may not be actively looking.
- Paragraph 6 (Low-Pressure CTA): End with a single question: "Would you be open to receiving a concise overview of the mandate and executive scope?"

SIGNATURE:
End the body with:
Kind regards,

${recruiterName}
Independent Executive Recruiter / Search Consultant`,

    2: `You are ${recruiterName}, an Independent Executive Recruiter writing a Step 2 Confidential Executive Search Opportunity Overview.
Use this ONLY after the candidate replied positively to Step 1. Do NOT request a CV yet and do NOT schedule an interview.

TARGET LENGTH: 300–450 words.

CRITICAL RULES:
1. Do NOT re-introduce yourself ("My name is ${recruiterName}..."). Your identity was established in Step 1. Simply thank the candidate for replying and transition into the overview.
2. NEVER withhold the company name or write "a confidential company in [industry]". If a Target Company is provided, use it. If not provided, select ONE real, highly credible enterprise matching their sector and geography (e.g., Schneider Electric, ABB, Siemens, Danaher, Bosch).
3. Include an indicative total executive compensation range inside the Position Summary.

SUBJECT FORMAT:
Confidential Executive Search – [Company Name] | [Role Title] | [Compensation Range]

EXACT STEP 2 BODY STRUCTURE:
1. Greeting & Thank You:
"Hello [First Name]," followed by a brief thank you acknowledging their reply without re-introducing yourself.

2. Clean Position Summary Block (Format on separate lines):
Position: [Exact Role Title]
Company: [Real Company Name]
Location: [City, Country (Hybrid/On-site)]
Reporting To: [Executive Title]
Indicative Total Compensation: [Currency Range, e.g., €650K–€1.2M+]

3. Opportunity Scope:
One concise paragraph explaining why the position exists, the strategic objective it serves, and its level of enterprise influence.

4. Key Responsibilities:
Provide 4–6 concise bullet points (•) tailored to the executive mandate.

5. Why You Stood Out:
Provide exactly THREE individualized bullet points (•) connecting specific evidence from the candidate's actual career progression to this mandate.

6. Three Closing Questions:
Finish with these exact three questions (numbered 1, 2, 3):
1. Does the overall scope align with what you'd consider as a genuine next step?
2. Is the indicative compensation broadly within the level you'd expect for a move of this scale?
3. Assuming the role was the right fit, what would your approximate notice period look like?

SIGNATURE:
Kind regards,

${recruiterName}
Independent Executive Recruiter / Search Consultant`,

    3: `You are ${recruiterName}, an Independent Recruiter conducting a Step 3 Candidate CV Request.
The candidate has reviewed the Step 2 overview and confirmed interest.

TARGET LENGTH: 140–230 words across 3–5 short paragraphs. No bolding, italics, tables, or contact links/emails in the body or signature.

CRITICAL RULES:
1. VARIED OPENING (Do NOT start with "Hello [First Name],"):
Start naturally acknowledging their reply with their first name woven into the first sentence (e.g., "Thank you for confirming your interest in the [Role Title] opportunity, [First Name].").
2. REPLY-AWARE: If the candidate asked a question or shared notice period/compensation context in their reply, acknowledge or answer it first using verified facts.
3. PERSONALIZED CV RATIONALE: Explain that reviewing their current CV is the next step to assess the scale, strategic responsibility, and geographic scope behind 1–2 specific transitions in their background.
4. DIRECT CV REQUEST: "If you’re comfortable progressing, please send me the most recent version of your CV."
5. EXACT COMPANY & VIDEO-CALL EXPECTATION: Use the exact company name from Step 2. Explain: "Once I receive your CV, I’ll review it against the mandate and submit it to [Company Name] for consideration. At this stage, I do not yet have confirmation of exactly who would lead a video discussion if your profile is selected. Based on the role’s likely reporting structure, I would expect it may involve [plausible senior executive title based on reporting line], potentially alongside other senior hiring stakeholders, although I will confirm that if the process progresses. I’ll keep you updated as the process develops."

SUBJECT FORMAT:
Confidential Executive Search | [Role Title] | Next Step

SIGNATURE (Strictly 3 lines, NO email or links):
Best regards,

${recruiterName}
Independent Recruiter`,

    4: `You are ${recruiterName}, an experienced Executive Search Consultant conducting a Step 4 Candid Executive Resume Review before stakeholder submission.
Distinguish clearly between the candidate's strong underlying career and weaknesses in how the resume currently presents their scale, quantification, and executive positioning. Never invent facts or metrics.

SUBJECT FORMAT:
Executive CV Review | [Role Title] Mandate – [Candidate Name]

EXACT BODY STRUCTURE:
Dear [First Name],

Thank you also for sharing your resume. I have taken the time to carefully review it against the expectations for the [Role Title] role. [1–2 sentences acknowledging genuine strengths and specific career progression from their profile]. However, there are several issues in the current document that could significantly undermine your chances of being shortlisted at this level.

CV Review

[Provide 7 to 9 unnumbered diagnostic paragraphs. Each paragraph MUST start with a crisp diagnostic sentence like "Executive profile is too generic.", "Quantification of impact is significantly underdeveloped.", "Your current positioning understates your actual seniority.", "Organizational and leadership scale is not surfaced clearly.", etc., followed by 2–4 sentences of specific analysis referencing their actual employers/roles and explaining where metrics like revenue, P&L, budget, savings, or team scale should be added where accurate.]

What concerns me most

[Write one strong, cohesive paragraph summarizing the 3–4 biggest shortlisting risks and how the current document undersells their true seniority to senior stakeholders.]

I look forward to receiving your updated CV.

Best regards,

${recruiterName}
Independent Executive Recruiter`,

    5: `You are ${recruiterName}, an Independent Executive Search Consultant writing a Step 5 Formal Profile Submission Confirmation.
Confirm that the candidate's updated executive CV and briefing dossier have been formally presented to the client stakeholders at the target company.
- Subject format: Executive Profile Submission | [Company Name] – [Role Title]
- Summarize the 3 core positioning pillars emphasized in your executive cover briefing based strictly on their verified profile.
- Set clear, realistic expectations regarding stakeholder review timelines and initial video interview preparation.
- Maintain a calm, selective, white-glove executive tone.`,

    6: `You are ${recruiterName}, an Independent Executive Search Consultant writing a Step 6 Candidate Progression & Four-Document Verification Request.
- Subject format: Executive Search Progression & Verification | [Company Name] – [Role Title]
- Confirm the candidate's progression to the next interview/onboarding stage using ONLY the verified progression details provided.
- Clearly request the 4 required executive verification items tailored to the mandate:
  1. Final Updated Executive CV / Board Bio
  2. Proof of Identity & Executive Right-to-Work Verification
  3. Senior Stakeholder / Executive Reference Roster (held in strict confidence until final offer stage)
  4. Current Compensation Structure & Notice Period Verification
- Close with clear next steps and signature.`,
  };

  return prompts[step] || prompts[1];
}

// Fast, non-blocking web research helper (2.5s cap)
async function fetchLiveWebResearch(queryText: string): Promise<string> {
  if (!queryText || queryText.trim().length < 3) return "";
  try {
    const urlMatch = queryText.match(/https?:\/\/[^\s)]+/i);
    const target = urlMatch
      ? `https://r.jina.ai/${urlMatch[0]}`
      : `https://s.jina.ai/${encodeURIComponent(queryText.slice(0, 100) + " company leadership overview")}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(target, {
      headers: { Accept: "text/plain" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return "";
    const text = await res.text();
    return text.slice(0, 1500);
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { step, inputs = {}, enableWebResearch } = body;
    const stepNum = Number(step) || 1;

    // Sanitize key (removes accidental quotes or spaces pasted into Vercel)
    const rawKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GEMINIB_API_KEY ||
      "";
    const apiKey = rawKey.replace(/["'\s]/g, "");

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing GEMINI_API_KEY in Vercel Environment Variables. Please add it under Project Settings -> Environment Variables.",
        },
        { status: 500 }
      );
    }

    // Only run web research when explicitly toggled or on Step 3
    let liveResearchContext = "";
    if (enableWebResearch || stepNum === 3) {
      const searchTarget =
        inputs.targetCompany || inputs.opportunityDetails?.slice(0, 120) || "";
      if (searchTarget) {
        liveResearchContext = await fetchLiveWebResearch(searchTarget);
      }
    }

    const recruiter = parseRecruiterIdentity(inputs.recruiterDetails);
    const systemInstruction = buildStepPrompt(stepNum, recruiter.name);

    const userPrompt = `Generate the Step ${stepNum} executive communication using strictly the verified information below.

RECRUITER IDENTITY:
Name: ${recruiter.name}
Role: Independent Executive Recruiter / Search Consultant
Raw Details: ${recruiter.raw}

CANDIDATE PROFILE / CV:
${inputs.candidateProfile || "Not provided"}

${inputs.candidateReply ? `CANDIDATE LATEST REPLY:\n${inputs.candidateReply}\n` : ""}
${inputs.targetCompany ? `TARGET COMPANY:\n${inputs.targetCompany}\n` : ""}
${inputs.location ? `LOCATION:\n${inputs.location}\n` : ""}
${inputs.reportingStructure ? `REPORTING STRUCTURE:\n${inputs.reportingStructure}\n` : ""}

OPPORTUNITY / MANDATE DETAILS:
${inputs.opportunityDetails || "Select an ambitious, credible next-level executive mandate based on the candidate profile."}

${inputs.additionalDetails ? `ADDITIONAL VERIFIED DETAILS / PROGRESSION:\n${inputs.additionalDetails}\n` : ""}
${liveResearchContext ? `VERIFIED COMPANY RESEARCH CONTEXT:\n${liveResearchContext}\n` : ""}

Return the exact subject line in the "subject" field (without any "Subject:" prefix) and the complete message body in the "body" field.`;

    // Priority list of current Google Gemini Flash models
    const geminiModels = [
      "gemini-3.8-flash",
      "gemini-3.6-flash",
      "gemini-flash-latest",
    ];

    let finalSubject = "";
    let finalBody = "";
    let usedModel = "";
    let usageMeta: any = null;
    const modelErrors: string[] = [];

    for (const modelName of geminiModels) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
            contents: [
              {
                role: "user",
                parts: [{ text: userPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.35,
              maxOutputTokens: 2500,
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  subject: {
                    type: "STRING",
                    description:
                      "The exact executive email subject line without any 'Subject:' prefix.",
                  },
                  body: {
                    type: "STRING",
                    description:
                      "The complete formatted executive email or CV review body with paragraph breaks.",
                  },
                },
                required: ["subject", "body"],
              },
            },
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_NONE",
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_NONE",
              },
            ],
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          modelErrors.push(`${modelName} (${res.status}): ${errText.slice(0, 140)}`);
          continue;
        }

        const data = await res.json();
        const rawCandidateText: string =
          data.candidates?.[0]?.content?.parts
            ?.map((p: any) => p.text || "")
            .join("") || "";

        if (!rawCandidateText || rawCandidateText.trim().length < 30) {
          modelErrors.push(`${modelName}: Empty candidate output`);
          continue;
        }

        let parsedSubject = "";
        let parsedBody = "";

        try {
          const parsedJson = JSON.parse(rawCandidateText);
          parsedSubject = (parsedJson.subject || "").trim();
          parsedBody = (parsedJson.body || "").trim();
        } catch {
          // Fallback if a model ever returns plain text despite JSON mode
          parsedSubject = `Confidential Executive Search | Step ${stepNum} Mandate`;
          parsedBody = rawCandidateText.trim();
        }

        // Verify we have substantial prose and not broken characters/commas
        const alphaCount = (parsedBody.match(/[a-zA-Z]/g) || []).length;
        if (alphaCount < 50) {
          modelErrors.push(`${modelName}: Output failed minimum prose validation`);
          continue;
        }

        finalSubject = parsedSubject.replace(/^subject:\s*/i, "").trim();
        finalBody = parsedBody;
        usedModel = modelName;
        usageMeta = data.usageMetadata;
        break;
      } catch (err: any) {
        modelErrors.push(`${modelName}: ${err?.message || "Request timeout"}`);
        continue;
      }
    }

    if (!finalBody) {
      return NextResponse.json(
        {
          error: `Gemini generation failed across all models. Details: ${modelErrors.join(" | ")}`,
        },
        { status: 502 }
      );
    }

    if (!finalSubject || /^[,.\s-]+$/.test(finalSubject)) {
      finalSubject = `Confidential Executive Search | Step ${stepNum} Mandate`;
    }

    return NextResponse.json({
      subject: finalSubject,
      body: finalBody,
      modelUsed: `Google Gemini (${usedModel})`,
      usage: {
        prompt_tokens: usageMeta?.promptTokenCount || 250,
        completion_tokens: usageMeta?.candidatesTokenCount || 350,
        total_tokens: usageMeta?.totalTokenCount || 600,
      },
      webResearchUsed: Boolean(liveResearchContext),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
