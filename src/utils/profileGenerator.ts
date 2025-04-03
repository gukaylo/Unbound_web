// Takes base test answers and returns user profile
export function generateUserProfile(answers: Record<string, string>) {
  const profile = {
    energy: null as string | null,
    blocker: null as string | null,
    preferred_style: null as string | null,
    tone: null as string | null,
    focus: null as string | null,
    change_style: null as string | null,
  };

  // Q1: Satisfaction (contextual only)
  const satisfaction = parseInt(answers['0']);
  if (satisfaction <= 3) profile.tone = "validating and supportive";
  else if (satisfaction <= 6) profile.tone = "calm and grounding";
  else if (satisfaction <= 8) profile.tone = "positive and motivational";
  else profile.tone = "bold and empowering";

  // Q2: Focus area
  const focusMap: Record<string, string> = {
    'health': "health",
    'relationships': "relationships",
    'career': "career",
    'confidence': "mindset",
    'focus': "focus",
  };
  profile.focus = focusMap[answers['1']];

  // Q3: Current mindset
  if (answers['2'] === 'stuck') profile.blocker = "action paralysis";
  else if (answers['2'] === 'unsure') profile.blocker = "lack of clarity";
  else if (answers['2'] === 'progressing') profile.blocker = "plateau";
  else profile.blocker = "emotional overload";

  // Q4: Energy
  const energyMap: Record<string, string> = {
    'low': "low",
    'scattered': "scattered",
    'productive': "productive",
    'high': "high",
  };
  profile.energy = energyMap[answers['3']];

  // Q5: Internal blocker
  const blockerMap: Record<string, string> = {
    'fear': "fear or self-doubt",
    'procrastination': "procrastination",
    'overthinking': "overthinking",
    'clarity': "lack of clarity",
    'overwhelm': "emotional overwhelm",
  };
  profile.blocker += ", " + blockerMap[answers['4']];

  // Q6: Follow-through
  if (answers['5'] === 'planner') profile.change_style = "activation triggers";
  else if (answers['5'] === 'starter') profile.change_style = "completion rituals";
  else if (answers['5'] === 'motivated') profile.change_style = "motivation-based systems";
  else profile.change_style = "consistent structure";

  // Q7: Support style
  const supportMap: Record<string, string> = {
    'push': "bold challenge",
    'encourage': "warm encouragement",
    'questions': "reflective questioning",
    'guidance': "clear step-by-step guidance",
  };
  profile.preferred_style = supportMap[answers['6']];

  // Q8: Decision-making
  if (answers['7'] === 'logic') profile.tone += ", logical";
  else if (answers['7'] === 'emotions') profile.tone += ", emotionally attuned";
  else if (answers['7'] === 'overthink') profile.tone += ", structured and decisive";
  else profile.tone += ", instinct-based";

  // Q9: Self-talk under stress
  const toneBoostMap: Record<string, string> = {
    'hard': ", self-critical",
    'shutdown': ", avoidant",
    'solve': ", constructive",
    'resilient': ", resilient",
  };
  profile.tone += toneBoostMap[answers['8']];

  // Q10: Change readiness
  const changeMap: Record<string, string> = {
    'small': "micro-habits",
    'bold': "bold action",
    'habits': "habit upgrades",
    'mindset': "deep mindset work",
  };
  profile.change_style += ", " + changeMap[answers['9']];

  return profile;
} 