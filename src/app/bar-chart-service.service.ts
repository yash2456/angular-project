import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BarChartServiceService {
  //hosturl = "http://192.168.1.115/FootFall/";
  hosturl = "http://192.168.0.10/FootFall/";

  constructor(private http: HttpClient) { }
  dayWiseFootFallData(day: string) {
    let url = this.hosturl + "api/GetDayWiseFootFall?StartHours=9&EndHours=21&Date=" + day;
    return this.http.get(url);
  }

  zoneWiseFootFallData(date: string, startHour: any, endHour: any) {
    let url = this.hosturl + "api/GetZoneWiseFootFall?Date=" + date + "&StartHours=" + startHour + "&EndHours=" + endHour;
    return this.http.get(url)
  }
}
