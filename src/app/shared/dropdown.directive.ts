import { Directive, Renderer2, HostListener, ElementRef, HostBinding } from '@angular/core';

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
    @HostBinding('class.open') isOpen: boolean = false;
    //constructor(private renderer: Renderer2, private eleRef: ElementRef) {}
    constructor() {}
    @HostListener('click') onClick() {
        // if (this.clicked) {
        //     this.renderer.removeClass(this.eleRef.nativeElement, 'open');    
        // } else {
        //     this.renderer.addClass(this.eleRef.nativeElement, 'open');
        // }
        this.isOpen = !this.isOpen;
    } 
}