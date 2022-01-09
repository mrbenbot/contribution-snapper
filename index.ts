import puppeteer from "puppeteer";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const image = await getImage();
await sendEmail(image);

async function getImage(): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://github.com/mrbenbot", {
    waitUntil: "networkidle2",
  });
  await page.waitForSelector(".js-calendar-graph");

  const element = await page.$(".js-calendar-graph");
  const image = await element?.screenshot({ quality: 100, type: "jpeg" });

  await browser.close();

  return image as Buffer;
}

async function sendEmail(image: Buffer) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions: Mail.Options = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    subject: `GitHub Contribution Image (${new Date().toDateString()})`,
    attachments: [{ filename: "image.jpg", content: image }],
  };

  await transporter.sendMail(mailOptions);
}
