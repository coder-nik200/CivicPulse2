import { Issue } from "../models/issue.model.js";
import nodemailer from "nodemailer";

const categories = new Set([
  "pothole",
  "garbage",
  "streetlight",
  "obstruction",
  "waterlogging",
]);

const statuses = new Set([
  "REPORTED",
  "AI_ANALYZED",
  "VERIFIED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "RESOLUTION_VERIFIED",
  "CLOSED",
]);

function assertIssueInput(input) {
  if (!input || !categories.has(input.category))
    throw new Error("A valid category is required");
  if (
    typeof input.imageUrl !== "string" ||
    input.imageUrl.length < 20 ||
    input.imageUrl.length > 8_000_000
  )
    throw new Error("A valid image is required");
  if (
    !Number.isFinite(input.lat) ||
    input.lat < -90 ||
    input.lat > 90 ||
    !Number.isFinite(input.lng) ||
    input.lng < -180 ||
    input.lng > 180
  )
    throw new Error("A valid location is required");
  if (
    typeof input.address !== "string" ||
    input.address.trim().length < 3 ||
    input.address.length > 180
  )
    throw new Error("A valid address is required");
  if (
    input.description &&
    (typeof input.description !== "string" || input.description.length > 500)
  )
    throw new Error("Description must be 500 characters or fewer");
}

function score(category, reports = 1) {
  const base =
    { pothole: 8, waterlogging: 8, obstruction: 7, streetlight: 6, garbage: 5 }[
      category
    ] ?? 4;
  return Math.min(10, base + Math.min(2, (reports - 1) * 0.5));
}

function summary(category, description) {
  return (
    description?.trim() ||
    `A ${category.replaceAll("_", " ")} report needs review by the relevant civic service team.`
  );
}

// Nodemailer Helper to send email alerts to authorities and administrator
async function sendIssueEmail(issue) {
  const recipients = ["codesnippet17@gmail.com", "ajajkhan2842@gmail.com"];
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  const mailOptions = {
    from: `"CivicPulse Alerts" <${emailUser || "noreply@civicpulse.org"}>`,
    to: recipients.join(", "),
    subject: `[CivicPulse Alert] New ${issue.category.toUpperCase()} Reported: ${issue.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #0f766e; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">CivicPulse Incident Report</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Authority & Admin Alert Notification</p>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #0f766e; border-bottom: 2px solid #f0fdfa; padding-bottom: 8px; margin-top: 0;">Issue Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 130px; color: #666;">Issue ID:</td>
              <td style="padding: 8px 0; font-family: monospace; font-weight: bold; color: #0f766e;">${issue.id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Category:</td>
              <td style="padding: 8px 0; text-transform: capitalize;">${issue.category.replaceAll("_", " ")}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Description:</td>
              <td style="padding: 8px 0;">${issue.description || "No description provided."}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Location Address:</td>
              <td style="padding: 8px 0;">${issue.address || "Unknown Address"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Coordinates:</td>
              <td style="padding: 8px 0; font-family: monospace;">${issue.lat.toFixed(6)}°, ${issue.lng.toFixed(6)}°</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">AI Severity:</td>
              <td style="padding: 8px 0;"><span style="background-color: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${issue.severity}/10</span></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Priority Score:</td>
              <td style="padding: 8px 0;"><span style="background-color: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${issue.priority}/100</span></td>
            </tr>
          </table>
          
          <div style="text-align: center; margin: 25px 0;">
            <p style="font-weight: bold; margin-bottom: 10px; color: #666;">Reported Photo Evidence:</p>
            <img src="${issue.imageUrl.startsWith("data:") ? "cid:issueimage" : issue.imageUrl}" style="max-width: 100%; max-height: 400px; border-radius: 8px; border: 1px solid #eee;" alt="Issue Photo"/>
          </div>
        </div>
        <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          This is an automated alert generated by CivicPulse. Please investigate the reported issue at the location listed above.
        </div>
      </div>
    `,
  };

  // Attach base64 image if applicable
  if (issue.imageUrl.startsWith("data:")) {
    const match = issue.imageUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (match) {
      const contentType = match[1];
      const base64Data = match[2];
      const filename = `issue_${issue.id}.${contentType.split("/")[1] || "jpg"}`;
      mailOptions.attachments = [{
        filename,
        content: Buffer.from(base64Data, 'base64'),
        cid: 'issueimage'
      }];
    }
  }

  if (emailUser && emailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });
      await transporter.sendMail(mailOptions);
      console.log(`✓ Email notification sent successfully to codesnippet17@gmail.com and ajajkhan2842@gmail.com for issue ${issue.id}`);
    } catch (err) {
      console.error("✗ Failed to send email alert:", err);
    }
  } else {
    console.log("ℹ EMAIL_USER and EMAIL_PASS not configured in .env. Creating automatic Ethereal test email account...");
    try {
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      mailOptions.from = `"CivicPulse Alerts" <${testAccount.user}>`;
      const info = await transporter.sendMail(mailOptions);
      const viewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`\n=============================================================`);
      console.log(`✓ [TEST EMAIL SENT] Issue ID: ${issue.id}`);
      console.log(`👉 View formatted email content at: ${viewUrl}`);
      console.log(`=============================================================\n`);
    } catch (err) {
      console.error("✗ Failed to send test email to Ethereal:", err);
    }
  }
}

export async function createIssue(input) {
  assertIssueInput(input);
  const now = new Date();

  // Duplicate check
  const duplicate = await Issue.findOne({
    category: input.category,
    lat: { $gte: input.lat - 0.001, $lte: input.lat + 0.001 },
    lng: { $gte: input.lng - 0.001, $lte: input.lng + 0.001 },
    status: { $ne: "CLOSED" },
  });

  if (duplicate) {
    duplicate.reportCount += 1;
    duplicate.uniqueReporterCount += 1;
    duplicate.severity = score(duplicate.category, duplicate.reportCount);
    duplicate.priority = Math.round(duplicate.severity * 10);
    duplicate.updatedAt = now;
    await duplicate.save();
    return { issue: duplicate, isDuplicate: true };
  }

  const count = await Issue.countDocuments();
  const sequence = 1040 + count;
  const issueId = `CIV-${sequence}`;
  const severity = score(input.category);

  const issue = new Issue({
    id: issueId,
    category: input.category,
    imageUrl: input.imageUrl, // Stores base64 directly in MongoDB
    lat: input.lat,
    lng: input.lng,
    location: { type: "Point", coordinates: [input.lng, input.lat] },
    address: input.address.trim(),
    description: input.description?.trim() || undefined,
    severity,
    confidence: 82,
    priority: Math.round(severity * 10),
    reportCount: 1,
    uniqueReporterCount: 1,
    status: "AI_ANALYZED",
    createdAt: now,
    updatedAt: now,
    aiSummary: summary(input.category, input.description),
  });

  await issue.save();
  await sendIssueEmail(issue);

  return { issue, isDuplicate: false };
}

export async function getIssues(filters = {}) {
  const query = {};
  if (filters.category) query.category = filters.category;
  if (filters.status) query.status = filters.status;
  return await Issue.find(query).sort({ createdAt: -1 });
}

export async function getIssueById(id) {
  return await Issue.findOne({ id });
}

export async function updateIssueStatus(id, status) {
  if (!statuses.has(status)) throw new Error("Invalid status");
  const issue = await Issue.findOne({ id });
  if (!issue) return null;
  issue.status = status;
  issue.updatedAt = new Date();
  await issue.save();
  return issue;
}

export async function upvoteIssue(id) {
  const issue = await Issue.findOne({ id });
  if (!issue) return null;
  issue.reportCount += 1;
  issue.priority = Math.round(score(issue.category, issue.reportCount) * 10);
  issue.updatedAt = new Date();
  await issue.save();
  return issue;
}
