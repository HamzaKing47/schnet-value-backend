export const valuationReportTemplate = ({
  marketValue,
  breakdown,
  weights,
  propertyType,
  spf = 0,
}) => {
  // Helper to format currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "—";
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper to format weight as percentage
  const formatWeight = (weight) => {
    if (!weight && weight !== 0) return "—";
    return `${Math.round(weight * 100)}%`;
  };

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      color: #1f2937;
      line-height: 1.5;
    }
    h1 {
      text-align: center;
      color: #058996;
      margin-bottom: 30px;
    }
    .value {
      font-size: 32px;
      font-weight: bold;
      text-align: center;
      margin: 30px 0;
      color: #058996;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 30px;
    }
    th, td {
      border: 1px solid #d1d5db;
      padding: 12px;
      text-align: left;
    }
    th {
      background: #f3f4f6;
      font-weight: 600;
    }
    .footer {
      margin-top: 50px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
    .spf {
      margin-top: 20px;
      padding: 10px;
      background: #f0f9fa;
      border-left: 4px solid #058996;
    }
  </style>
</head>
<body>

<h1>Immobilienbewertung gemäß ImmoWertV</h1>

<p><strong>Objektart:</strong> ${propertyType}</p>
<p><strong>Bewertungsdatum:</strong> ${new Date().toLocaleDateString("de-DE")}</p>

<div class="value">
  Marktwert: ${formatCurrency(marketValue)}
</div>

<table>
  <thead>
    <tr>
      <th>Bewertungsverfahren</th>
      <th>Wert (€)</th>
      <th>Gewichtung</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Vergleichswertverfahren</td>
      <td>${formatCurrency(breakdown?.comparativeValue)}</td>
      <td>${formatWeight(weights?.comparative)}</td>
    </tr>
    <tr>
      <td>Ertragswertverfahren</td>
      <td>${formatCurrency(breakdown?.incomeValue)}</td>
      <td>${formatWeight(weights?.income)}</td>
    </tr>
    <tr>
      <td>Sachwertverfahren</td>
      <td>${formatCurrency(breakdown?.costValue)}</td>
      <td>${formatWeight(weights?.cost)}</td>
    </tr>
  </tbody>
</table>

${
  spf
    ? `
<div class="spf">
  <strong>Sonderposten-Faktor (boG):</strong> ${formatCurrency(spf)}
</div>
`
    : ""
}

<div class="footer">
  <p>
    Hinweis: Diese Bewertung stellt eine indikative Marktwertermittlung gemäß
    ImmoWertV dar und ersetzt kein vollständiges Verkehrswertgutachten.
  </p>
  <p>Erstellt mit SchNet Value Immobilienbewertungssoftware</p>
</div>

</body>
</html>
`;
};
