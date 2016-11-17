import {Pipe, PipeTransform} from "@angular/core";
import {DateFormatter} from '@angular/common/src/facade/intl';

@Pipe({
    name: 'dateFormat'
})
export class DateFormat implements PipeTransform {
    transform(value: any, args: string[]): any {
        if (value) {
            var date = value instanceof Date ? value : new Date(value);
            return DateFormatter.format(date, 'en', args[0]);
        }
    }
}