import { LabelComponent } from './product/label.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
    { path: 'languages', component: LabelComponent, data: { reuse: true, title: 'language', titleI18n: 'Languages' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DesignRoutingModule { }
