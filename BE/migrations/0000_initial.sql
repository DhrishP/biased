-- Create bias_analyses table
CREATE TABLE IF NOT EXISTS bias_analyses (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  results TEXT NOT NULL,
  summary TEXT NOT NULL,
  timestamp INTEGER NOT NULL
);

-- Create index for faster history queries
CREATE INDEX IF NOT EXISTS idx_bias_analyses_timestamp ON bias_analyses(timestamp DESC); 