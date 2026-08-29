import emailjs from "@emailjs/browser";

interface EmailParams {
  id: string;
  category: string;
  description: string;
  address: string;
  imageUrl: string;
  lat: number;
  lng: number;
}

const EMAIL_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  recipient: "codesnippet17@gmail.com",
};

export async function sendEmailJSAlert({
  id,
  category,
  description,
  address,
  imageUrl,
  lat,
  lng,
}: EmailParams): Promise<void> {
  const { serviceId, templateId, publicKey, recipient } = EMAIL_CONFIG;

  // --------------------------------------------------
  // Validate EmailJS configuration
  // --------------------------------------------------
  if (!serviceId || !templateId || !publicKey) {
    console.warn(
      "⚠️ EmailJS is not configured. Skipping email notification.",
    );

    console.info("📧 EmailJS Preview:", {
      to: recipient,
      issueId: id,
      category,
      description: description || "No description provided.",
      address,
      coordinates: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      imageUrl,
    });

    return;
  }

  // --------------------------------------------------
  // Prepare template data
  // --------------------------------------------------
  const templateParams = {
    issue_id: id,
    category,
    description: description || "No description provided.",
    address: address || "Address not available",
    coordinates: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    image_url: imageUrl || "",
    to_email: recipient,
  };

  try {
    console.log("📨 Sending EmailJS notification...", {
      issueId: id,
      category,
      recipient,
    });

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey,
    );

    console.log("✅ EmailJS notification sent successfully.", {
      status: response.status,
      message: response.text,
    });
  } catch (error) {
    console.error("❌ EmailJS notification failed:", error);

    // Keep the main issue-reporting flow from crashing
    // if email delivery fails.
  }
}