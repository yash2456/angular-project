import { TestBed } from '@angular/core/testing';

import { BarChartServiceService } from './bar-chart-service.service';

describe('BarChartServiceService', () => {
  let service: BarChartServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarChartServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
