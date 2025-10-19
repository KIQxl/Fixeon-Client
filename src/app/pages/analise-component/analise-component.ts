import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { TicketDashboardResponse } from '../../models/Ticket';
import { Tickets_Services } from '../../services/ticket-service';
import { Notificacao } from '../../services/notificacao';
import { Chart, registerables, ChartType, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-analise-component',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './analise-component.html',
  styleUrls: ['./analise-component.css']
})
export class AnaliseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('analystChart') analystChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('dayChart') dayChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('hourChart') hourChartRef!: ElementRef<HTMLCanvasElement>;

  data?: TicketDashboardResponse;
  loading = true;

  // hold chart instances to destroy later
  private statusChart?: Chart;
  private analystChart?: Chart;
  private dayChart?: Chart;
  private hourChart?: Chart;

  private readyInterval?: any;

  constructor(private ticketService: Tickets_Services, private notificacao: Notificacao) {}

  ngAfterViewInit(): void {
    // load data and then render when both data and canvas refs are ready
    this.ticketService.GetTicketAnalysis().subscribe({
      next: (res) => {
        this.data = res.data;
        this.loading = false;

        // wait until viewchild references exist (they should on AfterViewInit), then render
        this.safeRender();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.notificacao.erro(err);
      }
    });
  }

  private safeRender() {
    // ensure canvases exist before rendering
    if (this.statusChartRef && this.analystChartRef && this.dayChartRef && this.hourChartRef && this.data) {
      this.renderCharts();
    } else {
      // fallback: check periodically but should rarely be needed in AfterViewInit
      this.readyInterval = setInterval(() => {
        if (this.statusChartRef && this.analystChartRef && this.dayChartRef && this.hourChartRef && this.data) {
          clearInterval(this.readyInterval);
          this.renderCharts();
        }
      }, 300);
    }
  }

  ngOnDestroy(): void {
    // destroy chart instances to free memory
    [this.statusChart, this.analystChart, this.dayChart, this.hourChart].forEach(c => c?.destroy());
    if (this.readyInterval) clearInterval(this.readyInterval);
  }

  private destroyAll() {
    [this.statusChart, this.analystChart, this.dayChart, this.hourChart].forEach(c => {
      if (c) { c.destroy(); }
    });
    this.statusChart = undefined;
    this.analystChart = undefined;
    this.dayChart = undefined;
    this.hourChart = undefined;
  }

  renderCharts() {
    if (!this.data) return;

    // destroy previous
    this.destroyAll();

    const ticketData = this.data.ticketAnalysisResponse;

    // ---------------- STATUS DOUGHNUT ----------------
    const ctxStatus = this.statusChartRef.nativeElement.getContext('2d')!;
    this.statusChart = new Chart(ctxStatus, {
      type: 'doughnut' as ChartType,
      data: {
        labels: ['Pendentes', 'Em Progresso', 'Resolvidos', 'Cancelados', 'Reabertos'],
        datasets: [{
          data: [
            ticketData.pending,
            ticketData.inProgress,
            ticketData.resolved,
            ticketData.canceled,
            ticketData.reOpened
          ],
          backgroundColor: ['#fde68a', '#bfdbfe', '#bbf7d0', '#fecaca', '#e9d5ff'],
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: <ChartOptions>{
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#374151' } },
          tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed} (${(ctx.parsed as number / ticketData.total * 100 || 0).toFixed(1)}%)` } },
          title: { display: false }
        }
      }
    });

    // ---------------- ANALYST BAR (horizontal) ----------------
    const analystLabels = this.data.analystTicketsAnalyses.map(a => a.analystName);
    const analystValues = this.data.analystTicketsAnalyses.map(a => a.ticketsTotal);
    const ctxAnalyst = this.analystChartRef.nativeElement.getContext('2d')!;
    this.analystChart = new Chart(ctxAnalyst, {
      type: 'bar' as ChartType,
      data: {
        labels: analystLabels,
        datasets: [{
          label: 'Total',
          data: analystValues,
          backgroundColor: '#c7dbfd',
          borderRadius: 6,
          barThickness: 18
        }]
      },
      options: <ChartOptions>{
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'nearest' } },
        scales: {
          x: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { color: '#475569' } },
          y: { ticks: { color: '#475569' } }
        }
      }
    });

    // ---------------- DAY LINE (created vs resolved) ----------------
    const dayLabels = (this.data.ticketsByDay ?? []).map(d => this.formatShortDate(d.date));
    const createdData = (this.data.ticketsByDay ?? []).map(d => d.created);
    const resolvedData = (this.data.ticketsByDay ?? []).map(d => d.resolved);
    const ctxDay = this.dayChartRef.nativeElement.getContext('2d')!;
    this.dayChart = new Chart(ctxDay, {
      type: 'line' as ChartType,
      data: {
        labels: dayLabels,
        datasets: [
          {
            label: 'Criados',
            data: createdData,
            fill: true,
            tension: 0.3,
            backgroundColor: 'rgba(99,102,241,0.12)',
            borderColor: '#6366f1',
            pointRadius: 4
          },
          {
            label: 'Resolvidos',
            data: resolvedData,
            fill: true,
            tension: 0.3,
            backgroundColor: 'rgba(16,185,129,0.12)',
            borderColor: '#10b981',
            pointRadius: 4
          }
        ]
      },
      options: <ChartOptions>{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { x: { ticks: { color: '#475569' } }, y: { beginAtZero: true, ticks: { color: '#475569' }, grid: { color: '#f3f4f6' } } }
      }
    });

    // ---------------- HOUR BAR (0-23) ----------------
    const hours = (this.data.ticketsByHour ?? []).map(h => this.padHourLabel(h.hour));
    const hoursValues = (this.data.ticketsByHour ?? []).map(h => h.ticketsCreated);
    const ctxHour = this.hourChartRef.nativeElement.getContext('2d')!;
    this.hourChart = new Chart(ctxHour, {
      type: 'bar' as ChartType,
      data: {
        labels: hours,
        datasets: [{
          label: 'Chamados',
          data: hoursValues,
          backgroundColor: '#dbeafe',
          borderRadius: 4,
          barThickness: 12
        }]
      },
      options: <ChartOptions>{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.parsed} chamados` } } },
        scales: { x: { ticks: { color: '#475569' } }, y: { beginAtZero: true, ticks: { color: '#475569' }, grid: { color: '#f3f4f6' } } }
      }
    });
  }

  private formatShortDate(d: any): string {
    // expecting d is Date or string; try to parse
    const dt = d instanceof Date ? d : new Date(d);
    return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }); // "dd/MM"
  }

  private padHourLabel(h: number): string {
    return `${h.toString().padStart(2, '0')}h`;
  }
}
