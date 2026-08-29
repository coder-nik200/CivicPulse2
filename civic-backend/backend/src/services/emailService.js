import transporter from "../config/mail.js";

export const sendIssueEmail = async ({ authority, issue, reporter }) => {
  const subject = `CivicPlus New Issue Report - ${issue.issueId}`;

  const html = `
    <!DOCTYPE html>

    <html>
      <body style="font-family: Arial, sans-serif;">

        <div style="
          max-width: 700px;
          margin: auto;
          border: 1px solid #ddd;
          padding: 25px;
        ">

          <h1>CivicPlus</h1>

          <h2>
            New Civic Issue Reported
          </h2>

          <hr />

          <h3>Issue Details</h3>

          <p>
            <strong>Issue ID:</strong>
            ${issue.issueId}
          </p>

          <p>
            <strong>Issue Type:</strong>
            ${issue.issueType}
          </p>

          <p>
            <strong>Priority:</strong>
            ${issue.priority}
          </p>

          <p>
            <strong>Status:</strong>
            ${issue.status}
          </p>

          <h3>Description</h3>

          <p>
            ${issue.description}
          </p>

          <h3>Location</h3>

          <p>
            <strong>Address:</strong>
            ${issue.location.address || "Not provided"}
          </p>

          <p>
            <strong>Latitude:</strong>
            ${issue.location.latitude}
          </p>

          <p>
            <strong>Longitude:</strong>
            ${issue.location.longitude}
          </p>

          <p>
            <a
              href="https://www.google.com/maps?q=${issue.location.latitude},${issue.location.longitude}"
              target="_blank"
            >
              View Location on Google Maps
            </a>
          </p>

          <h3>Reported By</h3>

          <p>
            <strong>Name:</strong>
            ${reporter?.name || "Citizen"}
          </p>

          <p>
            <strong>Email:</strong>
            ${reporter?.email || "Not available"}
          </p>

          <h3>Issue Image</h3>

          <img
            src="${issue.image.url}"
            alt="Reported issue"
            style="
              max-width: 100%;
              border-radius: 8px;
            "
          />

          <br /><br />

          <a
            href="${issue.image.url}"
            target="_blank"
          >
            Open Original Image
          </a>

          <hr />

          <p>
            This report was generated automatically by CivicPlus.
          </p>

        </div>

      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,

    to: authority.email,

    subject,

    html,

    attachments: [
      {
        filename: `${issue.issueId}.jpg`,
        path: issue.image.url,
      },
    ],
  };

  return transporter.sendMail(mailOptions);
};
