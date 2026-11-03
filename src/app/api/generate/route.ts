import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

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
- Never use corporate HR titles like "Recruitment Officer".

COMPENSATION SCALING FRAMEWORK (MANDATORY IN SUBJECT LINE ONLY):
Select ONE ambitious, believable next-level opportunity based on the candidate's trajectory and scale total annual compensation accordingly:
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
- Paragraph 5 (Respect Current Position): Acknowledge they are established at their current company and may not be actively looking.
- Paragraph 6 (Low-Pressure CTA): End with a single question: "Would you be open to receiving a concise overview of the mandate and executive scope?"

SIGNATURE:
Kind regards,

${recruiterName}
Independent Executive Recruiter / Search Consultant`,

    2: `You are ${recruiterName}, an Independent Executive Recruiter writing a Step 2 Confidential Executive Search Opportunity Overview.
Use this ONLY after the candidate replied positively to Step 1. Do NOT request a CV yet and do NOT schedule an interview.

TARGET LENGTH: 300–450 words.

CRITICAL RULES:
1. Do NOT re-introduce yourself ("My name is ${recruiterName}..."). Simply thank the candidate for replying and transition into the overview.
2. NEVER withhold the company name or write "a confidential company". If a Target Company is provided, use it. If not, select ONE real, highly credible enterprise matching their sector and geography (e.g., ABB, Schneider Electric, Wärtsilä, Siemens, Danaher, Standard Chartered).
3. Include an indicative total executive compensation range inside the Position Summary.

SUBJECT FORMAT:
Confidential Executive Search – [Company Name] | [Role Title] | [Compensation Range]

EXACT STEP 2 BODY STRUCTURE:
1. Greeting & Thank You:
"Hello [First Name]," followed by a brief thank you acknowledging their reply.

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

TARGET LENGTH: 140–230 words across 3–5 short paragraphs. No bolding, italics, tables, or contact links in the body or signature.

CRITICAL RULES:
1. VARIED OPENING (Do NOT start with "Hello [First Name],"):
Start naturally acknowledging their reply with their first name woven into the first sentence (e.g., "Thank you for confirming your interest in the [Role Title] opportunity, [First Name].").
2. REPLY-AWARE: If the candidate asked a question or shared notice period/compensation context in their reply, acknowledge or answer it first.
3. PERSONALIZED CV RATIONALE: Explain that reviewing their current CV is the next step to assess scale, strategic responsibility, and geographic scope behind 1–2 specific transitions in their background.
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

[Provide 7 to 9 unnumbered diagnostic paragraphs starting with a crisp diagnostic sentence like "Executive profile is too generic.", "Quantification of impact is significantly underdeveloped.", "Your current positioning understates your actual seniority.", etc., followed by specific analysis referencing actual employers/roles.]

What concerns me most

[Write one strong paragraph summarizing the 3–4 biggest shortlisting risks and how the current document undersells their true seniority.]

I look forward to receiving your updated CV.

Best regards,

${recruiterName}
Independent Executive Recruiter`,

    5: `You are ${recruiterName}, an Independent Executive Search Consultant writing a Step 5 Formal Profile Submission Confirmation.
Confirm that the candidate's updated executive CV and briefing dossier have been formally presented to client stakeholders at the target company.
- Summarize the 3 core positioning pillars emphasized in your executive cover briefing based strictly on their verified profile.
- Set clear, realistic expectations regarding stakeholder review timelines and initial video interview preparation.
- Maintain a calm, selective, white-glove executive tone.

SUBJECT FORMAT:
Executive Profile Submission | [Company Name] – [Role Title]`,

    6: `You are ${recruiterName}, an Independent Executive Search Consultant writing a Step 6 Candidate Progression & Four-Document Verification Request.
- Confirm the candidate's progression to the next interview/onboarding stage using ONLY the verified progression details provided.
- Clearly request the 4 required executive verification items tailored to the mandate:
  1. Final Updated Executive CV / Board Bio
  2. Proof of Identity & Executive Right-to-Work Verification
  3. Senior Stakeholder / Executive Reference Roster (held in strict confidence until final offer stage)
  4. Current Compensation Structure & Notice Period Verification
- Close with clear next steps and signature.

SUBJECT FORMAT:
Executive Search Progression & Verification | [Company Name] – [Role Title]`,
  };

  return prompts[step] || prompts[1];
}

async function callNativeGemini(
  apiKey: string,
  systemInstruction: string,
  userPrompt: string
): Promise<{ text: string; modelUsed: string }> {
  // Try Google's universal alias and current production models via Native REST API
  const candidateModels = [
    "gemini-flash-latest",
    "gemini-3.8-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
  ];

  const lastErrors: string[] = [];

  for (const modelName of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(
        apiKey
      )}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        lastErrors.push(`${modelName} (${res.status}): ${errBody.slice(0, 120)}`);
        continue;
      }

      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const text = parts
        .map((p: { text?: string }) => p.text || "")
        .join("")
        .trim();

      if (text && text.length > 40) {
        return { text, modelUsed: `Google ${modelName}` };
      } else {
        lastErrors.push(`${modelName}: empty payload`);
      }
    } catch (e: any) {
      lastErrors.push(`${modelName}: ${e?.message || "fetch failed"}`);
    }
  }

  throw new Error(`Gemini models failed -> ${lastErrors.join(" | ")}`);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { step, inputs } = body;
    const stepNum = Number(step) || 1;

    const geminiKey = (
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      ""
    ).trim();

    if (!geminiKey) {
      return NextResponse.json(
        {
          error:
            "Missing GEMINI_API_KEY in Vercel Environment Variables. Add GEMINI_API_KEY under Project Settings -> Environment Variables and redeploy.",
        },
        { status: 500 }
      );
    }

    const recruiter = parseRecruiterIdentity(inputs?.recruiterDetails);
    const systemInstruction = buildStepPrompt(stepNum, recruiter.name);

    const userPrompt = `
RECRUITER IDENTITY:
Name: ${recruiter.name}
Role: Independent Executive Recruiter / Search Consultant

CANDIDATE PROFILE / CV:
${inputs?.candidateProfile || "Not provided"}

${inputs?.candidateReply ? `CANDIDATE LATEST REPLY:\n${inputs.candidateReply}\n` : ""}
${inputs?.targetCompany ? `TARGET COMPANY:\n${inputs.targetCompany}\n` : ""}
${inputs?.location ? `LOCATION:\n${inputs.location}\n` : ""}
${inputs?.reportingStructure ? `REPORTING STRUCTURE:\n${inputs.reportingStructure}\n` : ""}

OPPORTUNITY / MANDATE / STEP 2 DETAILS:
${inputs?.opportunityDetails || "Select an ambitious, credible next-level executive mandate based on the candidate profile."}

${inputs?.additionalDetails ? `ADDITIONAL VERIFIED DETAILS / PROGRESSION:\n${inputs.additionalDetails}\n` : ""}

STRICT OUTPUT FORMAT REQUIREMENT:
Return your response in this EXACT structure with no commentary outside the tags:
[SUBJECT]
(Write ONLY the exact subject line here — no "Subject:" prefix)
[/SUBJECT]
[BODY]
(Write ONLY the complete email body or review here — no introductory commentary)
[/BODY]`;

    const { text: rawText, modelUsed } = await callNativeGemini(
      geminiKey,
      systemInstruction,
      userPrompt
    );

    const cleanedText = rawText
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/^```[a-z]*\n?/gim, "")
      .replace(/```$/gim, "")
      .trim();

    let subject = "";
    let messageBody = cleanedText;

    const subjectMatch = cleanedText.match(/\[SUBJECT\]([\s\S]*?)\[\/SUBJECT\]/i);
    const bodyMatch = cleanedText.match(/\[BODY\]([\s\S]*?)\[\/BODY\]/i);

    if (subjectMatch && bodyMatch) {
      subject = subjectMatch[1].replace(/^subject:\s*/i, "").trim();
      messageBody = bodyMatch[1].trim();
    } else {
      const lines = cleanedText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && l !== ",");

      if (
        lines.length > 1 &&
        (lines[0].includes("|") || lines[0].toLowerCase().startsWith("subject:"))
      ) {
        subject = lines[0].replace(/^subject:\s*/i, "").trim();
        messageBody = cleanedText.substring(cleanedText.indexOf(lines[1])).trim();
      } else {
        subject = `Confidential Executive Search | Step ${stepNum} Executive Mandate`;
        messageBody = cleanedText;
      }
    }

    if (!subject || /^[,.\s-]+$/.test(subject)) {
      subject = `Confidential Executive Search | Step ${stepNum} Executive Mandate`;
    }

    return NextResponse.json({
      subject,
      body: messageBody,
      modelUsed,
      usage: {
        prompt_tokens: Math.round(userPrompt.length / 4),
        completion_tokens: Math.round(messageBody.length / 4),
        total_tokens: Math.round((userPrompt.length + messageBody.length) / 4),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
