import { Component } from '@angular/core';
import { NavController, Platform, AlertController, NavParams} from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  task:any;
  data = { date:'', time:'' };

  constructor(public navCtrl: NavController,
    public localNotifications: LocalNotifications,
    public platform: Platform,
    public alertCtrl: AlertController,
    public navParams: NavParams) {
      this.task = navParams.get('item');
      console.log(this.task);
      //this.data.description = this.task;
    }

  submit() {
    console.log(this.data);
    var date = new Date(this.data.date+" "+this.data.time);

    var minutes = String(date.getMinutes());
    if (minutes.length == 1)
    minutes = "0" + minutes;
    
    var hour = date.getHours();
    
    var year = date.getFullYear();
    var month = date.getMonth(); 
    var day = date.getDate();


var dateSelecionada  = day +'/' + month + '/' + year + ' at ' + hour + ':' + minutes;


    console.log(date);
    this.localNotifications.requestPermission().then((permission) => {
      this.localNotifications.schedule({
         id: 1,
         text: 'You have chosen this time to complete this task : ' + this.task.name,
         at: date,
         led: 'FF0000',
         sound: this.setSound(),
      });
      let alert = this.alertCtrl.create({
        title: 'Congratulation!',
        subTitle: 'Notification saved successfully on the date  '+ dateSelecionada,
        buttons: ['OK']
      });
      alert.present();
      this.data = { date:'', time:'' };
      //this.task.name = '';
    });
  }

  setSound() {
    if (this.platform.is('android')) {
      return 'file://assets/sounds/Rooster.mp3'
    } else {
      return 'file://assets/sounds/Rooster.caf'
    }
  }

}
