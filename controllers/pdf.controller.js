import puppeteer from "puppeteer";
import { valuationReportTemplate } from "../templates/valuationReport.html.js";

export const generateValuationPDF = async (req, res) => {
  console.log("📄 PDF generation request received");
  try {
    const { marketValue, breakdown, weights, propertyType, spf = 0 } = req.body;

    if (!marketValue) {
      return res.status(400).json({ error: "Market value missing" });
    }

    const html = valuationReportTemplate({
      marketValue,
      breakdown,
      weights,
      propertyType,
      spf,
    });

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=Immobilienbewertung.pdf",
      "Content-Length": pdf.length,
    });
    res.send(pdf);
  } catch (error) {
    console.error("❌ PDF Error:", error);
    res.status(500).json({ error: "PDF generation failed: " + error.message });
  }
};