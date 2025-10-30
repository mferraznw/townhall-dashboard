# Coca-Cola Townhall Insights Dashboard

A comprehensive AI-powered analytics dashboard for analyzing global townhall meetings. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🏠 Dashboard Home
- Real-time statistics and metrics
- Quick access to all features
- Recent activity overview
- Global engagement insights

### 📈 Trend Analysis
- Emerging topic identification
- Sentiment momentum tracking
- Meeting frequency analysis
- Novelty score calculations

### 👥 Speaker Insights
- Speaker engagement metrics
- Sentiment analysis by speaker
- Department and region breakdown
- Exemplar quotes and key insights

### 💬 Utterances Search
- Full-text search across all speech segments
- Advanced filtering by speaker, department, region, sentiment
- Real-time search capabilities
- Content analysis and topic extraction

### 🤖 AI Assistant
- Natural language query interface
- Intelligent insights generation
- Context-aware responses
- Integration with Azure OpenAI

## Technology Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Icons**: Lucide React
- **Charts**: Recharts
- **Backend**: Azure Functions (Python)
- **AI Services**: Azure OpenAI, Azure AI Language
- **Search**: Azure AI Search
- **Storage**: Azure Data Lake Storage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Azure Function App running locally (port 7071)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:7071
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Azure Function App Setup

Make sure your Azure Function App is running locally:

```bash
cd ../townhall_insights_functionapp
func start
```

The dashboard will automatically connect to the local Function App at `http://localhost:7071`.

## Project Structure

```
project/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Dashboard home
│   ├── trends/            # Trend analysis page
│   ├── speakers/           # Speaker insights page
│   ├── utterances/         # Utterances search page
│   ├── chat/              # AI assistant page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utilities and API client
│   ├── api.ts           # Azure Functions API client
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

## API Integration

The dashboard integrates with the Azure Functions backend through a comprehensive API client:

- **Chat API**: `/chat/query` - AI-powered question answering
- **Trends API**: `/insights/trends` - Topic trend analysis
- **Speakers API**: `/insights/speakers` - Speaker engagement metrics
- **Utterances API**: `/insights/utterances` - Speech segment search

## Features Overview

### Dashboard Home
- **Statistics Cards**: Total topics, active speakers, average sentiment, meetings held
- **Quick Actions**: Direct links to all major features
- **Recent Activity**: Top trends and most active speakers
- **Global Overview**: Meeting frequency, global reach, engagement metrics

### Trend Analysis
- **Topic Discovery**: Identify emerging discussion topics
- **Sentiment Tracking**: Monitor sentiment changes over time
- **Momentum Analysis**: Track topic momentum (up/down/flat)
- **Novelty Scoring**: Measure topic freshness and innovation

### Speaker Insights
- **Engagement Metrics**: Track speaker participation and mentions
- **Sentiment Analysis**: Individual speaker sentiment scores
- **Geographic Analysis**: Department and region breakdown
- **Quote Extraction**: Key quotes and exemplar statements

### Utterances Search
- **Full-Text Search**: Search across all speech content
- **Advanced Filtering**: Filter by speaker, department, region, sentiment
- **Content Analysis**: Topic extraction and sentiment scoring
- **Time-based Search**: Find content by meeting and timestamp

### AI Assistant
- **Natural Language**: Ask questions in plain English
- **Context Awareness**: Maintains conversation context
- **Intelligent Responses**: Powered by Azure OpenAI
- **Data Integration**: Accesses all dashboard data sources

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Code Structure

The dashboard follows Next.js 13 app directory conventions:

- **Server Components**: Default for static content
- **Client Components**: For interactive features (marked with `'use client'`)
- **API Routes**: Backend integration through API client
- **Component Library**: Reusable UI components with Radix UI

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Custom Components**: Dashboard-specific components
- **Responsive Design**: Mobile-first approach

## Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Configuration

For production deployment, update the API URL:

```bash
NEXT_PUBLIC_API_URL=https://your-function-app.azurewebsites.net
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please contact the development team or create an issue in the repository.






