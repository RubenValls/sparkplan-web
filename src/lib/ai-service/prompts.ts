import { env } from "@/config/env";

export const ANALYSIS_PROMPT = env.aiAnalysisPrompt;
export const PLAN_GENERATION_PROMPT = env.aiPlanGenerationPrompt;
export const BRANDING_PROMPT = env.aiBrandingPrompt;

export function getNameEvaluationSection(projectName?: string | null): string {
  if (projectName) {
    return `### Name Evaluation: "${projectName}"

**Strengths:**
- [2-3 specific strengths of this name in relation to the positioning]
- [Consider memorability, pronunciation, domain availability implications]
- [Alignment with target audience]

**Considerations:**
- [2-3 potential limitations or challenges]
- [SEO/marketing considerations]
- [Scalability/international considerations if relevant]

**Overall Assessment:**
[Provide clear recommendation: Is this name strong for the concept? Any suggested adjustments or variants?]

---`;
  } else {
    return `### Naming Recommendations

Based on the positioning and target audience, here are recommended name options:

#### Option 1: [Proposed Name]
- **Positioning alignment**: [How it reflects the brand positioning]
- **Meaning/Origin**: [What it means and why it works]
- **Strengths**: [2-3 key advantages]
- **Domain availability**: [.com likely available / check - do not guarantee]

#### Option 2: [Proposed Name]
- **Positioning alignment**: [How it reflects the brand positioning]
- **Meaning/Origin**: [What it means and why it works]
- **Strengths**: [2-3 key advantages]
- **Domain availability**: [.com likely available / check - do not guarantee]

#### Option 3: [Proposed Name]
- **Positioning alignment**: [How it reflects the brand positioning]
- **Meaning/Origin**: [What it means and why it works]
- **Strengths**: [2-3 key advantages]
- **Domain availability**: [.com likely available / check - do not guarantee]

**Recommended Choice**: [Which option and comprehensive reasoning based on memorability, positioning fit, and market context]

---`;
  }
}