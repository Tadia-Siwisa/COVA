// Utility functions for simple, robust business exports (CSV, Excel-compatible format, and printable view)

export interface ExportColumn {
  key: string;
  label: string;
}

export function exportToCSV(
  filename: string,
  columns: ExportColumn[],
  rows: Record<string, any>[]
) {
  const header = columns.map((col) => `"${col.label.replace(/"/g, '""')}"`).join(',');
  const lines = rows.map((row) =>
    columns
      .map((col) => {
        const val = row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  const csvContent = '\uFEFF' + [header, ...lines].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\.[^/.]+$/, '')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToExcel(
  filename: string,
  columns: ExportColumn[],
  rows: Record<string, any>[]
) {
  // Generates an Excel-compatible XML spreadsheet or TSV with .xls extension
  const header = columns.map((col) => `"${col.label.replace(/"/g, '""')}"`).join('\t');
  const lines = rows.map((row) =>
    columns
      .map((col) => {
        const val = row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      })
      .join('\t')
  );

  const content = '\uFEFF' + [header, ...lines].join('\r\n');
  const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\.[^/.]+$/, '')}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printOrExportPDF(title: string, columns: ExportColumn[], rows: Record<string, any>[]) {
  // Open formatted printable summary window
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    // If popups blocked, fallback to CSV
    exportToCSV(title, columns, rows);
    return;
  }

  const rowsHtml = rows
    .map(
      (r) =>
        `<tr>${columns
          .map(
            (c) =>
              `<td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-size: 12px; font-family: sans-serif;">${
                r[c.key] ?? ''
              }</td>`
          )
          .join('')}</tr>`
    )
    .join('');

  const headersHtml = columns
    .map(
      (c) =>
        `<th style="padding: 10px 12px; text-align: left; background: #f3f4f6; border-bottom: 2px solid #d1d5db; font-size: 11px; text-transform: uppercase; font-family: sans-serif;">${c.label}</th>`
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - Cova Decision Intelligence</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #111827; }
          h1 { font-size: 20px; margin-bottom: 4px; }
          .meta { font-size: 12px; color: #6b7280; margin-bottom: 18px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
          <div>
            <h1>Cova — ${title}</h1>
            <div class="meta">Exported on ${new Date().toLocaleDateString('en-ZA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })} · September 2026 Reporting Period</div>
          </div>
          <button onclick="window.print()" style="padding: 8px 16px; background: #1f2937; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">
            Print / Save to PDF
          </button>
        </div>
        <table>
          <thead><tr>${headersHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
}
