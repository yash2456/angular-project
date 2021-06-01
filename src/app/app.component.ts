import { Component, ElementRef, ViewChild } from "@angular/core";
import { BarChartServiceService } from './bar-chart-service.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
  ApexNoData,

} from "ng-apexcharts";
import { DatePipe } from "@angular/common";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
export type ChartOptions = {
  series: any;
  chart: any;
  dataLabels: any;
  plotOptions: any;
  grid: any;
  yaxis: any;
  legend: any;
  colors: any;
  tooltip: any;
  xaxis: any;
  responsive: any
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chart';
  tab: any;
  weekDays: any = [];
  differencePeopleFootfall: any;
  lastWeekDataFootfall: any;
  currentWeekDataFootfall: any;
  todayIndex: any;
  doesPlay: boolean;
  setTimeout: any;
  closeResult: string;
  lastWeekZonewiseTotalCount: any = 0;
  currentWeekZonewiseTotalCount: any = 0;
  zoneWisedate: any;
  todayDate: string = "";


  @ViewChild("zonewiseFootfallModal") zonewiseFootfallModal: ElementRef
  public dayWiseFootFall: Partial<ChartOptions>;
  public zoneWiseFootFall: Partial<ChartOptions>;
  constructor(public bar: BarChartServiceService, public datepipe: DatePipe, private modalService: NgbModal) {
    this.dayWiseFootFall = this.getChartCommonConfiguration(
      {
        dataPointSelection: (e: any, chart: any, opts: any) => {
          if (e.button == 0) //opts.seriesIndex == 1 && for current week only
          {
            var startHour = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].startHour;
            var endHour = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].endHour;
            var selectedDate = this.weekDays[this.todayIndex].Date;
            this.zoneWiseDataPopup(selectedDate, startHour, endHour);
          }
        }
      }

    );



    this.zoneWiseFootFall = this.getChartCommonConfiguration(null, "Zone", "Count");
    this.todayDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.getWeeksDays();
    this.todayIndex = this.weekDays.findIndex(x => x.Date === this.todayDate);
    this.weekDayChangeToChart(this.todayDate);
  }

  getChartCommonConfiguration(event: any, xaxisName: string = "", yaxisName: string = "") {
    var chartConfiguration: Partial<ChartOptions> = {
      series: [],
      chart: {
        type: "bar",
        height: 350,
        width: 750,
        stacked: false,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        },
      },
      responsive: [
        {
          breakpoint: 8000,
          options: {
            plotOptions: {
              bar: {
                horizontal: false
              }
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      colors: ['#bec1c7', '#729ef1'],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10
        }
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: false,
      },
      yaxis: {
        show: false,
      },
      xaxis: {
        show: false,
      },
      legend: {
        show: true,
        fontWeight: 800,
        itemMargin: {
          horizontal: 25,
          vertical: 25
        },

      },
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          return (
            '<div class="arrow_box">' +
            '<div style="margin-top:5px !important">' +
            '</div>' +
            '<b style="color:#2b57ab !important; margin-left:9px ">People Count</b>' +
            '<b style="margin-right:9px">' +
            ' : ' +
            series[seriesIndex][dataPointIndex] +
            '</b >' +
            '<br>' +
            '<hr style="margin-top: 5px !important;margin-bottom: 5px !important;border:1px solid #a7acb1 !important">' +
            ' ' +
            '<span style="display:flex; justify-content: center;margin-bottom:5px">' +
            '<b >' +
            w.globals.labels[dataPointIndex] +
            '</b>' +
            "</span>" +
            "</div>"
          );
        }
      }
    };

    if (event) {
      chartConfiguration.chart.events = event;
    }

    if (xaxisName != "") {
      chartConfiguration.xaxis = {
        show: true,
        title: {
          text: xaxisName,
          style: {
            color: '#363d7c',
            fontSize: '18px',
          },
        }

      }
    }
    if (yaxisName != "") {
      chartConfiguration.yaxis = {
        show: true,

        labels: {
          show: false
        },
        title: {
          text: yaxisName,
          style: {
            color: '#363d7c',
            fontSize: '20px',
          },
        }

      }
    }

    return chartConfiguration;
  }
  zoneWiseDataPopup(date: string, startHour: any, endHour: any) {
    this.bar.zoneWiseFootFallData(date, startHour, endHour).subscribe((data) => {
      this.zoneWiseFootFall.series = data;

      this.lastWeekZonewiseTotalCount = data[0].data.map((m: any) => {
        return m.y;
      }).reduce((a: any, b: any) => a + b, 0);

      this.currentWeekZonewiseTotalCount = data[1].data.map((m: any) => {
        return m.y;
      }).reduce((a: any, b: any) => a + b, 0);

      this.modalService.open(this.zonewiseFootfallModal, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
    });
  }
  getWeeksDays() {
    var first = this.startOfWeek(new Date());
    for (let i = 0; i < 7; i++) {
      let curr = new Date();
      curr.setDate(first.getDate() + i);
      this.weekDays.push({ Day: new Date(curr).toLocaleString('en-us', { weekday: 'short' }), Date: this.datepipe.transform(curr, 'yyyy-MM-dd') });
    }
  }
  startOfWeek(date: any) {
    var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }
  playPause() {
    this.doesPlay = !this.doesPlay;
    if (this.doesPlay)
      this.weekDayChangeToChart(this.weekDays[this.todayIndex].Date);
  }
  weekDayChangeToChart(date: string, eventFromDayClick: boolean = false) {
    this.todayIndex = this.weekDays.findIndex(x => x.Date === date);
    this.bar.dayWiseFootFallData(date).subscribe((data: any) => {
      this.dayWiseFootFall.series = data;

      var lastWeekDataFootfall = data[0].data.map((m: any) => {
        return m.y;
      }).reduce((a: any, b: any) => a + b, 0);

      var currentWeekDataFootfall = data[1].data.map((m: any) => {
        return m.y;
      }).reduce((a: any, b: any) => a + b, 0);

      this.currentWeekDataFootfall = currentWeekDataFootfall;
      this.differencePeopleFootfall = Math.round(((this.currentWeekDataFootfall / (lastWeekDataFootfall <= 0 ? 1 : lastWeekDataFootfall) * 100.00) - 100) * 100) / 100;

      if (this.doesPlay && !eventFromDayClick) {
        setTimeout(() => {
          this.todayIndex++;
          this.todayIndex = this.weekDays.length <= this.todayIndex ? 0 : this.todayIndex;
          this.weekDayChangeToChart(this.weekDays[this.todayIndex].Date);
        }, 1000);
      }
    });
    this.tab = date;
    this.zoneWisedate = date;
  }
}


