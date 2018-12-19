import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    public http: HttpClient
  ) { }

  public getConceptualAssets() {
    return this.http.get(environment.base_url + 'conceptual_assets');
  }

  public getRealAssetById(conceptual_asset_id) {
    return this.http.get(environment.base_url + `conceptual_assets/${conceptual_asset_id}/real_assets`);
  }

  public getRealAssetDaysById(real_asset_id) {
    return this.http.get(environment.base_url + `real_assets/${real_asset_id}/days`);
  }
}
