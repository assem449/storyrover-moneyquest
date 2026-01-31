# StoryRover: Money Quest

An AI-powered interactive financial literacy robot for kids using Gemini AI and ElevenLabs.

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API Key
- ElevenLabs API Key (optional for hardware)

### Installation

1. **Extract the zip file**
```bash
cd storyrover-money-quest
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Configure API Keys**

Create `.env` file in `/backend` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
RASPBERRY_PI_URL=http://192.168.1.50:5000
PORT=3001
```

Create `.env` file in `/frontend` directory:
```env
VITE_API_URL=http://localhost:3001
```

4. **Start Development Servers**

Option A - Start both frontend and backend together:
```bash
npm run dev
```

Option B - Start separately:
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Project Structure

```
storyrover-money-quest/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── services/    # API services
│   │   ├── App.tsx      # Main app component
│   │   └── main.tsx     # Entry point
│   └── package.json
├── backend/           # NestJS application
│   ├── src/
│   │   ├── adventure/   # Adventure module
│   │   ├── gemini/      # Gemini AI service
│   │   ├── hardware/    # Hardware communication
│   │   └── main.ts      # Entry point
│   └── package.json
└── README.md
```

## How to Use

1. **Start Adventure**: Click the "Start New Adventure" button
2. **Read Scenario**: AI generates a financial scenario for the child
3. **Make Choice**: Click one of three options (Spend/Save/Invest)
4. **Watch Robot**: The robot moves to the corresponding zone
5. **See Consequence**: AI reveals what happened based on the choice
6. **Continue Learning**: Keep making decisions and learning!

## 🔧 Hardware Integration

The backend automatically sends commands to the Raspberry Pi at the URL configured in `.env`.

Expected Raspberry Pi endpoints:
- `POST /command` - Receives movement and speech commands

Example command payload:
```json
{
  "text": "You chose to save your money!",
  "zone": "blue",
  "emotion": "happy"
}
```

## Wealthsimple Branding

The app uses Wealthsimple's color scheme:
- Primary: #191919 (Black)
- Accent: #FFD700 (Gold)
- Zones: Red (Spend), Blue (Save), Yellow (Invest)

## Hackathon Features

✅ **Gemini 1.5 Integration** - Real-time scenario generation  
✅ **Interactive Dashboard** - Kid-friendly UI  
✅ **Financial Education** - Age-appropriate money lessons  
✅ **Hardware Ready** - Connects to Raspberry Pi robot  
✅ **ElevenLabs Ready** - Voice synthesis integration on Pi  
✅ **Wealthsimple Theme** - Professional branding  

## 📊 API Endpoints

### Backend (http://localhost:3001)

- `POST /adventure/start` - Start a new adventure
- `POST /adventure/choice` - Submit a choice
- `GET /adventure/status` - Get current status
- `POST /hardware/test` - Test hardware connection

## Troubleshooting

**Backend won't start:**
- Check if `.env` file exists in `/backend`
- Verify GEMINI_API_KEY is set
- Make sure port 3001 is available

**Frontend can't connect:**
- Check if backend is running
- Verify VITE_API_URL in `/frontend/.env`
- Check browser console for errors

**Hardware not responding:**
- Verify Raspberry Pi IP address in backend `.env`
- Check if Pi is on same network
- Test Pi endpoint manually with curl

## Built With

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: NestJS, TypeScript
- **AI**: Google Gemini 1.5
- **Voice**: ElevenLabs (on Raspberry Pi)
- **Hardware**: Raspberry Pi, Arduino, Sumobot

## Team

- **Software Lead**: Assem 
- **Hardware Lead**: Aruzhan
