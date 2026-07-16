-- Table to store user progress on the 72-day roadmap
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  day_number INTEGER NOT NULL,
  status TEXT DEFAULT 'locked', -- locked, unlocked, completed
  completed_at TIMESTAMP WITH TIME ZONE,
  github_submission_url TEXT,
  UNIQUE(user_id, day_number)
);

-- Table for interactive challenge responses
CREATE TABLE challenge_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  day_number INTEGER NOT NULL,
  challenge_id TEXT NOT NULL,
  response TEXT,
  is_correct BOOLEAN DEFAULT false,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
