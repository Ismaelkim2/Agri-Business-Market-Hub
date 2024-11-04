import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexYAxis, ApexDataLabels, ApexStroke } from 'ng-apexcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnChanges {
  @Input() chartValues: number[] = [];
  @Input() chartLabels: string[] = [];
  @Input() chartType: 'line' | 'bar' = 'line';

  public chartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    title: ApexTitleSubtitle;
    dataLabels: ApexDataLabels;
    stroke: ApexStroke;
  };

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Data",
          type: 'line',
          data: this.chartValues
        }
      ],
      chart: {
        height: 350,
        type: 'bar'
      },
      title: {
        text: "Data Overview"
      },
      xaxis: {
        categories: this.chartLabels
      },
      yaxis: {
        title: {
          text: 'Values'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: [2]
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartValues'] || changes['chartLabels'] || changes['chartType']) {
      this.updateChartOptions();
    }
  }

  private updateChartOptions(): void {
    this.chartOptions.series = this.chartType === 'line'
      ? [
        {
          name: "Data",
          type: 'line',
          data: this.chartValues
        }
      ]
      : [
        {
          name: "Data",
          type: 'bar',
          data: this.chartValues
        }
      ];

    this.chartOptions.chart.type = this.chartType;
    this.chartOptions.xaxis.categories = this.chartLabels;
  }

  switchToHistogram(): void {
    this.chartType = 'bar';
    this.updateChartOptions();
  }

  switchToLine(): void {
    this.chartType = 'line';
    this.updateChartOptions();
  }
}
