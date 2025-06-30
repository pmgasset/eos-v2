# EOS Platform - Modular Architecture

A comprehensive EOS (Entrepreneurial Operating System) management platform built with React and Cloudflare Workers.

## 🚀 Features

- **Dashboard** - Overview of key metrics and KPIs
- **Scorecard** - Track company vital signs
- **Rocks** - Manage 90-day priorities  
- **Issues List** - Identify, discuss, and solve issues
- **V/TO** - Vision/Traction Organizer
- **L10 Meetings** - Level 10 meeting management
- **People Analyzer** - GWC assessment for team members
- **Integrations** - GoHighLevel CRM integration with EOS filtering

## 🏗️ Architecture

This application uses a modular architecture with:

- **React Context** for state management
- **Custom hooks** for reusable logic
- **Component-based** architecture
- **Service layer** for API abstraction
- **Utility functions** for common operations

## 📁 Project Structure
src/
├── components/          # React components organized by feature
├── context/            # React Context and reducers
├── hooks/              # Custom React hooks
├── services/           # API and external service integrations
├── utils/              # Utility functions and constants
└── styles/             # CSS styles

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
🌐 Deployment
The frontend deploys to Cloudflare Pages and connects to Cloudflare Workers for the backend API.
🔗 GoHighLevel Integration
The platform integrates with GoHighLevel CRM and only syncs contacts and opportunities tagged with 'EOS' for better data management.
📄 License
MIT License

---

## 🚀 Setup Instructions

1. **Create a new repository** on GitHub
2. **Clone the repository** locally
3. **Create the folder structure** as shown above
4. **Copy each file content** into the appropriate files
5. **Install dependencies**: `npm install`
6. **Test the build**: `npm run build`
7. **Push to GitHub**: `git add . && git commit -m "Initial modular structure" && git push`

This modular structure will make your EOS platform much easier to maintain, debug, and extend in the future!