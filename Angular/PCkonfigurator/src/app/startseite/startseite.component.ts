import { Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { AuthService } from '../auth.service';
import { TrendsService } from '../trends.service';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-startseite',
  templateUrl: './startseite.component.html',
  styleUrls: ['./startseite.component.scss']
})
export class StartseiteComponent implements OnInit {

  users: any;
  notifyTrue: boolean;
  notify: HTMLElement;
  trends: any[] = [];


  constructor(private AuthService: AuthService, private trendsService: TrendsService) {

  }

  fetchTrends(): void {
    // const pollingInterval = interval(0); // so that the trends changes ansychronously

    this.trendsService.getTrends().subscribe((data: any) => {
      this.trends = data;
      console.log(data);
    });

    // pollingInterval.pipe(
    //   // Switch to calling getTrends every time interval emits a value
    //   switchMap(() => this.trendsService.getTrends())
    // ).subscribe((data: any) => {
    //   this.trends = data;
    // });
  }

    //---------------------Notify
  getNotifyIn(): boolean {
    return this.AuthService.getNotifyIn();
  }
    //this.AuthService.getNotifyIn();

  getNotifyOut(): boolean {
    return this.AuthService.getNotifyOut();
  }

  setNotifyInFalseAfter50ms() {
    timer(50).pipe(
      take(1)
    ).subscribe(() => {
      this.AuthService.setNotifyIn(false);
    });
  }


  //---------------------GSAP
  ngOnInit(): void {

    this.fetchTrends();
    
    const images = ['assets/intel.png', 'assets/image4.jpg', 'assets/amd 1.png', 'assets/gaming-computer.jpg'];
    let currentImageIndex = 0;

    const imgSlider: HTMLImageElement | null = document.querySelector('.img-slider');
    const dots = document.querySelectorAll('.dot');
    const prevArrow = document.querySelector('.prev');
    const nextArrow = document.querySelector('.next');

    

    function updateImage() {
      gsap.fromTo(imgSlider, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5 });

      if (imgSlider) {
        imgSlider.src = images[currentImageIndex];
      }

      dots.forEach((dot, index) => {
        if (index === currentImageIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function showNextImage() {
      gsap.fromTo(imgSlider, { opacity: 1, x: 0 }, { opacity: 0, x: 10, duration: 0.5, onComplete: showNextImageComplete });
    }

    function showNextImageComplete() {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      updateImage();
    }

    function showPrevImage() {
      gsap.fromTo(imgSlider, { opacity: 1, x: 0 }, { opacity: 0, x: -20, duration: 0.5, onComplete: showPrevImageComplete });
    }

    function showPrevImageComplete() {
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      updateImage();
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentImageIndex = index;
        updateImage();
      });
    });

    if (prevArrow) {
      prevArrow.addEventListener('click', showPrevImage);
    }

    if (nextArrow) {
      nextArrow.addEventListener('click', showNextImage);
    }

    // Automatischer Bildwechsel alle 5 Sekunden
    const autoChangeInterval = setInterval(showNextImage, 7000);
    // Initial update
    updateImage();


  }

}