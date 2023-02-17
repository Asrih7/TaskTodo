import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TodoTasksPage } from './todo-tasks';

@NgModule({
  declarations: [
    TodoTasksPage,
  ],
  imports: [
    IonicPageModule.forChild(TodoTasksPage),
  ],
})
export class TodoTasksPageModule {}
