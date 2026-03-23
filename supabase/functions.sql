-- Function to get posts with their vote scores
CREATE OR REPLACE FUNCTION get_posts_with_scores()
RETURNS TABLE (
  id UUID,
  score BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    COALESCE(SUM(v.value), 0)::BIGINT as score
  FROM posts p
  LEFT JOIN votes v ON p.id = v.post_id
  GROUP BY p.id
  ORDER BY score DESC;
END;
$$ LANGUAGE plpgsql;
