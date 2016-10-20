import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'drugsfilter',
    pure: false
})
export class DrugsFilterPipe implements PipeTransform {
    transform(drugslist: any, params: string) {
        if (drugslist == null) { return null; }
        let query = params.toLowerCase();
        return drugslist.filter(drug =>
            drug.drugname.toLowerCase().indexOf(query) > -1
        );
    }
}