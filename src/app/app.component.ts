import { Component, ɵConsole } from '@angular/core';
import { ApiService } from './api.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public promises = [];
  public ids = [];

  public nombre;
  public rentabilidad;
  public desviacion;

  public opciones = [];

  constructor(
    public api: ApiService
  ) {

    this.api.getConceptualAssets().subscribe((response:any) => {
      console.log(response);
      response.data.forEach((conceptualAsset) => {
        //Posee info fondo
        this.api.getRealAssetById(conceptualAsset.id).subscribe((realAssets:any) => {
          realAssets.data.forEach((realAsset) => {
            this.opciones.push({
              id: realAsset.id,
              name: realAsset.attributes.name + ' - ' + realAsset.attributes.serie
            });
            //this.ids.push(realAsset.id);
          });
        });
      })
    });
  }

  public seleccionFondo(event) {
    let selectedIndex = event.target.selectedIndex;
    let seleccionado = this.opciones[selectedIndex];
    this.nombre = seleccionado.name;
    this.getDays(event.target.value)
  }

  public getDays(id) {

    this.api.getRealAssetDaysById(id).subscribe((days:any) => {
      this.rentabilidad = null;
      this.desviacion = null;

      let prices = [];
      console.log(days);
      days.data.forEach((day) => {
        prices.push(day.attributes.price);
      });

      console.log(prices);

      let nDays = days.data.length;
      let getLastDay = days.data[0];
      let getFirstDay = days.data[days.data.length - 1];
      let rentabilidadTotal = (getLastDay.attributes.price - getFirstDay.attributes.price) / getFirstDay.attributes.price;
      let rentabilidadPromedioDiario = (Math.pow((rentabilidadTotal + 1), 1 / nDays) - 1);

      let stdDeviation = this.standardDeviation(prices);

      console.log(nDays);
      console.log(getFirstDay);
      console.log(getLastDay);
      console.log(rentabilidadTotal);
      this.rentabilidad = rentabilidadPromedioDiario;
      console.log(rentabilidadPromedioDiario);
      console.log(stdDeviation);
      this.desviacion = stdDeviation;
    });
  }

  private standardDeviation(values){
    var avg = this.average(values);

    var squareDiffs = values.map(function(value){
      var diff = value - avg;
      var sqrDiff = diff * diff;
      return sqrDiff;
    });

    var avgSquareDiff = this.average(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
  }

  private average(data){
    var sum = data.reduce(function(sum, value){
      return sum + value;
    }, 0);

    var avg = sum / data.length;
    return avg;
  }
}
