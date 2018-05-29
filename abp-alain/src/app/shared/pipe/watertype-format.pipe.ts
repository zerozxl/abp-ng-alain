import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'watertype' })
export class WaterTypeFormatPipe implements PipeTransform {
    transform(value: number, format: string) {
        // console.log(moment.localeData());
        // console.log(format);

        if ( value === undefined || value === 0 ) {
            return '-';
        }

        if ( value === 1 ) {
            return 'I';
        }

        if ( value === 2 ) {
            return 'II';
        }

        if ( value === 3 ) {
            return 'III';
        }

        if ( value === 4 ) {
            return 'IV';
        }

        if ( value === 5 ) {
            return 'V';
        }

        if ( value === 6 ) {
            return '劣';
        }

        return '-';

        // console.log('moment.locale:' + moment.locale());
        // return moment(value).format(format);
    }
}
