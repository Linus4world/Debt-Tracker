import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { Group } from '../../models/group.model';
import { CurrencyProvider } from '../../providers/currency/currency';
import { Observable } from 'rxjs';

@Component({
  selector: 'chart',
  templateUrl: 'chart.html'
})
export class ChartComponent {

  myChart: Chart;
  @ViewChild('chartContainer') chartcontainer: ElementRef;
  @ViewChild('chartcanvas') chartcanvas: ElementRef;

  private group: Group;
  @Input() group$: Observable<Group>;

  constructor(public currency: CurrencyProvider) {
    console.log('Hello ChartComponent Component');
    console.log(this.group$);
  }

  ngAfterViewInit() {
    console.log("######ASDASD######");
    if(this.group === undefined){
    this.group$.subscribe((data: Group) => {
      this.group = data;
      this.createChart();
    })
  }
    //this.createChart();
  }

  createChart() {
    let labels: string[] = [];
    let data: number[] = [];
    let backgroundColor = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)'
    ];
    let borderColor= [
      'rgba(255,99,132,1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)'
    ];
    if(this.group.members.size+1 > 6){
      backgroundColor = [];
      borderColor = [];
    }
    let i = 1;
    this.group.members.forEach((value, key, map) => {
      labels.push(value + ': ' + this.group.balances.get(key) + this.currency.currency);
      data.push(this.group.balances.get(key));
      backgroundColor.push(this.rainbow(this.group.members.size+1, i++));
      borderColor.push('#FFFFFF');
    }
    )
    this.myChart = new Chart(this.chartcanvas.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: labels,
        datasets: [{
          label: this.currency.currency,
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  /**
   * https://stackoverflow.com/a/7419630
   * @param numOfSteps 
   * @param step 
   */
  rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch (i % 6) {
      case 0: r = 1; g = f; b = 0; break;
      case 1: r = q; g = 1; b = 0; break;
      case 2: r = 0; g = 1; b = f; break;
      case 3: r = 0; g = q; b = 1; break;
      case 4: r = f; g = 0; b = 1; break;
      case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
  }


}
