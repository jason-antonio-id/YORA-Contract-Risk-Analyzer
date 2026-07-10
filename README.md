# QianYue AI (千约 AI) - Google Gemini Integration

This application provides intelligent legal risk assessment for international commercial agreements in the Indonesian market, powered by Google Gemini AI.

## Setup Instructions

### 1. Get Google Gemini API Key
- Go to [Google AI Studio](https://aistudio.google.com/).
- Sign in with your Google account.
- Click **"Get API key"** in the sidebar.
- Create a new API key in a new project or select an existing one.

### 2. Configure Environment Variables
- In your development environment, rename `.env.example` to `.env`.
- Set `GEMINI_API_KEY` to your actual API key:
  ```env
  GEMINI_API_KEY=AIzaSy...
  ```
- **AI Studio Users:** No need to edit `.env`. Go to the **Secrets** panel in the AI Studio UI and add a secret named `GEMINI_API_KEY` with your key value.

### 3. Usage
- Once configured, the application will automatically use the Gemini API for contract analysis and smart Q&A.
- No further code changes are required.

## Key Features
- **Contract Risk Analyzer:** Scans Indonesian contracts for legal risks.
- **Red Flag Alerts:** Identifies high-risk clauses with legal references.
- **Smart Q&A:** Interactive chat to ask follow-up questions about the contract.
- **Bilingual Support:** Full support for English and Simplified Mandarin.
- **Mobile Responsive:** Optimized for both desktop and mobile viewing.

## Powered By
This application is powered by **Google Gemini 2.0 Flash**.
