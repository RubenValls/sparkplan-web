# SparkPlan ✨

**Transform your ideas into actionable business plans with AI**

SparkPlan is a Next.js web application that leverages OpenAI's GPT-4 to generate professional business plans from user ideas. Plans are automatically saved to Google Drive and available for download as PDF.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)

---

## 🚀 Features

- ✅ **AI-Powered Generation**: Uses OpenAI GPT-4o-mini for high-quality business plans
- ✅ **Google Authentication**: Secure OAuth 2.0 login with NextAuth.js
- ✅ **Google Drive Integration**: Automatic saving of plans to user's Drive
- ✅ **PDF Export**: Download plans as professionally formatted PDFs
- ✅ **Multilingual Support**: English and Spanish interface (i18n)
- ✅ **Dark/Light Theme**: System-aware theme with manual toggle
- ✅ **Responsive Design**: Optimized for desktop and mobile
- ✅ **Type-Safe**: Full TypeScript coverage with strict mode
- ✅ **Tested**: Comprehensive test suite with Vitest

---

## 🛠️ Tech Stack

### **Framework & Language**
- [Next.js 16](https://nextjs.org) - React framework with App Router
- [TypeScript 5](https://www.typescriptlang.org/) - Type safety
- [React 19](https://react.dev) - UI library

### **Authentication & APIs**
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [OpenAI API](https://platform.openai.com/) - AI plan generation
- [Google Drive API](https://developers.google.com/drive) - File storage

### **Styling**
- [SCSS Modules](https://sass-lang.com/) - Component-scoped styles
- [next-themes](https://github.com/pacocoursey/next-themes) - Dark mode

### **Internationalization**
- [next-intl](https://next-intl-docs.vercel.app/) - i18n for Next.js

### **PDF Generation**
- [jsPDF 4](https://github.com/parallax/jsPDF) - PDF creation
- [html2canvas](https://html2canvas.hertzen.com/) - HTML to canvas

### **Testing**
- [Vitest](https://vitest.dev/) - Unit testing
- [React Testing Library](https://testing-library.com/react) - Component testing

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ and npm
- Google Cloud Console project with OAuth 2.0 credentials
- OpenAI API key

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
```bash
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-here
   
   # Google OAuth (from Google Cloud Console)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # OpenAI
   OPENAI_API_KEY=your-openai-api-key
   
   # Optional: Custom AI prompt
   AI_SYSTEM_PROMPT="You are a professional business plan generator..."
```

5. **Run development server**
```bash
   npm run dev
```

6. **Open browser**
```
   http://localhost:3000
```

---

## 🔑 Environment Variables

See `.env.example` for all available variables.

### **Required Variables**

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Generate with: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | [Google Cloud Console](https://console.cloud.google.com/) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | [Google Cloud Console](https://console.cloud.google.com/) |
| `OPENAI_API_KEY` | OpenAI API Key | [OpenAI Platform](https://platform.openai.com/api-keys) |

### **Optional Variables**

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXTAUTH_URL` | Base URL of the app | `http://localhost:3000` |
| `AI_SYSTEM_PROMPT` | Custom system prompt for AI | Built-in professional prompt |

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

- ✅ All environment variables validated at build time
- ✅ CSRF protection via NextAuth.js
- ✅ Secure session handling with HTTP-only cookies
- ✅ No vulnerabilities in dependencies

**Audit dependencies:**
```bash
npm audit
```

---

## 🌍 Internationalization

SparkPlan currently supports:
- 🇬🇧 English
- 🇪🇸 Spanish

**Add a new language:**

1. Create translation file in `src/locales/`:
```bash
   touch src/locales/fr.json
```

2. Copy structure from `src/locales/en.json` and translate

3. Update `src/config/i18n.ts`:
```typescript
   import fr from "@/locales/fr.json";
   
   export const languages = {
     en,
     es,
     fr, // Add new language
   };
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Before submitting:**
- ✅ Run tests: `npm run test`
- ✅ Check types: `npm run build`

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React Framework
- [OpenAI](https://openai.com) - AI technology
- [Lucide Icons](https://lucide.dev) - Beautiful icons

---

**Made with ❤️ using Next.js and OpenAI**