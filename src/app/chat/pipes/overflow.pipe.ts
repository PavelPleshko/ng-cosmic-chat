import {Pipe,PipeTransform} from '@angular/core';

@Pipe({name:'overflowPipe'})

export class OverflowPipe implements PipeTransform {
	transform(value:string,limit:number):any{
		if(!limit){
			return value;
		}else{
			
			if(value.length > limit){
				return value.slice(0,limit)+'...'
			}else{
				return value;
			}
		}
			
		
}
}
