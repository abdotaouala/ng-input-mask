import {Attribute, Directive, ElementRef, HostListener, OnInit} from '@angular/core';
import {NgControl} from '@angular/forms';
import * as _ from 'lodash'



@Directive({
    selector: '[fdcNumberMask]',
})
export class MaskDirective implements OnInit {

    private templateMask: TamplateMask = {
        percent:'percent',
        decimal:'decimal',
        currency:'currency',
        integer:'integer',
    }



    constructor(private _elRef: ElementRef, private model: NgControl,  @Attribute("fdcNumberMask") private template: string) {

    }

    @HostListener('focus') onInputFocusChange() {
        let modelValue = this.getModelValue();
        this.model.control.setValue(parseFloat(modelValue));
        this.formatPush(modelValue);
    }

    @HostListener('change',['$event.target.value'])
    @HostListener('keydown',['$event.target.value'])
    @HostListener('keyup',['$event.target.value'])
    onKeyUp(value:string){
        if(value.indexOf('.')!=(value.length -1))
        this.model.control.setValue((parseFloat(value) || 0));
    }

    @HostListener('blur')
    @HostListener('change') onInputChange() {
        this.runFormatNumber();
    }

    ngOnInit() {
        setTimeout(() => this.runFormatNumber());
    }



    private runFormatNumber() {
        // receive the input value (Digits only)
        let modelValue = this.getModelValue();
        this.model.control.setValue((parseFloat(modelValue) || 0));
        let viewValue = this.format(modelValue);
        this.formatPush(viewValue);
    }

    private formatPush(formattedValue) {
        this._elRef.nativeElement.value = formattedValue;
    }

    private getModelValue() {
        let elementValue = this._elRef.nativeElement.value;
        switch (this.template) {
            case this.templateMask.percent:
                return elementValue.replace(/ %/g, '');
            case this.templateMask.decimal:
            case this.templateMask.integer:
                return elementValue.replace(new RegExp(',','g'),'');
            case this.templateMask.currency:
                elementValue=elementValue.replace(new RegExp(',','g'),'');
                return elementValue.replace(/£ /g, '');
        }
    }


    private format(s) {
        switch (this.template) {
            case this.templateMask.percent:
                s = this.formatPercentageNumber(parseFloat(s) || 0);
                return String(s).concat(' %');
            case this.templateMask.decimal:
            case this.templateMask.integer:
                return this.multiplierFormatter(parseFloat(s)||0);
            case this.templateMask.currency:
                s=this.multiplierFormatter(parseFloat(s)||0);
                let currency="£ "
                return currency.concat(s);
        }
        return s;
    }
    private multiplierFormatter(value: number, length = 2): string {
        let formattedString: string = "";
        let numberString: string = Number(Number(value).toFixed(length)).toString();
        let [entirePart, decimalPart] = numberString.split(".");
        let numbersArray: Array<string> = _.flattenDeep(
            _.chunk(entirePart.split("").reverse(), 3)
                .reverse()
                .map(array => [array.reverse(), ","])
        );
        numbersArray.pop();
        formattedString = numbersArray.join("");
        if(this.template==this.templateMask.decimal){
            if (decimalPart) formattedString = formattedString.concat(".", decimalPart);
        }
        return formattedString;
    }
    formatPercentageNumber(number) {
        if (
            number.toString().indexOf(".") > 0 ||
            number.toString().indexOf(",") > 0
        ) {
            let nombreNumberafterComma = 0;
            if (number.toString().indexOf(".") > 0)
                nombreNumberafterComma = number
                    .toString()
                    .substring(number.toString().indexOf(".") + 1).length;
            else if (number.toString().indexOf(",") > 0)
                nombreNumberafterComma = number
                    .toString()
                    .substring(number.toString().indexOf(",") + 1).length;

            if (nombreNumberafterComma != 0)
                switch (number.toString().substring(number.toString().indexOf(".") + 1)
                    .length) {
                    case 1:
                        return number.toString() + "000";
                    case 2:
                        return number.toString() + "00";
                    case 3:
                        return number.toString() + "0";
                    case 4:
                        return number;
                    default:
                        return (
                            parseInt(number).toString() +
                            "." +
                            number
                                .toString()
                                .substring(
                                    number.toString().indexOf(".") + 1,
                                    number.toString().indexOf(".") + 5
                                )
                        );
                }
        }
        return (parseInt(number) || 0).toString() + ".0000";
    }
}

export interface TamplateMask{
    percent:string;
    decimal:string;
    currency:string;
    integer:string;
}