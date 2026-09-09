-- Feedback type and status enums
CREATE TYPE feedback_type AS ENUM ('bug_report', 'feature_request', 'rating', 'general');
CREATE TYPE feedback_status AS ENUM ('new', 'reviewed', 'resolved', 'dismissed');

-- Feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type feedback_type NOT NULL,
  subject TEXT NOT NULL CHECK (char_length(subject) <= 200),
  message TEXT NOT NULL CHECK (char_length(message) <= 5000),
  rating SMALLINT CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  email TEXT CHECK (email IS NULL OR (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')),
  page_url TEXT,
  user_agent TEXT,
  status feedback_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_feedback_user_id ON feedback(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_feedback_type ON feedback(type);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- RLS policies
-- Anyone (anon + authenticated) can insert feedback
CREATE POLICY "Anyone can submit feedback"
  ON feedback FOR INSERT
  WITH CHECK (true);

-- Authenticated users can read only their own feedback
CREATE POLICY "Users can read own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);

-- Comment: Admin access is handled via service_role key (bypasses RLS)
