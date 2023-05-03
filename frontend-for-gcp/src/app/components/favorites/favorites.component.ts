import { Component } from '@angular/core';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  indexKey:string = "dklsajfkljweaklfjsdnafklad";
  items:any = [];

  
  ngOnInit() {
    let indexValue:any;
    try {
      let tmpValue = localStorage.getItem(this.indexKey);
      if(tmpValue != null){
        indexValue = JSON.parse(tmpValue);
        for(let item of indexValue){
          try {
            let tmpObj = localStorage.getItem(item);
            if(tmpObj != null){
              let obj:any = JSON.parse(tmpObj);
              this.items.push(obj);
            }else{
              console.log("cannot iterate this obj");
              
            }
          } catch (error) {
            console.log("cannot find this obj");
            
          }
        }
        this.items.sort((a:any, b:any) => {
          return a.timestamp - b.timestamp;
        });
      }
      else{
        console.log("index array is null");
      }
    } catch (error) {
      console.log("no this index array");
    }
  }


  delete(x:any, deleteIndex:any):void{
    alert("Removed from favorites!");
    this.items.splice(deleteIndex, 1);
    localStorage.removeItem(String(x.id));
    let indexValue:any;
    try {
      let tmpValue = localStorage.getItem(this.indexKey);
      if(tmpValue != null){
        indexValue = JSON.parse(tmpValue);
        const index = indexValue.indexOf(x.id);
        if (index !== -1) {
          indexValue.splice(index, 1);
          localStorage.setItem(this.indexKey, JSON.stringify(indexValue));
        }else{
          console.log("cannot find id in this array!");
        }
      } 
      else{
        console.log("index array is null");
      }
    } catch (error) {
      console.log("no this index array");
    }
  }
}
