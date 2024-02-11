import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { circle, CRS, imageOverlay, latLng, LatLng, map, MapOptions, marker, polygon, tileLayer } from 'leaflet';
import { LatLngBoundsExpression } from 'leaflet';


@Component({
  selector: 'app-line-status',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    LeafletModule
  ],
  templateUrl: './line-status.component.html',
  styleUrl: './line-status.component.scss',
})
export class LineStatusComponent implements OnInit {

  loaded = false;

  public image: HTMLImageElement;

  options: MapOptions = {
    minZoom: -1,
    maxZoom: 2,
    zoom: 0,
    // zoomDelta: 1,
    inertia: true,
    inertiaDeceleration: 0,
    inertiaMaxSpeed: 0,
    zoomSnap: 0,
    boxZoom: true,
    wheelDebounceTime: 0,
    wheelPxPerZoomLevel: 1,
    doubleClickZoom: false,
    crs: CRS.Simple,
    attributionControl: false,
  };

  baseLayers = {};

  layersControl = {

    overlays: {
      'Big Circle': circle([ 46.95, -122 ], { radius: 5000 }),
      'Big Square': polygon([[ 46.8, -121.55 ], [ 46.9, -121.55 ], [ 46.9, -121.7 ], [ 46.8, -121.7 ]])
    }
  }


  private map: L.Map;




  constructor(private http: HttpClient) { }

  async ngOnInit() {
    // this.initMap();
    const imageUrl = '/assets/plano.png';
    this.image = await this.loadImage(imageUrl);
    const aspectRatio = this.image.width / this.image.height;
    const imageBounds: LatLngBoundsExpression = [[0, 0], [1000, 1000*aspectRatio]];


    this.options.maxBounds = imageBounds;
    this.options.zoom = 0;
    this.options.center = latLng(500, 500*aspectRatio);

     // put image on map
     this.baseLayers['Plano'] = imageOverlay(this.image.src, imageBounds);

      this.loaded = true;
  }

  private async initMap() {
    const imageUrl = '/assets/plano.png';

    this.image = await this.loadImage(imageUrl);
    console.log('img', this.image.width, this.image.height);

    const aspectRatio = this.image.width / this.image.height;


    const imageBounds: LatLngBoundsExpression = [[0, 0], [1000, 1000*aspectRatio]];
    const imageBounds2: LatLngBoundsExpression = [[0, 0], [1000, 1000*aspectRatio]];

    this.map = map('map', {
      minZoom: -1,
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
      crs: CRS.Simple,
      attributionControl: false,
    });


    imageOverlay(this.image.src, imageBounds).addTo(this.map);
    this.map.fitBounds(imageBounds);


    const c = circle([600, 300], {radius: 50}).addTo(this.map);
    c.addEventListener('click', (e) => {
      console.log('click', e);
    });

    let color = '#00aa00';
    c.setStyle({color, fillOpacity: 0.3, opacity: 0.8});

    setInterval(() => {
      color = color === 'red' ? '#00aa00' : 'red';
      c.setStyle({color});
    }, 1000);



    marker([500, 1000]).addTo(this.map);
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
