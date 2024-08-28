import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule,FormsComponent,RouterOutlet,RouterLink],
  providers: [UserService],
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent {
  data:any[]=[];
  constructor(public userservice: UserService) {}
  ngOnInit(): void {
    this.userservice.getData().subscribe((response) => {
      this.data=response.data;
    });
  }
  deleteForm(id:any){
    this.userservice.deleteData(id).subscribe((response) => {
      alert(response.message);
      this.ngOnInit();
    });
  }

}
