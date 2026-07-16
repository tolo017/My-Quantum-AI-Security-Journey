import { Octokit } from "octokit";

export async function submitToGithub(params: {
  token: string;
  owner: string;
  repo: string;
  day: number;
  content: string;
  path: string;
}) {
  const octokit = new Octokit({ auth: params.token });

  try {
    // 1. Get current file data (if exists)
    let sha;
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner: params.owner,
        repo: params.repo,
        path: params.path,
      });
      if (!Array.isArray(data)) sha = data.sha;
    } catch (e) {
      // File doesn't exist yet
    }

    // 2. Create or Update file
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: params.owner,
      repo: params.repo,
      path: params.path,
      message: `✅ Complete Day ${params.day} Challenge`,
      content: Buffer.from(params.content).toString("base64"),
      sha,
    });

    return { success: true };
  } catch (error) {
    console.error("GitHub Submission Error:", error);
    return { success: false, error };
  }
}
