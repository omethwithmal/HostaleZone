const PDFDocument = require("pdfkit");
const Fee = require("../Model/Fee.js");
const Payment = require("../Model/Payment.js");

const COLORS = {
  ink: '#0f172a',
  muted: '#64748b',
  line: '#dbe4f0',
  panel: '#f8fafc',
  accent: '#0ea5e9',
  accentSoft: '#e0f2fe',
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));

const ensurePageSpace = (doc, requiredHeight = 80) => {
  if (doc.y + requiredHeight > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
};

const drawHeader = (doc, title, subtitle) => {
  const { left, right } = doc.page.margins;
  const width = doc.page.width - left - right;

  doc
    .roundedRect(left, 40, width, 88, 18)
    .fill('#0f172a');

  doc
    .fontSize(10)
    .fillColor('#7dd3fc')
    .text('HOSTELPAY REPORT', left + 24, 58, {
      width: width - 48,
      characterSpacing: 2,
    });

  doc
    .fontSize(22)
    .fillColor('#ffffff')
    .text(title, left + 24, 78, {
      width: width - 48,
    });

  doc
    .fontSize(10)
    .fillColor('#cbd5e1')
    .text(subtitle, left + 24, 106, {
      width: width - 48,
    });

  doc.y = 150;
};

const drawStats = (doc, stats) => {
  if (!stats.length) {
    return;
  }

  const { left, right } = doc.page.margins;
  const availableWidth = doc.page.width - left - right;
  const gap = 12;
  const boxWidth = (availableWidth - gap * (stats.length - 1)) / stats.length;
  const boxHeight = 58;
  const startY = doc.y;

  stats.forEach((stat, index) => {
    const x = left + index * (boxWidth + gap);

    doc
      .roundedRect(x, startY, boxWidth, boxHeight, 12)
      .fill(COLORS.panel);

    doc
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(stat.label.toUpperCase(), x + 14, startY + 12, {
        width: boxWidth - 28,
        characterSpacing: 1,
      });

    doc
      .fontSize(15)
      .fillColor(COLORS.ink)
      .text(stat.value, x + 14, startY + 28, {
        width: boxWidth - 28,
      });
  });

  doc.y = startY + boxHeight + 18;
};

const drawSectionTitle = (doc, title, description) => {
  ensurePageSpace(doc, 70);

  doc
    .fontSize(13)
    .fillColor(COLORS.ink)
    .text(title);

  if (description) {
    doc
      .moveDown(0.25)
      .fontSize(10)
      .fillColor(COLORS.muted)
      .text(description);
  }

  doc.moveDown(0.65);
};

const drawRows = (doc, rows) => {
  if (!rows.length) {
    doc.fontSize(10).fillColor(COLORS.muted).text('No data available.');
    doc.moveDown();
    return;
  }

  rows.forEach((row) => {
    ensurePageSpace(doc, 54);
    const startY = doc.y;
    const x = doc.page.margins.left;
    const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;

    doc
      .roundedRect(x, startY, width, 42, 10)
      .fill('#ffffff');

    doc
      .strokeColor(COLORS.line)
      .lineWidth(1)
      .roundedRect(x, startY, width, 42, 10)
      .stroke();

    doc
      .fontSize(11)
      .fillColor(COLORS.ink)
      .text(row.primary, x + 14, startY + 10, {
        width: width - 28,
      });

    if (row.secondary) {
      doc
        .fontSize(9)
        .fillColor(COLORS.muted)
        .text(row.secondary, x + 14, startY + 24, {
          width: width - 28,
        });
    }

    doc.y = startY + 50;
  });
};

const sendPdf = (res, filename, title, subtitle, writer) => {
  const doc = new PDFDocument({ margin: 48, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  doc.pipe(res);
  drawHeader(doc, title, subtitle);
  writer(doc);
  doc.end();
};

exports.downloadReport = async (req, res) => {
  const { type } = req.params;
  const [fees, payments] = await Promise.all([
    Fee.find().sort({ dueDate: -1 }),
    Payment.find().sort({ createdAt: -1 }),
  ]);

  const approvedPayments = payments.filter((payment) => payment.status === 'approved');
  const overdueFees = fees.filter((fee) => fee.status === 'overdue');
  const paidFees = fees.filter((fee) => fee.status === 'paid');
  const unpaidFees = fees.filter((fee) => fee.status !== 'paid');
  const generatedAt = `Generated on ${formatDate(new Date())}`;

  switch (type) {
    case 'student-payment-history':
      return sendPdf(
        res,
        'student-payment-history.pdf',
        'Student Payment History',
        generatedAt,
        (doc) => {
          drawStats(doc, [
            { label: 'Total Records', value: String(payments.length) },
            { label: 'Approved', value: String(approvedPayments.length) },
            { label: 'Collected', value: formatCurrency(approvedPayments.reduce((sum, payment) => sum + payment.amount, 0)) },
          ]);

          drawSectionTitle(doc, 'Recent Student Payments', 'Chronological payment activity across the system.');
          drawRows(
            doc,
            payments.map((payment) => ({
              primary: `${payment.studentName} · ${payment.feeName}`,
              secondary: `${formatCurrency(payment.amount)} · ${payment.status.toUpperCase()} · ${formatDate(payment.date)} · Ref ${payment.referenceNumber}`,
            }))
          );
        }
      );

    case 'outstanding-balances':
      return sendPdf(
        res,
        'outstanding-balances.pdf',
        'Outstanding Balances',
        generatedAt,
        (doc) => {
          const totalOutstanding = overdueFees.reduce((sum, fee) => sum + fee.amount, 0);

          drawStats(doc, [
            { label: 'Outstanding Fees', value: String(overdueFees.length) },
            { label: 'Balance Total', value: formatCurrency(totalOutstanding) },
          ]);

          drawSectionTitle(doc, 'Overdue Fee Items', 'Fees that remain unpaid past their due date.');
          drawRows(
            doc,
            overdueFees.map((fee) => ({
              primary: fee.title,
              secondary: `${formatCurrency(fee.amount)} · Due ${formatDate(fee.dueDate)} · Status ${fee.status.toUpperCase()}`,
            }))
          );
        }
      );

    case 'monthly-yearly-income':
      return sendPdf(
        res,
        'monthly-yearly-income.pdf',
        'Monthly and Yearly Income Report',
        generatedAt,
        (doc) => {
          const monthlyMap = new Map();
          const yearlyMap = new Map();

          approvedPayments.forEach((payment) => {
            const date = new Date(payment.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const yearKey = String(date.getFullYear());

            monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + payment.amount);
            yearlyMap.set(yearKey, (yearlyMap.get(yearKey) || 0) + payment.amount);
          });

          drawStats(doc, [
            { label: 'Approved Payments', value: String(approvedPayments.length) },
            { label: 'Total Income', value: formatCurrency(approvedPayments.reduce((sum, payment) => sum + payment.amount, 0)) },
          ]);

          drawSectionTitle(doc, 'Monthly Income', 'Income grouped by month.');
          drawRows(
            doc,
            [...monthlyMap.entries()].map(([month, amount]) => ({
              primary: month,
              secondary: formatCurrency(amount),
            }))
          );

          drawSectionTitle(doc, 'Yearly Income', 'Income grouped by year.');
          drawRows(
            doc,
            [...yearlyMap.entries()].map(([year, amount]) => ({
              primary: year,
              secondary: formatCurrency(amount),
            }))
          );
        }
      );

    case 'paid-unpaid-bills':
      return sendPdf(
        res,
        'paid-and-unpaid-bills.pdf',
        'Paid and Unpaid Bills List',
        generatedAt,
        (doc) => {
          drawStats(doc, [
            { label: 'Paid Bills', value: String(paidFees.length) },
            { label: 'Unpaid Bills', value: String(unpaidFees.length) },
          ]);

          drawSectionTitle(doc, 'Paid Bills', 'Fees fully settled.');
          drawRows(
            doc,
            paidFees.map((fee) => ({
              primary: fee.title,
              secondary: `${formatCurrency(fee.amount)} · Due ${formatDate(fee.dueDate)}`,
            }))
          );

          drawSectionTitle(doc, 'Unpaid Bills', 'Fees not yet completed.');
          drawRows(
            doc,
            unpaidFees.map((fee) => ({
              primary: fee.title,
              secondary: `${formatCurrency(fee.amount)} · ${fee.status.toUpperCase()} · Due ${formatDate(fee.dueDate)}`,
            }))
          );
        }
      );

    case 'overdue-payments':
      return sendPdf(
        res,
        'overdue-payment-reports.pdf',
        'Overdue Payment Reports',
        generatedAt,
        (doc) => {
          drawStats(doc, [
            { label: 'Overdue Count', value: String(overdueFees.length) },
            { label: 'Overdue Total', value: formatCurrency(overdueFees.reduce((sum, fee) => sum + fee.amount, 0)) },
          ]);

          drawSectionTitle(doc, 'Overdue Fees', 'Payments that require urgent follow-up.');
          drawRows(
            doc,
            overdueFees.map((fee) => ({
              primary: fee.title,
              secondary: `${formatCurrency(fee.amount)} · Due ${formatDate(fee.dueDate)}`,
            }))
          );
        }
      );

    case 'room-flow-income':
      return sendPdf(
        res,
        'room-and-flow-income.pdf',
        'Room and Flow Income',
        `${generatedAt} · Room totals inferred from fee titles containing "room"`,
        (doc) => {
          const roomPayments = approvedPayments.filter((payment) =>
            payment.feeName.toLowerCase().includes('room')
          );
          const roomIncome = roomPayments.reduce((sum, payment) => sum + payment.amount, 0);
          const totalIncome = approvedPayments.reduce((sum, payment) => sum + payment.amount, 0);

          drawStats(doc, [
            { label: 'Room Income', value: formatCurrency(roomIncome) },
            { label: 'Total Flow', value: formatCurrency(totalIncome) },
          ]);

          drawSectionTitle(doc, 'Approved Payment Flow', 'Approved payments contributing to income flow.');
          drawRows(
            doc,
            approvedPayments.map((payment) => ({
              primary: `${payment.feeName} · ${payment.studentName}`,
              secondary: `${formatCurrency(payment.amount)} · ${formatDate(payment.date)} · ${payment.paymentMethod.toUpperCase()}`,
            }))
          );
        }
      );

    default:
      return res.status(404).json({ message: 'Unknown report type' });
  }
};
