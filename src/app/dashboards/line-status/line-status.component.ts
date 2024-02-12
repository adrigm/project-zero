import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';
import { LatLngBoundsExpression } from 'leaflet';


@Component({
  selector: 'app-line-status',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './line-status.component.html',
  styleUrl: './line-status.component.scss',
})
export class LineStatusComponent implements OnInit {

  public image: HTMLImageElement;
  private map: L.Map;

  private robotSvg;


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.initMap();

  }

  private async initMap() {
    const imageUrl = '/assets/TeslaLUD.png';

    this.image = await this.loadImage(imageUrl);
    console.log('img', this.image.width, this.image.height);

    const aspectRatio = this.image.width / this.image.height;

    console.log(aspectRatio*1000);


    const imageBounds: LatLngBoundsExpression = [[0, 0], [1000, 1000*aspectRatio]];
    const imageBounds2: LatLngBoundsExpression = [[0, 0], [1000, 1000*aspectRatio]];

    this.map = L.map('map', {
      minZoom: -2,
      maxZoom: 2,
      zoom: 0,
      // zoomDelta: 1,
      inertia: true,
      inertiaDeceleration: 0,
      inertiaMaxSpeed: 0,
      zoomSnap: 0,
      boxZoom: true,
      maxBounds: imageBounds2,
      wheelDebounceTime: 0,
      wheelPxPerZoomLevel: 1,
      doubleClickZoom: false,
      crs: L.CRS.Simple,
      attributionControl: false,
    });


    L.imageOverlay(this.image.src, imageBounds).addTo(this.map);
    this.map.fitBounds(imageBounds);


    const c = L.circle([600, 2200], {radius: 50});
    const d = L.circle([800, 3000], {radius: 50});

    const cGroup = L.layerGroup([c, d]);

    const r1 = L.rectangle([[100, 100], [200, 200]]);
    const r2 = L.rectangle([[400, 900], [450, 950]]);

    const rGroup = L.layerGroup([r1, r2]);

    const overlayMaps = {
      'Circles': cGroup,
      'Rectangles': rGroup
    };
    const controls = L.control.layers(null, overlayMaps);

    controls.addTo(this.map);

    c.addEventListener('click', (e) => {
      console.log('click', e);
    });

    let color = '#00aa00';
    c.setStyle({color, fillOpacity: 0.3, opacity: 0.8});

    setInterval(() => {
      color = color === 'red' ? '#00aa00' : 'red';
      c.setStyle({color});
    }, 1000);



    L.marker([500, 1000]).addTo(this.map);
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const imagen = new Image();
      imagen.onload = () => resolve(imagen);
      imagen.onerror = reject;
      imagen.src = src;
    });
  }
}
