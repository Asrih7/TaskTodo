import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {Task } from '../../app/task';

import { HomePage } from '../../pages/home/home';
import { NavController } from 'ionic-angular';
import { Data } from '../../providers/data';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';





@IonicPage()
@Component({
  selector: 'page-todo-tasks',
  templateUrl: 'todo-tasks.html',
})
export class TodoTasksPage {

   
  constructor(public navCtrl: NavController,public dataService: Data , private admobFree: AdMobFree) {
    this.Tasks = JSON.parse(localStorage.getItem("Tasks"));

    if(!this.Tasks) {
        this.Tasks = [];
    }
    this.dTask = JSON.parse(localStorage.getItem("dTask"));

    if(!this.dTask) {
      this.dTask = [];
  }
 
  }

  showBannerAd() {
    let bannerConfig: AdMobFreeBannerConfig = {
        autoShow: true,
        id: "ca-app-pub-8619187063113177/6385601607"
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare().then(() => {
        // success
    }).catch(e => alert(e));
} 
       title = "Todo List"
       flag=1;
       toDoTaskCount=0;
       completedTaskCount=0;
       Tasks:Task[]=[];
       dTask:Task[]=[];
       taskText:string="";
       msg:string;
       errMsg:string;
       totalTaskToComplete:number;
       completedTask:number;
       today:number;
       alreadyAddedTask:string;
      
      
      showModal(task)
      {
        
        this.navCtrl.push(HomePage,{
          item:task
          });
      }
      
  
       addTask(msg:string){
         
           if(msg.length==0){
               
               this.errMsg = "Task is not clear";
           }
           else if(this.duplicateTask(msg) && this.flag ){
                this.errMsg="Task is already in the list";
           }
               
           else{
                
                this.today=Date.now();
                this.Tasks.push(new Task(msg,this.toDoTaskCount,this.today));
                this.errMsg="";
                this.taskText="";
                this.totalTaskToComplete=this.Tasks.length;
                this.toDoTaskCount+=1;
                this.save();
               
           }     
       }
  
       duplicateTask(msg:string):number{
  
            for(var i=0;i<this.Tasks.length;i++)
            {
               if( msg==this.Tasks[i].name)
               {
                  return 1;
               }
                
            }
              
            return 0;
       }
       
       markAsComplete(task:Task){
             
             this.addDTask(task);
             this.deleteTask(task);
             
       }

       editTask(task:Task){
         this.taskText=task.name;
         this.deleteTask(task);
         this.totalTaskToComplete=this.Tasks.length; 
         this.save();
       }
       
        deleteTask(task:Task){
         
          this.Tasks = this.Tasks.filter(Tasks => Tasks.id !== task.id);
           this.totalTaskToComplete=this.Tasks.length;
           this.save();
           
       }
      
      reset(){
        this.taskText="";
      }
  
      dismiss(){
        this.errMsg="";
        this.taskText="";
      }
  
      addAnyWay(msg:string){
            if(msg.length==0){
              msg="Nothing to do";
            }
            
            this.flag=0;
            this.addTask(msg);
  
            this.taskText="";
      }
  
      addDTask(task:Task){
         
         this.dTask.push(new Task(task.name,this.completedTaskCount,Date.now()));
         this.msg=task.name;
         this.completedTask=this.dTask.length;
         this.completedTaskCount+=1;
         this.save();
         
       }
  
      deleteDTask(task:Task){
         
          this.dTask = this.dTask.filter(dTask => dTask.id !== task.id);
          this.completedTask=this.dTask.length;
          this.save();

       }
       save() {
        
            localStorage.setItem("Tasks", JSON.stringify(this.Tasks));
            localStorage.setItem("dTask", JSON.stringify(this.dTask));
                     
        }
     
      ngOnInit(){
  
      }
  

}
