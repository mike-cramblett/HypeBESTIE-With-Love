import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { getUserCredits, getUserCreditInfo, decrementUserCredits, getDb, saveDb } from './server/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Serve static assets directory
const assetsDir = path.join(process.cwd(), 'assets');
if (fs.existsSync(assetsDir)) {
  app.use('/assets', express.static(assetsDir));
}
const publicDir = path.join(process.cwd(), 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

// Cached Demo Scan Data
const CACHED_DEMO_RESULT = {
  styleName: 'CYBER-GLOW MAIN CHARACTER SUPREME',
  'MCE%': '99.9%',
  biometricSpecs: [
    '> OPTICAL CHARISMA: 99.9% MAXIMUM GRAVITATIONAL PULL',
    '> CHROMATIC AURA: ULTRA-VIBRANT RADIANCE DETECTED',
    '> SYMMETRY INDEX: STATISTICALLY UNPARALLELED STAR POWER',
    '> THERMAL SIGNATURE: 100% PURE MAIN CHARACTER ENERGY',
  ],
  hypeText:
    'OBSESSED isn’t even a strong enough word! ✨ The camera angle, the effortless composure, and that radiant glow—literally every pixel is serving superstar energy 🔥 Mathematical proof that you were built to headline the movie of your life 💅 No notes, just pure iconic bestie perfection! 💖👑',
};

// 0. GET /api/demo-scan (Simulated zero-credit demo scan)
app.get('/api/demo-scan', (req, res) => {
  res.json({
    success: true,
    isDemo: true,
    scanResult: CACHED_DEMO_RESULT,
    creditsRemaining: null,
  });
});

// Helper to get userId from Authorization header
function getUserIdFromReq(req: express.Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) return token;
  }
  return 'default-anon-user';
}

// 1. GET /api/credits
app.get('/api/credits', async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const { creditsRemaining, maxCredits } = await getUserCreditInfo(userId);
    res.json({ userId, creditsRemaining, maxCredits });
  } catch (error: any) {
    console.error('Error fetching credits:', error);
    res.status(500).json({ error: 'Failed to fetch credit balance' });
  }
});

// 2. POST /api/scan
app.post('/api/scan', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', isDemo, targetType = 'self', friendName = '' } = req.body;

    // Zero-credit instant simulated scan for demo mode
    if (isDemo) {
      return res.json({
        success: true,
        isDemo: true,
        scanResult: {
          ...CACHED_DEMO_RESULT,
          targetType,
          friendName: targetType === 'friend' ? (friendName || 'Bestie') : undefined,
        },
        creditsRemaining: null,
      });
    }

    const userId = getUserIdFromReq(req);
    const creditsRemaining = await getUserCredits(userId);

    if (creditsRemaining <= 0) {
      return res.status(429).json({
        error: "You've reached today's 25 hype scan limit! Your daily quota resets at midnight.",
        creditsRemaining: 0,
      });
    }

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided for scanning' });
    }

    // Strip base64 prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Read persona prompt dynamically on request execution
    const promptPath = path.join(process.cwd(), 'server', 'prompts', 'hype_persona.txt');
    let personaPrompt = '';
    try {
      personaPrompt = fs.readFileSync(promptPath, 'utf-8');
    } catch (e) {
      console.error('Failed to read hype_persona.txt prompt:', e);
      personaPrompt = `You are HypeBESTIE. Inspect the image and give effusive hype validation, MCE%, style name, 4 biometric specs starting with '> ', and a hype paragraph mentioning 3 specific visual details.`;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const imagePart = {
      inlineData: {
        mimeType,
        data: cleanBase64,
      },
    };

    let contextDirective = '';
    if (targetType === 'friend') {
      const sanitizedName = friendName.trim() || 'their cherished friend';
      contextDirective = `\n\nSPECIAL MISSION - COMPLIMENT FOR A FRIEND:\nThe user uploaded a photo of their friend (${sanitizedName}). You are generating a heart-melting, high-dopamine hype compliment and receipt specifically dedicated to their friend ${sanitizedName} so they can send it to them via email or Instagram! Make ${sanitizedName} feel unconditionally celebrated, seen, and treasured.`;
    }

    const textPart = {
      text: `${personaPrompt}${contextDirective}\n\nInspect this image and generate the HypeBESTIE analysis json payload according to the schema.`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            styleName: {
              type: Type.STRING,
              description: 'Catchy aesthetic archetype name',
            },
            'MCE%': {
              type: Type.STRING,
              description: 'Main Character Energy percentage string',
            },
            biometricSpecs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Array of EXACTLY 4 technical sci-fi diagnostic strings starting with > ',
            },
            hypeText: {
              type: Type.STRING,
              description: 'Full uncut validation paragraph mentioning 3+ visual details',
            },
          },
          required: ['styleName', 'MCE%', 'biometricSpecs', 'hypeText'],
        },
      },
    });

    const rawText = response.text || '{}';
    let scanResult;
    try {
      scanResult = JSON.parse(rawText);
      scanResult.targetType = targetType;
      if (targetType === 'friend') {
        scanResult.friendName = friendName.trim() || 'Friend';
      }
    } catch (e) {
      console.error('Failed to parse Gemini JSON response:', rawText);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    // Decrement credit atomically on success
    const newCredits = await decrementUserCredits(userId);

    return res.json({
      success: true,
      scanResult,
      creditsRemaining: newCredits,
    });
  } catch (error: any) {
    console.error('Scan API error:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during scanning' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
