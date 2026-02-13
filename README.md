# SparkPlan ✨

**Transform your business ideas into professional plans with AI**

SparkPlan is a Next.js web application that uses Google Gemini AI to generate comprehensive business plans. Describe your idea in any language and get a complete business plan with strategic analysis, market research, financial projections, and branding recommendations in seconds.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-Flash-4285F4?logo=google)](https://ai.google.dev/)

---

## 🚀 Features

### **AI-Powered Generation**
- ✅ **Google Gemini AI**: Advanced language model for high-quality business plans
- ✅ **Automatic Language Detection**: Write in any language, get the plan in that language
- ✅ **Comprehensive Plans**: Executive summary, market analysis, financial projections, go-to-market strategy, and more
- ✅ **Brand Identity Recommendations**: Colors, typography, visual guidelines, and naming suggestions

### **User Experience**
- ✅ **Google Authentication**: Secure OAuth 2.0 login with NextAuth.js
- ✅ **PDF Export**: Download plans as professionally formatted PDFs with proper page breaks
- ✅ **Google Drive Integration**: Save plans directly to your Drive with one click
- ✅ **Plan History**: Access all your previous plans (PLUS/PRO users)
- ✅ **Dark/Light Theme**: System-aware theme with manual toggle
- ✅ **Multilingual Interface**: Available in English and Spanish
- ✅ **Responsive Design**: Optimized for desktop, tablet, and mobile

### **Subscription Plans**
- 🆓 **FREE**: 1 free business plan (lifetime)
- 💎 **PLUS**: 30 plans per month
- 🚀 **PRO**: 100 plans per month

### **Technical**
- ✅ **Type-Safe**: Full TypeScript coverage with strict mode
- ✅ **Tested**: Comprehensive test suite with Vitest
- ✅ **Clean Code**: Following SOLID principles and best practices

---

## 🛠️ Tech Stack

### **Framework & Language**
- [Next.js 16](https://nextjs.org) - React framework with App Router
- [TypeScript 5](https://www.typescriptlang.org/) - Type-safe JavaScript
- [React 19](https://react.dev) - UI library

### **AI & APIs**
- [Google Gemini API](https://ai.google.dev/) - AI-powered plan generation
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Google Drive API](https://developers.google.com/drive) - Cloud storage

### **Database**
- [Supabase](https://supabase.com/) - PostgreSQL database with authentication

### **Styling & UI**
- [SCSS Modules](https://sass-lang.com/) - Component-scoped styles
- [next-themes](https://github.com/pacocoursey/next-themes) - Dark mode support
- [Lucide Icons](https://lucide.dev) - Icon library

### **Internationalization**
- [next-intl](https://next-intl-docs.vercel.app/) - i18n for Next.js

### **PDF Generation**
- [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) - HTML to PDF with page break support
- [html2canvas](https://html2canvas.hertzen.com/) - HTML rendering

### **Testing**
- [Vitest](https://vitest.dev/) - Unit testing
- [React Testing Library](https://testing-library.com/react) - Component testing

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18 or higher
- npm or yarn
- Google Cloud Console project with OAuth 2.0 credentials
- Google AI API key (Gemini)
- Supabase account and project

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/sparkplan.git
cd sparkplan
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Configure `.env.local`**
   
Edit `.env.local` with your credentials:
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google AI (Gemini)
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional: Custom AI Prompts
AI_ANALYSIS_PROMPT="Your custom analysis prompt..."
AI_PLAN_GENERATION_PROMPT="Your custom plan generation prompt..."
AI_BRANDING_PROMPT="Your custom branding prompt..."
```

5. **Set up Supabase**

Create the necessary tables in your Supabase project. You'll need:
- `users` table for user management
- `business_plans` table for storing plans

Refer to Supabase documentation for setting up Row Level Security policies.

6. **Run development server**
```bash
npm run dev
```

7. **Open browser**
```
http://localhost:3000
```

---

## 🔑 Environment Variables

### **Required Variables**

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Generate: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | [Google Cloud Console](https://console.cloud.google.com/) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | [Google Cloud Console](https://console.cloud.google.com/) |
| `GOOGLE_AI_API_KEY` | Google AI API Key (Gemini) | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | [Supabase Dashboard](https://supabase.com/dashboard) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | [Supabase Dashboard](https://supabase.com/dashboard) |

### **Optional Variables**

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXTAUTH_URL` | Base URL of the app | `http://localhost:3000` |
| `AI_ANALYSIS_PROMPT` | Custom analysis prompt | Built-in strategic analysis |
| `AI_PLAN_GENERATION_PROMPT` | Custom plan prompt | Built-in business plan |
| `AI_BRANDING_PROMPT` | Custom branding prompt | Built-in brand strategy |

---

## 📖 How It Works

1. **Sign in** with your Google account
2. **Describe your business idea** (minimum 50 characters, any language)
3. **AI generates your plan** with:
   - Executive Summary
   - Value Proposition
   - Market Analysis
   - Business Model Options
   - Competitive Analysis
   - Go-to-Market Strategy
   - Operations Plan
   - Financial Projections (3 years)
   - Risk Analysis & Mitigation
   - Validation Roadmap
   - Brand Identity & Recommendations
4. **Download as PDF** or **save to Google Drive**
5. **Access your plan history** (PLUS/PRO users)

---

## 🧪 Testing
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Coverage thresholds:**
- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

---

## 📦 Building for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 🔒 Security

- ✅ Environment variables validated at build time
- ✅ CSRF protection via NextAuth.js
- ✅ Secure session handling with HTTP-only cookies
- ✅ Row Level Security in Supabase
- ✅ OAuth 2.0 authentication
- ✅ No vulnerabilities in dependencies

**Audit dependencies:**
```bash
npm audit
```

---

## 🌍 Internationalization

### **Interface Languages**
- 🇬🇧 English
- 🇪🇸 Spanish

### **AI Content Languages**
The AI automatically detects your input language and generates the entire business plan in that same language. Write in Spanish, English, French, or any other language.

### **Add a New Interface Language**

1. Create translation file:
```bash
touch messages/fr.json
```

2. Copy structure from `messages/en.json` and translate

3. Update configuration:
```typescript
// src/config/i18n.ts
export const locales = ['en', 'es', 'fr'] as const;
```

---

## 🎨 Design System

SparkPlan uses CSS variables for consistent theming:

### **Light Mode**
- Background: `#ffffff`
- Text: `#1a1a1a`
- Primary: `#0066cc`
- Surface: `#f8f9fa`

### **Dark Mode**
- Background: `#0f172a`
- Text: `#e5e7eb`
- Primary: `#0066cc`
- Surface: `#1e293b`

The theme automatically adapts to system preferences and can be manually toggled.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
```bash
   git checkout -b feature/amazing-feature
```
3. **Make your changes**
4. **Run tests**
```bash
   npm run test
   npm run build
```
5. **Commit your changes**
```bash
   git commit -m 'Add amazing feature'
```
6. **Push to branch**
```bash
   git push origin feature/amazing-feature
```
7. **Open a Pull Request**

### **Code Guidelines**

- Follow Clean Code principles
- Use TypeScript strict mode
- Write descriptive function names
- Keep functions small and focused
- Add tests for new features
- Follow existing code style

---

## 📝 Project Structure
```
sparkplan/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Libraries and utilities
│   │   ├── ai-service/      # AI plan generation
│   │   └── supabase/        # Database operations
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript types
│   └── config/              # Configuration
├── messages/                # i18n translations
├── public/                  # Static assets
└── tests/                   # Test files
```

---

## 🐛 Troubleshooting

### **PDF displays with dark background**

PDFs are always generated in light mode. If you see issues:
- Clear browser cache
- Try downloading again

### **Google Drive upload fails**

Ensure:
- Google Drive API is enabled in Google Cloud Console
- OAuth consent screen includes Drive scope
- You granted permissions when signing in

### **Plans not appearing in history**

- FREE users don't have access to plan history
- Only PLUS and PRO users can save and view past plans

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React Framework
- [Google Gemini](https://ai.google.dev/) - AI Technology
- [Supabase](https://supabase.com) - Backend Platform
- [Lucide Icons](https://lucide.dev) - Icon Library

---

**Built with ❤️ using Next.js, TypeScript, and Google Gemini AI**