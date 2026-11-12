const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, 'data.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create Resume table
db.exec(`
  CREATE TABLE IF NOT EXISTS resumes (
    id TEXT PRIMARY KEY,
    candidate_name TEXT NOT NULL,
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    job_role TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT DEFAULT '',
    skills TEXT DEFAULT '[]',
    matched_skills TEXT DEFAULT '[]',
    missing_skills TEXT DEFAULT '[]',
    score REAL DEFAULT 0,
    education TEXT DEFAULT '',
    experience TEXT DEFAULT '',
    summary TEXT DEFAULT '',
    status TEXT DEFAULT 'processing',
    created_date TEXT DEFAULT (datetime('now'))
  )
`);

// Create Feedback table
db.exec(`
  CREATE TABLE IF NOT EXISTS feedbacks (
    id TEXT PRIMARY KEY,
    rating REAL NOT NULL,
    comment TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    created_date TEXT DEFAULT (datetime('now'))
  )
`);

// Helper to parse JSON arrays stored as text
const parseResume = (row) => {
  if (!row) return null;
  return {
    ...row,
    skills: JSON.parse(row.skills || '[]'),
    matched_skills: JSON.parse(row.matched_skills || '[]'),
    missing_skills: JSON.parse(row.missing_skills || '[]'),
  };
};

// Resume CRUD
const resumeDb = {
  list: (orderBy = '-created_date', limit = 100) => {
    const col = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
    const dir = orderBy.startsWith('-') ? 'DESC' : 'ASC';
    const safeCol = ['created_date', 'score', 'candidate_name', 'job_role'].includes(col) ? col : 'created_date';
    const rows = db.prepare(`SELECT * FROM resumes ORDER BY ${safeCol} ${dir} LIMIT ?`).all(limit);
    return rows.map(parseResume);
  },

  get: (id) => {
    const row = db.prepare('SELECT * FROM resumes WHERE id = ?').get(id);
    return parseResume(row);
  },

  create: (data) => {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO resumes (id, candidate_name, email, phone, job_role, file_url, file_name, skills, matched_skills, missing_skills, score, education, experience, summary, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.candidate_name || '',
      data.email || '',
      data.phone || '',
      data.job_role || '',
      data.file_url || '',
      data.file_name || '',
      JSON.stringify(data.skills || []),
      JSON.stringify(data.matched_skills || []),
      JSON.stringify(data.missing_skills || []),
      data.score || 0,
      data.education || '',
      data.experience || '',
      data.summary || '',
      data.status || 'processing'
    );
    return resumeDb.get(id);
  },

  update: (id, data) => {
    const existing = resumeDb.get(id);
    if (!existing) return null;
    const merged = { ...existing, ...data };
    const stmt = db.prepare(`
      UPDATE resumes SET
        candidate_name = ?, email = ?, phone = ?, job_role = ?, file_url = ?,
        file_name = ?, skills = ?, matched_skills = ?, missing_skills = ?,
        score = ?, education = ?, experience = ?, summary = ?, status = ?
      WHERE id = ?
    `);
    stmt.run(
      merged.candidate_name,
      merged.email,
      merged.phone,
      merged.job_role,
      merged.file_url,
      merged.file_name,
      JSON.stringify(Array.isArray(merged.skills) ? merged.skills : []),
      JSON.stringify(Array.isArray(merged.matched_skills) ? merged.matched_skills : []),
      JSON.stringify(Array.isArray(merged.missing_skills) ? merged.missing_skills : []),
      merged.score,
      merged.education,
      merged.experience,
      merged.summary,
      merged.status,
      id
    );
    return resumeDb.get(id);
  },

  delete: (id) => {
    db.prepare('DELETE FROM resumes WHERE id = ?').run(id);
  },
};

// Feedback CRUD
const feedbackDb = {
  list: (orderBy = '-created_date', limit = 50) => {
    const col = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
    const dir = orderBy.startsWith('-') ? 'DESC' : 'ASC';
    const safeCol = ['created_date', 'rating', 'category'].includes(col) ? col : 'created_date';
    return db.prepare(`SELECT * FROM feedbacks ORDER BY ${safeCol} ${dir} LIMIT ?`).all(limit);
  },

  create: (data) => {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO feedbacks (id, rating, comment, category)
      VALUES (?, ?, ?, ?)
    `).run(id, data.rating, data.comment, data.category || 'general');
    return db.prepare('SELECT * FROM feedbacks WHERE id = ?').get(id);
  },

  delete: (id) => {
    db.prepare('DELETE FROM feedbacks WHERE id = ?').run(id);
  },
};

module.exports = { resumeDb, feedbackDb };
