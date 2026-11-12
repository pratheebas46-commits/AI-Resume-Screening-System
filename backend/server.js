require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { resumeDb, feedbackDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// ─── Multer File Upload ────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only PDF, DOC, DOCX files are allowed'));
  },
});

// ─── File Upload Endpoint ──────────────────────────────────────────────────────
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const file_url = `/uploads/${req.file.filename}`;
  res.json({ file_url, original_name: req.file.originalname });
});

// ─── LLM Endpoint ─────────────────────────────────────────────────────────────
app.post('/api/llm', async (req, res) => {
  try {
    const { prompt, file_urls, response_json_schema } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(503).json({
        error: 'GEMINI_API_KEY not configured. Please add it to backend/.env'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const parts = [];

    // If there are file URLs, read file content and include as text
    if (file_urls && file_urls.length > 0) {
      for (const fileUrl of file_urls) {
        // fileUrl is like /uploads/filename.pdf
        const filename = fileUrl.replace(/^\/uploads\//, '');
        const filePath = path.join(UPLOADS_DIR, filename);

        if (fs.existsSync(filePath)) {
          const ext = path.extname(filename).toLowerCase();
          
          if (ext === '.pdf') {
            // Send PDF as inline data to Gemini
            const fileData = fs.readFileSync(filePath);
            const base64Data = fileData.toString('base64');
            parts.push({
              inlineData: {
                data: base64Data,
                mimeType: 'application/pdf'
              }
            });
          } else if (ext === '.docx' || ext === '.doc') {
            // For doc/docx, read as binary and send as base64
            const fileData = fs.readFileSync(filePath);
            const base64Data = fileData.toString('base64');
            parts.push({
              inlineData: {
                data: base64Data,
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              }
            });
          }
        }
      }
    }

    // Add the text prompt
    if (response_json_schema) {
      parts.push({
        text: prompt + '\n\nIMPORTANT: Respond ONLY with valid JSON that matches this schema: ' + JSON.stringify(response_json_schema)
      });
    } else {
      parts.push({ text: prompt });
    }

    const result = await model.generateContent(parts);
    const text = result.response.text();

    if (response_json_schema) {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json(parsed);
        } catch (e) {
          console.error('Failed to parse JSON response:', text);
          return res.status(500).json({ error: 'LLM returned invalid JSON', raw: text });
        }
      }
      return res.status(500).json({ error: 'No JSON found in LLM response', raw: text });
    }

    res.json(text);
  } catch (err) {
    console.error('LLM error:', err);
    res.status(500).json({ error: err.message || 'LLM request failed' });
  }
});

// ─── Resume Endpoints ──────────────────────────────────────────────────────────
app.get('/api/resumes', (req, res) => {
  const { order = '-created_date', limit = 100 } = req.query;
  const resumes = resumeDb.list(order, parseInt(limit));
  res.json(resumes);
});

app.get('/api/resumes/:id', (req, res) => {
  const resume = resumeDb.get(req.params.id);
  if (!resume) return res.status(404).json({ error: 'Not found' });
  res.json(resume);
});

app.post('/api/resumes', (req, res) => {
  try {
    const resume = resumeDb.create(req.body);
    res.status(201).json(resume);
  } catch (err) {
    console.error('Create resume error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/resumes/:id', (req, res) => {
  const resume = resumeDb.update(req.params.id, req.body);
  if (!resume) return res.status(404).json({ error: 'Not found' });
  res.json(resume);
});

app.delete('/api/resumes/:id', (req, res) => {
  resumeDb.delete(req.params.id);
  res.json({ success: true });
});

// ─── Feedback Endpoints ────────────────────────────────────────────────────────
app.get('/api/feedbacks', (req, res) => {
  const { order = '-created_date', limit = 50 } = req.query;
  const feedbacks = feedbackDb.list(order, parseInt(limit));
  res.json(feedbacks);
});

app.post('/api/feedbacks', (req, res) => {
  try {
    const feedback = feedbackDb.create(req.body);
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/feedbacks/:id', (req, res) => {
  feedbackDb.delete(req.params.id);
  res.json({ success: true });
});

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', gemini: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 AI Resume Screening Backend running on http://localhost:${PORT}`);
  const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
  if (hasKey) {
    console.log('✅ Gemini API key configured — AI features enabled');
  } else {
    console.log('⚠️  GEMINI_API_KEY not set — AI analysis will not work');
    console.log('   Add your key to backend/.env and restart the server');
  }
});
