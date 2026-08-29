import * as issueService from "../services/issue.service.js";

export async function create(req, res) {
  try {
    const result = await issueService.createIssue(req.body);
    res.status(result.isDuplicate ? 200 : 201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAll(req, res) {
  try {
    const issues = await issueService.getIssues(req.query);
    res.json({ issues });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getOne(req, res) {
  try {
    const issue = await issueService.getIssueById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });
    res.json({ issue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateStatus(req, res) {
  try {
    const updated = await issueService.updateIssueStatus(
      req.params.id,
      req.body.status,
    );
    if (!updated) return res.status(404).json({ error: "Issue not found" });
    res.json({ issue: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function upvote(req, res) {
  try {
    const result = await issueService.upvoteIssue(req.params.id);
    if (!result) return res.status(404).json({ error: "Issue not found" });
    res.json({ issue: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
