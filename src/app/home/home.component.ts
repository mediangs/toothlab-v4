import { Component, OnInit } from '@angular/core';
import { NgZone } from '@angular/core';

declare var x3dom: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  carouselImages = [];

  constructor(private zone: NgZone) { }

  ngOnInit() {
    this.carouselImages.push("../../assets/images/3d_model.png");
    this.carouselImages.push("../../assets/images/section.png");
    this.carouselImages.push("../../assets/images/3d_model_with_section.png");
    this.carouselImages.push("../../assets/images/thinnest_dentin.png");
    this.carouselImages.push("../../assets/images/dentin_thickness_chart.png");
  }



}
