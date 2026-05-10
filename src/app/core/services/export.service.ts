import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private escapeCsv(field: any): string {
    if (field === null || field === undefined) {
      return '';
    }

    const str = String(field);

    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }

    return str;
  }

  exportDashboardCsv(summary: any, transactions: any[]): void {

    const lines: string[] = [];

    // HEADER
    lines.push('SMARTBUDGET - RELATÓRIO FINANCEIRO');
    lines.push('');

    // RESUMO GERAL
    lines.push('RESUMO GERAL');

    lines.push(`Saldo Total,${this.escapeCsv(summary.total_balance)}`);
    lines.push(`Receitas Totais,${this.escapeCsv(summary.total_income)}`);
    lines.push(`Despesas Totais,${this.escapeCsv(summary.total_expense)}`);

    lines.push('');

    // RESUMO MENSAL
    lines.push('RESUMO MENSAL');

    lines.push(`Mês,${this.escapeCsv(summary.month)}`);
    lines.push(`Receitas do Mês,${this.escapeCsv(summary.monthly_income)}`);
    lines.push(`Despesas do Mês,${this.escapeCsv(summary.monthly_expense)}`);
    lines.push(`Saldo do Mês,${this.escapeCsv(summary.monthly_balance)}`);

    lines.push('');

    // TRANSAÇÕES
    lines.push('ÚLTIMAS TRANSAÇÕES');
    lines.push('');

    lines.push('Data,Descrição,Tipo,Valor');

    transactions.forEach(txn => {
      // Format date as dd/MM/yyyy when possible
      let dateStr = '';

      try {
        const d = new Date(txn.date);
        if (!isNaN(d.getTime())) {
          dateStr = d.toLocaleDateString('pt-PT');
        } else {
          dateStr = String(txn.date || '');
        }
      } catch (e) {
        dateStr = String(txn.date || '');
      }

      const row = [
        this.escapeCsv(dateStr),
        this.escapeCsv(txn.description),
        this.escapeCsv(txn.type),
        this.escapeCsv(txn.amount)
      ].join(',');

      lines.push(row);
    });

    const csvContent = lines.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `smartbudget-report-${Date.now()}.csv`;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  }

}
