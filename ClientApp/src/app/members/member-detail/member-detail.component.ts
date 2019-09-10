import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/User';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';
import { forEach } from '@angular/router/src/utils/collection';
import { AuthService } from 'src/app/_services/auth.service';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  @ViewChild('memberTabs') memberTabs: TabsetComponent;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}
  user: User;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  configGalleryOptions() {
    this.galleryOptions = [
      { imageAutoPlay: true, imageAutoPlayPauseOnHover: true, previewAutoPlay: true, previewAutoPlayPauseOnHover: true },
      { breakpoint: 500, width: '300px', height: '300px', thumbnailsColumns: 3 },
      { breakpoint: 300, width: '100%', height: '200px', thumbnailsColumns: 2 }
      ];
  }

  configGalleryImages() {
    this.user.photos.forEach(p => {
      this.galleryImages.push({
        small: p.url,
        big: p.url,
        medium: p.url
      });
    });
  }

  selectTab(tabId: number){
    this.memberTabs.tabs[tabId].active = true;
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.user;
      this.user = this.authService.initialUser(this.user);
      this.configGalleryOptions();
      this.configGalleryImages();
    });
    this.route.queryParams.subscribe(params =>
      {
        this.selectTab(params.tab > 0 ? params.tab : 0 );
      });
  }
}
