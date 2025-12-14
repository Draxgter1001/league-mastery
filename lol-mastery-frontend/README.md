# LoL Mastery Dashboard - Frontend

React-based web application for tracking League of Legends champion mastery progress.

## ✨ Features

- 🔍 **Search** summoners by Riot ID and region
- 📊 **Visualize** champion mastery with progress bars
- 🎯 **Filter** by mastery level and chest availability
- 🔄 **Sort** by points, level, or name
- 📦 **Track** hextech chest availability
- ⚡ **Lazy loading** for optimal performance (155 champions!)
- 📱 **Fully responsive** mobile design
- 🎨 **Smooth animations** and transitions

## 🛠️ Tech Stack

- **React 18+** with Hooks
- **Vite** for blazing-fast development
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Riot Data Dragon** for champion images

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running on \`http://localhost:8080\`

## ⚙️ Setup

### 1. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure environment (optional)

Create \`.env\` file:

\`\`\`properties

VITE_API_BASE_URL=http://localhost:8080/api

VITE_DD_VERSION=14.23.1
\`\`\`

### 3. Run development server

\`\`\`bash
npm run dev
\`\`\`

Open \`http://localhost:5173\`

## 🏗️ Project Structure

\`\`\`
src/
├── components/       # Reusable UI components
│   ├── ChampionCard.jsx
│   ├── SummonerProfile.jsx
│   ├── FilterBar.jsx
│   ├── StatsCards.jsx
│   ├── BackToTop.jsx
│   ├── LazyImage.jsx
│   ├── ErrorBoundary.jsx
│   └── ...
├── pages/           # Page components
│   └── Home.jsx
├── services/        # API integration
│   └── api.js
├── utils/           # Helper functions
│   ├── championData.js
│   └── constants.js
├── App.jsx
└── main.jsx
\`\`\`

## 🎨 Key Features

### Performance Optimizations
- **Lazy loading images** - Only loads visible champions
- **Virtual scrolling** - Smooth rendering of 155 champions
- **Memoized components** - Prevents unnecessary re-renders
- **Smart caching** - Champion data loaded once per session

### User Experience
- **Real-time search** - Filter champions as you type
- **6 sort options** - Points, level, name (asc/desc)
- **3 filter types** - Level, chest availability, search
- **Loading states** - Clear feedback during data fetching
- **Error handling** - User-friendly error messages
- **Keyboard navigation** - Fully accessible

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactive elements

## 🚀 Build for Production

\`\`\`bash
npm run build
\`\`\`

Output in \`dist/\` folder.

## 📝 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint

## 🎯 Usage

1. Enter summoner **Game Name** (e.g., "Faker")
2. Enter summoner **Tag Line** (e.g., "KR1")
3. Select **Region**
4. Click **Search**

The dashboard will display:
- Summoner profile with stats
- All champion masteries with:
    - Mastery level (color-coded 1-7)
    - Mastery points
    - Progress to next level
    - Chest availability
    - Tokens earned

## 🐛 Known Issues

- Development API keys expire every 24 hours
- Riot API rate limits: 20 req/sec, 100 req/2min

## 👤 Author

Tafshi Uthshow Hoque - [GitHub](https://github.com/Draxgter1001)