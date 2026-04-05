import { env } from "@/config/env";

export const ANALYSIS_PROMPT = env.aiAnalysisPrompt;
export const PLAN_GENERATION_PROMPT = env.aiPlanGenerationPrompt;
export const BRANDING_PROMPT = env.aiBrandingPrompt;

export function getNameEvaluationSection(projectName?: string | null, language?: string): string {
  const lang = language || "English";

  if (projectName) {
    return `### [Translate "Name Evaluation" to ${lang}]: "${projectName}"

[Translate and complete in ${lang}]:

**[Strengths in ${lang}]:**
- [2-3 specific strengths of this name in relation to the positioning]
- [Consider memorability, pronunciation, domain availability implications]
- [Alignment with target audience]

**[Considerations in ${lang}]:**
- [2-3 potential limitations or challenges]
- [SEO/marketing considerations]
- [Scalability/international considerations if relevant]

**[Overall Assessment in ${lang}]:**
[Provide clear recommendation: Is this name strong for the concept? Any suggested adjustments or variants?]

---`;
  } else {
    return `### [Translate "Naming Recommendations" to ${lang}]

[Write entirely in ${lang}. Based on the positioning and target audience, here are recommended name options:]

#### [Option 1 in ${lang}]: [Proposed Name]
- **[Positioning alignment in ${lang}]**: [How it reflects the brand positioning]
- **[Meaning/Origin in ${lang}]**: [What it means and why it works]
- **[Strengths in ${lang}]**: [2-3 key advantages]
- **[Domain availability in ${lang}]**: [.com likely available / check - do not guarantee]

#### [Option 2 in ${lang}]: [Proposed Name]
- **[Positioning alignment in ${lang}]**: [How it reflects the brand positioning]
- **[Meaning/Origin in ${lang}]**: [What it means and why it works]
- **[Strengths in ${lang}]**: [2-3 key advantages]
- **[Domain availability in ${lang}]**: [.com likely available / check - do not guarantee]

#### [Option 3 in ${lang}]: [Proposed Name]
- **[Positioning alignment in ${lang}]**: [How it reflects the brand positioning]
- **[Meaning/Origin in ${lang}]**: [What it means and why it works]
- **[Strengths in ${lang}]**: [2-3 key advantages]
- **[Domain availability in ${lang}]**: [.com likely available / check - do not guarantee]

**[Recommended Choice in ${lang}]**: [Which option and comprehensive reasoning based on memorability, positioning fit, and market context]

---`;
  }
}