import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({ name: 'momentFormat' })
export class MomentFormatPipe implements PipeTransform {
    transform(value: moment.MomentInput, format: string) {
        // console.log(moment.localeData());
        // console.log(format);

        if (value === undefined) {
            return '';
        }
        // console.log('moment.locale:' + moment.locale());
        return moment(value).format(format);
    }
}
