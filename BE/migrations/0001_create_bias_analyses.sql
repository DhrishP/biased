CREATE TABLE bias_analyses (
  id TEXT PRIMARY KEY,
  scenario TEXT NOT NULL,
  biases TEXT NOT NULL, 
  analysis TEXT NOT NULL,
  created_at TEXT NOT NULL
); 