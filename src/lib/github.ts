// Fetch public repos and contribution data for GitHub username
const GITHUB_USERNAME = "Anakintano";

export interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
}

// Curated list of relevant repos to show (ML/AI/Security only)
const RELEVANT_REPOS = [
  "Knowledge-Graph-with-OpenAI",
  "AI-Podcast-Generator",
  "SpeechPresentationGuid-AI",
  "OllamaThinkTryOuts",
  "PoseAnimeFlow",
  "aditya-Phishing-email-detection",
];

export async function fetchRepos(): Promise<Repo[]> {
  // Fetch all public repos, filter to relevant ones
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      {
        next: { revalidate: 3600 },
        headers: process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {},
      }
    );
    if (!res.ok) return getFallbackRepos();
    const all: Repo[] = await res.json();
    const relevant = all.filter((r) =>
      RELEVANT_REPOS.some((name) => r.name.toLowerCase() === name.toLowerCase())
    );
    // Return in curated order
    return RELEVANT_REPOS.map(
      (name) =>
        relevant.find((r) => r.name.toLowerCase() === name.toLowerCase()) ||
        null
    ).filter(Boolean) as Repo[];
  } catch {
    return getFallbackRepos();
  }
}

function getFallbackRepos(): Repo[] {
  return [
    {
      name: "Knowledge-Graph-with-OpenAI",
      description:
        "Converts text into structured visual knowledge graphs using GPT-4o",
      html_url: `https://github.com/${GITHUB_USERNAME}/Knowledge-Graph-with-OpenAI`,
      language: "Python",
      stargazers_count: 0,
      forks_count: 0,
      topics: ["openai", "knowledge-graph", "nlp"],
    },
    {
      name: "AI-Podcast-Generator",
      description: "Cloud-native podcast generation using Nitric framework",
      html_url: `https://github.com/${GITHUB_USERNAME}/AI-Podcast-Generator`,
      language: "Python",
      stargazers_count: 0,
      forks_count: 0,
      topics: ["ai", "podcast", "cloud"],
    },
    {
      name: "SpeechPresentationGuid-AI",
      description:
        "Audio feedback tool for speaking skills using Whisper and Qwen models",
      html_url: `https://github.com/${GITHUB_USERNAME}/SpeechPresentationGuid-AI`,
      language: "Python",
      stargazers_count: 0,
      forks_count: 0,
      topics: ["speech", "ai", "whisper"],
    },
    {
      name: "OllamaThinkTryOuts",
      description: "DeepSeek R1 reasoning demonstrations with Ollama",
      html_url: `https://github.com/${GITHUB_USERNAME}/OllamaThinkTryOuts`,
      language: "Python",
      stargazers_count: 0,
      forks_count: 0,
      topics: ["llm", "ollama", "reasoning"],
    },
    {
      name: "PoseAnimeFlow",
      description:
        "Generates anime-style characters in poses via Stable Diffusion and ControlNet",
      html_url: `https://github.com/${GITHUB_USERNAME}/PoseAnimeFlow`,
      language: "Python",
      stargazers_count: 0,
      forks_count: 0,
      topics: ["stable-diffusion", "controlnet", "anime"],
    },
    {
      name: "aditya-Phishing-email-detection",
      description: "Phishing email detection using structure theory and ML",
      html_url: `https://github.com/${GITHUB_USERNAME}/aditya-Phishing-email-detection`,
      language: "Python",
      stargazers_count: 0,
      forks_count: 0,
      topics: ["security", "phishing", "ml"],
    },
  ];
}
